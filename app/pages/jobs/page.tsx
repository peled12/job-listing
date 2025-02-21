import Container from "./Container";
import { Job } from "../types";
import { Suspense } from "react";
import Loading from "../../Loading";

const fetchJobs = async (): Promise<Job[]> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/jobs`;

  console.log("Fetching jobs from:", apiUrl); // This will appear in build logs

  const response = await fetch(apiUrl + "/api/jobs", {
    next: { revalidate: 20 }, // revalidate the page every 20 seconds
  });
  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }
  return response.json();
};

const Page = async () => {
  // fetch jobs
  const initJobs = await fetchJobs();

  return (
    <Suspense fallback={<Loading />}>
      <h1 className="text-5xl m-8 mb-0">Jobs Listing</h1>
      <Container initJobs={initJobs} />
    </Suspense>
  );
};

export default Page;
