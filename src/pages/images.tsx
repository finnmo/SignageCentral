import { type ReactNode, useState, type ReactElement, useEffect   } from "react";
import Layout from "~/layouts/Layout";
import type { NextPageWithLayout } from "./_app";
import React from 'react'
import Image from 'next/image'
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { api } from "~/utils/api";
import useModal from "~/server/helpers/modals/useModal";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { storage } from "../server/api/firebase";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import 'firebase/compat/firestore';
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { closeModal, openModal, URLModal } from "react-url-modal";
import DurationPicker from "~/components/DurationPicker";
import type { RollingImage } from "@prisma/client";


const ImagePage: NextPageWithLayout = () => {
  const {data, isLoading} = api.image.getAll.useQuery();
  const { isOpen, toggle } = useModal();
  
  if (isLoading) return (
    <div className="p-5 flex flex-row justify-center items-center">
    <LoadingSpinner size={40}/>
    </div>
)
  if(!data) return <div className="top-0 right-0 ml-6 mt-3" >Something went wrong...</div>

  const handleOpenModal = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e.currentTarget.getAttribute('data-key'))
    try {
      void (async () => {
        await openModal({
          name: 'EditImageModal',
          params: {
            imageId: e.currentTarget.getAttribute('data-key')
          },
        });
      })()
      // The code here will only execute after the modal is closed (resolved state)
      console.log('Modal opened.');
    } catch (error) {
      // Handle any errors that occur during the modal operation (rejected state)
      console.error('Modal error:', error);
    }
  };
  
  return  (
  <>
<div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker z-10">
  <h1 className="text-2xl font-semibold">{`Rolling Images`}</h1>
</div>

<div className="mt-2">
    <URLModal
      modals={{
        EditImageModal: EditImageModal,
        DeleteImageModal: DeleteImageModal,
      }}
    />
  <div className="grid grid-flow-row md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-2 2xl:grid-cols-4 mr-10 pb-4 ml-10">
    <div onClick={toggle} className="cursor-pointer col-span-1 ml-4 mb-6 border-2 min-h-[430px] max-w-[315px] min-w-[215px] border-gray-400 rounded-lg dark:bg-darker flex flex-col items-center justify-center max-h-[40%]">

    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" strokeWidth="0.5" stroke="gray" className="w-40 h-40">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 0v29m15-15h-30" />
    </svg>
      <a className="text-xl pt-20 text-gray-500">Upload New Image</a>
    </div>
    <AddImageModal isOpen={isOpen} toggle={toggle}></AddImageModal>
    {...data?.map((image) => (
      <div onClick={handleOpenModal} key={image.id} data-key={image.id} className="cursor-pointer grid-flow-row auto-rows-max ml-4 mb-10 col-span-1 max-w-[315px] min-w-[215px] min-h-[430px] dark:bg-primary-dark bg-white rounded-lg dark:bg-darker pb-5 max-h-[430px]">
    <ImageCard  image={image}/>
    </div>
    ))}
  </div>
</div>
</>
)
}

