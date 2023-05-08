import { type ReactElement, type ReactNode, useState, useEffect, ChangeEvent, useRef   } from "react";
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
import { Sign } from "@prisma/client";

const SignPage: NextPageWithLayout<{ id: string }> = ({ id }) => {

  const MapChart = dynamic(() => import("~/components/MapChart"), { ssr:false })

  const { isOpen, toggle } = useModal();

  const { data } = api.sign.getById.useQuery({
    id,
  });

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  useEffect(() => {
    // put the fetchData inside the effect
    if(data){
      setLatitude(data.latitude);
      setLongitude(data.longitude);
      console.log(data)
    }


  },[]);


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

    const [isOnParkingMap, setIsOnParkingMap] = useState(props.data.customContentEnabled ? props.data.customContentEnabled: false);
    const [isOnEmergency, setIsOnEmergency] = useState(props.data.emergencyNotificationEnabled ? props.data.emergencyNotificationEnabled: false);

    const [signName, setSignName] = useState<string>("");
    const [signNumber, setSignNumber] = useState<number>(props.data.number ? props.data.number : 1);
    const [signWidth, setSignWidth] = useState<number>(props.data.width ? props.data.width : 1);
    const [signHeight, setSignHeight] = useState<number>(props.data.height ? props.data.height : 1);
    const [signLatitude, setLatitude] = useState<number>(props.data.latitude ? props.data.latitude : 0);
    const [signLongitude, setLongitude] = useState<number>(props.data.longitude ? props.data.longitude : 0);
    

    const onNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = !Number.isNaN(e.target.valueAsNumber) ? e.target.valueAsNumber : 1;
      setSignNumber(value);
    }
    const onWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = !Number.isNaN(e.target.valueAsNumber) ? e.target.valueAsNumber : 1;
      setSignWidth(value);
    }
    const onHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = !Number.isNaN(e.target.valueAsNumber) ? e.target.valueAsNumber : 1;
      setSignHeight(value);
    }


    useEffect(() => {
      if(props.data){
          if(props.data.latitude && props.data.longitude){
              setLatitude(props.data.latitude);
              setLongitude(props.data.longitude);
          }
          if(props.data.emergencyNotificationEnabled == true){
              setIsOnEmergency(true);
          }
          if(props.data.customContentEnabled == true){
              setIsOnParkingMap(true);
          }
      }

  }, []);
    return (
        <> 
            {props.isOpen && (
                <div className="z-10">
                    <div className="py-12 bg-gray-500/50 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0 dark:bg-darker/50" id="modal">
                        <div role="alert" className="container mx-auto w-11/12 md:w-2/3 max-w-lg">
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
                                        <input id="name" defaultValue={props.data.name} onChange={(e) => setSignName(e.target.value)}  className="mb-5 mt-2 text-gray-400 dark:bg-primary placeholder-gray-200 dark:text-light dark:placeholder-gray-200 dark:border-gray-700 w-80 mr-5 focus:outline-none focus:ring focus:ring-primary font-normal h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="Enter sign name" />
                                    </div>
                                    <div>
                                        <label className="text-gray-800dark:text-light text-sm font-bold leading-tight tracking-normal">Sign Number</label>
                                        <input id="number"defaultValue={props.data.number} onChange={onNumberChange} className="mb-5 mt-2 text-gray-600 dark:bg-primary dark:text-light placeholder-gray-400 dark:placeholder-gray-200 dark:border-gray-700 w-20 focus:outline-none  focus:ring focus:ring-primary font-normal h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="Number" />
                                    </div>
                                </div>
                                <label className="text-gray-800 dark:text-light  text-sm font-bold leading-tight tracking-normal">Sign Type</label>
                                <select className="mb-5 mt-2 text-gray-600 dark:bg-primary dark:text-light dark:placeholder-gray-200 dark:border-gray-700 w-50 focus:outline-none  focus:ring focus:ring-primary  font-normal h-7 flex items-center pl-3 text-sm border-gray-300 rounded border" id="cars" name="cars">
                                    <option value="general">General</option>
                                    <option value="pole_mounted">Pole Mounted</option>
                                </select>
                                <label className="text-gray-800 dark:text-light  text-sm font-bold leading-tight tracking-normal">Screen Dimensions</label>
                                <div className="flex flex-row">
                                    <input id="name" defaultValue={props.data.width} onChange={onWidthChange} className="mb-5 mr-2 mt-2 text-gray-600 dark:bg-primary dark:text-light dark:placeholder-gray-200 dark:border-gray-700 focus:outline-none  focus:ring focus:ring-primary  font-normal h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="Width px" />
                                    <input id="name" defaultValue={props.data.width} onChange={onHeightChange} className="mb-5 mt-2 ml-5 text-gray-600 dark:bg-primary dark:text-light dark:placeholder-gray-200 dark:border-gray-700 focus:outline-none  focus:ring focus:ring-primary  font-normal h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="Height px" />
                                </div>
                                <label className="text-gray-800 dark:text-light  text-sm font-bold leading-tight tracking-normal">Parking Map</label>
                                <div className="flex items-center w-full h-10">
                                    <button
                                    className="relative focus:outline-none"
                                    //x-cloak
                                    onClick={ () => setIsOnParkingMap(!isOnParkingMap)}
                                    >
                                    <div
                                        className="w-12 h-6 transition rounded-full outline-none bg-primary-100 dark:bg-primary-darker"
                                    ></div>
                                    <div
                                        className={`absolute top-0 left-0 inline-flex items-center justify-center w-6 h-6 transition-all duration-200 ease-in-out transform scale-110 rounded-full shadow-sm ${
                                        isOnParkingMap ? "translate-x-6 bg-primary-light dark:bg-primary" : "translate-x-0  bg-white dark:bg-primary-100"
                                        }`}   
                                    ></div>
                                    </button>
                                </div>
                                <label className="text-gray-800 dark:text-light  text-sm font-bold leading-tight tracking-normal">Emergency Notifiaction </label>
                                <div className="flex items-center w-full h-10 mb-3">
                                    <button
                                    className="relative focus:outline-none"
                                    onClick={ () => setIsOnEmergency(!isOnEmergency)}
                                    //x-cloak
                                    >
                                    <div
                                        className="w-12 h-6 transition rounded-full outline-none bg-primary-100 dark:bg-primary-darker"
                                    ></div>
                                    <div
                                        className={`absolute top-0 left-0 inline-flex items-center justify-center w-6 h-6 transition-all duration-200 ease-in-out transform scale-110 rounded-full shadow-sm ${
                                            isOnEmergency ? "translate-x-6 bg-primary-light dark:bg-primary" : "translate-x-0  bg-white dark:bg-primary-100"
                                        }`}   
                                    ></div>
                                    </button>
                                </div>
                                <div className={`${isOnEmergency ? '' : 'hidden'} ml-5 mr-5`}>
                                    <label className="text-gray-600 dark:text-light  text-sm leading-tight tracking-normal">Data Source</label>
                                    <select className="mb-5 mt-2 text-gray-600 dark:bg-primary dark:text-light dark:placeholder-gray-200 dark:border-gray-700 w-full focus:outline-none  focus:ring focus:ring-primary  font-normal h-7 flex items-center pl-3 text-sm border-gray-300 rounded border" id="cars" name="cars">
                                        <option value="general">Gallagher</option>
                                        <option value="pole_mounted">Other Integration</option>
                                    </select>
                                </div>
                                
                                <div className="flex items-center justify-start w-full">
                                <button
                                    className="px-8 py-2 text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
                                    >
                                    Update
                                    </button>
                                <button
                                    className="dark:bg-primary-darker dark:text-light px-8 py-2 ml-3 text-sm text-gray-700 hover:text-lighter hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 border rounded"
                                    onClick={props.toggle}>
                                    Cancel
                                </button>  
                                </div>
                                <button className="cursor-pointer absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600" onClick={props.toggle} aria-label="close modal" role="button">
                                    <svg  xmlns="http://www.w3.org/2000/svg"  className="icon icon-tabler icon-tabler-x" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" />
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>  
                        </div>
                    </div>
            </div>
        )}
        </>
        
    )
}
