import Container from "./Container";
import "./login.css";
import { CustomLink } from "@/app/custom_hooks/NavigationTransition";

const Login = () => {
  return (
    <>
      <Container>
        <button
          type="submit"
          className="py-2 px-3 rounded-lg text-slate-50 bg-gray-700"
        >
          Log In
        </button>
        <CustomLink url="/pages/signup" className="p-2 rounded-lg signup">
          Sign up
        </CustomLink>
        <CustomLink url="/pages/jobs" className="p-2 rounded-lg">
          Cancel
        </CustomLink>
      </Container>
    </>
  );
};

export default Login;
