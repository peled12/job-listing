import { Job } from "../../../types";

import { MdKeyboardArrowDown } from "react-icons/md";

const Inputs = ({
  insertedJob,
  handleChange,
}: {
  insertedJob: Job;
  handleChange: (key: keyof Job, newValue: Job[keyof Job]) => void;
}) => {
  return (
    <div className="inputs-container">
      <div className="input">
        <p>Title *</p>
        <input
          className="mt-3 rounded h-10 text-base px-3"
          onChange={(e) => handleChange("title", e.target.value)}
          maxLength={30}
          required
          value={insertedJob.title}
        />
      </div>
      <div className="input">
        <p>Company Name</p>
        <input
          className="mt-3 rounded h-10 text-base px-3"
          id="company"
          onChange={(e) => handleChange("company", e.target.value)}
          maxLength={30}
          value={insertedJob.company}
        />
      </div>
      <div className="input">
        <p>Location *</p>
        <input
          className="mt-3 rounded h-10 text-base px-3"
          id="location"
          onChange={(e) => handleChange("location", e.target.value)}
          required
          maxLength={30}
          value={insertedJob.location}
        />
      </div>
      <div className="input">
        <p>
          Contact *
          <span className="text-sm opacity-50"> (email or phone number)</span>
        </p>
        <input
          className="mt-3 rounded h-10 text-base px-3"
          id="contact"
          onChange={(e) => handleChange("contact", e.target.value)}
          maxLength={30}
          required
          value={insertedJob.contact}
        />
      </div>
      <div className="input">
        <p>Type</p>
        <div className="relative mt-3">
          <MdKeyboardArrowDown className="custom-select-arrow" />
          <select
            className="custom-select rounded h-10 text-base px-3 w-full"
            id="type"
            value={insertedJob.job_type}
            onChange={(e) => handleChange("job_type", e.target.value)}
          >
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>
      <div className="input">
        <p>Exprience Level</p>
        <div className="relative mt-3">
          <MdKeyboardArrowDown className="custom-select-arrow" />
          <select
            className="custom-select rounded h-10 text-base px-3 w-full"
            id="experience-level"
            value={insertedJob.experience}
            onChange={(e) => handleChange("experience", e.target.value)}
          >
            <option value="Junior">Junior</option>
            <option value="Mid-Level">Mid-Level</option>
            <option value="Senior">Senior</option>
          </select>
        </div>
      </div>
      <div className="input">
        <p>Salary *</p>
        <input
          className="mt-3 rounded h-10 text-base px-3"
          id="salary"
          type="number"
          min={1}
          step={1}
          onChange={(e) => handleChange("salary", e.target.value)}
          required
          value={insertedJob.salary}
        />
        <p className="opacity-50 !text-base mt-1 px-3">in USD</p>
      </div>
      <div className="input sm:col-span-2">
        <p>Short Description *</p>
        <textarea
          className="mt-3 rounded h-10 text-base px-3 py-1"
          id="short-description"
          onChange={(e) => handleChange("description", e.target.value)}
          maxLength={200}
          required
          value={insertedJob.description}
        />
        <p className="opacity-50 !text-base mt-1">Max 200 characters</p>
      </div>
      <div className="input sm:col-span-3">
        <p>Full Description</p>
        <textarea
          className="mt-3 rounded h-10 text-base px-3 py-1"
          id="full-description"
          onChange={(e) => handleChange("more_description", e.target.value)}
          value={insertedJob.more_description}
        />
      </div>
    </div>
  );
};

export default Inputs;
