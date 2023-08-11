
import React, { useEffect, type Dispatch, type SetStateAction, useRef, useState } from "react";
import Link from "next/link";
//import { useOnClickOutside } from "usehooks-ts";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import useModal from "~/server/helpers/useModal";
import useModalIntegration from "~/server/helpers/useModalIntegration";
import { LoadingSpinner } from "./LoadingSpinner";
import { AddIntegrationModal, AddSignModal } from "./Sidebar";
import { encodeUrlParams } from "react-url-modal";

type Props = {
    isDark: boolean;
    setDarkMode: (isDark: boolean) => void;
    isMobileMainMenuOpen: boolean;
    openMobileMainMenu: Dispatch<SetStateAction<boolean>>;
  }; 
  
const MobileSidebar: React.FunctionComponent<{ isDark: boolean, setDarkMode: (isDark: boolean) => void, isMobileMainMenuOpen: boolean, openMobileMainMenu: Dispatch<SetStateAction<boolean>>}> = (props: Props) =>{
    const router = useRouter();

    const { data: signs, isLoading: isLoadingSigns } = api.sign.getAll.useQuery();
    const { data: images, isLoading: isLoadingImages } = api.image.getAll.useQuery();
  
   
    const { isOpen, toggle } = useModal();
    const { isOpenIntegration, toggleIntegration } = useModalIntegration();   
   
    const [openDashboards, setOpenDashboards] = useState(true);
    const [openSigns, setOpenSigns] = useState(
      router.pathname == "/sign/{id}" ? true : false
    );

    const [openRollingImages, setOpenRollingImages] = useState(false);
    const [openAuthentication, setOpenAuthentication] = useState(false);
    const [openLayouts, setOpenLayouts] = useState(false);
    const [openParkingMap, setOpenParkingMap] = useState(false);


  const handleOpenRollingImages = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenRollingImages(!openRollingImages);
  } 

  useEffect(() => {
    const signRegex = /^[A-Za-z0-9#]+$/; // Regular expression to match the ID pattern

    const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id; // Extract the ID from the query parameters

    if (id && signRegex.test(id)) {
      setOpenSigns(true);
    }
  }, [router.query.id]);


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
        </div>
      </div>

      <div x-data="{ isActive: false, open: false }">
        <a
          href="#"
          onClick={() => setOpenSigns(!openSigns)}
          className={`flex items-center p-2 text-gray-500 transition-colors rounded-md dark:text-light hover:bg-primary-100 dark:hover:bg-primary ${
            openSigns ? "bg-primary-100 dark:bg-primary" : ""}`}
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
          <span className="ml-2 text-sm"> Signs </span>
          <span aria-hidden="true" className="ml-auto">
            <svg
              className={`w-4 h-4 transition-transform transform ${
                openSigns ? "rotate-180" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </a>
        <div className={`mt-2 space-y-2 px-7 ${openSigns ? "" : "hidden"}`} role="menu" arial-label="Components">
            {!isLoadingSigns ?
                signs?.map((sign) => (
                  <Link
                    href={`/sign/${sign.id}`}
                    className={`${
                      router.query.id == sign.id ? "text-gray-700": ""} dark:hover:text-light block rounded-md p-2 text-sm text-gray-400 transition-colors duration-200 hover:text-gray-700 dark:text-gray-400`}
                    key={sign.id}
                  >
                    {sign.name}
                  </Link>
                )) : <div className = 'flex align-center justify-center'> <LoadingSpinner/></div>
              }
              {!isLoadingSigns ?
                <div>
                <a
                  onClick={toggle}
                  className={`${
                    isOpen ? "border-gray-400 text-gray-700" : ""
                  } dark:hover:text-light block rounded-md border-2 p-2 text-center text-sm text-gray-400 transition-colors duration-200 hover:cursor-pointer hover:border-gray-400 hover:text-gray-700 dark:text-gray-400`}
                >
                  Add New Sign +
                </a>
                <AddSignModal isOpen={isOpen} toggle={toggle}></AddSignModal></div> : <div/>}
          </div>
        </div>

      <div x-data="{ isActive: false, open: false }">
        <Link
          href="/images"
          className={`flex items-center p-2 text-gray-500 transition-colors rounded-md dark:text-light hover:bg-primary-100 dark:hover:bg-primary ${
            openRollingImages ? "bg-primary-100 dark:bg-primary" : ""}`}
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
          <span className="ml-2 text-sm"> Rolling Images </span>
          <span aria-hidden="true" className="ml-auto">
            <svg
              onClick={handleOpenRollingImages}
              className={`w-4 h-4 transition-transform transform ${
                openRollingImages ? "rotate-180" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </Link>
        <div className={`mt-2 space-y-2 px-7 ${openRollingImages ? "" : "hidden"}`} role="menu" arial-label="Pages">
        {!isLoadingImages ?
                images?.map((image) => (
                  <Link
                    href={`/images?modal=EditImageModal&params=${encodeUrlParams({ imageId: image.id })}`}
                    className={`${
                      router.query.id == image.id ? "text-gray-700": ""} dark:hover:text-light block rounded-md p-2 text-sm text-gray-400 transition-colors duration-200 hover:text-gray-700 dark:text-gray-400`}
                    key={image.id}
                  >
                    {image.imageName}
                  </Link>
                )) : <div className = 'flex align-center justify-center'> <LoadingSpinner/></div>}
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

      <div>
              <a
                href="#"
                onClick={() => setOpenParkingMap(!openParkingMap)}
                className={`dark:text-light hover:bg-primary-100 dark:hover:bg-primary flex items-center rounded-md p-2 text-gray-500 transition-colors ${
                  openParkingMap ? "bg-primary-100 dark:bg-primary" : ""
                }`}
                role="button"
                aria-haspopup="true"
                //aria-expanded={`${openAuthentication ? "true" : "false"}`}
              >
                <span aria-hidden="true">
                  <svg
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="13.000000pt"
                    height="13.000000pt"
                    viewBox="0 0 980.000000 818.000000"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <g
                      transform="translate(0.000000,818.000000) scale(0.100000,-0.100000)"
                      fill="currentColor"
                      stroke="currentColor"
                    >
                      <path
                        d="M2916 8154 c-643 -100 -1234 -595 -1436 -1203 -26 -79 -111 -456
            -266 -1186 l-227 -1071 -94 -49 c-404 -213 -693 -610 -772 -1060 -13 -74 -121
            -1491 -121 -1588 0 -172 59 -412 140 -570 129 -253 347 -467 596 -585 l70 -34
            17 -61 c74 -256 292 -506 552 -633 233 -113 530 -135 780 -57 282 88 519 297
            647 569 l39 84 2062 0 2062 0 23 -58 c59 -153 218 -348 368 -452 174 -120 352
            -179 569 -187 118 -4 156 -2 244 17 203 42 375 129 517 263 136 129 220 255
            279 419 l32 93 84 43 c132 69 217 129 321 230 243 235 377 532 394 872 7 125
            -96 1537 -121 1669 -83 434 -382 828 -786 1036 l-76 39 -227 1070 c-155 731
            -240 1108 -266 1187 -203 612 -798 1108 -1444 1204 -90 13 -343 15 -1987 14
            -1549 -1 -1900 -3 -1973 -15z m3914 -352 c467 -89 802 -315 1029 -694 94 -156
            177 -379 220 -583 20 -97 401 -2072 401 -2080 0 -2 37 -23 82 -46 340 -177
            605 -514 692 -879 20 -81 37 -235 77 -670 59 -657 61 -780 16 -953 -30 -111
            -95 -255 -158 -348 -101 -150 -274 -298 -448 -385 l-90 -45 -11 -57 c-51 -255
            -103 -373 -212 -479 -117 -114 -241 -162 -434 -170 -93 -4 -139 -2 -198 11
            -158 36 -302 133 -412 279 -44 60 -164 288 -164 314 0 11 -429 13 -2317 13
            l-2318 0 -35 -86 c-123 -308 -317 -462 -622 -495 -416 -45 -711 173 -859 636
            l-32 101 -102 53 c-279 144 -442 361 -501 667 -28 147 -22 330 30 904 25 283
            53 559 61 612 61 403 330 772 707 973 l85 45 12 58 c6 31 99 514 206 1072 107
            558 207 1058 222 1110 71 257 180 472 329 652 230 276 597 452 1016 487 57 5
            893 8 1858 7 l1755 -2 115 -22z"
                      />
                      <path
                        d="M2700 7191 c-175 -56 -334 -204 -384 -359 -9 -26 -99 -493 -201
            -1038 -193 -1036 -200 -1085 -169 -1177 22 -64 92 -140 162 -174 l57 -28 2715
            0 2715 0 57 28 c65 32 122 90 150 154 45 101 46 93 -156 1168 -102 545 -194
            1020 -206 1057 -51 164 -205 314 -379 368 -62 20 -94 20 -2185 19 -2000 0
            -2124 -1 -2176 -18z m4532 -1371 c103 -542 188 -991 188 -997 0 -10 -516 -13
            -2545 -13 l-2545 0 5 23 c6 24 375 1967 375 1973 0 2 975 3 2167 2 l2167 -3
            188 -985z"
                      />
                      <path
                        d="M1932 3360 c-96 -25 -152 -51 -227 -105 -90 -64 -160 -146 -211 -250
            -99 -200 -99 -400 0 -600 165 -335 567 -470 906 -304 111 55 237 178 293 286
            103 198 103 438 0 636 -56 108 -182 231 -293 286 -146 71 -318 90 -468 51z"
                      />
                      <path
                        d="M7552 3365 c-35 -8 -103 -33 -150 -56 -71 -34 -102 -57 -172 -128
            -140 -140 -200 -284 -200 -476 0 -192 60 -336 200 -476 69 -71 101 -94 171
            -128 167 -80 348 -93 519 -35 270 90 460 354 460 639 0 103 -24 198 -74 300
            -80 162 -222 287 -389 341 -102 33 -266 42 -365 19z"
                      />
                    </g>
                  </svg>
                </span>
                <span className="ml-2 text-sm"> Parking Map </span>
                <span aria-hidden="true" className="ml-auto">
                  <svg
                    className={`h-4 w-4 transform transition-transform ${
                      openParkingMap ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </a>
              <div
                className={`mt-2 space-y-2 px-7 ${
                  openParkingMap ? "" : "hidden"
                }`}
                role="menu"
                aria-label="Authentication"
              >
                <Link
                  href="auth/register"
                  className="dark:hover:text-light block rounded-md p-2 text-sm text-gray-400 transition-colors duration-200 hover:text-gray-700"
                >
                  Register
                </Link>
                <Link
                  href="auth/login"
                  className="dark:hover:text-light block rounded-md p-2 text-sm text-gray-400 transition-colors duration-200 hover:text-gray-700"
                >
                  Login
                </Link>
                <Link
                  href="auth/forgotPassword"
                  className="dark:hover:text-light block rounded-md p-2 text-sm text-gray-400 transition-colors duration-200 hover:text-gray-700"
                >
                  Forgot Password
                </Link>
                <Link
                  href="auth/resetPassword"
                  className="dark:hover:text-light block rounded-md p-2 text-sm text-gray-400 transition-colors duration-200 hover:text-gray-700"
                >
                  Reset Password
                </Link>
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
          <span className="ml-2 text-sm"> Integrations </span>
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
          <a
                  onClick={toggleIntegration}
                  className={`${
                    isOpenIntegration ? "border-gray-400 text-gray-700" : ""
                  } dark:hover:text-light block rounded-md border-2 p-2 text-center text-sm text-gray-400 transition-colors duration-200 hover:cursor-pointer hover:border-gray-400 hover:text-gray-700 dark:text-gray-400`}
                >
                  Add New Integration +
                </a>
                <AddIntegrationModal
                  isOpenIntegration={isOpenIntegration}
                  toggleIntegration={toggleIntegration}
                ></AddIntegrationModal>
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