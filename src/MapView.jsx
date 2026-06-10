import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";

// Custom teardrop pin — navy with white centre dot
const navyPin = L.divIcon({
  className: "",
  html: `<div style="
    position:relative;
    width:36px;
    height:44px;
    filter:drop-shadow(0 4px 12px rgba(27,58,107,.40));
  ">
    <svg viewBox="0 0 36 44" width="36" height="44" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 0C9.163 0 2 7.163 2 16c0 10.5 16 28 16 28S34 26.5 34 16C34 7.163 26.837 0 18 0z"
            fill="#1B3A6B" stroke="white" stroke-width="2.5"/>
      <circle cx="18" cy="16" r="5.5" fill="white"/>
    </svg>
  </div>`,
  iconSize: [36, 44],
  iconAnchor: [18, 44],
  popupAnchor: [0, -44],
});

// Smooth fly-to when coords change
function FlyTo({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 15, { duration: 1.4, easeLinearity: 0.2 });
  }, [lat, lng, map]);
  return null;
}

export default function MapView({ lat, lng }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-xl border border-[#E8E0D5]">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: "420px", width: "100%" }}
      >
        {/* CartoDB Positron — clean, no-label variant for context, labelled for usability */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />
        <Marker position={[lat, lng]} icon={navyPin} />
        <FlyTo lat={lat} lng={lng} />
        <ZoomControl position="bottomright" />
      </MapContainer>
    </div>
  );
}
