import Container from "./Container";
import { Job } from "../types";

/*
  TODO: handle loading / error displays
*/

const page = async () => {
  const response = await fetch("http://localhost:3000/api/jobs", {
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

export default page;
