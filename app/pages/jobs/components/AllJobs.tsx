import { Job as JobType } from "../../types";
import Job from "@/app/components/Job";

const AllJobs = ({
  jobs,
  hiddenArr,
  favoriteArr,
  handleChangeUserFilter,
}: {
  jobs: JobType[];
  hiddenArr: string[];
  favoriteArr: string[];
  handleChangeUserFilter: (
    jobId: string,
    filter: "hidden" | "favorite",
    addFilter: boolean
  ) => Promise<void>;
}) => {
  return (
    <div className="jobs">
      {jobs.map((job, index) => (
        <Job
          key={index}
          job={job}
          hidden={hiddenArr.includes(job.id!)}
          favorite={favoriteArr.includes(job.id!)}
          handleChangeUserFilter={handleChangeUserFilter}
        />
      ))}
    </div>
  );
};

export default AllJobs;
