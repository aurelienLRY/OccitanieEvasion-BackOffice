"use client";

/*
 * src/components/mapCustomer.tsx
 * Component to display a map with markers for each spot
 * code: @aurelienLRY
 */

/* librairie react */
import { useEffect } from "react";

/* librairie leaflet */
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngBounds , icon } from "leaflet";

/* Types */
import { ISpot } from "@/types";

/**
 * Component to display a map with markers for each spot.
 * @param spots - The spots to be displayed on the map.
 */
function MapCustomer({ spot }: { spot: ISpot  }) {

  if(typeof window !== 'undefined') {


  const coordinatesWeb = convertGpsCoordinates(spot.gpsCoordinates);
  const coordinatesMeetingHalf_day = spot.meetingPoint?.half_day ? convertGpsCoordinates(spot.meetingPoint.half_day) : null;
  const coordinatesMeetingFull_day = spot.meetingPoint?.full_day ? convertGpsCoordinates(spot.meetingPoint.full_day) : null;
  return (
    <MapContainer center={coordinatesWeb} zoom={14} className="w-full h-full min-h-[300px] rounded-md z-0">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={coordinatesWeb} icon={IconWeb}>
        <Popup>
          <p>{spot.name}</p>

        </Popup>
      </Marker>
      {coordinatesMeetingHalf_day && (
        <Marker position={coordinatesMeetingHalf_day} icon={IconMeetingHalfDay}>
          <Popup>
              <p>Point de rendez-vous demi-journée</p>
          </Popup>
        </Marker>
      )}
      {coordinatesMeetingFull_day && (
        <Marker position={coordinatesMeetingFull_day} icon={IconMeetingFullDay}>
          <Popup>
            <p>Point de rendez-vous pleine journée</p>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );}
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

 const IconWeb = icon({
  iconUrl: "/img/Marker-web.png",
  iconSize: [75, 100],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
 const IconMeetingHalfDay = icon({
  iconUrl: "/img/Marker-meeting_half.png",
  iconSize: [75, 100],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
 const IconMeetingFullDay = icon({
  iconUrl: "/img/Marker-meeting_full.png",
  iconSize: [75, 100],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});



// Export the component using `dynamic` to disable server-side rendering
export default MapCustomer;
