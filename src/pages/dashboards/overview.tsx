import type { ReactElement } from "react";
import Overview from "~/components/Overview";
import Layout from "~/layouts/Layout";
import type { NextPageWithLayout } from "../_app";

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