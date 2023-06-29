import dynamic from "next/dynamic";
import Link from "next/link";
import { type ReactElement, useEffect } from "react";
import ActiveSigns from "~/components/ActiveSigns";
import AvailablityLineChart from "~/components/AvailbilityLineChart";
import Layout from "~/layouts/Layout";
import { api } from "~/utils/api";
import type { NextPageWithLayout } from "../_app";
import React, {useState} from "react";
import { LoadingSpinner } from "~/components/LoadingSpinner";


const Page: NextPageWithLayout = () => {
    const {data, isLoading} = api.sign.getAll.useQuery();

  if(isLoading) return <div className="p-5 flex justify-center items-center"><LoadingSpinner></LoadingSpinner></div>

  if(!data) return <div className="top-0 right-0 ml-6 mt-3" >Something went wrong...</div>

  const MapChartAllSigns = dynamic(() => import("~/components/MapChartAllSigns"), { ssr:false })

  return (        
  <>
    <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
    <h1 className="text-2xl font-semibold">Overview</h1>
    <a
      href="https://github.com/finnmo/SignageCentral"
      target="_blank"
      className="px-4 py-2 text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
    >
      View on github
    </a>
  </div>
  <div className="mt-2">
  <h1 className="text-1xl font-semibold text-gray-500 px-4">Signs</h1>
    <StatusBlockMap></StatusBlockMap>
    <div className="grid grid-cols-1 p-4 space-y-8 lg:gap-8 lg:space-y-0 lg:grid-cols-3">
    <AvailablityLineChart></AvailablityLineChart>
    <ActiveSigns></ActiveSigns>
    </div>

    <div className="grid grid-cols-1 p-4 space-y-8 lg:gap-8 lg:space-y-0 lg:grid-cols-2">
      <MapChartAllSigns allSigns={data}></MapChartAllSigns>
    </div>
  </div>
</>

)}

const StatusBlockMap = () => {
  const {data, isLoading} = api.sign.getAll.useQuery();

  if (isLoading) return (
      <div className="top-0 right-0 ml-6 mt-3">
      <LoadingSpinner size={40}/>
      </div>
  )

  if(!data) return <div className="top-0 right-0 ml-6 mt-3" >Something went wrong...</div>

  return (
    <div className="grid grid-cols-1 gap-8 p-4 lg:grid-cols-2 xl:grid-cols-4">
      {...data?.map((sign) => (
        <Link
            href={`/sign/${sign.id}`}
            key={sign.id}>
          <SignStatusOverview signName={sign.name} signNumber={sign.number} signIpAddress={sign.ipAddress} signType={sign.type}></SignStatusOverview>
        </Link>
      ))} 
    </div>
  )
}


export interface Props {
    signName: string;
    signNumber: number;
    signIpAddress: string;
    signType: string;
}

