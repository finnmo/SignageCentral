import React, { useMemo, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from "leaflet";

const DefaultIcon = L.icon({
    iconUrl: '/assets/marker-icon.png',
    shadowUrl: '/assets/marker-shadow.png'
});

type Props = {
   latitude: number, 
   setLatitude: React.Dispatch<React.SetStateAction<number>>
   longitude: number,
   setLongitude: React.Dispatch<React.SetStateAction<number>>,
  }; 

const MapChartAddSign: React.FunctionComponent<{latitude: number, setLatitude: React.Dispatch<React.SetStateAction<number>> ,longitude: number, setLongitude: React.Dispatch<React.SetStateAction<number>>}>=(props: Props) =>{
      function DraggableMarker() {
        L.Marker.prototype.options.icon = DefaultIcon;
        
        const markerRef = useRef<L.Marker>(null)
        const eventHandlers = useMemo(
          () => ({
            dragend() {
              const marker = markerRef.current
              if (marker != null) {
                props.setLatitude(marker.getLatLng().lat)
                props.setLongitude(marker.getLatLng().lng)
              }
            },
          }),
          [],
        )
        return (
          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={[props.latitude, props.longitude]}
            ref={markerRef}>
          </Marker>
        )
    }

    return (
        <MapContainer className="h-full w-full" center={[-32.005760548213935,115.8936261719052]} zoom={13} scrollWheelZoom={true}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
          <DraggableMarker></DraggableMarker>
        </MapContainer>
    )
}
export default MapChartAddSign
