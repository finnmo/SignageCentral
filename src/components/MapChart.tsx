import React, {useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from "leaflet";

type Props = {
    latitude: number, 
    longitude: number,
}; 

const DefaultIcon = L.icon({
    iconUrl: '/assets/marker-icon.png',
    shadowUrl: '/assets/marker-shadow.png'
});
 
const MapChart: React.FunctionComponent<{latitude: number, longitude: number}>=(props: Props) =>{

    const [isOnLineChart] = useState(true);
     
    const handleLineChartButton = () => {
        console.log("");
      }

    const [latitude] = useState(props.latitude? props.latitude : 0);
    const [longitude] = useState(props.longitude? props.longitude : 0);

    function CustomMarker() {
        L.Marker.prototype.options.icon = DefaultIcon;
        
        return (

          <Marker
            draggable={false}
            position={[latitude, longitude]}>
          </Marker>
        )
    }

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

            <MapContainer className="h-full w-full" center={[latitude, longitude]} zoom={15} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className='map-tiles'
                />
                <CustomMarker></CustomMarker>
                </MapContainer>

            </div>
        </div>
    )
}
export default MapChart
