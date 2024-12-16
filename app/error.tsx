"use client";

import { useEffect, useState } from "react";
import Loading from "./Loading";

const Error = () => {
  const [isClient, setIsClient] = useState(false);

  // This will run only on the client side after the initial render
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center w-full mt-6">
      <h1 className="text-5xl font-bold mb-4">Something went wrong.</h1>
      <p className="text-xl mb-8">
        There was an issue retrieving the data. Please check your internet
        connection or try again later.
      </p>
      <button
        className="back-home-btn hover:opacity-85"
        onClick={() => window.location.reload()} // Safe to call because it's inside useEffect
      >
        Try Again
      </button>
    </div>
  );
};

export default Error;
