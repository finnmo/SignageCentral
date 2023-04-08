import React, { PropsWithChildren, useState, useEffect} from "react";
import SettingsPanel from "~/components/SettingsPanel";
import Sidebar from "~/components/Sidebar";
import SeachPanel from "~/components/SearchPanel";


const TwoColums = (props: PropsWithChildren) => {

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
  function getColor(color: string, defaultValue: string) {
    // getting stored value
    let initial = "cyan";
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
  const [isSettingsPanelOpen, openSettingsPanel] = useState(false);
  const [isSearchPanelOpen, openSearchPanel] = useState(false);


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
  }, []);

return (
    <>
<div>
    <div
      x-data="setup()"
      x-init="$refs.loading.classList.add('hidden'); setColors(color);"
      //:className="{ 'dark': isDark}"
      //@resize.window="watchScreen()"
      
    >
      <div className="flex h-screen antialiased text-gray-900 bg-gray-100 dark:bg-dark dark:text-light">
        <div
          x-ref="loading"
          className={`fixed inset-0 z-50 flex items-center justify-center text-2xl font-semibold text-white bg-primary-darker ${loading ? "" : "hidden"}`}
        >
          Loading.....
        </div>

        <Sidebar isDark={isDark} isSettingsPanelOpen={isSettingsPanelOpen} openSettingsPanel={openSettingsPanel}></Sidebar>

        <div
          x-show="isSecondSidebarOpen"
          //@click="isSecondSidebarOpen = false"
          className="hidden fixed inset-0 z-10 bg-primary-darker lg:hidden"
          //style="opacity: 0.5"
          aria-hidden="true"
        ></div>

        <section
          //x-show="isSecondSidebarOpen"
          //x-transition:enter="transition-all transform duration-300 ease-in-out"
          //x-transition:enter-start="-translate-x-full opacity-0"
          //x-transition:enter-end="translate-x-0 opacity-100"
          //x-transition:leave="transition-all transform duration-300 ease-in-out"
          //x-transition:leave-start="translate-x-0 opacity-100"
          //x-transition:leave-end="-translate-x-full opacity-0"
          //x-ref="secondSidebar"
          //@keydown.escape="window.innerWidth <= 1024 ? isSecondSidebarOpen = false : ''"
          //tabindex="-1"
          className="fixed inset-y-0 z-10 flex-shrink-0 w-64 bg-white border-r dark:border-primary-darker dark:bg-darker lg:static focus:outline-none"
          aria-labelledby="secondSidebarHeader"
        >
          <div className="flex flex-col h-screen">
            <div className="flex-shrink-0">
              <div className="px-4 pt-4 border-b dark:border-primary-darker">
                <h2 id="secondSidebarHeader" className="pb-4 font-semibold">Header</h2>
              </div>
            </div>

            <div className="flex-1 pt-4 overflow-y-hidden hover:overflow-y-auto">
              <div className="space-y-4">
                <p className="px-4">Content</p>
              </div>
            </div>
          </div>
        </section>

        <div className="fixed flex items-center space-x-4 top-5 right-10 lg:hidden">
          <button
            //@click="isSidebarOpen = true; $nextTick(() => { $refs.sidebar.focus() })"
            className="p-1 transition-colors duration-200 rounded-md text-primary-lighter bg-primary-50 hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark dark:bg-dark focus:outline-none focus:ring"
          >
            <span className="sr-only">Toggle main manu</span>
            <span aria-hidden="true">
              <svg
                x-show="!isSidebarOpen"
                className="w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                x-show="isSidebarOpen"
                className="w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </button>
          <button
            //@click="isSecondSidebarOpen = true; $nextTick(() => { $refs.secondSidebar.focus() })"
            className="p-1 transition-colors duration-200 rounded-md text-primary-lighter bg-primary-50 hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark dark:bg-dark focus:outline-none focus:ring"
          >
            <span className="sr-only">Toggle second sidebar panel</span>
            <span aria-hidden="true">
              <svg
                className="w-8 h-8 transition-transform transform"
                //:className="{ 'rotate-180': isSecondSidebarOpen }"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>

        <main className="flex-1">
          <div
            className="flex flex-col items-center justify-center flex-1 h-full min-h-screen p-4 overflow-x-hidden overflow-y-auto"
          >
            <h1 className="mb-4 text-2xl font-semibold text-center md:text-3xl">Two Columns - Sidebar</h1>
            <div className="space-y-4">
              <div className="relative flex p-1 space-x-1 bg-white shadow-md w-80 h-72 dark:bg-darker">
                <div className="w-16 h-full bg-gray-200 dark:bg-dark"></div>
                <div className="w-16 h-full bg-gray-200 dark:bg-dark"></div>
                <div className="flex-1 h-full bg-gray-100 dark:bg-dark"></div>
              </div>
            </div>
          </div>
        </main>
        <SettingsPanel isDark={isDark} setDarkMode={handleDarkModeChange} setColors={setColors} isSettingsPanelOpen={isSettingsPanelOpen} openSettingsPanel={openSettingsPanel}/>
        <SeachPanel isSearchPanelOpen={isSearchPanelOpen} openSearchPanel={openSearchPanel}></SeachPanel>

      </div>
    </div>
    </div>
    </>
  );
};

export default TwoColums;




