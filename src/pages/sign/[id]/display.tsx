import type { NextPageWithLayout } from "../../_app";
import React from 'react'
import { api } from "~/utils/api";
import type { GetStaticPaths, GetStaticProps } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { prisma } from "~/server/db";
import "leaflet/dist/leaflet.css";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import Image from 'next/image'

const Endpoint: NextPageWithLayout<{ id: string }> = ({ id }) => {

  const { data, isLoading } = api.sign.getById.useQuery({
    id,
  });



  if(isLoading) return <LoadingSpinner></LoadingSpinner>
  if(!data) return <div>404 Not found</div>

  return  (
  <>
  <div className="fixed block" style={{
          width: data.width+'px',
          height: data.height+'px',
          backgroundColor: 'black',
        }}>
          <div className="w-100 h-100">
            <Image style={{objectFit: "fill"}} fill={true} alt="" src="/avatar.jpg"></Image>
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


export default Endpoint;
