"use client";

import { useState, useEffect } from "react";
import Container from "./Container";
import { Job } from "../types";
import Loading from "../../Loading";

const Page = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/jobs",
          {
            next: { revalidate: 20 }, // revalidate the page every 20 seconds
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();
        setJobs(data); // Set fetched jobs
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message); // Set error message
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false); // Hide loading spinner once done
      }
    };

    fetchJobs(); // Trigger the fetch function
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Display loading, error, or the jobs data
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-5xl m-8 mb-0">Jobs Listing</h1>
      <Container initJobs={jobs} />
    </div>
  );
};

export default Page;
