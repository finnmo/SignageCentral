import React, { useState, useEffect} from "react";
import SettingsPanel from "~/components/SettingsPanel";
import MobileSubMenu from "~/components/MobileSubMenu";
import Sidebar from "~/components/Sidebar";
import Navbar from "~/components/Navbar";
import NotificationPanel from "~/components/NotificationPanel";
import SeachPanel from "~/components/SearchPanel";
import MobileSidebar from "~/components/MobileSidebar";
import Footer from "~/components/Footer";
import { Loading } from "~/components/Loading";


interface Props {
  children: React.ReactNode;
}
//force git commit
function Layout({ children }: Props) {

  function getTheme(dark: string, defaultValue: boolean) {
    // getting stored value
    let initial = false;
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
  function getColor(color: string, value: string) {
    // getting stored value
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(color) || null;
    if(saved){
      //value = typeof saved === "string" ? JSON.parse(saved) : "cyan";
      value = "cyan"
    }
  }
    return value;
  }


  const [isDark, setDarkMode] = useState<boolean>(getTheme('dark', false));
  const [isNotificationPanelOpen, openNotificationPanel] = useState<boolean>(false);
  const [isSettingsPanelOpen, openSettingsPanel] = useState<boolean>(false);
  const [isSearchPanelOpen, openSearchPanel] = useState<boolean>(false);
  const [isMobileSubMenuOpen, openMobileSubMenu] = useState<boolean>(false);
  const [isMobileMainMenuOpen, openMobileMainMenu] = useState<boolean>(false);


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
  
  function handleDarkModeChange(isDark: boolean){
    setDarkMode(isDark);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dark', JSON.stringify(isDark));
    }
  }

  //On load run once
  useEffect(() => {
    setColors(getColor('color', 'cyan'));
  }, []);


  return (
    <>
        <div x-data="setup()" /*x-init="$refs.loading.classList.add('hidden');"*/ className={`${isDark ? 'dark' : '' }`}>
          <div className="flex h-screen antialiased text-gray-900 bg-gray-100 dark:bg-dark dark:text-light">
            <Loading/>
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
            <SeachPanel isSearchPanelOpen={isSearchPanelOpen} openSearchPanel={openSearchPanel}></SeachPanel>
         </div>
        </div>
    </>
  );
}

export default Layout;




