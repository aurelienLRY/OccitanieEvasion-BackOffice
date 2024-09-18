"use client";

/*
 * src/components/mapCustomer.tsx
 * Component to display a map with markers for each spot
 * code: @aurelienLRY
 */

/* librairie react */
import { useEffect } from "react";

/* librairie leaflet */
import { MapContainer, TileLayer, Marker,  } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngBounds , icon } from "leaflet";

/* Types */
import { ISpot } from "@/types";

/**
 * Component to display a map with markers for each spot.
 * @param spots - The spots to be displayed on the map.
 */
function MapCustomer({ spot }: { spot: ISpot | null }) {

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("window is defined");
    }
    // Retourner undefined au lieu de null
    return undefined;
  }, []);

  if (spot === null) return null;

  const coordinates = convertGpsCoordinates(spot.gpsCoordinates);   
  return (
    <MapContainer center={coordinates} zoom={15} className="w-full h-full min-h-[300px] rounded-md z-0">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={coordinates} icon={Icon}></Marker>
    </MapContainer>
  );
}

/**
 * Converts GPS coordinates from a string format to an array format.
 * @param gpsCoordinates - The GPS coordinates in string format (e.g., "latitude,longitude").
 * @returns The GPS coordinates in array format [latitude, longitude].
 */
function convertGpsCoordinates(gpsCoordinates: string): [number, number] {
  const gps = gpsCoordinates.split(",");
  return [parseFloat(gps[0]), parseFloat(gps[1])];
}

 const Icon = icon({
  iconUrl: "/img/Marker.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});



// Export the component using `dynamic` to disable server-side rendering
export default MapCustomer;
