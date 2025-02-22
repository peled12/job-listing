import { GetServerSideProps } from "next";
import Container from "./Container";
import { Job } from "../types";
import Loading from "../../Loading";

const fetchJobs = async (): Promise<Job[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`);
  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }
  return response.json();
};

const JobsPage = ({ jobs }: { jobs: Job[] }) => {
  return (
    <>
      <h1 className="text-5xl m-8 mb-0">Jobs Listing</h1>
      <Container initJobs={jobs} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const jobs = await fetchJobs();
    return { props: { jobs } };
  } catch (error) {
    return { props: { jobs: [] } }; // Return empty array in case of error
  }
};

export default JobsPage;
