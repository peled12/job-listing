import Clock from "./components/Clock";
import DarkMode from "./components/DarkMode";

import { UserContextProvider } from "./custom_hooks/UserContext";
import {
  CustomLink,
  NavigationTransition,
} from "./custom_hooks/NavigationTransition";

import UserSettings from "./components/UserSettings";

import "./globals.css";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense
          fallback={
            <div className="navigation-loader-container">
              <div className="navigation-loader"></div>
            </div>
          }
        >
          <UserContextProvider>
            <div className="navbar-filler">HI</div>
            <div className="navbar">
              <Clock />
              <div className="main-loader hide"></div>
              <div className="error-sign text-xl transition !text-red-600 !hidden">
                :(
              </div>
              <div className="links">
                <DarkMode />
                <CustomLink url="/pages/jobs" className="custom-button">
                  Job Listing
                </CustomLink>
                <UserSettings />
              </div>
            </div>
            <NavigationTransition>{children}</NavigationTransition>
          </UserContextProvider>
        </Suspense>
      </body>
    </html>
  );
}
