import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const LISTINGS = [
  {
    id: 1,
    badge: "Central Park",
    street: "220 Central Park South",
    unit: "Residence 54W",
    neighborhood: "Billionaires' Row",
    city: "New York, NY 10019",
    price: "$42,000",
    period: "/mo",
    beds: 3,
    baths: "3.5",
    sqft: "3,200",
    description:
      "A Robert A.M. Stern masterpiece perched above Central Park. Floor-to-ceiling windows frame unobstructed park views from every room. Signature marble baths, a chef's kitchen with Sub-Zero appliances, and private elevator entry complete this exceptional residence.",
    lat: 40.7672,
    lng: -73.9812,
    tags: ["Park Views", "Private Terrace", "White Glove"],
    agent: "Victoria Chen",
    agentTitle: "Senior Leasing Advisor",
  },
  {
    id: 2,
    badge: "Midtown",
    street: "432 Park Avenue",
    unit: "Residence 68A",
    neighborhood: "Midtown East",
    city: "New York, NY 10022",
    price: "$28,500",
    period: "/mo",
    beds: 2,
    baths: "2.5",
    sqft: "2,100",
    description:
      "At 1,396 feet, a global icon. Private elevator opens directly to your foyer on the 68th floor. Twelve-foot ceilings and 360° panoramic views over Manhattan define this extraordinary home. Full concierge and in-building dining available.",
    lat: 40.7616,
    lng: -73.9724,
    tags: ["360° Views", "Full Concierge", "Private Elevator"],
    agent: "Marcus Williams",
    agentTitle: "Luxury Residential Specialist",
  },
  {
    id: 3,
    badge: "Hudson Yards",
    street: "15 Hudson Yards",
    unit: "Residence 35D",
    neighborhood: "West Side",
    city: "New York, NY 10001",
    price: "$19,800",
    period: "/mo",
    beds: 2,
    baths: "2",
    sqft: "1,850",
    description:
      "Manhattan's most dynamic new neighborhood. Steps from The Shed, the High Line, and world-class dining. Building amenities span a 75-foot lap pool, private cinema, golf simulator, and a quarter-acre rooftop terrace with Hudson River views.",
    lat: 40.754,
    lng: -74.0021,
    tags: ["High Line Access", "75ft Pool", "Cinema"],
    agent: "Sophia Park",
    agentTitle: "West Side Market Expert",
  },
];