export const SignStatusOverview: React.FunctionComponent<{ signName: string, signNumber: number, signIpAddress: string, signType: string}> = (props: Props) =>{

    const {data: isOnline, isLoading} = api.ping.getOnline.useQuery({ip: props.signIpAddress});
    const [onlineText, setOnlineText] = useState("Offline");
    const [onlineBoolean, setOnlineBoolean] = useState(false);

    useEffect(() => {
      if(isOnline !== undefined){
        setOnlineBoolean(isOnline);
        if(isOnline){
          setOnlineText("Online");
        }else{
          setOnlineText("Offline");
        }

      }

    }, [isOnline]);

    return (
<div className="flex items-center justify-between p-4 bg-white rounded-md dark:bg-darker">
    <div>
        <h6
        className="text-xs font-medium leading-none tracking-wider text-gray-500 uppercase dark:text-primary-light"
        >
        Sign {props.signNumber}
        </h6>
        <span className="text-xl font-semibold">{props.signName}</span>
        <span className={`${isLoading ? `` : `inline-block px-2 py-px ml-2 text-xs ${onlineBoolean ? "text-green-500 bg-green-100" : "text-red-500 bg-red-200" } rounded-md`}`}>
        {isLoading ? '' : onlineText}
        </span>
    </div>
    <div>
        <span>
        <svg
            className={`w-12 h-12 text-gray-300 dark:text-primary-dark ${props.signType==='general' ? "":"hidden"}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 500 500"
            stroke="currentColor"
        >
        <path strokeLinecap="round"strokeLinejoin="round" className="stroke-gray-500 fill-transparent" strokeWidth="15" d="m145.043 494.29 225.193-.738" />
        <path d="m336.513 494.938-.693-94.693" className="stroke-gray-500 fill-transparent"strokeWidth="15px"/>
        <rect width="267.949" height="393.251" x="220.898" y="212.22" rx="21" ry="21"  strokeWidth="15" className="stroke-gray-500 fill-transparent"transform="rotate(.344 34506.812 -15857.296)"/>
        <path d="m178.839 493.566-.402-95.005" strokeWidth="15" className="stroke-gray-500 fill-transparent"/>
        <path d="m361.22 70.939-.943-32.754-174.308-1.111M153.785 38.03l1.092 328.53 203.341-.912 1.447-265.477" strokeWidth="15" strokeLinejoin="round" strokeLinecap="round" className="stroke-gray-500 fill-transparent" />
        <path d="m155.195 37.605 33.852-.685" strokeWidth="15" strokeLinejoin="round" strokeLinecap="round" className="stroke-gray-500 fill-transparent"/>
        <circle cx="256.038" cy="114.864" r="32.101"strokeWidth="15" className="stroke-gray-500 fill fill-transparent"/>
        <path d="m159.09 215.523 42.646-39.968 108.38 102.741 47.245-39.614" strokeLinejoin="round" strokeWidth="15" strokeLinecap="round" className="stroke-gray-500 fill fill-transparent"/>
        <path d="m262.903 225.353 27.75-24.593 55.623 51.589" strokeLinejoin="round" strokeWidth="15" className="stroke-gray-500 fill fill-transparent"/>
        <path d="m158.227 315.524 28.367-33.168 29.657 27.839" strokeLinejoin="round" strokeWidth="15" strokeLinecap="round" className="stroke-gray-500 fill fill-transparent"/>
        <path d="m232.977 327.227 36.209 38.873" className="  stroke-gray-500 fill-transparent"strokeWidth="15" strokeLinejoin="round"strokeLinecap="round"/>
        </svg>

        <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" viewBox="0 0 500 500" className={`w-12 h-12 text-gray-300 dark:text-primary-dark ${props.signType==='pole_mounted' ? "":"hidden"}`}>
        <path d="m114.443 391.112.654-304.598" strokeWidth="15" className="stroke-gray-500 fill-transparent" />
        <path d="m156.685 393.216.132-38.188" strokeWidth="15" className="stroke-gray-500 fill-transparent" strokeLinecap="round"/>
        <path d="m156.811 331.783-.534-246.079" strokeWidth="15" className="stroke-gray-500 fill-transparent" strokeLinecap="round"/>
        <path d="m156.308 118.879 66.001.567" strokeWidth="15" className="stroke-gray-500 fill-transparent"/>
        <path d="m158.373 265.405 64.193-.754" strokeWidth="15" className="stroke-gray-500 fill-transparent" />
        <path d="m255.068 259.395 123.701 1.31 M277.438 281.84l81.629-.882" strokeWidth="15" className="stroke-gray-500 fill-transparent" strokeLinecap="round"/>
        <path d="m322.307 104.693-66.186-.098.087 124.978 122.762-1.948-1.235-123.798-33.131.737" strokeWidth="15" className="stroke-gray-500 fill-transparent" strokeLinecap="round"/>
        <path d="m287.416 137.552-1.157 32.857 61.919.087-1.157-35.291z" strokeWidth="15" className="stroke-gray-500 fill-transparent" strokeLinecap="round"/>
        <rect width="188.425" height="243.277" x="223.055" y="71.316" rx="21" ry="21" strokeWidth="15" className="stroke-gray-500 fill-transparent" strokeLinecap="round"/>
        <path d="m322.015 103.558-66.804-.134-.343 124.132 123.825.772-.624-125.083-33.526.669" strokeWidth="15" className="stroke-gray-500 fill-transparent" strokeLinecap="round" transform="rotate(.324 316.815 165.78)"/>
        <path d="m252.978 258.727 127.149.57M275.356 280.664l82.671-.243"strokeWidth="15" className="stroke-gray-500 fill-transparent" strokeLinecap="round"/>
        <path d="m297.24 197.244 41.857.148" strokeWidth="15" className="stroke-gray-500 fill-transparent" strokeLinecap="round"/>
        <rect width="65.358" height="34.86" x="283.56" y="134.434" rx="10.212" ry="10.212" strokeWidth="15" className="stroke-gray-500 fill-transparent" strokeLinecap="round"/>
        <path d="m91.439 427.006 86.418.243" strokeWidth="15" className="stroke-gray-500 fill-transparent" strokeLinecap="round"/>
        <path d="m113.95 87.791 3.584-4.207c3.583-4.207 10.75-12.622 17.932-12.827 7.181-.205 14.376 7.799 17.974 11.801l3.597 4.002" strokeWidth="15" className="stroke-gray-500 fill-transparent" strokeLinecap="round"/>
        <rect width="83.509" height="32.091" x="93.535" y="395.616" rx="7.823" ry="7.823" strokeWidth="15" className="stroke-gray-500 fill-transparent" strokeLinecap="round"/>
        </svg>
        </span>
    </div>
</div>
    )
};



Page.getLayout = function getLayout(page: ReactElement) {
  api.sign.getAll.useQuery() //Start fetching asap 
  return (
    <Layout>
      {page}
    </Layout>
  )
  }
export default Page