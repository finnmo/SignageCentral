import React, { PropsWithChildren, useState, useEffect} from "react";
import SettingsPanel from "~/components/SettingsPanel";
import MobileSubMenu from "~/components/MobileSubMenu";
import Sidebar from "~/components/Sidebar";
import Head from "next/head";
import Navbar from "~/components/Navbar";
import classNames from "classnames";
import NotificationPanel from "~/components/NotificationPanel";
import SeachPanel from "~/components/SearchPanel";
import MobileSidebar from "~/components/MobileSidebar";

import Footer from "~/components/Footer";
interface Props {
  children: React.ReactNode;
}

function Layout({ children }: Props) {

  function getTheme(dark: string, defaultValue: boolean) {
    // getting stored value
    var initial = false;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(dark) || null;
    if(saved){
      initial = ((saved) === 'true');
    }else{
      initial = defaultValue
    }
  }
    return initial;
  }
  function getColor(color: string, defaultValue: string) {
    // getting stored value
    var initial = "cyan";
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(color) || null;
    if(saved){
      initial = JSON.parse(saved);
    }else{
      initial = defaultValue
    }
  }
    return initial;
  }


  const [isDark, setDarkMode] = useState(getTheme('dark', false));
  const [loading, setLoading] = useState(true);
  const [isNotificationPanelOpen, openNotificationPanel] = useState(false);
  const [isSettingsPanelOpen, openSettingsPanel] = useState(false);
  const [isSearchPanelOpen, openSearchPanel] = useState(false);
  const [isMobileSubMenuOpen, openMobileSubMenu] = useState(false);
  const [isMobileMainMenuOpen, openMobileMainMenu] = useState(false);


  const [isOnLineChart, setIsOnLineChart] = useState(true);
  const [isOnDoughnutChart, setIsOnDoughnutChart] = useState(true);


  const setColors = (color: string) => {
    const root = document.documentElement
    root.style.setProperty('--color-primary', `var(--color-${color})`)
    root.style.setProperty('--color-primary-50', `var(--color-${color}-50)`)
    root.style.setProperty('--color-primary-100', `var(--color-${color}-100)`)
    root.style.setProperty('--color-primary-light', `var(--color-${color}-light)`)
    root.style.setProperty('--color-primary-lighter', `var(--color-${color}-lighter)`)
    root.style.setProperty('--color-primary-dark', `var(--color-${color}-dark)`)
    root.style.setProperty('--color-primary-darker', `var(--color-${color}-darker)`)
    if (typeof window !== 'undefined') {
      localStorage.setItem('color', JSON.stringify(color));
    }
    //
  }

  const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(event.code);
    if (event.code === "Escape") {
      openNotificationPanel(false);
    }
  }

  const handleLineChartButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsOnLineChart(!isOnLineChart);
    //$parent.updateDoughnutChart(isOn)
  }
  const handleDoughnutChartButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsOnDoughnutChart(!isOnDoughnutChart);
    //$parent.updateDoughnutChart(isOn)
  }
  
  function handleDarkModeChange(isDark: boolean){
    setDarkMode(isDark);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dark', JSON.stringify(isDark));
    }
  }

  //On load run once
  useEffect(() => {
    setColors(getColor('color', 'cyan'));
    setLoading(false);
    console.log(isDark);
  }, []);


  return (
    <>
      <Head>
        <title>Digital Signage Manager</title>
        <meta name="description" content="Generated by create-t3-app" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div x-data="setup()" /*x-init="$refs.loading.classList.add('hidden');"*/ className={classNames({"dark": isDark})}>
          <div className="flex h-screen antialiased text-gray-900 bg-gray-100 dark:bg-dark dark:text-light">
            <div
              id="loading"
              className={`fixed inset-0 z-50 flex items-center justify-center text-2xl font-semibold text-white bg-primary-darker ${loading ? "" : "hidden"}`}
              >Loading..... 
            </div>
            <Sidebar isDark={isDark} isSettingsPanelOpen={isSettingsPanelOpen} openSettingsPanel={openSettingsPanel}></Sidebar>
            <div className="flex-1 h-full overflow-x-hidden overflow-y-auto">
              <header className="relative bg-white dark:bg-darker">
                <div className="flex items-center justify-between p-2 border-b dark:border-primary-darker">
                  <button
                    onClick={() => openMobileMainMenu(!isMobileMainMenuOpen)}
                    className="p-1 transition-colors duration-200 rounded-md text-primary-lighter bg-primary-50 hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark dark:bg-dark md:hidden focus:outline-none focus:ring"
                  >
                    <span className="sr-only">Open main menu</span>
                    <span aria-hidden="true">
                      <svg
                        className="w-8 h-8"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </span>
                  </button>

                
                  <Navbar isDark={isDark} setDarkMode={handleDarkModeChange} isNotificationPanelOpen={isNotificationPanelOpen} openNotificationPanel={openNotificationPanel} isSearchPanelOpen={isSearchPanelOpen} openSearchPanel={openSearchPanel} isSettingsPanelOpen={isSettingsPanelOpen} openSettingsPanel={openSettingsPanel}></Navbar>
                  <MobileSubMenu isDark={isDark} setDarkMode={handleDarkModeChange} isMobileSubMenuOpen={isMobileSubMenuOpen} openMobileSubMenu={openMobileSubMenu} isNotificationPanelOpen={isNotificationPanelOpen} openNotificationPanel={openNotificationPanel} openSettingsPanel={openSettingsPanel} openSearchPanel={openSearchPanel}></MobileSubMenu>
                </div>
              <MobileSidebar isDark={isDark} setDarkMode={handleDarkModeChange} isMobileMainMenuOpen={isMobileMainMenuOpen} openMobileMainMenu={openMobileMainMenu}></MobileSidebar>
              </header>
              <main>
                {children}
              </main>
              <Footer></Footer>
            </div>
            <SettingsPanel isDark={isDark} setDarkMode={handleDarkModeChange} setColors={setColors} isSettingsPanelOpen={isSettingsPanelOpen} openSettingsPanel={openSettingsPanel}/>
            <NotificationPanel isNotificationPanelOpen={isNotificationPanelOpen} openNotificationPanel={openNotificationPanel} keyDownHandler={keyDownHandler}></NotificationPanel>
            <SeachPanel isSearchPanelOpen={isSearchPanelOpen} openSearchPanel={openSearchPanel} keyDownHandler={keyDownHandler}></SeachPanel>
         </div>
        </div>
    </>
  );
};

export default Layout;




