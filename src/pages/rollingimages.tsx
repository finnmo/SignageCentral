import { useState, type ReactElement   } from "react";
import Layout from "~/layouts/Layout";
import type { NextPageWithLayout } from "./_app";
import React from 'react'
import Image from 'next/image'
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { api } from "~/utils/api";

const ImagePage: NextPageWithLayout = () => {
  const {data, isLoading} = api.sign.getAll.useQuery();
  const [isOn, setIsOn] = useState(true);

  if (isLoading) return (
    <div className="top-0 right-0 ml-6 mt-3">
    <LoadingSpinner size={40}/>
    </div>
)
  if(!data) return <div className="top-0 right-0 ml-6 mt-3" >Something went wrong...</div>
  
  return  (
  <>
<div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker z-10">
  <h1 className="text-2xl font-semibold">{`Rolling Images`}</h1>
</div>

<div className="mt-2">
  <div className="grid p-4 space-y-4 lg:gap-8 lg:space-y-0 lg:grid-cols-4 grid-rows-2 pl-10">
    <div className="col-span-1 border-2 min-h-[315px] max-w-[315px] border-gray-400 rounded-lg dark:bg-darker flex flex-col items-center justify-center h-screen max-h-[40%]">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" stroke-width="0.5" stroke="gray" className="w-40 h-40">
      <path stroke-linecap="round" stroke-linejoin="round" d="M13 0v29m15-15h-30" />
    </svg>
      <span className="text-xl pt-20 text-gray-500">Upload New Image</span>
    </div>
    {...data?.map((sign) => (
    <div className="grid-flow-row auto-rows-max col-span-1 max-w-[315px] min-h-[315px] dark:bg-primary-dark bg-white rounded-lg dark:bg-darker pb-5 max-h-[40%]">
    <div className="w-full h-10 pt-2 pb-2 relative">
    <span className="p-4 relative justify-center items-center text-xl ">{sign.name}</span>
      <button className="cursor-pointer absolute right-2 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600"  aria-label="close modal" role="button">
          <svg  xmlns="http://www.w3.org/2000/svg"  className="icon icon-tabler icon-tabler-x" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" />
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
      </button>
    </div>
    <div className="flex w-full h-[80%] dark:bg-primary-darker bg-white p-4 border-b border-t border-gray-200 dark:border-primary ">
      <div className="w-full h-full justify-center items-center relative">
          <Image src="/avatar.jpg" fill={true} alt="rollingimages1" />
        </div>
      </div>
      <div className="relative  p-4">
        <button className="absolute bottom-0 right-0 pr-4 focus:outline-none" onClick={() => setIsOn(!isOn)}>
          <div
              className="w-12 h-6 transition rounded-full outline-none bg-primary-100 dark:bg-primary-darker"
          ></div>
          <div
              className={`absolute top-0 left-0 inline-flex items-center justify-center w-6 h-6 transition-all duration-200 ease-in-out transform scale-110 rounded-full shadow-sm ${
                isOn ? "translate-x-6 bg-primary-light dark:bg-primary" : "translate-x-0  bg-white dark:bg-primary-100"
              }`}   
          ></div>
        </button>
      </div>
    </div>
    ))}
  </div>
</div>
</>
)
}


ImagePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
  }

export default ImagePage
