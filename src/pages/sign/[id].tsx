import { type ReactElement, type ReactNode, useState, useEffect, type ChangeEvent   } from "react";
import Layout from "~/layouts/Layout";
import type { NextPageWithLayout } from "../_app";
import React from 'react'
import AvailablityLineChart from '~/components/AvailbilityLineChart';
import dynamic from 'next/dynamic';
import { api } from "~/utils/api";
import type { GetStaticPaths, GetStaticProps } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { prisma } from "~/server/db";
import "leaflet/dist/leaflet.css";
import useModal from "~/server/helpers/useModal";
import { type Sign } from "@prisma/client";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { toast } from "react-hot-toast";
import Link from "next/link";
import useModalDelete from "~/server/helpers/useModalDelete";

const SignPage: NextPageWithLayout<{ id: string }> = ({ id }) => {

  const MapChart = dynamic(() => import("~/components/MapChart"), { ssr:false })

  const { isOpen, toggle } = useModal();

  const { data, isLoading } = api.sign.getById.useQuery({
    id,
  });

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  useEffect(() => {
    // put the fetchData inside the effect
    if(data){
      setLatitude(data.latitude);
      setLongitude(data.longitude);
    }
  },[data]);

  if(isLoading) return <LoadingSpinner></LoadingSpinner>
  if(!data) return <div>404 Not found</div>

  return  (
  <>
<div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker z-10">
  <h1 className="text-2xl font-semibold">{`Sign ${data.number} - ${data.name}`}</h1>
  <button
    onClick={toggle}
    className="px-4 py-2 text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
  >
    Edit
  </button>
</div>
<EditSign data={data} isOpen={isOpen} toggle={toggle}></EditSign>

<div className="mt-2">
<h1 className="text-1xl font-semibold text-gray-500 px-4">Signs</h1>
  <div className="grid p-4 space-y-4 lg:gap-8 lg:space-y-0 lg:grid-cols-3">
  <div className="col-span-1 bg-white rounded-md dark:bg-darker">
      <div className="p-4 border-b dark:border-primary">
          <Link
            href={`/sign/${id}/display`}
            className="float-right px-4 py-2 text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
          >
          Display
          </Link>
          <h4 className="text-lg font-semibold text-gray-500 dark:text-light">Sign Preview</h4>
      </div>
      <div className="relative p-4"></div>
  </div>
  <AvailablityLineChart></AvailablityLineChart>
  </div>

  <div className="grid grid-cols-1 p-4 space-y-8 lg:gap-8 lg:space-y-0 lg:grid-cols-2">
    <MapChart latitude={latitude} longitude={longitude}></MapChart>
  </div>
</div>
</>
)
}


export const getStaticProps: GetStaticProps =  async  (
  context,
) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id as string;

  if(typeof id !== "string") throw new Error("Invalid id");

  await ssg.sign.getById.prefetch({ id }); 
  
  return {
    props: {
      trpcState: JSON.parse(JSON.stringify(ssg.dehydrate())) as string,
      id,
    },
    revalidate: 1,
  }
}

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
    fallback: 'blocking',
  };
};

SignPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
  }

export default SignPage


interface ModalType {
  children?: ReactNode;
  isOpen: boolean;
  toggle: () => void;
  data: Sign;
}

