import { useState } from "react";

export default function useModalIntegration() {
  const [isOpenIntegration, setIsOpenIntegration] = useState(false);

  const toggleIntegration = () => {
    setIsOpenIntegration(!isOpenIntegration);
  };

  const closeIntegration = () =>{
    setIsOpenIntegration(false);
  }


  return {
    isOpenIntegration,
    toggleIntegration,
    closeIntegration,
  };
}
