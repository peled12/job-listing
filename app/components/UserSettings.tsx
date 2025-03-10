"use client";

import { UserContextType, useUserContext } from "../custom_hooks/UserContext";

import {
  CustomLink,
  useTransitionNavigate,
} from "../custom_hooks/NavigationTransition";
import CustomSelect from "./CustomSelect";

const UserSettings = () => {
  const { user, saveUser }: UserContextType = useUserContext();
  const { navigateWithTransition } = useTransitionNavigate();

  const logout = (): void => {
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
    </>
  ) : (
    <CustomLink url="/pages/login" className="custom-button">
      Login
    </CustomLink>
  );
};

export default UserSettings;
