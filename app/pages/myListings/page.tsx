"use client";

export const dynamic = "force-dynamic";

import "./myListings.css";

import Job from "@/app/components/Job";
import { CustomLink } from "@/app/custom_hooks/NavigationTransition";
import {
  UserContextType,
  useUserContext,
} from "@/app/custom_hooks/UserContext";
import { Job as JobType } from "../types";
import { useState, useEffect } from "react";

import { HiXMark } from "react-icons/hi2";
import CustomSelect from "@/app/components/CustomSelect";

type OperationType = "Publish" | "Extend" | "Republish" | "Delete";
const toMilliseconds: number = 24 * 60 * 60 * 1000;

const Page = () => {
  const { user, saveUser }: UserContextType = useUserContext();

  // initilize the current time
  const [currentTime, setcurrentTime] = useState<number>();
  useEffect(() => {
    setcurrentTime(new Date().getTime());
  }, []);

  // states to handle the confirm action pop-up
  const [actionParams, setactionParams] = useState<{
    listing: JobType;
    extraDays: number; // if operation is Delete extraDays would be 0
    operation: OperationType;
  }>();

  // method to update the job's validity
  const updateJob = async (
    listing: JobType,
    extraDays: number,
    operation: OperationType
  ): Promise<void> => {
    // method to update the valid through property and save the user
    const customSaveUser = (newTime: number): void => {
      const newUser = { ...user! };

      // update the changed job
      newUser.jobs_draft = newUser.jobs_draft?.map((listingObj) =>
        listingObj.id === listing.id
          ? { ...listingObj, valid_through: newTime }
          : listingObj
      );

      saveUser(newUser);
    };

    // start the animation
    const loader = document.querySelector(".main-loader");
    loader?.classList.remove("hide");

    try {
      const currentTime = new Date().getTime(); // get currentTime again to get the new time
      const extraTime = extraDays * toMilliseconds;

      // switch between operations
      switch (operation) {
        case "Publish": {
          const newTime = currentTime + extraTime;

          const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/api/patchJobValidity",
            {
              method: "PATCH",
              body: JSON.stringify({
                ...listing,
                new_time: newTime,
                id: listing.id,
              }),
            }
          );

          // throw error if failed
          if (!response.ok) throw new Error("Problem posting job.");

          customSaveUser(newTime); // successfull request; update the user

          break;
        }
        case "Extend": {
          const newTime = listing.valid_through! + extraTime;

          const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/api/patchJobValidity",
            {
              method: "PATCH",
              body: JSON.stringify({
                new_time: newTime,
                id: listing.id,
              }),
            }
          );

          // throw error if failed
          if (!response.ok) throw new Error("Failed to extend job.");

          customSaveUser(newTime); // successfull request; update the user

          break;
        }
        case "Republish": {
          const newTime = currentTime + extraTime;

          const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/api/patchJobValidity",
            {
              method: "PATCH",
              body: JSON.stringify({
                new_time: newTime,
                id: listing.id,
              }),
            }
          );

          // throw error if failed
          if (!response.ok) throw new Error("Failed to republish job.");

          customSaveUser(newTime); // successfull request; update the user

          break;
        }
      }
    } catch (err) {
      console.error(err);

      alert(
        (err as Error).message +
          " Please try again later. You weren't charged for this."
      );
    } finally {
      loader?.classList.add("hide");
    }
  };

  // method to delete the job
  const deleteJob = async (id: string) => {
    // start the animation
    const loader = document.querySelector(".main-loader");
    loader?.classList.remove("hide");

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/jobs",
        {
          method: "DELETE",
          body: id,
        }
      );

      if (!response.ok) throw new Error("Failed to delete job");

      // update user
      const newUser = { ...user! };
      // use type assertion; you cant delete something that doesn't exist
      newUser.jobs_draft = newUser.jobs_draft!.filter(
        (listing) => listing.id !== id
      );

      saveUser(newUser);
    } catch (err) {
      console.error(err);

      alert(
        "Problem deleting job. Please check your internet or try again later."
      );
    } finally {
      loader?.classList.add("hide"); // end the animation
    }
  };

  // display the action confirmation div & save the params
  const handleClick = (
    listing: JobType,
    extraDays: number,
    operation: OperationType
  ) => {
    setactionParams({
      listing: listing,
      extraDays: extraDays,
      operation: operation,
    });
  };

  // handle action confirmation
  const handleConfirm = (confirmed: boolean, e?: React.MouseEvent) => {
    // handle case when the clicked element is inside the confirmation div
    if (e) {
      const clickedElement = e.target as HTMLElement;
      if (clickedElement.closest(".confirmation")) return;
    }

    if (confirmed) {
      // differ between deleting a job and updating its validity
      if (actionParams?.operation === "Delete")
        deleteJob(actionParams!.listing.id!);
      else
        updateJob(
          actionParams!.listing,
          actionParams!.extraDays,
          actionParams!.operation
        );
    }

    setactionParams(undefined); // undisplay the action confirmation div & unsave the params
  };

  const actionButton = (listing: JobType, operation: OperationType) => (
    <CustomSelect title={operation} className="publish-btn">
      <button
        className="custom-button !py-1 !font-normal"
        onClick={() => handleClick(listing, 30, operation)}
      >
        30 days - 100$
      </button>
      <button
        className="custom-button !py-1 !font-normal"
        onClick={() => handleClick(listing, 60, operation)}
      >
        60 days - 175$
      </button>
      <button
        className="custom-button !py-1 !font-normal"
        onClick={() => handleClick(listing, 90, operation)}
      >
        90 days - 225$
      </button>
    </CustomSelect>
  );
  return (
    <>
      <h1 className="m-4 p-4 text-4xl">My Listings</h1>
      <div className="my-listings-container">
        {currentTime &&
          user?.jobs_draft &&
          user.jobs_draft.map((listing, index) => (
            <Job
              job={listing}
              hidden={false}
              favorite={false}
              key={index}
              currentTime={currentTime}
            >
              <div className="buttons flex flex-row-reverse gap-x-1 p-3">
                {!listing.valid_through
                  ? actionButton(listing, "Publish")
                  : currentTime < listing.valid_through
                  ? actionButton(listing, "Extend")
                  : actionButton(listing, "Republish")}
                <CustomLink
                  url="/pages/listings/edit"
                  className="custom-button border"
                  state={listing.id}
                >
                  Edit
                </CustomLink>
                <button
                  className="custom-button"
                  onClick={() => handleClick(listing, 0, "Delete")}
                >
                  Delete
                </button>
              </div>
            </Job>
          ))}
      </div>
      {actionParams && (
        <div className="all-wrapper" onClick={(e) => handleConfirm(false, e)}>
          <div className="confirmation p-6 rounded-lg flex flex-col relative">
            <HiXMark
              className="absolute top-3 right-3 w-5 h-5 cursor-pointer"
              onClick={() => handleConfirm(false)}
            />
            {actionParams.operation === "Delete" ? (
              <>
                <h1 className="text-2xl mb-1">
                  Delete {actionParams.listing.title} for good?
                </h1>
                <p className="opacity-50 mb-3">
                  This purchase is non-refundable
                </p>
                <p className="mb-8">
                  After clicking confirm, {actionParams.listing.title} will be
                  deleted and you will not get your money back
                </p>
                <div className="flex justify-between">
                  <button
                    className="pay-btn rounded-lg py-2 w-full hover:opacity-85 transition font-bold"
                    onClick={() => handleConfirm(true)}
                  >
                    Confirm
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl mb-1">
                  {actionParams.operation} {actionParams.listing.title} for{" "}
                  {actionParams.extraDays} days
                </h1>
                <p className="opacity-50 mb-3">
                  This purchase is non-refundable
                </p>
                <p>
                  By paying, your post will be published for{" "}
                  {actionParams.extraDays}{" "}
                  {actionParams.operation === "Extend"
                    ? "more days"
                    : "days from now"}
                  .
                </p>
                <p className="mb-8">
                  You can always re-extend the duration of your post being
                  published.
                </p>
                <div className="flex justify-between">
                  <button
                    className="pay-btn rounded-lg py-2 w-full hover:opacity-85 transition font-bold"
                    onClick={() => handleConfirm(true)}
                  >
                    Pay{" "}
                    {actionParams.extraDays === 30
                      ? "100"
                      : actionParams.extraDays === 60
                      ? "175"
                      : "200"}
                    $
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
