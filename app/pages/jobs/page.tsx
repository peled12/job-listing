import Container from "./Container";
import { Job } from "../types";
import { Suspense } from "react";
import Loading from "./Loading";

const Page = async () => {
  console.log("API URL: " + process.env.NEXT_PUBLIC_API_URL);

  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/jobs", {
    cache: "no-store",
  });

  const initJobs: Job[] = await response.json();

  // Log the response status and content type to help diagnose issues
  console.log("Response Status:", response.status);
  console.log("Response Content-Type:", response.headers.get("Content-Type"));

  // Check if the response is successful and is returning JSON
  if (!response.ok) {
    const errorText = await response.text(); // Log the error response body
    console.error("Failed to fetch jobs, status code:", response.status);
    console.error("Error body:", errorText);
    throw new Error("Failed to fetch jobs");
  }

  return (
    <Suspense fallback={<Loading />}>
      <h1 className="text-5xl m-8 mb-0">Jobs Listing</h1>
      <Container initJobs={initJobs} />
    </Suspense>
  );
};

export default Page;
