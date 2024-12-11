import Container from "./Container";
import "./signup.css";

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
      </Container>
    </>
  );
};

export default Signup;
