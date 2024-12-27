import { Job as JobType } from "../pages/types";

import { useMemo } from "react";

import { PiMoneyLight, PiGraduationCap } from "react-icons/pi";
import { SlCalender } from "react-icons/sl";
import { FaRegEyeSlash, FaRegHeart } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { HiXMark } from "react-icons/hi2";

import MarkDownComponent from "./MarkDownComponent";

type FilterType = "hidden" | "favorite";

// NOTE: if there is children, this component is from my_listings.
// NOTE currentDate is new Date().getTime(). it exists if the component is rendered in myListings
const Job = ({
  job,
  hidden,
  favorite,
  currentDate,
  children,
  handleChangeUserFilter,
}: {
  job: JobType;
  hidden: boolean;
  favorite: boolean;
  currentDate?: Date;
  children?: React.ReactNode;
  handleChangeUserFilter?: (
    jobId: string,
    filter: FilterType,
    addFilter: boolean
  ) => Promise<void>;
}) => {
  // this is if the job is active
  const jobState = useMemo<string | number | null>(() => {
    if (!currentDate) return null; // jobState is not used then

    // if the job isn't assigned a valid_through date, its a draft
    if (!job.valid_through) return "draft";

    const validThroughDate = new Date(job.valid_through);

    // job.valid_through is not undefined
    const timeDiff = validThroughDate.getTime() - currentDate.getTime();

    // if the difference is nagative, the job is expired
    if (timeDiff < 0) return "expired";

    // else, its active and return the time difference
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  }, [job, currentDate]);

  const handleViewMore = (e: React.MouseEvent, action: string) => {
    const clickedElement = e.target as HTMLElement;

    if (
      !clickedElement.closest(".job-more") ||
      clickedElement.closest(".un-view-more")
    ) {
      const wrapper = document.querySelector(".all-wrapper");
      const selectedJob = document.querySelector(".job-more");
      if (action === "add") {
        selectedJob?.classList.add("fade-out"); // fade-out the selected job

        setTimeout(() => {
          wrapper?.classList.add("!hidden"); // hide the wrapper after a delay
          selectedJob?.classList.remove("fade-out"); // remove the animation
        }, 200);
      } else {
        setTimeout(() => {
          wrapper?.classList.remove("!hidden"); // show the wrapper after a delay
        }, 200);
      }
    }
  };

  const handleChange = (type: FilterType, addFilter: boolean): void => {
    if (handleChangeUserFilter)
      handleChangeUserFilter(job.id!, type, addFilter);
  };

  return (
    <>
      <div className="flex flex-col job">
        <div className="p-6 flex flex-col space-y-1.5">
          <div className="flex gap-4 justify-between">
            <div>
              <h2 className="text-2xl font-sans">{job.title}</h2>
              <p className="opacity-50">{job.location}</p>
              <p
                className={
                  !job.company ? "opacity-0 cursor-default" : "opacity-50"
                }
              >
                {job.company || "Hi"}
              </p>
            </div>
            <div className="flex gap-1 flex-wrap"></div>
            {children ? (
              jobState === "draft" ? (
                <p className="draft h-max">Draft</p>
              ) : jobState === "expired" ? (
                <p className="expired h-max">Expired</p>
              ) : (
                <p className="active h-max">Active - {jobState} days left</p>
              )
            ) : (
              <div className="flex gap-3 icons">
                {hidden ? (
                  <IoEyeOutline
                    className={!handleChangeUserFilter ? "!cursor-default" : ""}
                    onClick={() => handleChange("hidden", false)}
                  />
                ) : (
                  <FaRegEyeSlash
                    className={!handleChangeUserFilter ? "!cursor-default" : ""}
                    onClick={() => handleChange("hidden", true)}
                  />
                )}
                <FaRegHeart
                  className={`${favorite ? "red" : ""} ${
                    !handleChangeUserFilter ? "!cursor-default" : ""
                  }`}
                  onClick={() =>
                    favorite
                      ? handleChange("favorite", false)
                      : handleChange("favorite", true)
                  }
                />
              </div>
            )}
          </div>
          <div className="flex gap-1">
            {job.salary && (
              <div className="job-tag items-center rounded-full px-2.5 py-0.5 text-sm font-semibold transition-colors dark:border-slate-100 text-slate-900 dark:text-slate-50 flex gap-1 whitespace-nowrap w-max">
                <PiMoneyLight className="h-4 w-4" />
                <p>${job.salary.toLocaleString("en-US")}</p>
              </div>
            )}
            <div className="job-tag items-center rounded-full px-2.5 py-0.5 text-sm font-semibold transition-colors dark:border-slate-100 text-slate-900 dark:text-slate-50 flex gap-1 whitespace-nowrap w-max">
              <SlCalender />
              <p>{job.job_type}</p>
            </div>
            <div className="job-tag items-center rounded-full px-2.5 py-0.5 text-sm font-semibold transition-colors dark:border-slate-100 text-slate-900 dark:text-slate-50 flex gap-1 whitespace-nowrap w-max">
              <PiGraduationCap />
              <p>{job.experience}</p>
            </div>
          </div>
        </div>
        <div className="p-6 pt-0 flex-grow truncate">{job.description}</div>
        <div className="p-6 pt-0 flex gap-2 items-stretch justify-end">
          <button
            className="view-more-btn"
            onClick={(e) => handleViewMore(e, "remove")}
          >
            View More
          </button>
        </div>
        {children && children}
      </div>

      <div
        className="all-wrapper !hidden"
        onClick={(e) => handleViewMore(e, "add")}
      >
        <div className="job job-more relative flex flex-col transition-opacity duration-500 p-5">
          <div className="flex gap-4 justify-between">
            <div>
              <div>
                <p className="opacity-50 border-b border-slate-700 w-max mb-1 pr-1">
                  Contact at: {job.contact}
                </p>
                <h2 className="text-3xl font-sans">{job.title}</h2>
              </div>
              <p className="opacity-50">{job.location}</p>
              <p
                className={
                  !job.company ? "opacity-0 cursor-default" : "opacity-50"
                }
              >
                {job.company || "Space filler"}
              </p>
            </div>
            <div className="flex gap-1 flex-wrap"></div>
          </div>
          <div className="flex gap-1">
            {job.salary && (
              <div className="job-tag items-center rounded-full px-2.5 py-0.5 text-sm font-semibold transition-colors dark:border-slate-100 text-slate-900 dark:text-slate-50 flex gap-1 whitespace-nowrap w-max">
                <PiMoneyLight className="h-4 w-4" />
                <p>${job.salary.toLocaleString("en-US")}</p>
              </div>
            )}
            <div className="job-tag items-center rounded-full px-2.5 py-0.5 text-sm font-semibold transition-colors dark:border-slate-100 text-slate-900 dark:text-slate-50 flex gap-1 whitespace-nowrap w-max">
              <SlCalender />
              <p>{job.job_type}</p>
            </div>
            <div className="job-tag items-center rounded-full px-2.5 py-0.5 text-sm font-semibold transition-colors dark:border-slate-100 text-slate-900 dark:text-slate-50 flex gap-1 whitespace-nowrap w-max">
              <PiGraduationCap />
              <p>{job.experience}</p>
            </div>
          </div>
          <div className="pt-6 flex-grow mb-3">{job.description}</div>
          <div className="description-seperator"></div>
          <div className="p-6 pt-0 mt-3 flex-grow more-description-container">
            <MarkDownComponent text={job.more_description} />
          </div>
          <button
            onClick={(e) => handleViewMore(e, "remove")}
            className="absolute top-2 right-2 rounded un-view-more"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Job;
