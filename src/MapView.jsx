import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

/* ─────────────────────────────────────────────
   WOLT-STYLE PIN  —  MapLibre custom marker
───────────────────────────────────────────── */
function createPin(listingId) {
  const el = document.createElement("div");
  el.className = "vryfid-pin";
  el.style.cssText = "width:58px;height:74px;cursor:pointer;";
  const fid = `mpf${listingId}`;
  el.innerHTML = `
    <svg viewBox="0 0 58 74" width="58" height="74" xmlns="http://www.w3.org/2000/svg" overflow="visible">
      <defs>
        <filter id="${fid}" x="-60%" y="-30%" width="220%" height="190%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#0D2144" flood-opacity="0.45"/>
        </filter>
      </defs>
      <path d="M29 3C15.193 3 4 14.193 4 28C4 44.5 29 71 29 71C29 71 54 44.5 54 28C54 14.193 42.807 3 29 3Z"
            fill="#1B3A6B" filter="url(#${fid})"/>
      <circle cx="29" cy="28" r="12.5" fill="white"/>
      <circle cx="29" cy="28" r="4.5" fill="#1B3A6B" opacity="0.2"/>
    </svg>`;
  return el;
}

function flyTo(map, listing) {
  map.flyTo({
    center: [listing.lng, listing.lat],
    zoom: 15.5,
    pitch: 55,
    bearing: -17.6,
    duration: 2400,
    essential: true,
    curve: 1.3,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
}

/* ─────────────────────────────────────────────
   3D MAP
───────────────────────────────────────────── */
export default function MapView({ listing, isPrimary = true }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const listingRef = useRef(listing);
  listingRef.current = listing;

  /* ── Init once ── */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/positron",
      center: [listing.lng, listing.lat],
      zoom: 15.5,
      pitch: 55,
      bearing: -17.6,
      antialias: true,
      attributionControl: false,
    });

    mapRef.current = map;

    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");
    map.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), "bottom-right");

    map.on("load", () => {
      const style = map.getStyle();

      /* tint water sky-blue to match brand */
      style.layers.forEach((l) => {
        if (l["source-layer"] === "water" && l.type === "fill") {
          try { map.setPaintProperty(l.id, "fill-color", "#BFDBFE"); } catch {}
        }
      });

      /* kill flat 2D building fills — we replace with 3D */
      style.layers.forEach((l) => {
        if (l["source-layer"] === "building" && l.type === "fill") {
          try { map.setLayoutProperty(l.id, "visibility", "none"); } catch {}
        }
      });

      /* find the vector tile source */
      const srcId = Object.keys(style.sources).find(
        (id) => style.sources[id].type === "vector"
      );

      if (srcId) {
        /* ── 3D building extrusions — navy gradient by height ── */
        map.addLayer(
          {
            id: "vryfid-buildings-3d",
            type: "fill-extrusion",
            source: srcId,
            "source-layer": "building",
            paint: {
              "fill-extrusion-color": [
                "interpolate", ["linear"],
                ["coalesce", ["get", "render_height"], ["get", "height"], 8],
                0,   "#D4E5F7",
                25,  "#A8C8E8",
                60,  "#6699CC",
                120, "#3D6BC4",
                220, "#2A5298",
                350, "#1B3A6B",
                600, "#0D2144",
              ],
              "fill-extrusion-height": [
                "coalesce", ["get", "render_height"], ["get", "height"], 8,
              ],
              "fill-extrusion-base": [
                "coalesce", ["get", "render_min_height"], 0,
              ],
              "fill-extrusion-opacity": 0.9,
            },
          },
          /* insert before labels so text sits on top */
          style.layers.find((l) => l.type === "symbol")?.id
        );
      }

      /* drop initial marker */
      const el = createPin(listingRef.current.id);
      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([listingRef.current.lng, listingRef.current.lat])
        .addTo(map);
      markerRef.current = marker;
    });

    return () => {
      if (markerRef.current) { markerRef.current.remove(); markerRef.current = null; }
      map.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line

  /* ── Fly to + swap marker when listing changes ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const swap = () => {
      /* remove old marker */
      if (markerRef.current) { markerRef.current.remove(); markerRef.current = null; }

      /* fly */
      flyTo(map, listing);

      /* add new marker at destination — pin bounces in while camera travels */
      const el = createPin(listing.id);
      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([listing.lng, listing.lat])
        .addTo(map);
      markerRef.current = marker;
    };

    if (map.loaded()) swap();
    else map.once("load", swap);
  }, [listing.id]); // eslint-disable-line

  const { street, neighborhood, price, period } = listing;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: 22,
        height: 560,
        boxShadow: "0 32px 80px rgba(27,58,107,0.22), 0 8px 24px rgba(0,0,0,0.1)",
      }}
    >
      {/* map canvas */}
      <div ref={containerRef} className="vryfid-map" style={{ width: "100%", height: "100%" }} />

      {/* cinematic vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 115% 115% at 50% 38%, transparent 48%, rgba(13,33,68,0.14) 100%)",
          zIndex: 2,
        }}
      />

      {/* bottom gradient so card reads cleanly */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: 160,
          background: "linear-gradient(to top, rgba(255,255,255,0.7) 0%, transparent 100%)",
          zIndex: 3,
        }}
      />

      {/* floating address card */}
      <div className="absolute bottom-4 left-4 right-4" style={{ zIndex: 10 }}>
        <div
          className="vryfid-card-up flex items-center justify-between gap-4 px-5 py-4 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.75)",
            boxShadow: "0 8px 32px rgba(27,58,107,0.14), 0 1px 0 rgba(255,255,255,0.9) inset",
          }}
        >
          <div className="min-w-0">
            <p className="text-[#1B3A6B] font-semibold text-base leading-snug truncate">{street}</p>
            <p className="text-slate-400 text-sm mt-0.5">
              {neighborhood}&ensp;·&ensp;
              <span className="text-[#1B3A6B] font-medium">{price}</span>
              {period}
            </p>
          </div>
          <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#1B3A6B] text-white whitespace-nowrap">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {isPrimary ? "#1 Match" : "Also Consider"}
          </span>
        </div>
      </div>
    </div>
  );
}
