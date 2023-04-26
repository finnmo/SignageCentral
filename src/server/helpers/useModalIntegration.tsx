import { useState } from "react";

export default function useModalIntegration() {
  const [isOpenIntegration, setIsOpenIntegration] = useState(false);

  const toggleIntegration = () => {
    setIsOpenIntegration(!isOpenIntegration);
  };

  return {
    isOpenIntegration,
    toggleIntegration
  };
}
