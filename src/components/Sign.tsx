
import React from 'react'
import BarChart from "./BarChart"
import DynamicNumber from "./DynamicNumber";
import LineChart from "./LineChart";
import DoughnutChart from "./DoughnutChart";
import SignStatusOverview from './SignStatusOverview';
import AvailablityLineChart from './AvailbilityLineChart';
import dynamic from 'next/dynamic';
import ActiveSigns from './ActiveSigns';

export interface Props {}

const MapChart = dynamic(() => import("./MapChart"), { ssr:false })


const Sign: React.FC<Props> = (props) => {

    return (
        <>
        <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Sign 1 - </h1>
        <a
          href="https://github.com/Kamona-WD/kwd-dashboard"
          target="_blank"
          className="px-4 py-2 text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
        >
          View on github
        </a>
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
          <MapChart></MapChart>
        </div>
      </div>
    </>
    )
}
export default Sign