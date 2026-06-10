import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";

/* ─────────────────────────────────────────────
   WOLT-STYLE PIN
   Fat teardrop, navy fill, large white inner circle,
   subtle inner dot, heavy drop-shadow
───────────────────────────────────────────── */
function makePin(listingId) {
  const fid = `psf${listingId}`;
  return L.divIcon({
    className: "",
    html: `
      <div class="vryfid-pin">
        <svg
          viewBox="0 0 58 74"
          width="58"
          height="74"
          xmlns="http://www.w3.org/2000/svg"
          overflow="visible"
        >
          <defs>
            <filter id="${fid}" x="-60%" y="-30%" width="220%" height="190%">
              <feDropShadow
                dx="0" dy="8" stdDeviation="9"
                flood-color="#0D2144" flood-opacity="0.42"
              />
            </filter>
          </defs>
          <!-- Body: fat rounded teardrop -->
          <path
            d="M29 3
               C15.193 3 4 14.193 4 28
               C4 44.5 29 71 29 71
               C29 71 54 44.5 54 28
               C54 14.193 42.807 3 29 3 Z"
            fill="#1B3A6B"
            filter="url(#${fid})"
          />
          <!-- White inner ring (large, Wolt-style) -->
          <circle cx="29" cy="28" r="12.5" fill="white" />
          <!-- Subtle navy centre dot -->
          <circle cx="29" cy="28" r="4.5" fill="#1B3A6B" opacity="0.18" />
        </svg>
      </div>
    `,
    iconSize: [58, 74],
    iconAnchor: [29, 74],
    popupAnchor: [0, -74],
  });
}

/* ─────────────────────────────────────────────
   FLY-TO
───────────────────────────────────────────── */
function FlyTo({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 15, { duration: 1.3, easeLinearity: 0.18 });
  }, [lat, lng, map]);
  return null;
}

/* ─────────────────────────────────────────────
   MAP VIEW
───────────────────────────────────────────── */
export default function MapView({ listing }) {
  const { lat, lng, street, neighborhood, price, period } = listing;
  const icon = useMemo(() => makePin(listing.id), [listing.id]);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: "22px",
        height: "530px",
        boxShadow:
          "0 24px 64px rgba(27,58,107,0.18), 0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      {/* ── Leaflet map ── */}
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        zoomControl={false}
        className="vryfid-map"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />
        <Marker key={listing.id} position={[lat, lng]} icon={icon} />
        <FlyTo lat={lat} lng={lng} />
        <ZoomControl position="bottomright" />
      </MapContainer>

      {/* ── Edge vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[500]"
        style={{
          background:
            "radial-gradient(ellipse 110% 110% at 50% 40%, transparent 52%, rgba(27,58,107,0.10) 100%)",
        }}
      />

      {/* ── Bottom gradient fade (behind card) ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none z-[600]"
        style={{
          background:
            "linear-gradient(to top, rgba(255,255,255,0.55) 0%, transparent 100%)",
        }}
      />

      {/* ── Floating address card (Wolt-style) ── */}
      <div className="absolute bottom-4 left-4 right-4 z-[1000]">
        <div
          className="vryfid-card-up flex items-center justify-between gap-4 px-5 py-4 rounded-2xl"
          style={{
            background: "rgba(255, 255, 255, 0.88)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.75)",
            boxShadow:
              "0 8px 32px rgba(27,58,107,0.14), 0 1px 0 rgba(255,255,255,0.9) inset",
          }}
        >
          <div className="min-w-0">
            <p className="text-[#1B3A6B] font-semibold text-base leading-snug truncate">
              {street}
            </p>
            <p className="text-slate-400 text-sm mt-0.5">
              {neighborhood}&ensp;·&ensp;
              <span className="text-[#1B3A6B] font-medium">{price}</span>
              {period}
            </p>
          </div>
          <span
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: "#1B3A6B", color: "white" }}
          >
            {/* small check icon */}
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            #1 Match
          </span>
        </div>
      </div>
    </div>
  );
}
