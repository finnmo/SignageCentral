import Pusher from 'pusher-js';
import React, {useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Display = () => {

  const router = useRouter();
  const { id } = router.query;
  const [currentImage] = useState("");
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

  
  

  if(!currentImage) return null;

  return (
    <div className="flex w-full h-full justify-center align-middle border">
      <div className='flex'>
        <h2 className="p-10 border-4 border-black">Notifications</h2>
      </div>
      {id}
          <Image src={currentImage} width={200} height={100} alt="image" />
          {pusherText}
    </div>
  );
};

export default Display;