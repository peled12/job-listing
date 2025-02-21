"use client";

import { useTransitionNavigate } from "@/app/custom_hooks/NavigationTransition";
import {
  UserContextType,
  useUserContext,
} from "@/app/custom_hooks/UserContext";
import { FormEvent, useState } from "react";

import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";

interface ValidationParams {
  email: string;
  username: string;
  password: string;
  repeatPassword: string;
}

// regex to check if an email is valid
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// regex to check if a username has at least 3 characters and a letter
const USERNAME_REGEX = /^(?=.*[a-zA-Z]).{3,}$/;

// regex to check if a password includes a capital letter, a number or a special character
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

/*
  TODO: fix problem signing up not working on vercel
*/

const Container = ({ children }: { children: React.ReactNode }) => {
  const { saveUser }: UserContextType = useUserContext();
  const { navigateWithTransition } = useTransitionNavigate();

  const [emailErr, setemailErr] = useState<string>("");
  const [usernameErr, setusernameErr] = useState<string>("");
  const [passwordErr, setpasswordErr] = useState<string>("");
  const [repeatPasswordErr, setrepeatPasswordErr] = useState<string>("");

  const [internalError, setinternalError] = useState<boolean>(false);

  const [showPassword, setshowPassword] = useState<boolean>(false);

  // display errors of valid user params and return true if they are all valid. false otherwise
  const checkUserValidation = ({
    email,
    username,
    password,
    repeatPassword,
  }: ValidationParams): boolean => {
    let validSignUp: boolean = true; // initilize the returned variable

    // check each param's validation, and set the error accordingly. else remove err message

    if (!EMAIL_REGEX.test(email)) {
      setemailErr("Invalid email.");
      validSignUp = false;
    } else setemailErr("");

    if (!USERNAME_REGEX.test(username)) {
      setusernameErr("Username must have at least 3 characters.");
      validSignUp = false;
    } else setusernameErr("");

    if (!PASSWORD_REGEX.test(password)) {
      setpasswordErr(
        "A password must have a capital letter, a number and a special character."
      );
      validSignUp = false;
    } else setpasswordErr("");

    if (repeatPassword !== password) {
      setrepeatPasswordErr("The passwords you entered must be identical.");
      validSignUp = false;
    } else setrepeatPasswordErr("");

    setinternalError(false); // also reset the internal error

    return validSignUp;
  };

  const signUp = async (e: FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    // get the inputed params
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const username = form.elements.namedItem("username") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;
    const repeatPassword = form.elements.namedItem(
      "repeat-password"
    ) as HTMLInputElement;

    const params: ValidationParams = {
      email: email.value,
      username: username.value,
      password: password.value,
      repeatPassword: repeatPassword.value,
    };

    // dont sign up if the params are invalid
    if (!checkUserValidation(params)) return;

    // valid params, create the new user

    // start the animation
    const loader = document.querySelector(".main-loader");
    loader?.classList.remove("hide");

    try {
      const newUser = {
        email: params.email,
        username: params.username,
        password: params.password,
        jobs_filter: { hidden: [], favorite: [] },
        jobs_draft: [],
      };

      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/users", {
        method: "POST",
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        const errorData = await res.json();

        throw new Error(errorData.message);
      }

      // success creating a user. update the user and navigate back to jobs

      const data = await res.json();

      saveUser({ ...newUser, id: data.inserted_id });
      navigateWithTransition({ url: "/pages/jobs" });
    } catch (err) {
      const errorMessage = (err as Error).message;

      if (errorMessage === "Email already exists")
        setemailErr("A user with this email already exists.");
      else setinternalError(true);
    } finally {
      loader?.classList.add("hide"); // end the animation
    }
  };

  return (
    <>
      <h1 className="ml-4 pl-4 mt-4 pt-4 text-4xl">Sign up</h1>
      <form className="signup-form" onSubmit={signUp}>
        <h1 className="mb-1 font-bold">Sign up</h1>
        <p className="mb-5 opacity-50">
          Sign up to this website and get the best out of it!
        </p>
        <div className="flex justify-between mb-1">
          <p className="text-base font-sans font-semibold m-0 pr-6">Email</p>
          <p className="!text-red-500 m-0">{emailErr}</p>
        </div>
        <input className="bg-none w-full h-8 px-2 rounded mb-3" name="email" />
        <div className="flex justify-between mb-1">
          <p className="text-base font-sans font-semibold m-0 pr-6">Username</p>
          <p className="!text-red-500 m-0">{usernameErr}</p>
        </div>
        <input
          className="bg-none w-full h-8 px-2 rounded mb-3"
          name="username"
        />
        <div className="flex justify-between mb-1">
          <p className="text-base font-sans font-semibold m-0 pr-6">Password</p>
          <p className="!text-red-500 m-0">{passwordErr}</p>
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
        <div className="flex justify-between mb-1">
          <p className="text-base font-sans font-semibold m-0">
            Repeat password
          </p>
          <p className="!text-red-500 m-0 pr-6">{repeatPasswordErr}</p>
        </div>
        <input
          className="bg-none w-full h-8 px-2 rounded mb-3"
          name="repeat-password"
          type={showPassword ? "text" : "password"}
        />
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
