import React, { useEffect, useState } from 'react';


export const Loading = () =>{
    const [loading, setLoading] = useState<boolean>(true);

        //On load run once
useEffect(() => {
    setLoading(false);
}, []);

    return (
    <div
        id="loading"
        className={`fixed inset-0 z-50 flex items-center justify-center text-2xl font-semibold text-white bg-primary-darker ${loading ? "" : "hidden"} `}
        >Loading..... 
    </div>
    )
}