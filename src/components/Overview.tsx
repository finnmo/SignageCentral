
import React from 'react'
import SignStatusOverview from './SignStatusOverview';
import AvailablityLineChart from './AvailbilityLineChart';
import dynamic from 'next/dynamic';
import ActiveSigns from './ActiveSigns';


const MapChart = dynamic(() => import("./MapChart"), { ssr:false })


const Overview: React.FC = () => {

    return (
        <>
        <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Overview</h1>
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
        <div className="grid grid-cols-1 gap-8 p-4 lg:grid-cols-2 xl:grid-cols-4">
          <SignStatusOverview signName={"University Blvd and Hayman Rd"} signNumber={1} ></SignStatusOverview>
          <SignStatusOverview signName={"University Blvd and Kent St"} signNumber={2} ></SignStatusOverview>
          <SignStatusOverview signName={"Stadium Entrance"} signNumber={3} ></SignStatusOverview>
          <SignStatusOverview signName={"Beazley Ave and Kent St"} signNumber={4} ></SignStatusOverview>
          <SignStatusOverview signName={"South Entrance"} signNumber={5} ></SignStatusOverview>
          <SignStatusOverview signName={"Pole Mount Display"} signNumber={6} ></SignStatusOverview>
        </div>

        <div className="grid grid-cols-1 p-4 space-y-8 lg:gap-8 lg:space-y-0 lg:grid-cols-3">
        <AvailablityLineChart></AvailablityLineChart>
        <ActiveSigns></ActiveSigns>
        </div>

        <div className="grid grid-cols-1 p-4 space-y-8 lg:gap-8 lg:space-y-0 lg:grid-cols-2">
          <MapChart></MapChart>
        </div>
      </div>
    </>
    )
}
export default Overview