const ImageCard: React.FunctionComponent<{ image: RollingImage }> = ({ image }) => {
  const [isOn, setIsOn] = useState(true);

  const handleOpenDeleteModal = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    console.log(e.currentTarget.getAttribute('data-key'))
    try {
      void (async () => {
        await openModal({
          name: 'DeleteImageModal',
          params: {
            imageId: e.currentTarget.getAttribute('data-key')
          },
        });
      })()
      // The code here will only execute after the modal is closed (resolved state)
      console.log('Modal opened.');
    } catch (error) {
      // Handle any errors that occur during the modal operation (rejected state)
      console.error('Modal error:', error);
    }
  };

  
  return(
    <>
     <URLModal
      modals={{
        DeleteImageModal: DeleteImageModal,
      }}
    />
    <div className="w-full h-10 pt-2 pb-2 relative">
    <span className="p-4 relative justify-center items-center text-xl ">{image.imageName}</span>
      <button  key={image.id} data-key={image.id} className=" cursor-pointer absolute right-2 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600"  aria-label="close modal" role="button"
      onClick={handleOpenDeleteModal}
      >
          <svg  xmlns="http://www.w3.org/2000/svg"  className="icon icon-tabler icon-tabler-x" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" />
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
      </button>
    </div>
    <div className="flex w-full h-[80%] dark:bg-primary-darker bg-white p-4 border-b border-t border-gray-200 dark:border-primary ">
      <div className="w-full h-full justify-center items-center relative">

          <Image src={image.imageUrl} fill={true} alt="rollingimages1" />
        </div>
      </div>
      <div className="flex w-full h-12">
        <div className="flex justify-start m-5 items-center w-full bg-white dark:bg-primary-dark rounded-lg text-md">
          00:00:30
        </div>
      <div className="flex justify-end items-center  w-full h-12 bg-white dark:bg-primary-dark rounded-lg">
        <button className="relative pr-4 focus:outline-none" onClick={() => setIsOn(!isOn)}>
          <div
              className="w-12 h-6 transition rounded-full outline-none bg-primary-100 dark:bg-primary-darker"></div>

          <div className={`absolute top-0 left-0 inline-flex items-center justify-center w-6 h-6 transition-all duration-200 ease-in-out transform scale-110 rounded-full shadow-lg ${
                isOn ? "translate-x-6 bg-primary-light dark:bg-primary" : "translate-x-0  bg-white dark:bg-primary-100"
              }`}   
          ></div>
        </button>
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
      toast.success("Image uploaded successfully!");
      handleCancel();
      void ctx.image.invalidate();
    },
    onError: () => {
      toast.error("Error occured while adding image");
    }
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUpload, setImageUpload] = useState<File | null>(null); 
  const [imageName, setImageName] = useState("");
  const [progresspercent, setProgresspercent] = useState(0);
  const [processingState, setProcessingState] = useState(false);
  const [durationHour, setDurationHour] = useState(0);
  const [durationMinute, setDurationMinute] = useState(0);
  const [durationSecond, setDurationSecond] = useState(0);

  const handleCancel = () => {
    props.toggle();
    setImageName("");
    setImageUpload(null);
    setProgresspercent(0);
    setProcessingState(false);
    setImagePreview(null);
    setDurationHour(0);
    setDurationMinute(0);
    setDurationSecond(0);
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

  const onSubmit = (event: React.FormEvent<ImageFormElement>) =>{
    event.preventDefault();
  
    if (!imageUpload) {
      toast.error("Please select an image to upload");
      return;
    } else if (!imageName) {
      toast.error("Please enter an image name");
      return;
    }
    setProcessingState(true);
  
    try {
        const auth = getAuth();
        void (async () => {
          const firebaseToken = await getToken({ template: "integration_firebase" });
          if (!firebaseToken) {
            toast.error("Authentication Error");
            return;
          }
          await signInWithCustomToken(auth, firebaseToken);
        })()  
        // Signed in
          const storageRef = ref(storage, `files/${imageName}`);
          const uploadTask = uploadBytesResumable(storageRef, imageUpload);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgresspercent(progress);
          },
          (error) => {
            alert(error);
            toast.error("Error uploading image");
          },
          void (async () => {
            await uploadTask;
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            mutate({ imageName: imageName, imageUrl: downloadURL, durationHour: durationHour, durationMinute: durationMinute, durationSecond: durationSecond });
          })()
        );
      } catch (error) {
        // Handle the error that occurs during sign-in or upload
        if (error instanceof Error) {
          console.log(error.message); // Log the error message here
          toast.error("Error uploading image");
        }
      }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageName(event.target.value)
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Read the file and set it as the image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      // Set the uploaded image to state for further processing
      setImageUpload(file);
    } else {
      setImagePreview(null);
      setImageUpload(null);
    }
  };
  
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
              <div className="dark:bg-dark rounded-md border border-gray-400 bg-white px-5 py-8  dark:border-gray-700 md:px-10">
                <form onSubmit={onSubmit}>
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
                      onChange={handleChange}
                      type="text"
                      id="name"
                      className="dark:bg-primary dark:text-light focus:ring-primary mb-5 mr-5 mt-2 flex h-10 w-80 items-center rounded  border border-gray-300 pl-3 text-sm font-normal text-gray-600 placeholder-gray-400 focus:outline-none focus:ring dark:border-gray-700 dark:placeholder-gray-200"
                      placeholder="Enter image name"
                    />
                  </div>
          
                </div>
                <DurationPicker durationHours={durationHour} setDurationHours={setDurationHour} durationMinutes={durationMinute} setDurationMinutes={setDurationMinute} durationSeconds={durationSecond} setDurationSeconds={setDurationSecond}></DurationPicker>
                <div></div>

                <label htmlFor="usernameInput" className="dark:text-light text-sm font-bold leading-tight tracking-normal text-gray-800">
                  Upload Image
                </label>
                <div className={`${processingState ? '' : 'hidden'}`}>
                <div className={`flex justify-between mb-1`}>
                  <span className="text-base font-medium text-light dark:text-white"></span>
                  <span className="text-sm font-medium text-primary-dark dark:text-primary-light">{progresspercent}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div className={`bg-primary-light dark:bg-primary-dark h-2.5 rounded-full w-[${progresspercent}%]`}></div>
                </div>
                </div>

                <div
                  className={`mb-5 pt-3 flex items-center justify-center`}
                >
                  <div className={`${processingState ? 'hidden' : ''} space-y-2`}>
                    <label className="group block cursor-pointer rounded-lg border-2 border-dashed border-gray-200 p-4 text-center focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:border-gray-700 sm:p-7">
                      <input
                        id="imageInput"
                        name="af-submit-app-upload-images"
                        type="file"
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                      {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Image Preview"
                        className="mx-auto h-32 object-cover"
                        width={128}
                        height={128}
                      />
                    ) : (
                      <>
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
                      <span className="mt-2 block text-sm text-gray-800 dark:text-light">
                        Browse your device or{" "}
                        <span className="text-primary-light group-hover:text-primary-dark">
                          drag n drop
                        </span>
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        Maximum file size is 2 MB
                      </span>
                      </>
                      )}
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
                  onClick={handleCancel}
                    className="dark:bg-primary-darker dark:text-light hover:text-lighter hover:bg-primary ml-3 rounded border px-8 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
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


