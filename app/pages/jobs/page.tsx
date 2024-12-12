import Container from "./Container";
import { Job } from "../types";

/*
  TODO: fix access denied bug when fetching
*/

const Page = async () => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/pages/api/jobs",
    {
      cache: "no-store",
    }
  );

  const res = await response.json();
  console.log(res);

  if (!response.ok) {
    return (
      <>
        <h1 className="text-5xl m-8 mb-0">Jobs Listing</h1>
        <Container error={true} />
      </>
    );
  }

  const initJobs: Job[] = await res;

  return (
    <>
      <h1 className="text-5xl m-8 mb-0">Jobs Listing</h1>
      <Container initJobs={initJobs} />
    </>
  );
};

export default Page;
