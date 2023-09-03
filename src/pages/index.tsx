import type { ReactElement } from "react";
import Layout from "~/layouts/Layout";
import Overview from "./dashboards/overview";
import type { NextPageWithLayout } from "./_app";

const Page: NextPageWithLayout = () => {
  return <Overview></Overview>
}


Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
  }
export default Page