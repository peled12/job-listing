import { JobType, ExperienceLevel, InputProps, Job } from "../../types";
import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const Input = ({
  name,
  value,
  changeInput,
  setfilteredJobs,
  initJobs,
}: {
  name: keyof InputProps;
  value: string | number | JobType | ExperienceLevel;
  changeInput: (
    key: keyof InputProps,
    newValue: InputProps[keyof InputProps]
  ) => void;
  setfilteredJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  initJobs: Job[];
}) => {
  const [normalName] = useState(
    name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );

  // filtering methods

  const handleChangeJobType = (newValue: JobType): void => {
    changeInput("job_type", newValue); // change the input value

    setfilteredJobs(
      initJobs.filter((job) => newValue === "Any" || job.job_type === newValue)
    );
  };

  const handleChangeExprienceLevel = (newValue: ExperienceLevel): void => {
    changeInput("experience_level", newValue); // change the input value

    setfilteredJobs(
      initJobs.filter(
        (job) => newValue === "Any" || job.experience === newValue
      )
    );
  };

  const handleChangeLocation = (newValue: string): void => {
    changeInput("location", newValue); // change the input value

    setfilteredJobs(
      initJobs.filter((job) =>
        job.location.toLowerCase().includes(newValue.toLowerCase())
      )
    );
  };

  const handleChangeTitle = (newValue: string): void => {
    changeInput("title", newValue); // change the input value

    setfilteredJobs(
      initJobs.filter((job) =>
        job.title.toLowerCase().includes(newValue.toLowerCase())
      )
    );
  };

  const handleChangeSalary = (newValue: number): void => {
    changeInput("minimum_salary", newValue); // change the input value

    setfilteredJobs(initJobs.filter((job) => job.salary >= newValue));
  };

  // method to choose which filter method is needed by the name of the input
  const callInputchange = (newValue: string | number): void => {
    if (!document.querySelector(".main-loader")?.classList.contains("hide")) {
      // if the loader is still running, don't do anything
      alert("Please wait for the current action to finish.");
      return;
    }

    switch (name) {
      case "title":
        handleChangeTitle(newValue as string);
        break;
      case "location":
        handleChangeLocation(newValue as string);
        break;
      case "minimum_salary":
        handleChangeSalary(newValue as number);
        break;
      case "experience_level":
        handleChangeExprienceLevel(newValue as ExperienceLevel);
        break;
      case "job_type":
        handleChangeJobType(newValue as JobType);
        break;
    }
  };

  return (
    <div className="input">
      <h3 className="text-xl mb-3">{normalName}</h3>
      {name === "experience_level" || name === "job_type" ? (
        <div className="relative">
          <MdKeyboardArrowDown className="custom-select-arrow" />
          <select
            className="custom-select select rounded w-full h-10 text-lg px-3"
            onChange={(e) =>
              name === "job_type"
                ? callInputchange(e.target.value as JobType)
                : callInputchange(e.target.value as ExperienceLevel)
            }
          >
            <option value="Any">Any</option>
            {name === "experience_level" ? (
              <>
                <option value="Junior">Junior</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
              </>
            ) : (
              <>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
              </>
            )}
          </select>
        </div>
      ) : (
        <input
          className="rounded px-3 h-10 text-lg"
          value={value}
          {...(name === "minimum_salary" && { type: "number" })}
          onChange={(e) => callInputchange(e.target.value)}
        />
      )}
    </div>
  );
};

export default Input;
