import React, {useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

const MapChart: React.FunctionComponent=() =>{
    
    
    const [isOnLineChart] = useState(true);
    useEffect(() => {
      // Client-side-only code
        const computedStyle = getComputedStyle(document.documentElement);
     }, [])
     
  
    const handleLineChartButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log("");
      }
    const position = [51.505, -0.09]

    return (
        <div className="col-span-2 bg-white rounded-md dark:bg-darker" x-data="{ isOn: false }">
            <div className="flex items-center justify-between p-4 border-b dark:border-primary">
            <h4 className="text-lg font-semibold text-gray-500 dark:text-light">Map</h4>
            <div className="flex items-center">
                <button
                className="relative focus:outline-none"
                //x-cloak
                onClick={handleLineChartButton}
                >
                <div
                    className="w-12 h-6 transition rounded-full outline-none bg-primary-100 dark:bg-primary-darker"
                ></div>
                <div
                    className={`absolute top-0 left-0 inline-flex items-center justify-center w-6 h-6 transition-all duration-200 ease-in-out transform scale-110 rounded-full shadow-sm ${
                    isOnLineChart ? "translate-x-6 bg-primary-light dark:bg-primary" : "translate-x-0  bg-white dark:bg-primary-100"
                    }`}   
                ></div>
                </button>
            </div>
            </div>
            <div className="block overflow-hidden p-4 h-72" id="map">

            <MapContainer center={[-32.01683210743635, 115.89311123558154]} zoom={15} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className='map-tiles'
                />
                <Marker position={[-32.005760548213935, 115.8936261719052]}>
                    <Popup>
                    Example Sign <br /> Decription.
                    </Popup>
                </Marker>
                </MapContainer>

            </div>
        </div>
    )
}
export default MapChart
