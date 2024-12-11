"use client";

import React, { useEffect, useState } from "react";

const Clock = () => {
  const getFormattedTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const [time, setTime] = useState<string>(getFormattedTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getFormattedTime());
    }, 1000); // Updates every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return <div className="text-lg">{time}</div>;
};

export default Clock;
