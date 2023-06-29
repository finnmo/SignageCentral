import { useState, type ReactElement   } from "react";
import Layout from "~/layouts/Layout";
import type { NextPageWithLayout } from "./_app";
import React from 'react'
import Image from 'next/image'

const ImagePage: NextPageWithLayout = () => {

  const [isOn, setIsOn] = useState(true);
  return  (
  <>
<div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker z-10">
  <h1 className="text-2xl font-semibold">{`Rolling Images`}</h1>
</div>

<div className="mt-2">
  <div className="grid p-4 space-y-4 lg:gap-8 lg:space-y-0 lg:grid-cols-4 grid-rows-2">

    <div className="col-span-1 border-2 border-gray-400 rounded-lg dark:bg-darker">

    </div>
    <div className="col-span-1 bg-white rounded-lg dark:bg-darker pb-5">
      <div className="w-full pt-2 pb-2">
        <span className="p-4">Image Name</span>
      </div>
        <div className="flex w-full bg-white justify-center items-center pl-2 pt-4 pb-4 border-b border-t border-gray-200 dark:border-primary">
            <Image src="/smart-sign-virus-distancing-3.jpg" width={192} height={256} alt="rollingimages1" />
        </div>
        <div className="grid justify-items-end p-4">
          <button className="relative focus:outline-none" onClick={() => setIsOn(!isOn)}>
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
    <div className="col-span-1 bg-white rounded-lg dark:bg-darker pb-5">
      <div className="w-full pt-2 pb-2">
        <span className="p-4">Image Name</span>
      </div>
        <div className="flex w-full bg-white justify-center items-center pl-2 pt-4 pb-4 border-b border-t border-gray-200 dark:border-primary">
            <Image src="/avatar.jpg" width={192} height={256} alt="rollingimages1" />
        </div>
        <div className="grid justify-items-end p-4">
          <button className="relative focus:outline-none" onClick={() => setIsOn(!isOn)}>
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
