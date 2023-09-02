import {
  type ReactElement,
  type ReactNode,
  useState,
  useEffect,
  type ChangeEvent,
} from "react";
import Layout from "~/layouts/Layout";
import type { NextPageWithLayout } from "../_app";
import React from "react";
import AvailablityLineChart from "~/components/AvailbilityLineChart";
import dynamic from "next/dynamic";
import { api } from "~/utils/api";
import type { GetStaticPaths, GetStaticProps } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { prisma } from "~/server/db";
import "leaflet/dist/leaflet.css";
import useModal from "~/server/helpers/modals/useModal";
import type { SignToRollingImage, Sign } from "@prisma/client";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { toast } from "react-hot-toast";
import Link from "next/link";
import useModalDelete from "~/server/helpers/modals/useModalDelete";
import Image from "next/image";

const SignPage: NextPageWithLayout<{ id: string }> = ({ id }) => {
  const MapChart = dynamic(() => import("~/components/MapChart"), {
    ssr: false,
  });

  const { isOpen, toggle } = useModal();

  const { data, isLoading } = api.sign.getById.useQuery({
    id,
  });

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [images, setImages] = useState<SignToRollingImage[]>([]);

  useEffect(() => {
    // put the fetchData inside the effect
    if (data && data.latitude && data.longitude) {
      setLatitude(data.latitude);
      setLongitude(data.longitude);
    }
    if (data && data.images) {
      setImages(data.images);
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
  if (!data) return <div>404 Not found</div>;

  return (
    <>
      <div className="dark:border-primary-darker z-10 flex items-center justify-between border-b px-4 py-4 lg:py-6">
        <h1 className="text-2xl font-semibold">{`Sign ${data.number} - ${data.name}`}</h1>
        <button
          onClick={toggle}
          className="bg-primary hover:bg-primary-dark focus:ring-primary dark:focus:ring-offset-dark rounded-md px-4 py-2 text-sm text-white focus:outline-none focus:ring focus:ring-offset-1 focus:ring-offset-white"
        >
          Edit
        </button>
      </div>
      <EditSign data={data} isOpen={isOpen} toggle={toggle}></EditSign>

      <div className="mt-2">
        <h1 className="text-1xl px-4 font-semibold text-gray-500">Signs</h1>
        <div className="grid space-y-4 p-4 lg:grid-cols-3 lg:gap-8 lg:space-y-0">
          <div className="dark:bg-darker col-span-1 rounded-md bg-white">
            <div className="dark:border-primary border-b p-4">
              <Link
                href={`/sign/${id}/display`}
                className="bg-primary hover:bg-primary-dark focus:ring-primary dark:focus:ring-offset-dark float-right rounded-md px-4 py-2 text-sm text-white focus:outline-none focus:ring focus:ring-offset-1 focus:ring-offset-white"
              >
                Display
              </Link>
              <h4 className="dark:text-light text-lg font-semibold text-gray-500">
                Sign Preview
              </h4>
            </div>
            <div className="relative p-4"></div>
          </div>
          <AvailablityLineChart></AvailablityLineChart>
        </div>
        <div className="grid grid-cols-1 space-y-8 p-4 lg:grid-cols-2 lg:gap-8 lg:space-y-0">
          <ImagesListView images={images} />
        </div>

        <div className="grid grid-cols-1 space-y-8 p-4 lg:grid-cols-2 lg:gap-8 lg:space-y-0">
          <MapChart latitude={latitude} longitude={longitude}></MapChart>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id as string;

  if (typeof id !== "string") throw new Error("Invalid id");

  await ssg.sign.getById.prefetch({ id });

  return {
    props: {
      trpcState: JSON.parse(JSON.stringify(ssg.dehydrate())) as string,
      id,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const signs = await prisma.sign.findMany({
    select: {
      id: true,
    },
  });
  return {
    paths: signs.map((sign) => ({
      params: {
        id: sign.id,
      },
    })),
    fallback: "blocking",
  };
};

SignPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SignPage;

interface ModalType {
  children?: ReactNode;
  isOpen: boolean;
  toggle: () => void;
  data: Sign;
}

export function EditSign(props: ModalType) {
  const ctx = api.useContext();

  const allSignNumbers = api.sign.getAll
    .useQuery()
    .data?.map((sign) => sign.number);
  const allSignNumbersWithoutCurrent = allSignNumbers?.filter(
    (signNumber) => signNumber !== props.data.number
  );

  const { mutate } = api.sign.update.useMutation({
    onSuccess: () => {
      handleCancel();
      void ctx.sign.getAll.invalidate();
      void ctx.sign.getById.invalidate();
      void ctx.sign.getLastSign.invalidate();
    },
    onError: (error) => {
      console.log(error.data);
      const errorMessage = error.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("An error occured, failed to update");
      }
    },
  });

  const [signName, setSignName] = useState<string>(
    props.data.name ? props.data.name : ""
  );
  const [signNumber, setSignNumber] = useState<number>(
    props.data.number ? props.data.number : 1
  );
  const [signWidth, setSignWidth] = useState<number>(
    props.data.width ? props.data.width : 1
  );
  const [signHeight, setSignHeight] = useState<number>(
    props.data.height ? props.data.height : 1
  );
  const [latitude, setLatitude] = useState<number>(
    props.data.latitude ? props.data.latitude : 0
  );
  const [longitude, setLongitude] = useState<number>(
    props.data.longitude ? props.data.longitude : 0
  );
  const [signType, setSignType] = useState<string>(
    props.data.type ? props.data.type : "general"
  );
  const [customContentEnabled, setCustomContentEnabled] = useState(
    props.data.customContentEnabled ? props.data.customContentEnabled : false
  );
  const [emergencyNotificationEnabled, setEmergencyNotificationEnabled] =
    useState(
      props.data.emergencyNotificationEnabled
        ? props.data.emergencyNotificationEnabled
        : false
    );
  const [signIpAdress, setSignIpAdress] = useState(
    props.data.ipAddress ? props.data.ipAddress : "0.0.0.0"
  );

  const { isOpenDelete, toggleDelete } = useModalDelete();

  const [validNumber, setValidNumber] = useState<boolean>(true);

  const handleCancel = () => {
    props.toggle();
    setValidNumber(true);
    if (props.data) {
      setCustomContentEnabled(props.data.customContentEnabled);
      setEmergencyNotificationEnabled(props.data.emergencyNotificationEnabled);
      setSignName(props.data.name);
      setSignNumber(props.data.number);
      setSignWidth(props.data.width);
      setSignHeight(props.data.height);
      setLatitude(props.data.latitude);
      setLongitude(props.data.longitude);
      setSignIpAdress(props.data.ipAddress);
    }
    console.log(validNumber);
  };

  const onNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value && !isNaN(Number(value))) {
      const numberValue = Number(value);
      if (
        allSignNumbersWithoutCurrent &&
        allSignNumbersWithoutCurrent.indexOf(numberValue) > -1
      ) {
        toast.error("Sign number already exists");
        setValidNumber(false);
      } else if (numberValue < 1) {
        toast.error("Sign number must be greater than 0");
        setValidNumber(false);
      } else if (numberValue > 999) {
        toast.error("Sign number must be less than 1000");
        setValidNumber(false);
      } else if (numberValue % 1 !== 0) {
        toast.error("Sign number must be an integer");
        setValidNumber(false);
      } else {
        setSignNumber(numberValue);
        setValidNumber(true);
      }
    }
  };

  const onWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value && !isNaN(Number(value))) {
      const numberValue = Number(value);
      setSignWidth(numberValue);
    }
  };

  const onHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value && !isNaN(Number(value))) {
      const numberValue = Number(value);
      setSignHeight(numberValue);
    }
  };
  const onTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSignType(value);
  };

  const handleUpdate = () => {
    if (!validNumber) {
      toast.error("Invalid sign number");
    } else {
      mutate({
        id: props.data.id,
        signName,
        signNumber,
        signType,
        signWidth,
        signHeight,
        latitude,
        longitude,
        customContentEnabled,
        emergencyNotificationEnabled,
        signIpAdress,
      });
    }
  };

  useEffect(() => {
    console.log(props.data);
    if (props.data) {
      if (props.data.latitude && props.data.longitude) {
        setLatitude(props.data.latitude);
        setLongitude(props.data.longitude);
      }
      if (props.data.emergencyNotificationEnabled != null) {
        setEmergencyNotificationEnabled(
          props.data.emergencyNotificationEnabled
        );
      }
      if (props.data.customContentEnabled != null) {
        setCustomContentEnabled(props.data.customContentEnabled);
      }
    }
  }, [props.data]);

  const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(event.code);
    if (event.code === "Escape") {
      props.toggle();
    }
  };

  if (!props.data) return <LoadingSpinner></LoadingSpinner>;

  return (
    <>
      {props.isOpen && (
        <div
          className="dark:bg-darker/50 absolute bottom-0 left-0 right-0 top-0 z-10 flex h-full justify-center overflow-y-hidden bg-gray-500/50 py-12 transition duration-150 ease-in-out"
          id="modal"
          onKeyDown={keyDownHandler}
        >
          <div
            className={`bg-primary-darker absolute inset-y-0 z-10 h-full w-full opacity-50 `}
            onClick={() => handleCancel()}
          ></div>
          <div
            role="alert"
            className="absolute z-20 mx-auto h-5/6 w-11/12 max-w-lg overflow-y-auto md:w-2/3"
          >
            <div className="dark:bg-dark relative rounded-md border border-gray-400 bg-white px-5 py-8 shadow-md dark:border-gray-700 md:px-10">
              <div className="mb-3 flex w-full justify-start text-gray-600">
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </div>
              <h1 className="dark:text-light font-lg mb-4 font-bold leading-tight tracking-normal text-gray-800">
                Edit Sign
              </h1>
              <div className="flex flex-row">
                <div>
                  <label className="dark:text-light text-sm font-bold leading-tight tracking-normal text-gray-800">
                    Sign Name
                  </label>
                  <input
                    id="name"
                    defaultValue={props.data.name}
                    onChange={(e) => setSignName(e.target.value)}
                    className="dark:bg-primary dark:text-light focus:ring-primary mb-5 mr-5 mt-2 flex h-10 w-80 items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 placeholder-gray-200 focus:outline-none focus:ring dark:border-gray-700 dark:placeholder-gray-200"
                    placeholder="Enter sign name"
                  />
                </div>
                <div>
                  <label className="dark:text-light text-sm font-bold leading-tight tracking-normal text-gray-800">
                    Sign Number
                  </label>
                  <input
                    id="number"
                    defaultValue={props.data.number}
                    onChange={onNumberChange}
                    className={`${
                      validNumber
                        ? "focus:ring-primary  ring-none focus:outline-none focus:ring"
                        : "outline-none ring ring-red-400"
                    } dark:bg-primary dark:text-light mb-5 mt-2 flex h-10 w-20 items-center rounded  border border-gray-300 pl-3 text-sm font-normal text-gray-600 placeholder-gray-400 dark:border-gray-700 dark:placeholder-gray-200`}
                    placeholder="Number"
                  />
                </div>
              </div>
              <label className="dark:text-light text-sm  font-bold leading-tight tracking-normal text-gray-800">
                Sign Type
              </label>
              <select
                defaultValue={props.data.type}
                onChange={onTypeChange}
                className="dark:bg-primary dark:text-light w-50 focus:ring-primary mb-5 mt-2 flex h-7 items-center  rounded border  border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:outline-none focus:ring dark:border-gray-700 dark:placeholder-gray-200"
              >
                <option value="general">General</option>
                <option value="pole_mounted">Pole Mounted</option>
              </select>
              <label className="dark:text-light text-sm  font-bold leading-tight tracking-normal text-gray-800">
                Screen Dimensions
              </label>
              <div className="flex flex-row">
                <input
                  id="name"
                  defaultValue={props.data.width}
                  onChange={onWidthChange}
                  className="dark:bg-primary dark:text-light focus:ring-primary mb-5 mr-2 mt-2 flex h-10 items-center  rounded border  border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:outline-none focus:ring dark:border-gray-700 dark:placeholder-gray-200"
                  placeholder="Width px"
                />
                <input
                  id="name"
                  defaultValue={props.data.height}
                  onChange={onHeightChange}
                  className="dark:bg-primary dark:text-light focus:ring-primary mb-5 ml-5 mt-2 flex h-10 items-center  rounded border  border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:outline-none focus:ring dark:border-gray-700 dark:placeholder-gray-200"
                  placeholder="Height px"
                />
              </div>
              <div>
                <label className="dark:text-light text-sm font-bold leading-tight tracking-normal text-gray-800">
                  Ip Adress
                </label>
                <input
                  onChange={(e) => setSignIpAdress(e.target.value)}
                  type="text"
                  id="name"
                  defaultValue={props.data.ipAddress}
                  className="dark:bg-primary dark:text-light focus:ring-primary mb-5 mr-5 mt-2 flex h-10 w-80 items-center rounded  border border-gray-300 pl-3 text-sm font-normal text-gray-600 placeholder-gray-400 focus:outline-none focus:ring dark:border-gray-700 dark:placeholder-gray-200"
                  placeholder="Enter IP Adress"
                />
              </div>
              <label className="dark:text-light text-sm  font-bold leading-tight tracking-normal text-gray-800">
                Custom Content
              </label>
              <div className="flex h-10 w-full items-center">
                <button
                  className="relative focus:outline-none"
                  //x-cloak
                  onClick={() => setCustomContentEnabled(!customContentEnabled)}
                >
                  <div className="bg-primary-100 dark:bg-primary-darker h-6 w-12 rounded-full outline-none transition"></div>
                  <div
                    className={`absolute left-0 top-0 inline-flex h-6 w-6 scale-110 transform items-center justify-center rounded-full shadow-sm transition-all duration-200 ease-in-out ${
                      customContentEnabled
                        ? "bg-primary-light dark:bg-primary translate-x-6"
                        : "dark:bg-primary-100  translate-x-0 bg-white"
                    }`}
                  ></div>
                </button>
              </div>
              <label className="dark:text-light text-sm  font-bold leading-tight tracking-normal text-gray-800">
                Emergency Notifiaction{" "}
              </label>
              <div className="mb-3 flex h-10 w-full items-center">
                <button
                  className="relative focus:outline-none"
                  onClick={() =>
                    setEmergencyNotificationEnabled(
                      !emergencyNotificationEnabled
                    )
                  }
                  //x-cloak
                >
                  <div className="bg-primary-100 dark:bg-primary-darker h-6 w-12 rounded-full outline-none transition"></div>

                  <div
                    className={`absolute left-0 top-0 inline-flex h-6 w-6 scale-110 transform items-center justify-center rounded-full shadow-sm transition-all duration-200 ease-in-out ${
                      emergencyNotificationEnabled
                        ? "bg-primary-light dark:bg-primary translate-x-6"
                        : "dark:bg-primary-100  translate-x-0 bg-white"
                    }`}
                  ></div>
                </button>
              </div>
              <div
                className={`${
                  emergencyNotificationEnabled ? "" : "hidden"
                } ml-5 mr-5`}
              >
                <label className="dark:text-light text-sm  leading-tight tracking-normal text-gray-600">
                  Data Source
                </label>
                <select
                  className="dark:bg-primary dark:text-light focus:ring-primary mb-5 mt-2 flex h-7 w-full items-center  rounded border  border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:outline-none focus:ring dark:border-gray-700 dark:placeholder-gray-200"
                  id="cars"
                  name="cars"
                >
                  <option value="general">Gallagher</option>
                  <option value="pole_mounted">Other Integration</option>
                </select>
              </div>

              <div className="relative flex w-full items-center justify-start">
                <button
                  onClick={handleUpdate}
                  className="bg-primary hover:bg-primary-dark focus:ring-primary dark:focus:ring-offset-dark rounded-md px-8 py-2 text-sm text-white focus:outline-none focus:ring focus:ring-offset-1 focus:ring-offset-white"
                >
                  Update
                </button>
                <button
                  className="dark:bg-primary-darker dark:text-light hover:text-lighter hover:bg-primary ml-3 rounded border px-8 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  onClick={toggleDelete}
                  className="focus:ring-primary dark:focus:ring-offset-dark absolute right-0 rounded-md bg-red-400 px-6 py-2 text-sm text-white hover:bg-red-600 focus:outline-none focus:ring focus:ring-offset-1 focus:ring-offset-white"
                >
                  Delete
                </button>
              </div>
              {isOpenDelete ? (
                <DeleteSignModal
                  isOpenDelete={isOpenDelete}
                  toggleDeleteModal={toggleDelete}
                  data={props.data}
                ></DeleteSignModal>
              ) : null}
              <button
                className="absolute right-0 top-0 mr-5 mt-4 cursor-pointer rounded text-gray-400 transition duration-150 ease-in-out hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
                onClick={handleCancel}
                aria-label="close modal"
                role="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-x"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface ModalTypeDelete {
  isOpenDelete: boolean;
  toggleDeleteModal: () => void;
  data: Sign;
}

export function DeleteSignModal(props: ModalTypeDelete) {
  const ctx = api.useContext();
  const { mutate } = api.sign.delete.useMutation({
    onSuccess: () => {
      void ctx.sign.getAll.invalidate();
      void ctx.sign.getById.invalidate();
      void ctx.sign.getLastSign.invalidate();
    },
    onError: (error) => {
      console.log(error.data);
      const errorMessage = error.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("An error occured, failed to delete");
      }
    },
  });

  const handleCancel = () => {
    props.toggleDeleteModal();
    console.log("cancel");
  };

  return (
    <div
      className="dark:bg-darker/50 absolute bottom-0 left-0 right-0 top-0 z-10 flex h-full justify-center overflow-y-hidden bg-gray-500/50 py-12 transition duration-150 ease-in-out"
      id="modal"
    >
      <div
        className={`bg-primary-darker absolute inset-y-0 z-10 h-full w-full opacity-50 `}
        onClick={handleCancel}
      ></div>
      <div
        id="deleteModal"
        aria-hidden="true"
        className="h-50 w-100 h-modal fixed left-0 right-0 top-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0 md:h-full"
      >
        <div className="relative h-full w-full max-w-md p-4 md:h-auto">
          <div className="relative rounded-lg bg-white p-4 text-center shadow dark:bg-gray-800 sm:p-5">
            <button
              type="button"
              className="absolute right-2.5 top-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="deleteModal"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <svg
              className="mx-auto mb-3.5 h-11 w-11 text-gray-400 dark:text-gray-500"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            <p className="mb-4 text-gray-500 dark:text-gray-300">
              Are you sure you want to delete this item?
            </p>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleCancel}
                data-modal-toggle="deleteModal"
                type="button"
                className="focus:ring-primary-300 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
              >
                No, cancel
              </button>
              <button
                onClick={() =>
                  mutate({
                    id: props.data.id,
                  })
                }
                className="rounded-lg bg-red-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
              >
                Yes, I&apos;m sure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ImagesListView: React.FunctionComponent<{
  images: SignToRollingImage[];
}> = ({ images }) => {
  return (
    <div
      className="dark:bg-darker col-span-2 rounded-md bg-white"
    >
      <div className="dark:border-primary flex items-center justify-between border-b p-4">
        <h4 className="dark:text-light text-lg font-semibold text-gray-500">
          Images Playlist
        </h4>
      </div>

      <div className="ml-10 mr-10 flex overflow-auto ">
          {...images?.map((image) => <ImageCard key={image.rollingImageId} id={image.rollingImageId} />)}
        </div>
      </div>
  );
};

const ImageCard: React.FunctionComponent<{ id: string }> = ({ id }) => {
  const { data, isLoading } = api.image.getById.useQuery({
    id,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!data) return <div>Error Loading Image</div>;

  return (
    <>
        <div className="dark:bg-darker col-span-1 mt-4 mb-4 ml-4 flex max-h-[30%] min-h-[260px] min-w-[215px] max-w-[115px] cursor-pointer items-center justify-center rounded-lg border-2 border-gray-400">
            <Image
              src={data.imageUrl}
              width={200}
              height={200}
              alt="rollingimages1"
            />
            </div>
        
    </>
  );
};