const EditImageModal = ({
    params,
  }: {
    params: { [imageId: string]: string },
  }) => {
  
    const ctx = api.useContext();

  const { data, isLoading } = api.image.getById.useQuery({
    id: params.imageId || "",
  });


  const [imageName, setImageName] = useState("");
  const [durationHour, setDurationHour] = useState(0);
  const [durationMinute, setDurationMinute] = useState(0);
  const [durationSecond, setDurationSecond] = useState(0);

  const { mutate } = api.image.update.useMutation(
    {
      onSuccess: () => {
          handleCancel();
          void ctx.image.getAll.invalidate();
          void ctx.image.getById.invalidate();
          toast.success("Image updated successfully");
      },
      onError: (error) => {
        console.log(error.data)
        const errorMessage = error.data?.zodError?.fieldErrors.content;
        if(errorMessage && errorMessage[0]){
          toast.error(errorMessage[0]);
        }else{
          toast.error("An error occured, failed to update");
        }
      },
    }
    );

  const handleCancel = () => {
    setImageName("");
    try {
      void (async () => {
        await closeModal();
      })()
      // The code here will only execute after the modal is closed (resolved state)
      console.log('Modal closed.');
    } catch (error) {
      // Handle any errors that occur during the modal operation (rejected state)
      console.error('Modal error:', error);
    }
  };

  const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(event.code);
    if (event.code === "Escape") {
      try {
        void (async () => {
          await closeModal();
        })()
        // The code here will only execute after the modal is closed (resolved state)
        console.log('Modal closed.');
      } catch (error) {
        // Handle any errors that occur during the modal operation (rejected state)
        console.error('Modal error:', error);
      }
    }
  }

  interface FormElements extends HTMLFormControlsCollection {
    imageInput: HTMLInputElement
  }
  interface ImageFormElement extends HTMLFormElement {
    readonly elements: FormElements
  }

  const onSubmit = (event: React.FormEvent<ImageFormElement>) =>{
    event.preventDefault();
  }
  

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageName(event.target.value)
  }

  const handleUpdate = () => {
    if(data?.id && imageName.length > 0){
      mutate(
        {
          id: data.id,
          imageName: imageName,
          imageUrl: data.imageUrl,
          createdAt: data.createdAt,
          uploadedBy: data.uploadedBy,
          durationHour: data.durationHour,
          durationMinute: data.durationMinute,
          durationSecond: data.durationSecond,
        },
        {
          onSuccess: () => {
            handleCancel();
          },
        }
      );
    }else{
      toast.error("Image name cannot be empty");
    }
  }

  useEffect(() => {
    // put the fetchData inside the effect
    if(data?.imageName){
      setImageName(data.imageName)
      setDurationHour(data.durationHour)
      setDurationMinute(data.durationMinute)
      setDurationSecond(data.durationSecond)
    }
  },[data]);

  return (
    <>
          <div
            className="flex justify-center dark:bg-darker/50 absolute bottom-0 left-0 right-0 top-0 z-10 h-full overflow-y-hidden bg-gray-500/50 py-12 transition duration-150 ease-in-out"
            id="modal"
            onKeyDown={keyDownHandler}
          >
          <div
              className={`absolute inset-y-0 z-10 w-full h-full rounded-md border bg-primary-darker opacity-50 `}
              onClick={()=>handleCancel()}
          ></div>
            <div
              role="alert"
              className="absolute mx-auto h-5/6 w-11/12 z-20 max-w-lg overflow-y-auto md:w-2/3"
            >
              {!isLoading  ? (
              <div className="dark:bg-dark rounded-md border border-gray-400 bg-white px-5 py-8 shadow-md dark:border-gray-700 md:px-10">
                <form onSubmit={onSubmit}>
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
                  Edit Image:
                </h1>
                <div className="flex flex-row">
                  <div>
                    <label className="dark:text-light text-sm font-bold leading-tight tracking-normal text-gray-800">
                      Image Name
                    </label>
                    <div className="flex w-full">
                    </div>
                    <input
                      onChange={handleChange}
                      type="text"
                      id="name"
                      className="dark:bg-primary dark:text-light focus:ring-primary mb-5 mr-5 mt-2 flex h-10 w-80 items-center rounded  border border-gray-300 pl-3 text-sm font-normal text-gray-600 placeholder-gray-400 focus:outline-none focus:ring dark:border-gray-700 dark:placeholder-gray-200"
                      defaultValue={imageName}
                    />
                  </div>
                </div>
                <div></div>
                <div className="flex flex-row">
                  <div>
                    <label className="dark:text-light text-sm font-bold leading-tight tracking-normal text-gray-800">
                      Playback Duration
                    </label>
                    <div className="flex w-full mt-3 mb-3">
                    <DurationPicker durationHours={durationHour} setDurationHours={setDurationHour} durationMinutes={durationMinute} setDurationMinutes={setDurationMinute} durationSeconds={durationSecond} setDurationSeconds={setDurationSecond}></DurationPicker>
                    </div>
                  </div>
                </div>
                <div></div>
                <label htmlFor="usernameInput" className="dark:text-light text-sm font-bold leading-tight tracking-normal text-gray-800">
                  Image Preview
                </label>
                <div className="flex items-center p-5 justify-center">
                <Image src={data?.imageUrl || ""} width="200" height="200" alt="rollingimages1" />
                </div>
                <div className="flex w-full items-center justify-start">
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark focus:ring-primary dark:focus:ring-offset-dark rounded-md px-8 py-2 text-sm text-white focus:outline-none focus:ring focus:ring-offset-1 focus:ring-offset-white"
                    onClick={handleUpdate}
                  >
                    Update
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
                  onClick={handleCancel}
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
              ) : (
                <div className="dark:bg-dark rounded-md border border-gray-400 bg-white px-5 py-8 shadow-md dark:border-gray-700 md:px-10">
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
                  Edit Image:
                </h1>

                <div className = 'flex align-center justify-center'> <LoadingSpinner/></div>

                  
                  <button
                    className="dark:bg-primary-darker dark:text-light hover:text-lighter hover:bg-primary ml-3 rounded border px-8 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>

                <button
                  className="absolute right-0 top-0 mr-5 mt-4 cursor-pointer rounded text-gray-400 transition duration-150 ease-in-out hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  onClick={handleCancel}
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

              )}
            </div>
          </div>
    </>
  );
}


