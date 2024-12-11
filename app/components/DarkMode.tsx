"use client";

import React, { useState, useEffect } from "react";
import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";

const DarkMode = () => {
  const [isDarkMode, setisDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const isInitialDark = localStorage.getItem("dark-mode") === "dark";

    if (isInitialDark) {
      document.body.classList.add("dark-mode");
    }

    setisDarkMode(isInitialDark);
  }, []);

  const changeTheme = () => {
    // get the new mode
    const isDarkMode = localStorage.getItem("dark-mode") === "dark";
    const newMode = isDarkMode ? "light" : "dark";

    // apply changes
    localStorage.setItem("dark-mode", newMode);
    setisDarkMode(newMode === "dark");

    document.body.classList.toggle("dark-mode");
  };

  return (
    <button onClick={changeTheme} className="dark-mode-btn">
      <MdOutlineDarkMode
        className={`absolute top-0 left-0 translate-y-[-50%] transition-opacity duration-300 ${
          isDarkMode ? "opacity-100" : "opacity-0"
        }`}
      />
      <MdOutlineLightMode
        className={`absolute top-0 left-0 translate-y-[-50%] transition-opacity duration-300 ${
          isDarkMode ? "opacity-0" : "opactiy-100"
        }`}
      />
    </button>
  );
};

export default DarkMode;
