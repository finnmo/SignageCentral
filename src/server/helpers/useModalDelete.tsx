import { useState } from "react";

export default function useModalDelete() {
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const toggleDeleteModal = () => {
    setIsOpenDelete(!isOpenDelete);
  };

  const closeDeleteModal = () =>{
    setIsOpenDelete(false);
  }

  return {
    isOpenDelete,
    toggleDeleteModal,
    closeDeleteModal,
  };
}
