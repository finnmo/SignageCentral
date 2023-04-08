import { ReactElement } from "react";
import Dashboards from "~/components/Dashboards";
import Layout from "~/layouts/Layout";
import { NextPageWithLayout } from "./_app";

const Page: NextPageWithLayout = () => {
  return <Dashboards></Dashboards>
}


Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
  }
export default Page