"use client";

import { createContext, useContext, useState, useEffect } from "react";

import { User } from "../pages/types";

export type UserContextType = {
  user: User;
  saveUser: (newUser: User) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

import React from "react";

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setuser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user-data");

    // undefined will become a string through localStorage
    if (stored === "undefined") return undefined;

    setuser(stored ? JSON.parse(stored) : undefined);
  }, []);

  // method to update the user
  const saveUser = (newUser: User): void => {
    setuser(newUser);

    localStorage.setItem("user-data", JSON.stringify(newUser)); // also save in localStorage
  };

  return (
    <UserContext.Provider value={{ user, saveUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);

  // if context is undefined
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }

  return context;
};
