"use client";

const Error = () => {
  return (
    <div className="flex flex-col items-center w-full mt-6">
      <h1 className="text-5xl font-bold mb-4">Something went wrong.</h1>
      <p className="text-xl mb-8">
        There was an issue retrieving the data. Please check your internet
        connection or try again later.
      </p>
      <button
        className="back-home-btn hover:opacity-85"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );
};

export default Error;
