import Container from "./Container";
import { Job } from "../types";
import { Suspense } from "react";
import Loading from "./Loading";

const Page = async () => {
  console.log("API URL: " + process.env.NEXT_PUBLIC_API_URL);

  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/jobs", {
    next: { revalidate: 30 },
  });

  const initJobs: Job[] = await response.json();

  return (
    <Suspense fallback={<Loading />}>
      <h1 className="text-5xl m-8 mb-0">Jobs Listing</h1>
      <Container initJobs={initJobs} />
    </Suspense>
  );
};

export default Page;
