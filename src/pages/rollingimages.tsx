import { type ReactNode, useState, type ReactElement   } from "react";
import Layout from "~/layouts/Layout";
import type { NextPageWithLayout } from "./_app";
import React from 'react'
import Image from 'next/image'
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { api } from "~/utils/api";
import useModal from "~/server/helpers/useModal";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { storage } from "../server/api/firebase";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import 'firebase/compat/firestore';
import { useAuth } from "@clerk/nextjs";


const ImagePage: NextPageWithLayout = () => {
  const {data, isLoading} = api.sign.getAll.useQuery();
  const [isOn, setIsOn] = useState(true);
  const { isOpen, toggle } = useModal();
  
  if (isLoading) return (
    <div className="p-5 flex flex-row justify-center items-center">
    <LoadingSpinner size={40}/>
    </div>
)
  if(!data) return <div className="top-0 right-0 ml-6 mt-3" >Something went wrong...</div>
  
  return  (
  <>
<div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker z-10">
  <h1 className="text-2xl font-semibold">{`Rolling Images`}</h1>
</div>

<div className="mt-2">
  <div className="grid p-4 space-y-4 lg:gap-8 lg:space-y-0 lg:grid-cols-4 grid-rows-2 pl-10">
    <div onClick={toggle} className="cursor-pointer col-span-1 border-2 min-h-[315px] max-w-[315px] border-gray-400 rounded-lg dark:bg-darker flex flex-col items-center justify-center h-screen max-h-[40%]">

    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" strokeWidth="0.5" stroke="gray" className="w-40 h-40">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 0v29m15-15h-30" />
    </svg>
      <a className="text-xl pt-20 text-gray-500">Upload New Image</a>
    </div>
    <AddImageModal isOpen={isOpen} toggle={toggle}></AddImageModal>
    {...data?.map((sign) => (
    <div key={sign.id} className="grid-flow-row auto-rows-max col-span-1 max-w-[315px] min-h-[315px] dark:bg-primary-dark bg-white rounded-lg dark:bg-darker pb-5 max-h-[40%]">
    <div className="w-full h-10 pt-2 pb-2 relative">
    <span className="p-4 relative justify-center items-center text-xl ">{sign.name}</span>
      <button className="cursor-pointer absolute right-2 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600"  aria-label="close modal" role="button">
          <svg  xmlns="http://www.w3.org/2000/svg"  className="icon icon-tabler icon-tabler-x" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" />
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
      </button>
    </div>
    <div className="flex w-full h-[80%] dark:bg-primary-darker bg-white p-4 border-b border-t border-gray-200 dark:border-primary ">
      <div className="w-full h-full justify-center items-center relative">
          <Image src="/avatar.jpg" fill={true} alt="rollingimages1" />
        </div>
      </div>
      <div className="flex items-center justify-end h-12  bg-white rounded-lg ">
        <button className="relative pr-4 focus:outline-none" onClick={() => setIsOn(!isOn)}>
          <div
              className="w-12 h-6 transition rounded-full outline-none bg-primary-100 dark:bg-primary-darker"
          ></div>
          <div
              className={`absolute top-0 left-0 inline-flex items-center justify-center w-6 h-6 transition-all duration-200 ease-in-out transform scale-110 rounded-full shadow-lg ${
                isOn ? "translate-x-6 bg-primary-light dark:bg-primary" : "translate-x-0  bg-white dark:bg-primary-100"
              }`}   
          ></div>
        </button>
      </div>
    </div>
    ))}
  </div>
</div>
</>
)
}

interface ModalType {
  children?: ReactNode;
  isOpen: boolean;
  toggle: () => void;
}

