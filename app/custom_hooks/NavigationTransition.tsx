"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useSearchParams } from "next/navigation";

export const NavigationTransition = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isPending } = useTransitionNavigate();

  return (
    <>
      {isPending && (
        <div className="navigation-loader-container">
          <div className="navigation-loader"></div>
        </div>
      )}
      {children}
    </>
  );
};

export const CustomLink = ({
  url,
  className = "", // default value
  state,
  children,
}: {
  url: string;
  className?: string;
  state?: any;
  children: React.ReactNode;
}) => {
  const { navigateWithTransition } = useTransitionNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // TODO: figure out how to pass state here

    navigateWithTransition({ url: url, state: state });
  };

  return (
    <a onClick={handleClick} className={className + " cursor-pointer h-max"}>
      {children}
    </a>
  );
};

export const useTransitionNavigate = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigateWithTransition = ({
    url,
    replace,
    state,
  }: {
    url: string;
    replace?: boolean;
    state?: any;
  }) => {
    // have a replace paramter to also include navigating with replace

    // get the state and encode it if exists
    const encodedState = state
      ? encodeURIComponent(JSON.stringify(state))
      : undefined;

    // get the new url (with the state)
    const newUrl = encodedState ? `${url}?state=${encodedState}` : url;

    startTransition(async () => {
      if (replace) router.replace(newUrl);
      else router.push(newUrl);
    });
  };

  return { navigateWithTransition, isPending };
};

// create a simpeler way to get the state
export const useUrlState = () => {
  const searchParams = useSearchParams();
  const stateParam = searchParams.get("state");

  const state = stateParam ? JSON.parse(decodeURIComponent(stateParam)) : null;

  return state;
};
