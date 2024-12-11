"use client";

import { FormEvent, useState } from "react";

import { useUserContext } from "@/app/custom_hooks/UserContext";
import {
  useTransitionNavigate,
  useUrlState,
} from "@/app/custom_hooks/NavigationTransition";

import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";

const Container = ({ children }: { children: React.ReactNode }) => {
  const { saveUser } = useUserContext();
  const { navigateWithTransition } = useTransitionNavigate();

  const state = useUrlState();

  const [emailErr, setemailErr] = useState<string>("");
  const [pwErr, setpwErr] = useState<string>("");
  const [internalError, setinternalError] = useState<boolean>(false);

  const [showPassword, setshowPassword] = useState<boolean>(false);

  const login = async (e: FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    // get the inputed params
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;

    // start the loader
    const loader = document.querySelector(".main-loader");
    loader?.classList.remove("hide");

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        body: JSON.stringify({ email: email.value, password: password.value }),
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(errorMessage);
      }

      const userData = await res.json();
      saveUser(userData);

      // navigate to the wanted page, or the jobs page by default
      const nextRoute = state ? state.nextRoute : null;
      navigateWithTransition({
        url: nextRoute || "/pages/jobs",
        replace: true,
      });
    } catch (err) {
      // reset previous error messages
      setemailErr("");
      setpwErr("");
      setinternalError(false);

      // which error message to give
      switch ((err as Error).message) {
        case "wrong email":
          setemailErr("Email doesn't exist.");
          break;
        case "wrong password":
          setpwErr("Password doesn't match with the email.");
          break;
        default:
          setinternalError(true);
          break;
      }
    } finally {
      loader?.classList.add("hide"); // end the animation
    }
  };

  return (
    <>
      <h1 className="m-4 p-4 text-4xl">Login</h1>
      <form className="login-form" onSubmit={login}>
        <h1 className="mb-1 font-bold">Log In</h1>
        <p className="mb-5 opacity-50">
          Log in to get get the best of this site!
        </p>
        <div className="flex justify-between mb-1">
          <p className="text-base font-sans font-semibold m-0">Email</p>
          <p className="!text-red-500 m-0">{emailErr}</p>
        </div>
        <input className="bg-none w-full h-8 px-2 rounded mb-3" name="email" />
        <div className="flex justify-between mb-1">
          <p className="text-base font-sans font-semibold m-0">Password</p>
          <p className="!text-red-500 m-0">{pwErr}</p>
        </div>
        <div className="relative mb-3">
          <input
            className="w-full h-8 px-2 rounded"
            name="password"
            type={showPassword ? "text" : "password"}
          />
          {showPassword ? (
            <IoEyeOutline
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer"
              onClick={() => setshowPassword(false)}
            />
          ) : (
            <FaRegEyeSlash
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer"
              onClick={() => setshowPassword(true)}
            />
          )}
        </div>
        <div className="mt-5 flex justify-between">
          <p className="!text-red-500">
            {internalError && "Internal server error."}
          </p>
          <div className="buttons flex flex-row-reverse gap-x-1">
            {children}
          </div>
        </div>
      </form>
    </>
  );
};

export default Container;