export function AddImageModal(props: ModalType) {
  const ctx = api.useContext();
  const { getToken } = useAuth();
  
  const { mutate } = api.image.create.useMutation({
    onSuccess: () => {
      handleCancel();
      void ctx.image.invalidate();
    },
  });

  const [error, setError] = useState(null);

  const [imageUpload, setImageUpload] = useState<File | null>(null); 
  const [imageName, setImageName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [progresspercent, setProgresspercent] = useState(0);



  const handleCancel = () => {
    props.toggle();
    setImageName("");
    setImageUrl("");
  };


  const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(event.code);
    if (event.code === "Escape") {
      props.toggle();
    }
  }


  interface FormElements extends HTMLFormControlsCollection {
    imageInput: HTMLInputElement
  }
  interface ImageFormElement extends HTMLFormElement {
    readonly elements: FormElements
  }

  const handleSubmit = async (event: React.FormEvent<ImageFormElement>) => {
    event.preventDefault()
      if (!imageUpload) { return;}
      try{
        const auth = getAuth();
        const firebaseToken = await getToken({ template: "integration_firebase" });
        if (!firebaseToken) {
          return;
        }

        signInWithCustomToken(auth, firebaseToken)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          const storageRef = ref(storage, `files/${imageUpload}`);
          const uploadTask = uploadBytesResumable(storageRef, imageUpload);

          uploadTask.on("state_changed",
            (snapshot) => {
              const progress =
                Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setProgresspercent(progress);
            },
            (error) => {
              alert(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImageUrl(downloadURL)
                console.log(downloadURL)
              });
            }
          );
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage)
        });
      }catch (err: any) {
      setError(err);
    }
    console.log(error)
  }
  
  
  return (
    <>
      {props.isOpen && (
          <div
            className="flex justify-center dark:bg-darker/50 absolute bottom-0 left-0 right-0 top-0 z-10 h-full overflow-y-hidden bg-gray-500/50 py-12 transition duration-150 ease-in-out"
            id="modal"
            onKeyDown={keyDownHandler}
          >
          <div
              className={`absolute inset-y-0 z-10 w-full h-full bg-primary-darker opacity-50 `}
              onClick={()=>handleCancel()}
          ></div>
            <div
              role="alert"
              className="absolute mx-auto h-5/6 w-11/12 z-20 max-w-lg overflow-y-auto md:w-2/3"
            >
              <div className="dark:bg-dark rounded-md border border-gray-400 bg-white px-5 py-8 shadow-md dark:border-gray-700 md:px-10">
                <form onSubmit={handleSubmit}>
                <div className=" mb-3 flex w-full justify-start text-gray-600">
                  <svg
                    className="h-5 w-5"
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
                </div>
                <h1 className="dark:text-light font-lg mb-4 font-bold leading-tight tracking-normal text-gray-800">
                  Upload New Image:
                </h1>
                <div className="flex flex-row">
                  <div>
                    <label className="dark:text-light text-sm font-bold leading-tight tracking-normal text-gray-800">
                      Image Name
                    </label>
                    <input
                      onChange={(e) => setImageName(e.target.value)}
                      type="text"
                      id="name"
                      className="dark:bg-primary dark:text-light focus:ring-primary mb-5 mr-5 mt-2 flex h-10 w-80 items-center rounded  border border-gray-300 pl-3 text-sm font-normal text-gray-600 placeholder-gray-400 focus:outline-none focus:ring dark:border-gray-700 dark:placeholder-gray-200"
                      placeholder="Enter image name"
                    />
                  </div>
          
                </div>
                <div></div>
                <label htmlFor="usernameInput" className="dark:text-light text-sm font-bold leading-tight tracking-normal text-gray-800">
                  Upload Image
                </label>
                <div
                  className={`mb-5 pt-3 flex items-center justify-center`}
                >
                  <div className="space-y-2">
                    <label className="group block cursor-pointer rounded-lg border-2 border-dashed border-gray-200 p-4 text-center focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:border-gray-700 sm:p-7">
                      <input
                        id="imageInput"
                        name="af-submit-app-upload-images"
                        type="file"
                        className="sr-only"
                        onChange={(e) => setImageUpload(e.target.files?.[0] ?? null)}
                      />
                      <svg
                        className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-600"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"
                        />
                        <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
                      </svg>
                      <span className="mt-2 block text-sm text-gray-800 dark:text-gray-200">
                        Browse your device or{" "}
                        <span className="text-blue-600 group-hover:text-blue-700">
                          drag n drop
                        </span>
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        Maximum file size is 2 MB
                      </span>
                    </label>
                  </div>
                </div>
                
                <div className="flex w-full items-center justify-start">
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark focus:ring-primary dark:focus:ring-offset-dark rounded-md px-8 py-2 text-sm text-white focus:outline-none focus:ring focus:ring-offset-1 focus:ring-offset-white"
                  >
                    Upload
                  </button>
                  <button
                    className="dark:bg-primary-darker dark:text-light hover:text-lighter hover:bg-primary ml-3 rounded border px-8 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
                </form>

                <button
                  className="absolute right-0 top-0 mr-5 mt-4 cursor-pointer rounded text-gray-400 transition duration-150 ease-in-out hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  onClick={props.toggle}
                  aria-label="close modal"
                  role="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-x"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
      )}
    </>
  );
}


ImagePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
  }

export default ImagePage