function mapUrl(lat, lng) {
  const d = 0.013;
  const bbox = [lng - d, lat - d, lng + d, lat + d]
    .map((n) => n.toFixed(6))
    .join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

function ListingCard({ listing, isSelected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(listing)}
      className={`
        group relative w-full text-left rounded-2xl overflow-hidden
        transition-all duration-300 ease-out
        ${
          isSelected
            ? "ring-2 ring-[#1B3A6B] shadow-2xl scale-[1.02]"
            : "shadow-md hover:shadow-xl hover:scale-[1.015]"
        }
        bg-white
      `}
    >
      {/* Top banner */}
      <div className="relative h-44 bg-[#1B3A6B] overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B3A6B] via-[#1B3A6B] to-[#2A5298]" />

        {/* Badge */}
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-white/10 text-white border border-white/20 backdrop-blur-sm">
          {listing.badge}
        </span>

        {/* Price */}
        <div className="absolute bottom-4 left-4">
          <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-0.5">
            Starting from
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-white text-2xl font-semibold">
              {listing.price}
            </span>
            <span className="text-white/60 text-sm">{listing.period}</span>
          </div>
        </div>

        {/* Selected check */}
        {isSelected && (
          <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md">
            <svg
              className="w-4 h-4 text-[#1B3A6B]"
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
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-5">
        <p className="text-[#1B3A6B] text-[11px] font-semibold uppercase tracking-widest mb-1">
          {listing.neighborhood}
        </p>
        <h3 className="font-serif text-[#1B3A6B] text-xl leading-tight mb-1">
          {listing.street}
        </h3>
        <p className="text-slate-500 text-sm mb-4">{listing.unit}</p>

        <div className="flex gap-3 text-sm text-slate-600 mb-4">
          <span className="flex items-center gap-1">
            <BedIcon />
            {listing.beds} bd
          </span>
          <span className="text-[#E8E0D5]">·</span>
          <span className="flex items-center gap-1">
            <BathIcon />
            {listing.baths} ba
          </span>
          <span className="text-[#E8E0D5]">·</span>
          <span className="flex items-center gap-1">
            <SqftIcon />
            {listing.sqft} sf
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {listing.tags.map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#DBEAFE] text-[#1B3A6B]"
            >
              {t}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`
            w-full py-3 rounded-xl text-sm font-semibold text-center transition-all duration-200
            ${
              isSelected
                ? "bg-[#1B3A6B] text-white"
                : "bg-[#FAF7F2] text-[#1B3A6B] border border-[#D4C9BC] group-hover:bg-[#1B3A6B] group-hover:text-white group-hover:border-[#1B3A6B]"
            }
          `}
        >
          {isSelected ? "Viewing This Match" : "Explore This Match"}
        </div>
      </div>
    </button>
  );
}

function Toast({ visible }) {
  return (
    <div
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-3 px-5 py-3.5 rounded-xl
        bg-[#1B3A6B] text-white shadow-2xl
        transition-all duration-500 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
      `}
    >
      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
        <svg
          className="w-3.5 h-3.5"
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
      </div>
      <span className="text-sm font-medium">
        Message sent to listing agent{" "}
        <span className="text-white/60">(demo)</span>
      </span>
    </div>
  );
}

/* Icons */
function BedIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-slate-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 12V6a1 1 0 011-1h16a1 1 0 011 1v6M3 12h18M3 12v5m18-5v5M3 17h18"
      />
    </svg>
  );
}
function BathIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-slate-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 12h16v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4zM6 12V7a3 3 0 016 0"
      />
    </svg>
  );
}
function SqftIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-slate-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4h6M4 4v6M4 4l6 6M20 20h-6m6 0v-6m0 6l-6-6"
      />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"
      />
      <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App() {
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(false);
  const detailsRef = useRef(null);

  const handleSelect = (listing) => {
    setSelected(listing);
    setMessage("");
    setToast(false);
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    setToast(true);
    setMessage("");
    setTimeout(() => setToast(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans">
      {/* ── Header ── */}
      <header className="relative overflow-hidden bg-[#1B3A6B]">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative max-w-5xl mx-auto px-6 pt-14 pb-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <span className="text-white font-semibold tracking-widest text-sm uppercase">
              VryfID
            </span>
          </div>

          {/* Headline */}
          <div className="max-w-2xl">
            <p className="text-[#93C5FD] text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              Agent-Matched Living · Manhattan
            </p>
            <h1 className="font-serif text-white text-5xl md:text-6xl leading-[1.1] mb-5">
              Your perfect apartment,
              <br />
              <em className="not-italic text-[#BFDBFE]">matched by AI.</em>
            </h1>
            <p className="text-white/60 text-lg font-light leading-relaxed max-w-xl">
              Our identity-verified matching engine surfaces apartments aligned
              to how you actually live — not just what you searched. Select a
              listing below to explore your match.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 mt-10 pt-8 border-t border-white/10">
            {[
              ["340+", "Verified Listings"],
              ["98%", "Match Accuracy"],
              ["2.1 days", "Avg. Time to Lease"],
            ].map(([val, label]) => (
              <div key={label}>
                <p className="text-white text-xl font-semibold">{val}</p>
                <p className="text-white/40 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Listings ── */}
      <main className="max-w-5xl mx-auto px-6 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[#1B3A6B] text-xs font-semibold uppercase tracking-[0.18em] mb-1.5">
              Your Matches
            </p>
            <h2 className="font-serif text-[#1B3A6B] text-3xl">
              3 residences curated for you
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-slate-400 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Live inventory
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {LISTINGS.map((l) => (
            <ListingCard
              key={l.id}
              listing={l}
              isSelected={selected?.id === l.id}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* ── Detail Panel ── */}
        {selected && (
          <div
            ref={detailsRef}
            className="mt-12 animate-in"
            style={{ animation: "fadeSlideUp 0.45s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            {/* Section label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 text-[#1B3A6B]">
                <PinIcon />
                <span className="font-semibold text-sm">{selected.street}</span>
              </div>
              <div className="flex-1 h-px bg-[#E8E0D5]" />
              <span className="text-slate-400 text-xs">{selected.neighborhood}</span>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-[#E8E0D5] shadow-lg mb-6 bg-[#DBEAFE]">
              <iframe
                key={selected.id}
                title={`Map of ${selected.street}`}
                src={mapUrl(selected.lat, selected.lng)}
                width="100%"
                height="380"
                loading="lazy"
                className="block w-full"
                style={{ border: "none" }}
              />
            </div>

            {/* Two-column: details + message */}
            <div className="grid md:grid-cols-5 gap-5">
              {/* Address card — wider */}
              <div className="md:col-span-3 bg-white rounded-2xl p-7 border border-[#E8E0D5] shadow-sm">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-[#1B3A6B] text-[11px] font-semibold uppercase tracking-widest mb-1">
                      {selected.neighborhood} · {selected.city}
                    </p>
                    <h3 className="font-serif text-[#1B3A6B] text-2xl leading-tight">
                      {selected.street}
                    </h3>
                    <p className="text-slate-500 text-sm mt-0.5">
                      {selected.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-[#1B3A6B] text-2xl">
                      {selected.price}
                    </p>
                    <p className="text-slate-400 text-xs">{selected.period}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    ["Bedrooms", selected.beds],
                    ["Bathrooms", selected.baths],
                    ["Square Feet", selected.sqft],
                  ].map(([label, val]) => (
                    <div
                      key={label}
                      className="bg-[#FAF7F2] rounded-xl p-3 text-center"
                    >
                      <p className="text-[#1B3A6B] font-semibold text-lg leading-none mb-1">
                        {val}
                      </p>
                      <p className="text-slate-400 text-[11px] uppercase tracking-wide">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-5">
                  {selected.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#DBEAFE] text-[#1B3A6B]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Message card */}
              <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-[#E8E0D5] shadow-sm flex flex-col">
                {/* Agent */}
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[#F0EAE0]">
                  <div className="w-10 h-10 rounded-full bg-[#1B3A6B] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {selected.agent.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-[#1B3A6B] font-semibold text-sm">
                      {selected.agent}
                    </p>
                    <p className="text-slate-400 text-xs">{selected.agentTitle}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-emerald-600 text-xs font-medium">
                      Online
                    </span>
                  </div>
                </div>

                <p className="text-[#1B3A6B] font-medium text-sm mb-1">
                  Message About This Listing
                </p>
                <p className="text-slate-400 text-xs mb-4">
                  Ask about availability, schedule a tour, or request more
                  details.
                </p>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Hi ${selected.agent.split(" ")[0]}, I'm interested in ${selected.street}...`}
                  rows={5}
                  className="
                    flex-1 w-full resize-none rounded-xl border border-[#E8E0D5]
                    bg-[#FAF7F2] px-4 py-3 text-sm text-[#1B3A6B]
                    placeholder:text-slate-300 outline-none
                    focus:border-[#93C5FD] focus:ring-2 focus:ring-[#DBEAFE]
                    transition-all duration-200
                  "
                />

                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="
                    mt-3 w-full py-3 rounded-xl text-sm font-semibold
                    bg-[#1B3A6B] text-white
                    hover:bg-[#0D2144] active:scale-[0.98]
                    disabled:opacity-30 disabled:cursor-not-allowed
                    transition-all duration-200
                  "
                >
                  Send Message
                </button>

                <p className="text-center text-slate-300 text-[11px] mt-3">
                  VryfID connects verified renters only
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty state hint */}
        {!selected && (
          <div className="mt-10 flex flex-col items-center text-center py-12 opacity-50">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#D4C9BC] flex items-center justify-center mb-3">
              <PinIcon />
            </div>
            <p className="text-slate-400 text-sm">
              Select a listing above to view it on the map
            </p>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#E8E0D5] mt-8">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1B3A6B] tracking-widest text-xs uppercase">
              VryfID
            </span>
            <span className="text-[#E8E0D5]">·</span>
            <span className="text-slate-400 text-xs">
              Agent-Matched Living · Demo v0.1
            </span>
          </div>
          <p className="text-slate-300 text-xs text-center">
            This is a product concept demo. All listings and pricing are
            illustrative.
          </p>
        </div>
      </footer>

      {/* Toast */}
      <Toast visible={toast} />

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