const DeleteImageModal = ({
  params,
}: {
  params: { [imageId: string]: string },
}) => {

  const ctx = api.useContext();

const { data, isLoading } = api.image.getById.useQuery({
  id: params.imageId || "",
});

const [imageName, setImageName] = useState("");

const { mutate } = api.image.delete.useMutation(
  {
    onSuccess: () => {
        handleCancel();
        void ctx.image.getAll.invalidate();
        void ctx.image.getById.invalidate();
        toast.success("Image deleted");
    },
    onError: (error) => {
      console.log(error.data)
      const errorMessage = error.data?.zodError?.fieldErrors.content;
      if(errorMessage && errorMessage[0]){
        toast.error(errorMessage[0]);
      }else{
        toast.error("An error occured, failed to delete");
      }
    },
  }
  );

const handleCancel = () => {
  try {
    void (async () => {
      await closeModal();
    })()
    // The code here will only execute after the modal is closed (resolved state)
    console.log('Modal closed.');
  } catch (error) {
    // Handle any errors that occur during the modal operation (rejected state)
    console.error('Modal error:', error);
  }
};

  const handleDelete = () => {
    if( data && data.id){
      mutate(
        {
          id: data.id,
        },
        {
          onSuccess: () => {
            handleCancel();
          },
        }
      );
    }else{
      toast.error("Image not found");
    }
  }

  useEffect(() => {
    // put the fetchData inside the effect
    if(data?.imageName){
      setImageName(data.imageName)
    }
  },[data]);

  return (
    <div
    className="flex justify-center dark:bg-darker/50 absolute bottom-0 left-0 right-0 top-0 z-10 h-full overflow-y-hidden bg-gray-500/50 py-12 transition duration-150 ease-in-out"
    id="modal"
  >
    <div
        className={`absolute inset-y-0 z-10 w-full h-full bg-primary-darker opacity-50 `}
        onClick={handleCancel}
    ></div>
      <div id="deleteModal" aria-hidden="true" className="flex h-50 w-100 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
      {!isLoading ? (
      <div className="relative p-4 w-full max-w-md h-full md:h-auto">
          <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
              <button type="button" onClick={handleCancel} className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="deleteModal">
                  <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                  <span className="sr-only">Close modal</span>
              </button>
              <svg className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
              <p className="mb-4 text-gray-500 dark:text-gray-300">{`Are you sure you want to delete ${imageName}?`}</p>
              <div className="flex justify-center items-center space-x-4">
                  <button onClick={handleCancel} data-modal-toggle="deleteModal" type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                      No, cancel
                  </button>
                  <button onClick={handleDelete}  className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                      Yes, I&apos;m sure
                  </button>
              </div>
          </div>
      </div>
      ) : (<div className="relative p-4 w-full max-w-md h-full md:h-auto">
      <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
          <button type="button" className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="deleteModal">
              <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              <span className="sr-only">Close modal</span>
          </button>
          <div className = 'flex align-center justify-center'> <LoadingSpinner/></div>
      </div>
  </div> )}
  </div>
</div>

  )

}

ImagePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
  }

export default ImagePage
