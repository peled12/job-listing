"use client";

import { useState } from "react";

import { useUserContext } from "../custom_hooks/UserContext";
import { MdKeyboardArrowDown } from "react-icons/md";

import {
  CustomLink,
  useTransitionNavigate,
} from "../custom_hooks/NavigationTransition";
import CustomSelect from "./CustomSelect";

/*
    TODO: fix bug the user setting could be opened after login
*/

const UserSettings = () => {
  const { user, saveUser } = useUserContext();
  const { navigateWithTransition } = useTransitionNavigate();

  const [isActive, setisActive] = useState<boolean>(false);

  const toggleMethods = (e: React.MouseEvent): void => {
    const clickedElement = e.target as HTMLElement;

    if (
      !clickedElement.closest(".opened") ||
      clickedElement.tagName === "BUTTON" ||
      clickedElement.tagName === "A"
    ) {
      document.querySelector(".wrapper")?.classList.toggle("hidden");
      setisActive((prev) => !prev);
    }
  };

  const logout = (): void => {
    setisActive(false); // hide the settings

    const logoutContainer = document.querySelector(".logout-container");

    logoutContainer?.classList.remove("!hidden"); // show the logout message

    navigateWithTransition({ url: "/pages/jobs" }); // navigate to jobs

    // after 0.6 seconds, hide the wrapper and the logout message and logout
    setTimeout(() => {
      saveUser(undefined);

      logoutContainer?.classList.add("!hidden");
      document.querySelector(".wrapper")?.classList.add("hidden");
    }, 600);
  };

  return user ? (
    <>
      <CustomSelect title={user.username} className="custom-button">
        <CustomLink url="/pages/myListings" className="custom-button w-full">
          My Listings
        </CustomLink>
        <div className="seperator"></div>
        <button className="custom-button w-full" onClick={logout}>
          Logout
        </button>
      </CustomSelect>
      <div className="logout-container !hidden">
        <p className="text-3xl p-5 font-sans">Logging Out</p>
        <div className="main-loader !h-10 !w-10"></div>
      </div>
    </>
  ) : (
    <CustomLink url="/pages/login" className="custom-button">
      Login
    </CustomLink>
  );
};

export default UserSettings;
