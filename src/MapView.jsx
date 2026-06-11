import { useEffect, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

/* ─────────────────────────────────────────────
   BUILDING COLOR — navy gradient by height
───────────────────────────────────────────── */
const BLDG_COLOR = [
  "interpolate", ["linear"],
  ["coalesce", ["get", "render_height"], ["get", "height"], 8],
  0,    "#CBD9EE",
  20,   "#A8C0E0",
  60,   "#6699CC",
  130,  "#3D6BC4",
  240,  "#2A5298",
  380,  "#1B3A6B",
  650,  "#0D2144",
];

/* ─────────────────────────────────────────────
   MARKER ELEMENTS
───────────────────────────────────────────── */
function createWoltPin(id) {
  const el = document.createElement("div");
  el.className = "vryfid-pin";
  el.style.cssText = "width:54px;height:70px;cursor:pointer;";
  const fid = `wf${id}`;
  el.innerHTML = `<svg viewBox="0 0 54 70" width="54" height="70"
      xmlns="http://www.w3.org/2000/svg" overflow="visible">
    <defs>
      <filter id="${fid}" x="-60%" y="-20%" width="220%" height="160%">
        <feDropShadow dx="0" dy="6" stdDeviation="7"
          flood-color="#0D2144" flood-opacity="0.5"/>
      </filter>
    </defs>
    <path d="M27 2C13.75 2 3 12.75 3 26C3 43 27 68 27 68C27 68 51 43 51 26C51 12.75 40.25 2 27 2Z"
          fill="#1B3A6B" filter="url(#${fid})"/>
    <circle cx="27" cy="26" r="12" fill="white"/>
    <circle cx="27" cy="26" r="4.5" fill="#1B3A6B" opacity="0.2"/>
  </svg>`;
  return el;
}

function createNumberBadge(rank, id) {
  const el = document.createElement("div");
  el.className = "vryfid-num-pin";
  el.style.cssText = "width:34px;height:34px;cursor:pointer;";
  const fid = `nf${id}`;
  el.innerHTML = `<svg viewBox="0 0 34 34" width="34" height="34"
      xmlns="http://www.w3.org/2000/svg" overflow="visible">
    <defs>
      <filter id="${fid}" x="-60%" y="-40%" width="220%" height="220%">
        <feDropShadow dx="0" dy="3" stdDeviation="4"
          flood-color="#0D2144" flood-opacity="0.4"/>
      </filter>
    </defs>
    <circle cx="17" cy="17" r="15" fill="white"
      stroke="#1B3A6B" stroke-width="2.5" filter="url(#${fid})"/>
    <text x="17" y="22" text-anchor="middle"
      font-family="Outfit,system-ui,sans-serif"
      font-weight="700" font-size="14" fill="#1B3A6B">${rank}</text>
  </svg>`;
  return el;
}

/* ─────────────────────────────────────────────
   FLY TO
───────────────────────────────────────────── */
function flyTo(map, lng, lat) {
  map.flyTo({
    center: [lng, lat],
    zoom: 15.5,
    pitch: 45,
    bearing: 0,
    duration: 2000,
    essential: true,
    curve: 1.2,
  });
}

/* ─────────────────────────────────────────────
   APPLY 3D BUILDING STYLES
   The liberty style already has fill-extrusion
   building layers — we restyle them rather than
   adding our own, to avoid layer conflicts.
───────────────────────────────────────────── */
function applyBuildingStyles(map) {
  const layers = map.getStyle().layers;

  // Restyle existing building extrusion layers
  let found = false;
  layers.forEach((l) => {
    if (l.type === "fill-extrusion" && l["source-layer"] === "building") {
      found = true;
      try {
        map.setPaintProperty(l.id, "fill-extrusion-color", BLDG_COLOR);
        map.setPaintProperty(l.id, "fill-extrusion-opacity", 0.88);
      } catch {}
    }
  });

  // If no existing 3D layer found, add our own
  if (!found) {
    const sources = map.getStyle().sources;
    const srcId =
      "openmaptiles" in sources
        ? "openmaptiles"
        : Object.keys(sources).find((k) => sources[k].type === "vector");

    if (srcId) {
      const beforeId = layers.find((l) => l.type === "symbol")?.id;
      try {
        map.addLayer(
          {
            id: "vryfid-bldg",
            type: "fill-extrusion",
            source: srcId,
            "source-layer": "building",
            paint: {
              "fill-extrusion-color": BLDG_COLOR,
              "fill-extrusion-height": [
                "coalesce", ["get", "render_height"], ["get", "height"], 8,
              ],
              "fill-extrusion-base": [
                "coalesce", ["get", "render_min_height"], 0,
              ],
              "fill-extrusion-opacity": 0.88,
            },
          },
          beforeId
        );
      } catch {}
    }
  }

  // Tint water sky-blue
  layers.forEach((l) => {
    if (l["source-layer"] === "water" && l.type === "fill") {
      try { map.setPaintProperty(l.id, "fill-color", "#BFDBFE"); } catch {}
    }
  });
}

/* ─────────────────────────────────────────────
   MAP COMPONENT
───────────────────────────────────────────── */
export default function MapView({ listing, ranked = [], isPrimary = true, onSelect }) {
  const containerRef = useRef(null);
  const mapRef      = useRef(null);
  const markersRef  = useRef([]);

  // Keep refs up-to-date on every render so callbacks are never stale
  const listingRef  = useRef(listing);  listingRef.current  = listing;
  const rankedRef   = useRef(ranked);   rankedRef.current   = ranked;
  const onSelectRef = useRef(onSelect); onSelectRef.current = onSelect;

  /* ── Marker refresh — always reads from refs ── */
  const refreshMarkers = useCallback((map, viewingId) => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const list = rankedRef.current.length > 0
      ? rankedRef.current.slice(0, 3)
      : [listingRef.current];

    list.forEach((l, i) => {
      const isViewing = l.id === viewingId;
      const el = isViewing ? createWoltPin(l.id) : createNumberBadge(i + 1, l.id);

      if (!isViewing) {
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onSelectRef.current?.(l);
        });
      }

      const marker = new maplibregl.Marker({
        element: el,
        anchor: isViewing ? "bottom" : "center",
      })
        .setLngLat([l.lng, l.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, []); // stable — only uses refs

  /* ── Init once ── */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      // liberty is OpenFreeMap's full-featured style — includes building data
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [listingRef.current.lng, listingRef.current.lat],
      zoom: 15.5,
      pitch: 45,
      bearing: 0,
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
      applyBuildingStyles(map);
      refreshMarkers(map, listingRef.current.id);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [refreshMarkers]);

  /* ── On listing change: fly + refresh markers ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const go = () => {
      flyTo(map, listing.lng, listing.lat);
      refreshMarkers(map, listing.id);
    };

    if (map.loaded()) go();
    else map.once("load", go);
  }, [listing.id, refreshMarkers]);

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

      {/* vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 115% 115% at 50% 40%, transparent 50%, rgba(13,33,68,0.1) 100%)",
        zIndex: 2,
      }} />

      {/* bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{
        height: 150,
        background: "linear-gradient(to top, rgba(255,255,255,0.78) 0%, transparent 100%)",
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
            {isPrimary ? "#1 Match" : "Viewing"}
          </span>
        </div>
      </div>
    </div>
  );
}
