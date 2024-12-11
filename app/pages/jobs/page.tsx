import Container from "./Container";
import { Job } from "../types";

/*
  TODO: handle loading / error displays
*/

const Page = async () => {
  const response = await fetch(process.env.PUBLIC_API_URL + "/api/jobs", {
    next: { revalidate: 60 },
  });

  const initJobs: Job[] = await response.json();

  return (
    <>
      <h1 className="text-5xl m-8 mb-0">Jobs Listing</h1>
      <Container initJobs={initJobs} />
    </>
  );
};

export default Page;
