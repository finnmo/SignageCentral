
import React, { type Dispatch, type SetStateAction, useRef, useState } from "react";
import Link from "next/link";
//import { useOnClickOutside } from "usehooks-ts";


type Props = {
    isDark: boolean;
    setDarkMode: (isDark: boolean) => void;
    isMobileMainMenuOpen: boolean;
    openMobileMainMenu: Dispatch<SetStateAction<boolean>>;
  }; 
  
const MobileSidebar: React.FunctionComponent<{ isDark: boolean, setDarkMode: (isDark: boolean) => void, isMobileMainMenuOpen: boolean, openMobileMainMenu: Dispatch<SetStateAction<boolean>>}> = (props: Props) =>{
    const [openDashboards, setOpenDashboards] = useState(true);
    const [openComponents, setOpenComponents] = useState(false);
    const [openPages, setOpenPages] = useState(false);
    const [openAuthentication, setOpenAuthentication] = useState(false);
    const [openLayouts, setOpenLayouts] = useState(false);

    const ref = useRef<HTMLDivElement>(null);
    // useOnClickOutside(ref, (e) => {
    //     props.openMobileMainMenu(false);
    // });
    return (
    <div
        className={`border-b md:hidden dark:border-primary-darker ${
            props.isMobileMainMenuOpen ? "" : "hidden"}`}
        ref={ref}
  >
    <nav aria-label="Main" className="px-2 py-4 space-y-2">
      <div>
        <a
          onClick={() => setOpenDashboards(!openDashboards)}
          className={`flex items-center p-2 text-gray-500 transition-colors rounded-md dark:text-light hover:bg-primary-100 dark:hover:bg-primary ${
            openDashboards ? "bg-primary-100 dark:bg-primary" : ""}`}
          role="button"
          aria-haspopup="true"
        >
          <span aria-hidden="true">
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </span>
          <span className="ml-2 text-sm"> Dashboards </span>
          <span className="ml-auto" aria-hidden="true">
            <svg
              className={`w-4 h-4 transition-transform transform ${
                openDashboards ? "rotate-180" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </a>
        <div role="menu" className={`mt-2 space-y-2 px-7 ${openDashboards ? "" : "hidden"}`} aria-label="Dashboards">
          <Link
            href="/"
            role="menuitem"
            className="block p-2 text-sm text-gray-700 transition-colors duration-200 rounded-md dark:text-light dark:hover:text-light hover:text-gray-700"
          >
            Dashboards
          </Link>
          <Link
            href="/overview"
            role="menuitem"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
          >
            Overview
          </Link>
          <Link
            href="/"
            role="menuitem"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
          >
            TBD (soon)
          </Link>
        </div>
      </div>

      <div x-data="{ isActive: false, open: false }">
        <a
          href="#"
          onClick={() => setOpenComponents(!openComponents)}
          className={`flex items-center p-2 text-gray-500 transition-colors rounded-md dark:text-light hover:bg-primary-100 dark:hover:bg-primary ${
            openComponents ? "bg-primary-100 dark:bg-primary" : ""}`}
          role="button"
          aria-haspopup="true"
          ////:aria-expanded="(open || isActive) ? 'true' : 'false'"
        >
          <span aria-hidden="true">
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </span>
          <span className="ml-2 text-sm"> Components </span>
          <span aria-hidden="true" className="ml-auto">
            <svg
              className={`w-4 h-4 transition-transform transform ${
                openComponents ? "rotate-180" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </a>
        <div className={`mt-2 space-y-2 px-7 ${openComponents ? "" : "hidden"}`} role="menu" arial-label="Components">
          <Link
            href="/sign"
            role="menuitem"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:text-gray-400 dark:hover:text-light hover:text-gray-700"
          >
             University Blvd and Hayman Rd (soon)
          </Link>
          <a
            href="#"
            role="menuitem"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:text-gray-400 dark:hover:text-light hover:text-gray-700"
          >
            University Blvd and Kent St (soon)
          </a>
          <a
            href="#"
            role="menuitem"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
          >
            Stadium Entrance (soon)
          </a>
          <a
            href="#"
            role="menuitem"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
          >
            Beazley Ave and Kent St (soon)
          </a>
          <a
            href="#"
            role="menuitem"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
          >
            South Entrance (soon)
          </a>
        </div>
      </div>

      <div x-data="{ isActive: false, open: false }">
        <a
          href="#"
          onClick={() => setOpenPages(!openPages)}
          className={`flex items-center p-2 text-gray-500 transition-colors rounded-md dark:text-light hover:bg-primary-100 dark:hover:bg-primary ${
            openPages ? "bg-primary-100 dark:bg-primary" : ""}`}
          role="button"
          aria-haspopup="true"
          ////:aria-expanded="(open || isActive) ? 'true' : 'false'"
        >
          <span aria-hidden="true">
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </span>
          <span className="ml-2 text-sm"> Pages </span>
          <span aria-hidden="true" className="ml-auto">
            <svg
              className={`w-4 h-4 transition-transform transform ${
                openPages ? "rotate-180" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </a>
        <div className={`mt-2 space-y-2 px-7 ${openPages ? "" : "hidden"}`} role="menu" arial-label="Pages">
          <a
            href="pages/blank.html"
            role="menuitem"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:text-gray-400 dark:hover:text-light hover:text-gray-700"
          >
            Blank
          </a>
          <a
            href="pages/404.html"
            role="menuitem"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:text-gray-400 dark:hover:text-light hover:text-gray-700"
          >
            404
          </a>
          <a
            href="pages/500.html"
            role="menuitem"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:text-gray-400 dark:hover:text-light hover:text-gray-700"
          >
            500
          </a>
          <a
            href="#"
            role="menuitem"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:text-gray-400 dark:hover:text-light hover:text-gray-700"
          >
            Profile (soon)
          </a>
          <a
            href="#"
            role="menuitem"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
          >
            Pricing (soon)
          </a>
          <a
            href="#"
            role="menuitem"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
          >
            Kanban (soon)
          </a>
          <a
            href="#"
            role="menuitem"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
          >
            Feed (soon)
          </a>
        </div>
      </div>

      <div x-data="{ isActive: false, open: false}">
        <a
          href="#"
          onClick={() => setOpenAuthentication(!openAuthentication)}
          className={`flex items-center p-2 text-gray-500 transition-colors rounded-md dark:text-light hover:bg-primary-100 dark:hover:bg-primary ${
            openAuthentication ? "bg-primary-100 dark:bg-primary" : ""}`}
          role="button"
          aria-haspopup="true"
          ////:aria-expanded="(open || isActive) ? 'true' : 'false'"
        >
          <span aria-hidden="true">
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </span>
          <span className="ml-2 text-sm"> Authentication </span>
          <span aria-hidden="true" className="ml-auto">
            <svg
              className={`w-4 h-4 transition-transform transform ${
                openAuthentication ? "rotate-180" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </a>
        <div className={`mt-2 space-y-2 px-7 ${openAuthentication ? "" : "hidden"}`}  role="menu" aria-label="Authentication">
          <a
            href="auth/register.html"
            role="menuitem"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
          >
            Register
          </a>
          <a
            href="auth/login.html"
            role="menuitem"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
          >
            Login
          </a>
          <a
            href="auth/forgot-password.html"
            role="menuitem"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
          >
            Forgot Password
          </a>
          <a
            href="auth/reset-password.html"
            role="menuitem"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
          >
            Reset Password
          </a>
        </div>
      </div>

      <div x-data="{ isActive: false, open: false}">
        <a
          href="#"
          onClick={() => setOpenLayouts(!openLayouts)}
          className={`flex items-center p-2 text-gray-500 transition-colors rounded-md dark:text-light hover:bg-primary-100 dark:hover:bg-primary ${
            openLayouts ? "bg-primary-100 dark:bg-primary" : ""}`}
          role="button"
          aria-haspopup="true"
          ////:aria-expanded="(open || isActive) ? 'true' : 'false'"
        >
          <span aria-hidden="true">
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              />
            </svg>
          </span>
          <span className="ml-2 text-sm"> Layouts </span>
          <span aria-hidden="true" className="ml-auto">
            <svg
              className={`w-4 h-4 transition-transform transform ${
                openLayouts ? "rotate-180" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </a>
        <div className={`mt-2 space-y-2 px-7 ${openLayouts ? "" : "hidden"}`} role="menu" aria-label="Layouts">
          <a
            href="layouts/two-columns-sidebar.html"
            role="menuitem"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:text-gray-400 dark:hover:text-light hover:text-gray-700"
          >
            Two Columns Sidebar
          </a>
          <a
            href="layouts/mini-plus-one-columns-sidebar.html"
            role="menuitem"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:text-gray-400 dark:hover:text-light hover:text-gray-700"
          >
            Mini + One Columns Sidebar
          </a>
          <a
            href="layouts/mini-column-sidebar.html"
            role="menuitem"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:text-gray-400 dark:hover:text-light hover:text-gray-700"
          >
            Mini Column Sidebar
          </a>
        </div>
      </div>
    </nav>
  </div>
)
}

export default MobileSidebar