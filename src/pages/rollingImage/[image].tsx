import { type ReactElement   } from "react";
import Layout from "~/layouts/Layout";
import type { NextPageWithLayout } from "../_app";
import React from 'react'
import AvailablityLineChart from '~/components/AvailbilityLineChart';

const ImagePage: NextPageWithLayout<{ image: string }> = ({ image }) => {

  return  (
  <>
<div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker z-10">
  <h1 className="text-2xl font-semibold">{`Image ${image}`}</h1>
  <button
    className="px-4 py-2 text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
  >
    Edit
  </button>
</div>

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
