import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

/* ─────────────────────────────────────────────
   MARKER CREATORS
───────────────────────────────────────────── */

/** Large Wolt-style teardrop — used for the currently-viewed listing */
function createWoltPin(listingId) {
  const el = document.createElement("div");
  el.className = "vryfid-pin";
  // tip sits exactly at bottom-center of the 58×74 bounding box
  el.style.cssText = "width:58px;height:74px;cursor:pointer;";
  const fid = `mpf${listingId}`;
  el.innerHTML = `
    <svg viewBox="0 0 58 74" width="58" height="74"
         xmlns="http://www.w3.org/2000/svg" overflow="visible">
      <defs>
        <filter id="${fid}" x="-60%" y="-20%" width="220%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="8"
            flood-color="#0D2144" flood-opacity="0.5"/>
        </filter>
      </defs>
      <!-- body: tip ends at (29,74) — exactly the anchor point -->
      <path d="M29 3
               C14.64 3 3 14.64 3 29
               C3 45 29 74 29 74
               C29 74 55 45 55 29
               C55 14.64 43.36 3 29 3 Z"
            fill="#1B3A6B" filter="url(#${fid})"/>
      <!-- white inner circle -->
      <circle cx="29" cy="29" r="13" fill="white"/>
      <!-- subtle navy centre dot -->
      <circle cx="29" cy="29" r="4.5" fill="#1B3A6B" opacity="0.22"/>
    </svg>`;
  return el;
}

/** Small numbered circle — for the #2 / #3 ranked listings */
function createNumberPin(rank, listingId) {
  const el = document.createElement("div");
  el.className = "vryfid-num-pin";
  el.dataset.rank = rank;
  const fid = `nf${listingId}`;
  el.style.cssText = "width:36px;height:46px;cursor:pointer;";
  // tear drop but smaller with a rank number inside
  el.innerHTML = `
    <svg viewBox="0 0 36 46" width="36" height="46"
         xmlns="http://www.w3.org/2000/svg" overflow="visible">
      <defs>
        <filter id="${fid}" x="-60%" y="-20%" width="220%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="5"
            flood-color="#0D2144" flood-opacity="0.4"/>
        </filter>
      </defs>
      <path d="M18 2
               C9.16 2 2 9.16 2 18
               C2 29 18 44 18 44
               C18 44 34 29 34 18
               C34 9.16 26.84 2 18 2 Z"
            fill="white" stroke="#1B3A6B" stroke-width="2.5"
            filter="url(#${fid})"/>
      <text x="18" y="23" text-anchor="middle"
            font-family="Outfit,system-ui,sans-serif"
            font-size="14" font-weight="700"
            fill="#1B3A6B">#${rank}</text>
    </svg>`;
  return el;
}

/* ─────────────────────────────────────────────
   FLY HELPERS
───────────────────────────────────────────── */
const NYC_CAMERA = { pitch: 45, bearing: 0, zoom: 15.5 };

function flyTo(map, listing) {
  map.flyTo({
    center: [listing.lng, listing.lat],
    ...NYC_CAMERA,
    duration: 2200,
    essential: true,
    curve: 1.2,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
}

/* ─────────────────────────────────────────────
   MAP COMPONENT
───────────────────────────────────────────── */
export default function MapView({ listing, ranked = [], isPrimary = true, onSelect }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]); // all active markers
  const listingRef = useRef(listing);
  listingRef.current = listing;

  /* ── Build / refresh all markers ── */
  function refreshMarkers(map, viewingId) {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const targets = ranked.length > 0 ? ranked.slice(0, 3) : [listing];

    targets.forEach((l, i) => {
      const isViewing = l.id === viewingId;
      const el = isViewing ? createWoltPin(l.id) : createNumberPin(i + 1, l.id);

      if (!isViewing && onSelect) {
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onSelect(l);
        });
      }

      const marker = new maplibregl.Marker({
        element: el,
        anchor: "bottom", // pin tip / circle bottom at the lng/lat
        offset: [0, 0],
      })
        .setLngLat([l.lng, l.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }

  /* ── Initialize once ── */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/positron",
      center: [listingRef.current.lng, listingRef.current.lat],
      ...NYC_CAMERA,
      antialias: true,
      attributionControl: false,
    });

    mapRef.current = map;

    map.addControl(
      new maplibregl.AttributionControl({ compact: true }), "bottom-left"
    );
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }),
      "bottom-right"
    );

    map.on("load", () => {
      const style = map.getStyle();

      /* tint water to match brand sky-blue */
      style.layers.forEach((l) => {
        if (l["source-layer"] === "water" && l.type === "fill") {
          try { map.setPaintProperty(l.id, "fill-color", "#BFDBFE"); } catch {}
        }
      });

      /* hide flat 2D building fills */
      style.layers.forEach((l) => {
        if (l["source-layer"] === "building" && l.type === "fill") {
          try { map.setLayoutProperty(l.id, "visibility", "none"); } catch {}
        }
      });

      /* find the vector source */
      const srcId = Object.keys(style.sources).find(
        (id) => style.sources[id].type === "vector"
      );

      if (srcId) {
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
              "fill-extrusion-opacity": 0.88,
            },
          },
          style.layers.find((l) => l.type === "symbol")?.id
        );
      }

      refreshMarkers(map, listingRef.current.id);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line

  /* ── Swap markers + fly when viewed listing changes ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const swap = () => {
      flyTo(map, listing);
      refreshMarkers(map, listing.id);
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
        height: 540,
        boxShadow: "0 28px 72px rgba(27,58,107,0.22), 0 8px 24px rgba(0,0,0,0.1)",
      }}
    >
      <div ref={containerRef} className="vryfid-map" style={{ width: "100%", height: "100%" }} />

      {/* cinematic vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 115% 115% at 50% 38%, transparent 48%, rgba(13,33,68,0.12) 100%)",
        zIndex: 2,
      }} />

      {/* bottom fade behind card */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{
        height: 160,
        background: "linear-gradient(to top, rgba(255,255,255,0.75) 0%, transparent 100%)",
        zIndex: 3,
      }} />

      {/* floating address card */}
      <div className="absolute bottom-4 left-4 right-4" style={{ zIndex: 10 }}>
        <div
          className="vryfid-card-up flex items-center justify-between gap-4 px-5 py-4 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.9)",
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
