export type JobType = "Any" | "Full Time" | "Part Time" | "Internship";
export type ExperienceLevel = "Any" | "Junior" | "Mid-Level" | "Senior";

export type InputProps = {
  title: string;
  location: string;
  minimum_salary: number;
  job_type: JobType;
  experience_level: ExperienceLevel;
  show_hidden: boolean;
  only_show_favorites: boolean;
};

export interface Job {
  id?: string;
  salary: number;
  experience: ExperienceLevel;
  location: string;
  job_type: JobType;
  title: string;
  contact: string;
  description: string;
  valid_through?: Date;
  more_description?: string;
  company?: string;
  hidden?: boolean; // for filtering
  favorite?: boolean; // for filtering
}

export type User =
  | {
      id: number;
      username: string;
      email: string;
      password: string;
      jobs_filter: { hidden: string[]; favorite: string[] };
      jobs_draft: Job[];
    }
  | undefined
  | null;
