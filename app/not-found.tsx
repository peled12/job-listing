import { CustomLink } from "./custom_hooks/NavigationTransition";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center w-full mt-6">
      <h1 className="text-5xl font-bold mb-4">404 - Not Found</h1>
      <p className="text-xl mb-8">
        The page you tried to access could not be found
      </p>
      <CustomLink url="/pages/jobs" className="back-home-btn hover:opacity-85">
        Take Me Home
      </CustomLink>
    </div>
  );
};

export default NotFound;
