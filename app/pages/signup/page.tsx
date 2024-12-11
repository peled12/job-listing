import Container from "./Container";
import "./signup.css";

import dynamic from "next/dynamic";

const DynamicCustomLink = dynamic(
  () =>
    import("@/app/custom_hooks/NavigationTransition").then(
      (mod) => mod.CustomLink
    ),
  { ssr: false }
);

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
        <DynamicCustomLink url="/pages/login" className="p-2 rounded-lg login">
          Login
        </DynamicCustomLink>
        <DynamicCustomLink url="/pages/jobs" className="p-2 rounded-lg">
          Cancel
        </DynamicCustomLink>
      </Container>
    </>
  );
};

export default Signup;
