"use client";
import React, { useState } from "react";

import "./jobs.css";

import Input from "./components/Input";

import { Job, InputProps } from "../types";
import AllJobs from "./components/AllJobs";
import LastInput from "./components/LastInput";
import {
  UserContextType,
  useUserContext,
} from "@/app/custom_hooks/UserContext";
import { CustomLink } from "@/app/custom_hooks/NavigationTransition";

const initInputs: InputProps = {
  title: "",
  location: "",
  minimum_salary: 0,
  job_type: "Any",
  experience_level: "Any",
  show_hidden: false,
  only_show_favorites: false,
};

const Container = ({ initJobs }: { initJobs: Job[] }) => {
  const { user, saveUser }: UserContextType = useUserContext();

  const [inputs, setinputs] = useState<InputProps>(initInputs);
  const [filteredJobs, setfilteredJobs] = useState<Job[]>(initJobs);

  // "filtering" arrays
  const [hiddenArr, sethiddenArr] = useState<string[]>(
    user ? user.jobs_filter.hidden : []
  );
  const [favoriteArr, setfavoriteArr] = useState<string[]>(
    user ? user.jobs_filter.favorite : []
  );

  const changeInput = (
    key: keyof InputProps,
    newValue: InputProps[keyof InputProps]
  ): void => {
    setinputs((prev) => {
      return { ...prev, [key]: newValue };
    });
  };

  // the favorite and hidden filters are here because hiddenArr or favoriteArr are needed
  // here they are

  const handleChangeHidden = (newValue: boolean): void => {
    changeInput("show_hidden", newValue); // change the input value

    // either its not hidden or its showing the hidden jobs too
    // it also needs to be valid for the other filtering array (favoriteArr)
    setfilteredJobs(
      initJobs.filter(
        (job) =>
          (!hiddenArr.includes(job.id!) || newValue) &&
          (favoriteArr.includes(job.id!) || !inputs.only_show_favorites)
      )
    );
  };

  const handleChangeFavorite = (newValue: boolean): void => {
    changeInput("only_show_favorites", newValue); // change the input value

    // either its favorite or its not only showing favorites
    // it also needs to be valid for the other filtering array (hiddenArr)
    setfilteredJobs(
      initJobs.filter(
        (job) =>
          (favoriteArr.includes(job.id!) || !newValue) &&
          (!hiddenArr.includes(job.id!) || inputs.show_hidden)
      )
    );
  };

  // a method to filter jobs by hidden / favorite
  const handleChangeUserFilter = async (
    jobId: string,
    filter: "hidden" | "favorite",
    addFilter: boolean
  ): Promise<void> => {
    const updateFilteringStates = (newArray: string[]) => {
      if (filter === "favorite") setfavoriteArr(newArray);
      else sethiddenArr(newArray);

      // filter the job manually if clicked on hide and its not showing hidden
      if (filter === "hidden" && addFilter && !inputs.show_hidden)
        setfilteredJobs(initJobs.filter((job) => !newArray.includes(job.id!)));

      // filter the job manually if clicked on unfavorite and its showing only favorites
      if (filter === "favorite" && !addFilter && inputs.only_show_favorites)
        setfilteredJobs(initJobs.filter((job) => newArray.includes(job.id!)));
    };

    if (!user) {
      let newArray = filter === "hidden" ? [...hiddenArr] : [...favoriteArr];

      if (addFilter) newArray.push(jobId);
      else newArray = newArray.filter((id) => id !== jobId);

      // update the state
      if (filter === "favorite") setfavoriteArr(newArray);
      else sethiddenArr(newArray);

      updateFilteringStates(newArray); // update the state

      return; // no update on the db shouldn't occur, only change the state
    }

    // initlize the new filter array
    let newArray = [...user.jobs_filter[filter]];

    if (addFilter) newArray.push(jobId); // push the id from the array
    else newArray = newArray.filter((id) => id !== jobId); // remove the id from the array

    updateFilteringStates(newArray); // update the filtering array before updating in the db

    const newFilterObj = { ...user.jobs_filter, [filter]: newArray };

    // patch in the db

    // start the animation
    const loader = document.querySelector(".main-loader");
    loader?.classList.remove("hide");

    try {
      // patch the new array to the user
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/users/" + user?.id,
        { method: "PATCH", body: JSON.stringify({ jobs_filter: newFilterObj }) }
      );

      loader?.classList.add("hide"); // end the animation

      if (!response.ok) throw new Error("Problem updating user");

      // successful request, initilize the new user and save it
      const newUser = { ...user };
      newUser.jobs_filter = newFilterObj;
      saveUser(newUser);
    } catch (err) {
      console.error(err);

      const errorSign = document.querySelector(".error-sign");
      errorSign?.classList.remove("!hidden");

      // error sign animation handling
      setTimeout(() => {
        errorSign?.classList.add("opacity-0");

        // after the transition is done
        setTimeout(() => {
          errorSign?.classList.add("!hidden");
          errorSign?.classList.remove("opacity-0");
        }, 150);
      }, 600);
    }
  };

  const resetFiltering = async (): Promise<void> => {
    // back to the initilized values
    setinputs(initInputs);
    setfilteredJobs(initJobs);
    setfavoriteArr([]);
    sethiddenArr([]);

    if (!user) return; // nothing to patch in the db because nothing was updated

    // patch in the db
    // start the animation
    const loader = document.querySelector(".main-loader");
    loader?.classList.remove("hide");

    try {
      // patch the new array to the user
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/users/" + user?.id,
        {
          method: "PATCH",
          body: JSON.stringify({ jobs_filter: { hidden: [], favorite: [] } }),
        }
      );

      loader?.classList.add("hide"); // end the animation

      if (!response.ok) throw new Error("Problem updating user");
    } catch (err) {
      console.error(err);

      const errorSign = document.querySelector(".error-sign");
      errorSign?.classList.remove("!hidden");

      // error sign animation handling
      setTimeout(() => {
        errorSign?.classList.add("opacity-0");

        // after the transition is done
        setTimeout(() => {
          errorSign?.classList.add("!hidden");
          errorSign?.classList.remove("opacity-0");
        }, 150);
      }, 600);
    }
  };

  return (
    <div className="jobs-container">
      <div className="w-full text-end mb-4">
        <CustomLink
          url={user ? "/pages/listings/new" : "/pages/listings/new"}
          className="custom-button h-max border !rounded-lg"
          state={!user ? { nextRoute: "/pages/listings/new" } : undefined}
        >
          Create Listing
        </CustomLink>
      </div>
      <div className="inputs">
        {Object.entries(inputs).map(
          ([name, value], index) =>
            typeof value !== "boolean" && (
              <Input
                key={index}
                name={name as keyof InputProps}
                value={value}
                changeInput={changeInput}
                setfilteredJobs={setfilteredJobs}
                initJobs={initJobs}
              />
            )
        )}
        <LastInput
          inputs={inputs}
          handleChangeHidden={handleChangeHidden}
          handleChangeFavorite={handleChangeFavorite}
          resetFiltering={resetFiltering}
        />
      </div>
      <AllJobs
        jobs={filteredJobs}
        hiddenArr={hiddenArr}
        favoriteArr={favoriteArr}
        handleChangeUserFilter={handleChangeUserFilter}
      />
    </div>
  );
};

export default Container;
