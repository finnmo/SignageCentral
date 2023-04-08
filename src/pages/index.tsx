import { ReactElement } from "react";
import Dashboards from "~/components/Dashboards";
import Layout from "~/layouts/Layout";
import { api } from "~/utils/api";
import { NextPageWithLayout } from "./_app";

const Page: NextPageWithLayout = () => {
  return <Dashboards></Dashboards>
}


Page.getLayout = function getLayout(page: ReactElement) {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  return (
    <Layout>
      {page}
    </Layout>
  )
  }
export default Page