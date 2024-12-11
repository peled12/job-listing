"use client";

import "./createListing.css";

import { FormEvent, useState } from "react";

import { Job as JobType } from "../../types";

import Inputs from "./components/Inputs";
import Job from "@/app/components/Job";

import { v4 as uuid } from "uuid";

import { useUserContext } from "@/app/custom_hooks/UserContext";
import {
  useTransitionNavigate,
  useUrlState,
} from "@/app/custom_hooks/NavigationTransition";

const Page = () => {
  const { user, saveUser } = useUserContext();
  const { navigateWithTransition } = useTransitionNavigate();

  const editingJobId = useUrlState(); // the draft_id if its editing, null if not

  // get the editing job
  const [editingJob] = useState<JobType | undefined>(
    user?.jobs_draft.find((listing) => listing.id === editingJobId)
  );

  const [isShowingPreview, setisShowingPreview] = useState<boolean>(false);
  const [insertedJob, setinsertedJob] = useState<JobType>(
    editingJob
      ? editingJob
      : // initilize a new job
        {
          salary: 1,
          experience: "Any",
          location: "",
          job_type: "Any",
          title: "",
          contact: "",
          description: "",
          more_description: "",
          company: "",
          id: uuid(),
        }
  );

  // if the id was not found, return a message
  if (!editingJob && editingJobId)
    return (
      <div className="w-full flex flex-col text-center mt-7 gap-2">
        <h1 className="text-3xl">Job Not Found</h1>
        <p>Problem find the job your&apos;e looking to edit.</p>
      </div>
    );

  // change the preview
  const handleChange = (
    key: keyof JobType,
    newValue: JobType[keyof JobType]
  ): void => {
    setinsertedJob((prev) => {
      return { ...prev, [key]: newValue };
    });
  };

  const saveJob = async (e: FormEvent) => {
    e.preventDefault();

    // form validation occures automatically

    // start the animation
    const loader = document.querySelector(".main-loader");
    loader?.classList.remove("hide");

    const newUserJobsDraft = editingJobId
      ? // if its editing, find the edited job and replace it
        (user?.jobs_draft || []).map((listing) =>
          listing.id === editingJobId ? insertedJob : listing
        )
      : // else just add to the beginning of the array the new job
        [insertedJob, ...(user?.jobs_draft || [])];

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/users/" + user?.id,
        {
          method: "PATCH",
          // add the new job to the user's job draft
          body: JSON.stringify({
            jobs_draft: newUserJobsDraft,
          }),
        }
      );

      // throw error if needed
      if (!res.ok) throw new Error("Problem saving job.");

      // save user with the new data
      const newUser = { ...user! }; // use non-null assertion
      newUser.jobs_draft = newUserJobsDraft;
      saveUser(newUser);

      navigateWithTransition({ url: "/pages/myListings" }); // navigate to the job listings
    } catch (err) {
      console.error(err);

      alert(
        "There was a problem saving saving the job. Please try again later"
      );
    } finally {
      loader?.classList.add("hide");
    }
  };

  return (
    <>
      <h1 className="text-4xl m-6">{editingJob ? "Edit" : "New"} Listing</h1>
      <div className="new-listing-container">
        <form onSubmit={saveJob}>
          <Inputs handleChange={handleChange} insertedJob={insertedJob} />
          <div className="flex flex-row-reverse w-full gap-2 mt-6">
            <button
              className="py-2 px-3 rounded-lg text-slate-50 bg-gray-700"
              type="submit"
            >
              Save
            </button>
            <button
              type="button"
              className="custom-button border !rounded-lg"
              onClick={() => setisShowingPreview((prev) => !prev)}
            >
              Show Preview
            </button>
          </div>
        </form>
        {isShowingPreview && (
          <div className="preview-container">
            <Job job={insertedJob} hidden={false} favorite={false} />
          </div>
        )}
      </div>
    </>
  );
};

export default Page;
