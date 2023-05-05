import React, {useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from "leaflet";
import { Sign } from "@prisma/client";


const DefaultIcon = L.icon({
    iconUrl: '/assets/marker-icon.png',
    shadowUrl: '/assets/marker-shadow.png'
});
type Props = {
    allSigns: Sign[]
}; 

const MapChartAllSigns: React.FunctionComponent<{allSigns: Sign[]}>=( props: Props) =>{

    const [isOnLineChart, setIsOnLineChart] = useState(false);

    return (
        <div className="col-span-2 bg-white rounded-md dark:bg-darker" x-data="{ isOn: false }">
            <div className="flex items-center justify-between p-4 border-b dark:border-primary">
            <h4 className="text-lg font-semibold text-gray-500 dark:text-light">Map</h4>
            <div className="flex items-center">
                <button
                className="relative focus:outline-none"
                //x-cloak
                onClick={()=>setIsOnLineChart}
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

            <MapContainer className="h-full w-full" center={[-32.005760548213935,115.8936261719052]} zoom={15} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className='map-tiles'
                />
                {...props.allSigns?.map((sign: Sign) => (
                <Marker
                    position={[sign.latitude, sign.longitude]}
                    icon={DefaultIcon}>
                    <Popup>
                        Sign {sign.number} <br /> {sign.name}
                    </Popup>
                </Marker>
                ))}
            </MapContainer>
            
            </div>
        </div>
    )
}
export default MapChartAllSigns
