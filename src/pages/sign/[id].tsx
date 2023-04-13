import type { ReactElement   } from "react";
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


const SignPage: NextPageWithLayout<{ id: string }> = ({ id }) => {

  const MapChartWithEdit = dynamic(() => import("~/components/MapChartWithEdit"), { ssr:false })


  const { data } = api.sign.getById.useQuery({
    id,
  });

  if(!data) return <div>404 Not found</div>

  return  (
  <>
  <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
  <h1 className="text-2xl font-semibold">{`Sign ${data.number} - ${data.name}`}</h1>
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
    <MapChartWithEdit></MapChartWithEdit>
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