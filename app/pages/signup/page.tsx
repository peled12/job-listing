import Container from "./Container";
import "./signup.css";

import { CustomLink } from "@/app/custom_hooks/NavigationTransition";

const Signup = () => {
  return (
    <>
      <Container>
        <button
          type="submit"
          className="py-2 px-3 rounded-lg text-slate-50 bg-gray-700"
        >
          Sign up
        </button>
        <CustomLink url="/pages/login" className="p-2 rounded-lg login">
          Login
        </CustomLink>
        <CustomLink url="/pages/jobs" className="p-2 rounded-lg">
          Cancel
        </CustomLink>
      </Container>
    </>
  );
};

export default Signup;
