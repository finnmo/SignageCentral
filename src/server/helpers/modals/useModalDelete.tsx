import { useState } from "react";

export default function useModal() {
  const [isOpenDelete, setisOpenDelete] = useState(false);

  const toggleDelete = () => {
    setisOpenDelete(!isOpenDelete);
  };

  return {
    isOpenDelete,
    toggleDelete,
  };
}