export function EditSign(props: ModalType) {
  const ctx = api.useContext();

  const allSignNumbers = api.sign.getAll.useQuery().data?.map((sign) => sign.number);
  const allSignNumbersWithoutCurrent = allSignNumbers?.filter((signNumber) => signNumber !== props.data.number);

  const { mutate } = api.sign.update.useMutation(
    {
      onSuccess: () => {
          handleCancel();
          void ctx.sign.getAll.invalidate();
          void ctx.sign.getById.invalidate();
          void ctx.sign.getLastSign.invalidate();
      },
      onError: (error) => {
        console.log(error.data)
        const errorMessage = error.data?.zodError?.fieldErrors.content;
        if(errorMessage && errorMessage[0]){
          toast.error(errorMessage[0]);
        }else{
          toast.error("An error occured, failed to update");
        }
      },
    }
    );

    const [signName, setSignName] = useState<string>(props.data.name ? props.data.name : "");
    const [signNumber, setSignNumber] = useState<number>(props.data.number ? props.data.number : 1);
    const [signWidth, setSignWidth] = useState<number>(props.data.width ? props.data.width : 1);
    const [signHeight, setSignHeight] = useState<number>(props.data.height ? props.data.height : 1);
    const [latitude, setLatitude] = useState<number>(props.data.latitude ? props.data.latitude : 0);
    const [longitude, setLongitude] = useState<number>(props.data.longitude ? props.data.longitude : 0);
    const [signType, setSignType] = useState<string>(props.data.type ? props.data.type : "general");
    const [customContentEnabled, setCustomContentEnabled] = useState(props.data.customContentEnabled ? props.data.customContentEnabled : false);
    const [emergencyNotificationEnabled, setEmergencyNotificationEnabled] = useState(props.data.emergencyNotificationEnabled ? props.data.emergencyNotificationEnabled : false);
    const [signIpAdress, setSignIpAdress] = useState(props.data.ipAddress ? props.data.ipAddress : "0.0.0.0");

    const { isOpenDelete, toggleDeleteModal } = useModalDelete();

    const [validNumber, setValidNumber] = useState<boolean>(true);

    const handleCancel = () => {
      props.toggle();
      setValidNumber(true);
      if(props.data){
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
    }

    const onNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.trim();
      if (value && !isNaN(Number(value))) {
        const numberValue = Number(value);
        if(allSignNumbersWithoutCurrent && (allSignNumbersWithoutCurrent.indexOf(numberValue) > -1)) {
          toast.error("Sign number already exists");
          setValidNumber(false);
        }else if(numberValue < 1){
            toast.error("Sign number must be greater than 0");
            setValidNumber(false);
        }else if(numberValue > 999){
          toast.error("Sign number must be less than 1000");
          setValidNumber(false);
        }else if(numberValue % 1 !== 0){
          toast.error("Sign number must be an integer");
          setValidNumber(false);
        }else{
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
    if(!validNumber){
      toast.error("Invalid sign number");
    }else{
        mutate({id:props.data.id, signName, signNumber, signType, signWidth, signHeight, latitude, longitude, customContentEnabled, emergencyNotificationEnabled, signIpAdress})
      }
    }

  

    useEffect(() => {
      console.log(props.data)
      if(props.data){
          if(props.data.latitude && props.data.longitude){
              setLatitude(props.data.latitude);
              setLongitude(props.data.longitude);
          }
          if(props.data.emergencyNotificationEnabled != null){
              setEmergencyNotificationEnabled(props.data.emergencyNotificationEnabled);
          }
          if(props.data.customContentEnabled != null){
              setCustomContentEnabled(props.data.customContentEnabled);
          }
      }
  }, [props.data]);

  const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(event.code);
    if (event.code === "Escape") {
      props.toggle();
    }
  }

    if(!props.data) return <LoadingSpinner></LoadingSpinner>

    return (
        <> 
          {props.isOpen && (
            <div
              className="flex justify-center dark:bg-darker/50 absolute bottom-0 left-0 right-0 top-0 z-10 h-full overflow-y-hidden bg-gray-500/50 py-12 transition duration-150 ease-in-out"
              id="modal"
              onKeyDown={keyDownHandler}
            >
              <div
                  className={`absolute inset-y-0 z-10 w-full h-full bg-primary-darker opacity-50 `}
                  onClick={()=>handleCancel()}
              ></div>
            <div
              role="alert"
              className="absolute mx-auto h-5/6 w-11/12 z-20 max-w-lg overflow-y-auto md:w-2/3"
            >
                  <div className="relative py-8 px-5 md:px-10 bg-white dark:bg-dark dark:border-gray-700 shadow-md rounded-md border border-gray-400">
                      <div className="w-full flex justify-start text-gray-600 mb-3">
                      <svg
                          className="w-5 h-5"
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
                      <h1 className="text-gray-800 dark:text-light font-lg font-bold tracking-normal leading-tight mb-4">Edit Sign</h1>
                      <div className="flex flex-row">
                          <div> 
                              <label className="text-gray-800 dark:text-light text-sm font-bold leading-tight tracking-normal">Sign Name</label>
                              <input id="name" defaultValue={props.data.name} onChange={(e) => setSignName(e.target.value)}  className="mb-5 mt-2 text-gray-600 dark:bg-primary placeholder-gray-200 dark:text-light dark:placeholder-gray-200 dark:border-gray-700 w-80 mr-5 focus:outline-none focus:ring focus:ring-primary font-normal h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="Enter sign name" />
                          </div>
                          <div>
                              <label className="text-gray-800 dark:text-light text-sm font-bold leading-tight tracking-normal">Sign Number</label>
                              <input id="number" defaultValue={props.data.number} onChange={onNumberChange} className={`${validNumber ? 'focus:outline-none  focus:ring focus:ring-primary ring-none' : 'outline-none ring ring-red-400'} mb-5 mt-2 text-gray-600 dark:bg-primary dark:text-light placeholder-gray-400 dark:placeholder-gray-200 dark:border-gray-700 w-20  font-normal h-10 flex items-center pl-3 text-sm border-gray-300 rounded border`} placeholder="Number" />
                          </div>
                      </div>
                      <label className="text-gray-800 dark:text-light  text-sm font-bold leading-tight tracking-normal">Sign Type</label>
                      <select defaultValue={props.data.type} onChange={onTypeChange} className="mb-5 mt-2 text-gray-600 dark:bg-primary dark:text-light dark:placeholder-gray-200 dark:border-gray-700 w-50 focus:outline-none  focus:ring focus:ring-primary  font-normal h-7 flex items-center pl-3 text-sm border-gray-300 rounded border">
                          <option value="general">General</option>
                          <option value="pole_mounted">Pole Mounted</option>
                      </select>
                      <label className="text-gray-800 dark:text-light  text-sm font-bold leading-tight tracking-normal">Screen Dimensions</label>
                      <div className="flex flex-row">
                          <input id="name" defaultValue={props.data.width} onChange={onWidthChange} className="mb-5 mr-2 mt-2 text-gray-600 dark:bg-primary dark:text-light dark:placeholder-gray-200 dark:border-gray-700 focus:outline-none  focus:ring focus:ring-primary  font-normal h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="Width px" />
                          <input id="name" defaultValue={props.data.height} onChange={onHeightChange} className="mb-5 mt-2 ml-5 text-gray-600 dark:bg-primary dark:text-light dark:placeholder-gray-200 dark:border-gray-700 focus:outline-none  focus:ring focus:ring-primary  font-normal h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="Height px" />
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
                      <label className="text-gray-800 dark:text-light  text-sm font-bold leading-tight tracking-normal">Custom Content</label>
                      <div className="flex items-center w-full h-10">
                          <button
                          className="relative focus:outline-none"
                          //x-cloak
                          onClick={ () => setCustomContentEnabled(!customContentEnabled)}
                          >
                          <div
                              className="w-12 h-6 transition rounded-full outline-none bg-primary-100 dark:bg-primary-darker"
                          ></div>
                          <div
                              className={`absolute top-0 left-0 inline-flex items-center justify-center w-6 h-6 transition-all duration-200 ease-in-out transform scale-110 rounded-full shadow-sm ${
                              customContentEnabled ? "translate-x-6 bg-primary-light dark:bg-primary" : "translate-x-0  bg-white dark:bg-primary-100"
                              }`}   
                          ></div>
                          </button>
                      </div>
                      <label className="text-gray-800 dark:text-light  text-sm font-bold leading-tight tracking-normal">Emergency Notifiaction </label>
                      <div className="flex items-center w-full h-10 mb-3">
                          <button
                          className="relative focus:outline-none"
                          onClick={ () => setEmergencyNotificationEnabled(!emergencyNotificationEnabled)}
                          //x-cloak
                          >
                          <div
                              className="w-12 h-6 transition rounded-full outline-none bg-primary-100 dark:bg-primary-darker"
                          ></div>

                          <div
                              className={`absolute top-0 left-0 inline-flex items-center justify-center w-6 h-6 transition-all duration-200 ease-in-out transform scale-110 rounded-full shadow-sm ${
                                  emergencyNotificationEnabled ? "translate-x-6 bg-primary-light dark:bg-primary" : "translate-x-0  bg-white dark:bg-primary-100"
                              }`}   
                          ></div>
                          </button>
                      </div>
                      <div className={`${emergencyNotificationEnabled ? '' : 'hidden'} ml-5 mr-5`}>
                          <label className="text-gray-600 dark:text-light  text-sm leading-tight tracking-normal">Data Source</label>
                          <select className="mb-5 mt-2 text-gray-600 dark:bg-primary dark:text-light dark:placeholder-gray-200 dark:border-gray-700 w-full focus:outline-none  focus:ring focus:ring-primary  font-normal h-7 flex items-center pl-3 text-sm border-gray-300 rounded border" id="cars" name="cars">
                              <option value="general">Gallagher</option>
                              <option value="pole_mounted">Other Integration</option>
                          </select>
                      </div>
                      
                      <div className="flex items-center relative justify-start w-full">
                      <button
                          onClick={handleUpdate}
                          className="px-8 py-2 text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
                          >
                          Update
                          </button>
                      <button
                          className="dark:bg-primary-darker dark:text-light px-8 py-2 ml-3 text-sm text-gray-700 hover:text-lighter hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 border rounded"
                          onClick={handleCancel}>
                          Cancel
                      </button>  
                      <button
                          onClick={toggleDeleteModal}
                          className="absolute right-0 px-6 py-2 text-sm text-white rounded-md bg-red-400 hover:bg-red-600 focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
                          >
                          Delete
                          </button>
                      </div>
                      <DeleteSignModal
                        isOpenDelete={isOpenDelete}
                        toggleDeleteModal={toggleDeleteModal}
                        data={props.data}
                      ></DeleteSignModal>
                      <button className="cursor-pointer absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600" onClick={handleCancel} aria-label="close modal" role="button">
                          <svg  xmlns="http://www.w3.org/2000/svg"  className="icon icon-tabler icon-tabler-x" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
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
        
    )
}

interface ModalTypeDelete {
  childrenInt?: ReactNode;
  isOpenDelete: boolean;
  toggleDeleteModal: () => void;
  data: Sign;
}

export function DeleteSignModal(props: ModalTypeDelete) {

  const ctx = api.useContext();
  const { mutate } = api.sign.delete.useMutation(
    {
      onSuccess: () => {
          void ctx.sign.getAll.invalidate();
          void ctx.sign.getById.invalidate();
          void ctx.sign.getLastSign.invalidate();
      },
      onError: (error) => {
        console.log(error.data)
        const errorMessage = error.data?.zodError?.fieldErrors.content;
        if(errorMessage && errorMessage[0]){
          toast.error(errorMessage[0]);
        }else{
          toast.error("An error occured, failed to delete");
        }
      },
    }
    );

    const handleCancel = () => {
      props.toggleDeleteModal();
    };
  
  return (
    <div
    className="flex justify-center dark:bg-darker/50 absolute bottom-0 left-0 right-0 top-0 z-10 h-full overflow-y-hidden bg-gray-500/50 py-12 transition duration-150 ease-in-out"
    id="modal"
  >
    <div
        className={`absolute inset-y-0 z-10 w-full h-full bg-primary-darker opacity-50 `}
        onClick={handleCancel}
    ></div>
      <div id="deleteModal" aria-hidden="true" className="flex h-50 w-100 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
      <div className="relative p-4 w-full max-w-md h-full md:h-auto">
          <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
              <button type="button" className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="deleteModal">
                  <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                  <span className="sr-only">Close modal</span>
              </button>
              <svg className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
              <p className="mb-4 text-gray-500 dark:text-gray-300">Are you sure you want to delete this item?</p>
              <div className="flex justify-center items-center space-x-4">
                  <button onClick={handleCancel} data-modal-toggle="deleteModal" type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                      No, cancel
                  </button>
                  <button onClick={() =>
                        mutate({
                          id: props.data.id,
                        })
                      }  className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                      Yes, I&apos;m sure
                  </button>
              </div>
          </div>
      </div>
  </div>
</div>

  )

  }