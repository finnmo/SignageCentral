import React, { useRef, useState, useEffect } from "react";
import Link from 'next/link'



type Props = {
    isDark: boolean;
    isSettingsPanelOpen: boolean;
    openSettingsPanel: any;
  }; 


const Sidebar: React.FunctionComponent<{ isDark: boolean, isSettingsPanelOpen: boolean, openSettingsPanel: any}> = (props: Props) =>{
  
  const [openDashboards, setOpenDashboards] = useState(true);
  const [openComponents, setOpenComponents] = useState(false);
  const [openPages, setOpenPages] = useState(false);
  const [openAuthentication, setOpenAuthentication] = useState(false);
  const [openLayouts, setOpenLayouts] = useState(false);
  const [openParkingMap, setOpenParkingMap] = useState(false);



  return (
    <>
    <div className="flex-shrink-0 hidden w-64 bg-white border-r dark:border-primary-darker dark:bg-darker md:block">
    <div className="flex flex-col h-full">
    <nav aria-label="Main" className="flex-1 px-2 py-4 space-y-2 overflow-y-hidden hover:overflow-y-auto">
        <div>
        <a
            href="#"
            onClick={() => setOpenDashboards(!openDashboards)}
            className={`flex items-center p-2 text-gray-500 transition-colors rounded-md dark:text-light hover:bg-primary-100 dark:hover:bg-primary ${
                openDashboards ? "bg-primary-100 dark:bg-primary" : ""
              }`}
            role="button"
            aria-haspopup="true"
            aria-expanded={`${openDashboards ? "true" : "false"}`}
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
                className={`${openDashboards ? "rotate-180": ""}
                    "w-4",
                    "h-4", 
                    "transition-transform",
                    "transform", 
                }`}
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
            className="block p-2 text-sm text-gray-700 transition-colors duration-200 rounded-md dark:text-light dark:hover:text-light hover:text-gray-700"
            >
            Dashboards
            </Link>
            <Link
            href="/overview"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
            >
            Overview
            </Link>
            <Link
            href="/"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
            >
            TBD (soon)
            </Link>
        </div>
        </div>

        <div>
        <a
            href="#"
            onClick={() => setOpenComponents(!openComponents)}
            className={`flex items-center p-2 text-gray-500 transition-colors rounded-md dark:text-light hover:bg-primary-100 dark:hover:bg-primary ${
                openComponents ? "bg-primary-100 dark:bg-primary" : ""
              }`}
            role="button"
            aria-haspopup="true"
            aria-expanded={`${openComponents ? "true" : "false"}`}
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
            <span className="ml-2 text-sm"> Sign Configuration</span>
            <span aria-hidden="true" className="ml-auto">
            <svg
                className={`w-4 h-4 transition-transform transform ${openComponents ? "rotate-180" : ""}`}
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

        <div>
        <a
            href="#"
            onClick={() => setOpenPages(!openPages)}
            className={`flex items-center p-2 text-gray-500 transition-colors rounded-md dark:text-light hover:bg-primary-100 dark:hover:bg-primary ${
                openPages ? "bg-primary-100 dark:bg-primary" : ""
              }`}
            role="button"
            aria-haspopup="true"
            aria-expanded={`${openComponents ? "true" : "false"}`}
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
                 className={`w-4 h-4 transition-transform transform ${openPages ? "rotate-180" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
            </span>
        </a>
        <div  className={`mt-2 space-y-2 px-7 ${openPages ? "" : "hidden"}`} role="menu" arial-label="Pages">
            <Link
              href="/blank" className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:text-gray-400 dark:hover:text-light hover:text-gray-700">
                Blank
            </Link>
            <Link
              href="/404" className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:text-gray-400 dark:hover:text-light hover:text-gray-700">
                404
            </Link>
            <Link
              href="/500" className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:text-gray-400 dark:hover:text-light hover:text-gray-700">
                500
            </Link>
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

        <div >
        <a
            href="#"
            onClick={() => setOpenParkingMap(!openParkingMap)}
            className={`flex items-center p-2 text-gray-500 transition-colors rounded-md dark:text-light hover:bg-primary-100 dark:hover:bg-primary ${
                openAuthentication ? "bg-primary-100 dark:bg-primary" : ""
              }`}
            role="button"
            aria-haspopup="true"
            aria-expanded={`${openAuthentication ? "true" : "false"}`}
        >
            <span aria-hidden="true">
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
            width="13.000000pt" height="13.000000pt" viewBox="0 0 980.000000 818.000000"
            preserveAspectRatio="xMidYMid meet">

            <g transform="translate(0.000000,818.000000) scale(0.100000,-0.100000)"
            fill="#6B7280" stroke="#6B7280">
            <path d="M2916 8154 c-643 -100 -1234 -595 -1436 -1203 -26 -79 -111 -456
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
            893 8 1858 7 l1755 -2 115 -22z"/>
            <path d="M2700 7191 c-175 -56 -334 -204 -384 -359 -9 -26 -99 -493 -201
            -1038 -193 -1036 -200 -1085 -169 -1177 22 -64 92 -140 162 -174 l57 -28 2715
            0 2715 0 57 28 c65 32 122 90 150 154 45 101 46 93 -156 1168 -102 545 -194
            1020 -206 1057 -51 164 -205 314 -379 368 -62 20 -94 20 -2185 19 -2000 0
            -2124 -1 -2176 -18z m4532 -1371 c103 -542 188 -991 188 -997 0 -10 -516 -13
            -2545 -13 l-2545 0 5 23 c6 24 375 1967 375 1973 0 2 975 3 2167 2 l2167 -3
            188 -985z"/>
            <path d="M1932 3360 c-96 -25 -152 -51 -227 -105 -90 -64 -160 -146 -211 -250
            -99 -200 -99 -400 0 -600 165 -335 567 -470 906 -304 111 55 237 178 293 286
            103 198 103 438 0 636 -56 108 -182 231 -293 286 -146 71 -318 90 -468 51z"/>
            <path d="M7552 3365 c-35 -8 -103 -33 -150 -56 -71 -34 -102 -57 -172 -128
            -140 -140 -200 -284 -200 -476 0 -192 60 -336 200 -476 69 -71 101 -94 171
            -128 167 -80 348 -93 519 -35 270 90 460 354 460 639 0 103 -24 198 -74 300
            -80 162 -222 287 -389 341 -102 33 -266 42 -365 19z"/>
            </g>
            </svg>
            </span>
            <span className="ml-2 text-sm"> Parking Map </span>
            <span aria-hidden="true" className="ml-auto">
            <svg
                 className={`w-4 h-4 transition-transform transform ${openParkingMap ? "rotate-180" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
            </span>
        </a>
        <div className={`mt-2 space-y-2 px-7 ${openParkingMap ? "" : "hidden"}`} role="menu" aria-label="Authentication">
            <Link
            href="auth/register"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
            >
            Register
            </Link>
            <Link
            href="auth/login"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
            >
            Login
            </Link>
            <Link
            href="auth/forgotPassword"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
            >
            Forgot Password
            </Link>
            <Link
            href="auth/resetPassword"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
            >
            Reset Password
            </Link>
        </div>
        </div>

        <div >
        <a
            href="#"
            onClick={() => setOpenAuthentication(!openAuthentication)}
            className={`flex items-center p-2 text-gray-500 transition-colors rounded-md dark:text-light hover:bg-primary-100 dark:hover:bg-primary ${
                openAuthentication ? "bg-primary-100 dark:bg-primary" : ""
              }`}
            role="button"
            aria-haspopup="true"
            aria-expanded={`${openAuthentication ? "true" : "false"}`}
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
                 className={`w-4 h-4 transition-transform transform ${openAuthentication ? "rotate-180" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
            </span>
        </a>
        <div className={`mt-2 space-y-2 px-7 ${openAuthentication ? "" : "hidden"}`} role="menu" aria-label="Authentication">
            <Link
            href="auth/register"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
            >
            Register
            </Link>
            <Link
            href="auth/login"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
            >
            Login
            </Link>
            <Link
            href="auth/forgotPassword"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
            >
            Forgot Password
            </Link>
            <Link
            href="auth/resetPassword"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
            >
            Reset Password
            </Link>
        </div>
        </div>

        <div >
        <a
            href="#"
            onClick={() => setOpenLayouts(!openLayouts)}
            className={`flex items-center p-2 text-gray-500 transition-colors rounded-md dark:text-light hover:bg-primary-100 dark:hover:bg-primary ${
                openLayouts ? "bg-primary-100 dark:bg-primary" : ""
              }`}
            role="button"
            aria-haspopup="true"
            aria-expanded={`${openLayouts ? "true" : "false"}`}
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
            <span className="ml-2 text-sm"> Other Configuration </span>
            <span aria-hidden="true" className="ml-auto">
            <svg
                 className={`w-4 h-4 transition-transform transform ${openLayouts ? "rotate-180" : ""}`}
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
            <Link
            href="/layouts/TwoColums"
            role="menuitem"
            className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:text-gray-400 dark:hover:text-light hover:text-gray-700"
            >
            Two Columns Sidebar
            </Link>
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

    <div className="flex-shrink-0 px-2 py-4 space-y-2">
        <button

        onClick={() => props.openSettingsPanel(true)}
        type="button"
        className="flex items-center justify-center w-full px-4 py-2 text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary-dark focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
        >
        <span aria-hidden="true">
            <svg
            className="w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
            </svg>
        </span>
        <span>Customize</span>
        </button>
    </div>
</div>
</div>
</>
)
}
export default Sidebar;