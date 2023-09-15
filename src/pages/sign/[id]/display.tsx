import axios, {type  AxiosResponse } from 'axios';
import Pusher from 'pusher-js';
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Display = () => {

  const router = useRouter();
  const { id } = router.query;
  const [currentImage, setCurrentImage] = useState("");
  const [pusherText, setPusherText] = useState("");

  Pusher.logToConsole = true;

  const pusher = new Pusher("78f4b7bfbca901f54507", {
    cluster: "ap4",
  });

  const channel = pusher.subscribe("my-channel");

  channel.bind("my-event", (data: string) => {
    // Method to be dispatched on trigger.
    setPusherText(data);
  });

  const getData = useCallback(async () => {
    try {
      setCurrentImage(await axios.get(`http://localhost:3001/api/sign/${id}/currentImage`));
    } catch (error) {
      console.error(error);
    }
  }, [id]);
  
  

  const handleClick = async (): Promise<void> => {
    try {
      await getData();
    } catch (error) {
      // Handle the error here, e.g., log it or display an error message.
      console.error(error);
    }
  };
  
  useEffect(() => {
    async function fetchData() {
      try {
        await getData();
        // Any additional logic you want to perform after getData() completes successfully.
      } catch (error) {
        // Handle errors from getData() here.
        console.error(error);
      }
    }
  
    fetchData();
  }, [getData]);
  
  

  if(!currentImage) return null;

  return (
    <div onClick={handleClick} className="flex w-full h-full justify-center align-middle border">
      <div className='flex'>
        <h2 className="p-10 border-4 border-black">Notifications</h2>
      </div>
          <Image src={currentImage} width={200} height={100} alt="image" />
          {pusherText}
    </div>
  );
};

export default Display;