import { useState, useEffect, useRef } from "react";
import { toPng } from "html-to-image";
import { QUESTIONS, scoreAndRank, getArchetype, getArchetypeKey, ARCHETYPES } from "./data.js";
import MapView from "./MapView.jsx";

/* ─────────────────────────────────────────────
   VIBE SCORE  —  ported from VryfID Vibes
───────────────────────────────────────────── */
const CATEGORY_META = {
  schools:   { label: "Schools",   emoji: "📚", accent: "#0D9488" },
  crime:     { label: "Safety",    emoji: "🛡️",  accent: "#059669" },
  grocery:   { label: "Grocery",   emoji: "🛒",  accent: "#D97706" },
  parking:   { label: "Parking",   emoji: "🅿️",  accent: "#0369A1" },
  nightlife: { label: "Nightlife", emoji: "🍸",  accent: "#9333EA" },
  transit:   { label: "Transit",   emoji: "🚇",  accent: "#0891B2" },
  traffic:   { label: "Traffic",   emoji: "🚦",  accent: "#C2410C" },
};

function getVibeTier(score) {
  if (score >= 85) return { label: "Paradise Vibes", emoji: "🌴", color: "#0D9488" };
  if (score >= 70) return { label: "Great Vibes",    emoji: "✨",  color: "#059669" };
  if (score >= 55) return { label: "Solid Vibes",    emoji: "😎",  color: "#D97706" };
  if (score >= 40) return { label: "Mixed Vibes",    emoji: "🌤️", color: "#EA580C" };
  return              { label: "Rough Vibes",    emoji: "⚠️",  color: "#DC2626" };
}

function ScoreRing({ score }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setDisplayed(score), 80);
    return () => clearTimeout(t);
  }, [score]);

  const r = 46;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - displayed / 100);
  const tier = getVibeTier(score);

  return (
    <div className="relative flex-shrink-0" style={{ width: 112, height: 112 }}>
      <svg
        width="112" height="112" viewBox="0 0 112 112"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle cx="56" cy="56" r={r} fill="none" stroke="#F0EAE0" strokeWidth="9" />
        <circle
          cx="56" cy="56" r={r}
          fill="none"
          stroke={tier.color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${circ}`}
          strokeDashoffset={`${offset}`}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-[#1B3A6B] leading-none" style={{ fontSize: "1.9rem", fontWeight: 700 }}>
          {score}
        </span>
        <span className="text-slate-400 text-[9px] uppercase tracking-widest mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

function CategoryPill({ label, emoji, rating, accent }) {
  return (
    <div className="bg-[#FAF7F2] rounded-xl p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-slate-500 text-xs font-medium flex items-center gap-1">
          <span className="text-sm leading-none">{emoji}</span>
          {label}
        </span>
        <span className="font-semibold text-sm tabular-nums" style={{ color: accent }}>
          {rating}
        </span>
      </div>
      <div className="h-1 rounded-full bg-[#E8E0D5] overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${rating}%`,
            background: accent,
            transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SHARE CARD  —  matches VryfID Vibes share format
   Renders at 380×676 (9:16 ratio).
   Captured at 2× by html-to-image → 760×1352 PNG.
   All styles are inline for reliable html-to-image capture.
───────────────────────────────────────────── */
function ShareCard({ listing, archetypeName, cardRef }) {
  const { vibeData } = listing;
  const tier = getVibeTier(vibeData.vibeScore);

  const top3 = Object.entries(CATEGORY_META)
    .map(([key, meta]) => ({ key, ...meta, rating: vibeData.categories[key].rating }))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const W = 380, H = 676;

  return (
    <div ref={cardRef} style={{
      width: W, height: H,
      backgroundColor: "#FAF7F2",
      fontFamily: '"Outfit", system-ui, sans-serif',
      position: "relative",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      {/* dot grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(27,58,107,0.07) 1px, transparent 0)",
        backgroundSize: "22px 22px",
        pointerEvents: "none",
      }} />

      {/* navy top band */}
      <div style={{
        background: "#1B3A6B",
        padding: "15px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "relative", zIndex: 1,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span style={{ color: "white", fontWeight: 700, letterSpacing: "0.2em", fontSize: 11, textTransform: "uppercase" }}>VryfID</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.42)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          Agent-Matched Living
        </span>
      </div>

      {/* score section */}
      <div style={{ padding: "24px 24px 16px", textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* faint background ring */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 190, height: 190, borderRadius: "50%",
          border: "1px solid rgba(27,58,107,0.07)",
          pointerEvents: "none",
        }} />
        <p style={{ color: "rgba(27,58,107,0.38)", fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 2 }}>
          Neighborhood Vibes
        </p>
        <p style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 120, color: "#1B3A6B", lineHeight: 1, margin: 0 }}>
          {vibeData.vibeScore}
        </p>
        <p style={{ color: "rgba(27,58,107,0.38)", fontSize: 11, margin: "2px 0 6px" }}>/ 100</p>
        <p style={{ color: tier.color, fontSize: 15, fontWeight: 600, margin: 0 }}>
          {tier.label} {tier.emoji}
        </p>
      </div>

      <div style={{ height: 1, background: "rgba(27,58,107,0.09)", margin: "0 24px" }} />

      {/* property section */}
      <div style={{ padding: "14px 24px", position: "relative", zIndex: 1 }}>
        <p style={{ color: "rgba(27,58,107,0.38)", fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 4 }}>
          Your Match
        </p>
        <p style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 23, color: "#1B3A6B", lineHeight: 1.15, marginBottom: 3 }}>
          {listing.street}
        </p>
        <p style={{ color: "#64748B", fontSize: 12, marginBottom: 4 }}>{listing.neighborhood} · {listing.city}</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
          <span style={{ color: "#1B3A6B", fontWeight: 700, fontSize: 15 }}>{listing.price}</span>
          <span style={{ color: "#94A3B8", fontSize: 13 }}>{listing.period}</span>
          <span style={{ color: "#CBD5E1" }}>·</span>
          <span style={{ color: "#64748B", fontSize: 12 }}>{listing.beds} bd · {listing.sqft} sf</span>
        </div>
      </div>

      <div style={{ height: 1, background: "rgba(27,58,107,0.09)", margin: "0 24px" }} />

      {/* top 3 vibes */}
      <div style={{ padding: "14px 24px", position: "relative", zIndex: 1 }}>
        <p style={{ color: "rgba(27,58,107,0.38)", fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 9 }}>
          Top Vibes
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {top3.map((cat) => (
            <div key={cat.key} style={{
              flex: 1,
              background: "white",
              borderRadius: 10,
              padding: "9px 10px",
              border: "1px solid rgba(27,58,107,0.08)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                <span style={{ fontSize: 11 }}>{cat.emoji}</span>
                <span style={{ color: "#64748B", fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{cat.label}</span>
              </div>
              <p style={{ color: cat.accent, fontSize: 24, fontWeight: 700, lineHeight: 1, margin: 0, fontFamily: '"DM Serif Display", Georgia, serif' }}>
                {cat.rating}
              </p>
              <div style={{ height: 3, background: "rgba(27,58,107,0.08)", borderRadius: 2, marginTop: 5 }}>
                <div style={{ height: 3, background: cat.accent, borderRadius: 2, width: `${cat.rating}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: "rgba(27,58,107,0.09)", margin: "0 24px" }} />

      {/* archetype + footer */}
      <div style={{ padding: "13px 24px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
        <div>
          <p style={{ color: "rgba(27,58,107,0.35)", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 2 }}>
            You Are
          </p>
          <p style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 16, color: "#1B3A6B", fontStyle: "italic", margin: 0 }}>
            {archetypeName}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1B3A6B" strokeWidth="2" opacity="0.4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span style={{ color: "rgba(27,58,107,0.4)", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em" }}>vryfid.com</span>
        </div>
      </div>
    </div>
  );
}

function ShareModal({ listing, archetypeName, onClose }) {
  const cardRef = useRef(null);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  async function handleDownload() {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: "#FAF7F2",
        width: 380,
        height: 676,
      });
      const link = document.createElement("a");
      link.download = `vryfid-${listing.street.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } finally {
      setGenerating(false);
    }
  }

  // Scale 380×676 → 285×507 for the modal preview (75%)
  const SCALE = 0.75;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(13,33,68,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center gap-0 max-w-sm w-full">
        {/* header */}
        <div className="w-full flex items-center justify-between px-6 py-4 border-b border-[#F0EAE0]">
          <p className="text-[#1B3A6B] font-semibold text-sm">Your Vibe Score Card</p>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-[#FAF7F2] flex items-center justify-center text-slate-400 hover:text-[#1B3A6B] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* card preview — scaled */}
        <div style={{
          width: 380 * SCALE,
          height: 676 * SCALE,
          overflow: "hidden",
          flexShrink: 0,
        }}>
          <div style={{ transform: `scale(${SCALE})`, transformOrigin: "top left", width: 380, height: 676 }}>
            <ShareCard listing={listing} archetypeName={archetypeName} cardRef={cardRef} />
          </div>
        </div>

        {/* actions */}
        <div className="w-full px-6 py-4 border-t border-[#F0EAE0] flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#E8E0D5] text-slate-500 text-sm font-medium hover:border-[#1B3A6B] hover:text-[#1B3A6B] transition-colors">
            Close
          </button>
          <button
            onClick={handleDownload}
            disabled={generating}
            className="flex-1 py-2.5 rounded-xl bg-[#1B3A6B] text-white text-sm font-semibold hover:bg-[#0D2144] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {generating ? (
              <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Generating…</>
            ) : done ? (
              <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Saved!</>
            ) : (
              <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>Save as Image</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   VIBE SCORE SECTION
───────────────────────────────────────────── */
function VibeScoreSection({ listing }) {
  const { vibeData } = listing;
  const tier = getVibeTier(vibeData.vibeScore);
  const archetypeName = ARCHETYPES[getArchetypeKey(listing.area)]?.name ?? "The Elevated";
  const [showShare, setShowShare] = useState(false);

  return (
    <>
    {showShare && (
      <ShareModal listing={listing} archetypeName={archetypeName} onClose={() => setShowShare(false)} />
    )}
    <div className="bg-white rounded-2xl border border-[#E8E0D5] shadow-sm overflow-hidden">
      {/* Header band */}
      <div className="px-7 pt-6 pb-5 border-b border-[#F5F0E8]">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[#1B3A6B] text-[10px] font-semibold uppercase tracking-[0.22em]">
            Neighborhood Vibes
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-300 font-medium">Powered by VryfID Vibes</span>
            <button
              onClick={() => setShowShare(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E8E0D5] text-[#1B3A6B] text-[11px] font-semibold hover:bg-[#1B3A6B] hover:text-white hover:border-[#1B3A6B] transition-all duration-200"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          </div>
        </div>

        <div className="flex items-center gap-5 mt-4">
          {/* Animated ring */}
          <ScoreRing score={vibeData.vibeScore} />

          <div className="flex-1 min-w-0">
            <p className="font-serif text-[#1B3A6B] text-2xl mb-1">
              {tier.label} {tier.emoji}
            </p>
            <p className="text-slate-500 text-sm leading-relaxed">
              {vibeData.vibeSummary}
            </p>
          </div>
        </div>
      </div>

      {/* 7 category pills */}
      <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {Object.entries(CATEGORY_META).map(([key, meta]) => (
          <CategoryPill
            key={key}
            label={meta.label}
            emoji={meta.emoji}
            rating={vibeData.categories[key].rating}
            accent={meta.accent}
          />
        ))}
      </div>

      {/* Hidden gem */}
      <div className="mx-5 mb-5 rounded-xl bg-[#1B3A6B] px-5 py-4 flex items-start gap-3">
        <span className="text-xl mt-0.5 flex-shrink-0">💎</span>
        <div>
          <p className="text-white/50 text-[10px] font-semibold uppercase tracking-widest mb-1">
            Hidden Gem
          </p>
          <p className="text-white/90 text-sm leading-relaxed">
            {vibeData.hiddenGem}
          </p>
        </div>
      </div>

      {/* Nearby spots row */}
      <div className="px-5 pb-6 grid sm:grid-cols-2 gap-3">
        {/* Grocery */}
        <div className="rounded-xl border border-[#F0EAE0] p-4">
          <p className="text-[#1B3A6B] text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5">
            🛒 Nearby Grocery
          </p>
          <ul className="space-y-2">
            {vibeData.nearbyGrocery.map((g) => (
              <li key={g.name} className="flex items-center justify-between">
                <span className="text-slate-700 text-xs font-medium truncate mr-2">{g.name}</span>
                <span className="text-slate-400 text-xs flex-shrink-0">{g.walkTime}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Nightlife */}
        <div className="rounded-xl border border-[#F0EAE0] p-4">
          <p className="text-[#1B3A6B] text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5">
            🍸 Nearby Nightlife
          </p>
          <ul className="space-y-2">
            {vibeData.nearbyNightlife.map((n) => (
              <li key={n.name} className="flex flex-col">
                <span className="text-slate-700 text-xs font-medium">{n.name}</span>
                <span className="text-slate-400 text-[11px] italic">{n.vibe}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Airport strip */}
      <div className="border-t border-[#F5F0E8] px-7 py-3 flex items-center gap-2 text-xs text-slate-400">
        <span>✈️</span>
        <span>Nearest airport:</span>
        <span className="text-[#1B3A6B] font-semibold">
          {vibeData.nearestAirport.name} ({vibeData.nearestAirport.code})
        </span>
        <span>—</span>
        <span>{vibeData.nearestAirport.driveTime}</span>
      </div>
    </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   ARCHETYPE ICONS
───────────────────────────────────────────── */
function IconElevated() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 18h16L12 2z" />
      <path d="M8 18v4M16 18v4" opacity=".4" />
    </svg>
  );
}
function IconPowerBroker() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconDowntownNative() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconModernist() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" />
    </svg>
  );
}
const ARCHETYPE_ICONS = {
  elevated:      <IconElevated />,
  powerbroker:   <IconPowerBroker />,
  downtownnative:<IconDowntownNative />,
  modernist:     <IconModernist />,
};

/* ─────────────────────────────────────────────
   SHARED ATOMS
───────────────────────────────────────────── */
function Logo({ light = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${light ? "bg-white/10 border border-white/20" : "bg-[#1B3A6B]/10 border border-[#1B3A6B]/15"}`}>
        <svg className={`w-4 h-4 ${light ? "text-white" : "text-[#1B3A6B]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <span className={`font-semibold tracking-widest text-xs uppercase ${light ? "text-white" : "text-[#1B3A6B]"}`}>VryfID</span>
    </div>
  );
}

function Toast({ visible }) {
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#1B3A6B] text-white shadow-2xl transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-sm font-medium">Message sent to listing agent <span className="text-white/50">(demo)</span></span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   INTRO
───────────────────────────────────────────── */
function IntroView({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#1B3A6B] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "30px 30px" }} />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0D2144] to-transparent" />

      <div className="relative flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 py-12">
        <Logo light />
        <div className="flex-1 flex flex-col justify-center py-16 text-center">
          <div className="inline-flex items-center gap-2 justify-center mb-7">
            <div className="h-px w-8 bg-white/20" />
            <span className="text-[#93C5FD] text-[10px] font-semibold uppercase tracking-[0.25em]">Manhattan · Home Type Quiz</span>
            <div className="h-px w-8 bg-white/20" />
          </div>
          <h1 className="font-serif text-white text-5xl md:text-[4rem] leading-[1.06] mb-6">
            Your home says<br />
            <em className="not-italic text-[#BFDBFE]">everything about you.</em>
          </h1>
          <p className="text-white/50 text-lg font-light leading-relaxed max-w-md mx-auto mb-12">
            Three questions. One Manhattan type. Your matched address — with a full neighborhood vibe score.
          </p>
          <div className="flex flex-col items-center gap-3">
            <button onClick={onStart} className="inline-flex items-center gap-2.5 px-9 py-4 bg-white text-[#1B3A6B] rounded-full font-semibold text-sm hover:bg-[#DBEAFE] active:scale-[0.97] transition-all duration-200 shadow-lg shadow-black/20">
              Discover My Type
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <p className="text-white/25 text-xs">8 verified listings · neighborhood vibe scores · 30 seconds</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex justify-center gap-10">
          {[["4", "Manhattan types"], ["8", "curated listings"], ["7", "vibe categories"]].map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="text-white font-semibold text-xl">{v}</p>
              <p className="text-white/30 text-xs mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   QUESTION
───────────────────────────────────────────── */
function QuestionView({ question, questionIndex, total, answers, onAnswer, onBack }) {
  const letters = ["A", "B", "C", "D"];
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <div className="max-w-2xl mx-auto w-full px-6 pt-8 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 text-slate-400 hover:text-[#1B3A6B] text-sm transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="flex gap-1.5 items-center">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i < questionIndex ? "w-5 bg-[#1B3A6B]" : i === questionIndex ? "w-9 bg-[#1B3A6B]" : "w-3 bg-[#E0D9D0]"}`} />
          ))}
        </div>
        <span className="text-slate-400 text-xs w-10 text-right">{questionIndex + 1}/{total}</span>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full px-6 py-12">
        <p className="text-[#1B3A6B]/40 text-[11px] font-semibold uppercase tracking-[0.22em] mb-5">Question {questionIndex + 1} of {total}</p>
        <h2 className="font-serif text-[#1B3A6B] text-[2.5rem] leading-tight mb-10">{question.question}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((opt, i) => {
            const selected = answers[question.id] === opt.value;
            return (
              <button key={opt.value} onClick={() => onAnswer(question.id, opt.value)}
                className={`group relative text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] ${selected ? "border-[#1B3A6B] bg-[#1B3A6B]" : "border-[#E0D9D0] bg-white hover:border-[#1B3A6B]"}`}>
                <span className={`absolute top-3.5 right-4 text-[11px] font-semibold ${selected ? "text-white/30" : "text-slate-200 group-hover:text-slate-300"}`}>{letters[i]}</span>
                <p className={`font-semibold text-sm leading-snug ${selected ? "text-white" : "text-[#1B3A6B]"}`}>{opt.label}</p>
                {opt.sub && <p className={`text-xs mt-0.5 ${selected ? "text-white/60" : "text-slate-400"}`}>{opt.sub}</p>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ANALYZING
───────────────────────────────────────────── */
const ANALYZING_PHASES = ["Reading your answers…", "Scoring 7 vibe categories…", "Your type is ready."];

function AnalyzingView({ onDone }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => onDone(), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className="min-h-screen bg-[#0D2144] flex items-center justify-center">
      <div className="text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-10"
          style={{ animation: "pulse 1.6s ease-in-out infinite" }}>
          <svg className="w-7 h-7 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <p key={phase} className="font-serif text-white text-2xl md:text-3xl mb-8" style={{ animation: "fadeSlideUp .4s cubic-bezier(.16,1,.3,1) both" }}>
          {ANALYZING_PHASES[phase]}
        </p>
        <div className="flex gap-2 justify-center">
          {ANALYZING_PHASES.map((_, i) => (
            <div key={i} className={`rounded-full transition-all duration-400 ${i <= phase ? "w-6 h-1 bg-white" : "w-2 h-1 bg-white/20"}`} />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.94)} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ARCHETYPE REVEAL
───────────────────────────────────────────── */
function ArchetypeCard({ archetypeKey, archetype, match, onScrollDown }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    const text = `I'm ${archetype.name} — my Manhattan home type.\n\n"${archetype.tagline}"\n\nNeighborhood Vibe Score: ${match.vibeData.vibeScore}/100\n\nFind yours at vryfid.com`;
    try { await navigator.clipboard.writeText(text); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="relative overflow-hidden bg-[#0D2144] min-h-[92vh] flex flex-col">
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#2A5298] opacity-20 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto w-full px-6 pt-6 flex items-center justify-between">
        <Logo light />
        <button onClick={onScrollDown} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          skip to listing
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto w-full px-6 py-12">
        <div className="w-16 h-16 rounded-2xl border border-white/15 bg-white/5 flex items-center justify-center text-white mb-8"
          style={{ animation: "fadeSlideUp .4s cubic-bezier(.16,1,.3,1) both" }}>
          {ARCHETYPE_ICONS[archetypeKey]}
        </div>

        <p className="text-white/35 text-[10px] font-semibold uppercase tracking-[0.28em] mb-4"
          style={{ animation: "fadeSlideUp .45s .05s cubic-bezier(.16,1,.3,1) both" }}>
          You are
        </p>

        <h2 className="font-serif text-white text-[3.2rem] md:text-[4.5rem] leading-[1.0] mb-5"
          style={{ animation: "fadeSlideUp .5s .1s cubic-bezier(.16,1,.3,1) both" }}>
          {archetype.name}
        </h2>

        <p className="text-[#93C5FD] text-lg md:text-xl font-light italic leading-snug max-w-lg mb-6"
          style={{ animation: "fadeSlideUp .5s .18s cubic-bezier(.16,1,.3,1) both" }}>
          "{archetype.tagline}"
        </p>

        <p className="text-white/55 text-base font-light leading-relaxed max-w-md mb-6"
          style={{ animation: "fadeSlideUp .5s .25s cubic-bezier(.16,1,.3,1) both" }}>
          {archetype.description}
        </p>

        {/* Vibe score teaser */}
        <div className="flex items-center gap-3 mb-8 px-4 py-2.5 rounded-full border border-white/10 bg-white/5"
          style={{ animation: "fadeSlideUp .5s .3s cubic-bezier(.16,1,.3,1) both" }}>
          <span className="text-[#93C5FD] text-xs font-semibold">Vibe Score</span>
          <span className="text-white font-serif text-lg font-bold">{match.vibeData.vibeScore}</span>
          <span className="text-white/30 text-xs">/ 100 · {getVibeTier(match.vibeData.vibeScore).label} {getVibeTier(match.vibeData.vibeScore).emoji}</span>
        </div>

        <div className="flex items-center gap-2 mb-10 px-4 py-2.5 rounded-full border border-white/10 bg-white/5"
          style={{ animation: "fadeSlideUp .5s .35s cubic-bezier(.16,1,.3,1) both" }}>
          <svg className="w-3.5 h-3.5 text-[#93C5FD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" />
          </svg>
          <span className="text-white/50 text-xs">Your match —</span>
          <span className="text-white text-xs font-semibold">{match.street}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center"
          style={{ animation: "fadeSlideUp .5s .42s cubic-bezier(.16,1,.3,1) both" }}>
          <button onClick={handleCopy}
            className={`flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-semibold transition-all duration-200 ${copied ? "bg-white text-[#1B3A6B] border-white" : "bg-white/8 text-white border-white/20 hover:bg-white/15"}`}>
            {copied ? (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Copied — share it</>
            ) : (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy your type</>
            )}
          </button>
          <button onClick={onScrollDown}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#1B3A6B] text-sm font-semibold hover:bg-[#DBEAFE] active:scale-[0.97] transition-all duration-200">
            See your match
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ALSO CONSIDER  (clickable)
───────────────────────────────────────────── */
function AlsoConsiderCard({ listing, rank, isViewing, onSelect }) {
  const tier = getVibeTier(listing.vibeData.vibeScore);
  return (
    <button
      onClick={() => onSelect(listing)}
      className={`w-full text-left rounded-2xl p-5 border-2 transition-all duration-200 hover:shadow-md active:scale-[0.98] ${
        isViewing
          ? "border-[#1B3A6B] bg-[#1B3A6B] shadow-lg"
          : "border-[#E8E0D5] bg-white hover:border-[#1B3A6B]"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${
          isViewing ? "bg-white/20 text-white" : "bg-[#FAF7F2] border border-[#E8E0D5] text-[#1B3A6B]"
        }`}>
          #{rank}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm truncate ${isViewing ? "text-white" : "text-[#1B3A6B]"}`}>
            {listing.street}
          </p>
          <p className={`text-xs mt-0.5 mb-2 ${isViewing ? "text-white/60" : "text-slate-400"}`}>
            {listing.neighborhood} · {listing.unit}
          </p>
          <div className="flex items-center justify-between">
            <span className={`font-semibold text-sm ${isViewing ? "text-white" : "text-[#1B3A6B]"}`}>
              {listing.price}<span className={`font-normal text-xs ${isViewing ? "text-white/50" : "text-slate-400"}`}>/mo</span>
            </span>
            <span className={`text-xs font-semibold ${isViewing ? "text-white/70" : ""}`} style={{ color: isViewing ? undefined : tier.color }}>
              {listing.vibeData.vibeScore} {tier.emoji}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {listing.tags.slice(0, 2).map((t) => (
              <span key={t} className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                isViewing ? "bg-white/15 text-white" : "bg-[#DBEAFE] text-[#1B3A6B]"
              }`}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────────
   LISTING SECTION  (main results view)
───────────────────────────────────────────── */
function ListingSection({ ranked, message, onMessageChange, onSend, onStartOver, toast, detailsRef }) {
  const [viewing, setViewing] = useState(ranked[0]);
  const mapRef = useRef(null);

  function selectListing(l) {
    setViewing(l);
    setTimeout(() => mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  const isPrimary = viewing.id === ranked[0].id;

  return (
    <div className="bg-[#FAF7F2]" ref={detailsRef}>
      {/* sticky nav */}
      <div className="bg-white border-b border-[#E8E0D5] sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Logo />
            <span className="text-[#E8E0D5] hidden sm:block">·</span>
            <span className="text-slate-400 text-sm hidden sm:block truncate">{viewing.street}</span>
            {!isPrimary && (
              <button onClick={() => selectListing(ranked[0])}
                className="ml-1 px-2.5 py-1 rounded-full bg-[#DBEAFE] text-[#1B3A6B] text-xs font-semibold hover:bg-[#BFDBFE] transition-colors">
                ← #1 Match
              </button>
            )}
          </div>
          <button onClick={onStartOver} className="flex items-center gap-1.5 text-slate-400 hover:text-[#1B3A6B] text-sm transition-colors flex-shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retake quiz
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* match / viewing context */}
        <div className="flex items-center gap-3 mb-6" ref={mapRef}>
          <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${isPrimary ? "bg-[#1B3A6B] text-white" : "bg-[#DBEAFE] text-[#1B3A6B]"}`}>
            {isPrimary ? "#1 Match" : "Also Consider"}
          </span>
          <h2 className="font-serif text-[#1B3A6B] text-2xl md:text-3xl leading-tight truncate">{viewing.street}</h2>
          <span className="text-slate-400 text-sm hidden md:block flex-shrink-0">{viewing.neighborhood}</span>
        </div>

        {/* map */}
        <div className="mb-6">
          <MapView listing={viewing} isPrimary={isPrimary} />
        </div>

        {/* listing details + message */}
        <div className="grid md:grid-cols-5 gap-5 mb-5">
          {/* listing card — luxury brochure layout */}
          <div className="md:col-span-3 bg-white rounded-2xl overflow-hidden border border-[#E8E0D5] shadow-sm">
            {/* dark header band */}
            <div className="bg-[#1B3A6B] px-7 py-5">
              <p className="text-white/45 text-[10px] font-semibold uppercase tracking-[0.22em] mb-1">
                {viewing.neighborhood} · {viewing.unit}
              </p>
              <h3 className="font-serif text-white text-2xl leading-tight mb-3">
                {viewing.street}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {viewing.tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/10 text-white/80 border border-white/15">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="px-7 pt-6 pb-2">
              {/* hero price */}
              <div className="flex items-baseline gap-2 mb-5">
                <span className="font-serif text-[#1B3A6B]" style={{ fontSize: "3rem", lineHeight: 1 }}>
                  {viewing.price}
                </span>
                <span className="text-slate-400 text-base">{viewing.period}</span>
              </div>

              {/* stats row */}
              <div className="flex items-center gap-2 mb-6 text-sm font-semibold text-[#1B3A6B]">
                <span>{viewing.beds} bd</span>
                <span className="text-[#E8E0D5]">·</span>
                <span>{viewing.baths} ba</span>
                <span className="text-[#E8E0D5]">·</span>
                <span>{viewing.sqft} sf</span>
                <span className="text-[#E8E0D5]">·</span>
                <span className="text-slate-400 font-normal">{viewing.city}</span>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed pb-6 border-b border-[#F5F0E8]">
                {viewing.description}
              </p>
            </div>

            {/* vibe score teaser strip */}
            <div className="px-7 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-serif font-bold text-sm text-white"
                  style={{ background: getVibeTier(viewing.vibeData.vibeScore).color }}
                >
                  {viewing.vibeData.vibeScore}
                </div>
                <span className="text-[#1B3A6B] font-semibold text-sm">
                  {getVibeTier(viewing.vibeData.vibeScore).label}
                </span>
                <span className="text-slate-300 text-xs">Neighborhood Score</span>
              </div>
              <span className="text-slate-300 text-xs">↓ Full breakdown below</span>
            </div>
          </div>

          {/* message card */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-[#E8E0D5] shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[#F0EAE0]">
              <div className="w-10 h-10 rounded-full bg-[#1B3A6B] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {viewing.agent.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-[#1B3A6B] font-semibold text-sm">{viewing.agent}</p>
                <p className="text-slate-400 text-xs">{viewing.agentTitle}</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-600 text-xs font-medium">Online</span>
              </div>
            </div>

            <p className="text-[#1B3A6B] font-semibold text-sm mb-1">Message About This Listing</p>
            <p className="text-slate-400 text-xs mb-4">Schedule a tour, ask questions, or request details.</p>

            <textarea
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder={`Hi ${viewing.agent.split(" ")[0]}, I'd love to learn more about ${viewing.street}…`}
              rows={5}
              className="flex-1 w-full resize-none rounded-xl border border-[#E8E0D5] bg-[#FAF7F2] px-4 py-3 text-sm text-[#1B3A6B] placeholder:text-slate-300 outline-none focus:border-[#93C5FD] focus:ring-2 focus:ring-[#DBEAFE] transition-all duration-200"
            />

            <button onClick={onSend} disabled={!message.trim()}
              className="mt-3 w-full py-3 rounded-xl text-sm font-semibold bg-[#1B3A6B] text-white hover:bg-[#0D2144] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200">
              Send Message
            </button>
            <p className="text-center text-slate-300 text-[11px] mt-3">VryfID connects verified renters only</p>
          </div>
        </div>

        {/* VIBE SCORE — full width, keyed to re-animate on listing change */}
        <div key={`vibes-${viewing.id}`} className="mb-10">
          <VibeScoreSection listing={viewing} />
        </div>

        {/* Also Consider */}
        {ranked.length > 1 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="font-serif text-[#1B3A6B] text-2xl">Also Consider</h3>
              <div className="flex-1 h-px bg-[#E8E0D5]" />
              <span className="text-slate-400 text-xs">click to explore</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {ranked.slice(1, 4).map((l, i) => (
                <AlsoConsiderCard
                  key={l.id}
                  listing={l}
                  rank={i + 2}
                  isViewing={viewing.id === l.id}
                  onSelect={selectListing}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-[#E8E0D5] mt-4">
        <div className="max-w-5xl mx-auto px-6 py-7 flex flex-col md:flex-row items-center justify-between gap-3">
          <Logo />
          <p className="text-slate-300 text-xs">Product concept demo · All listings and pricing are illustrative.</p>
        </div>
      </footer>

      <Toast visible={toast} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
export default function App() {
  const [step, setStep] = useState("intro");
  const [answers, setAnswers] = useState({});
  const [ranked, setRanked] = useState([]);
  const [archetype, setArchetype] = useState(null);
  const [archetypeKey, setArchetypeKey] = useState(null);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(false);
  const detailsRef = useRef(null);

  function handleAnswer(questionId, value) {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    const qIndex = QUESTIONS.findIndex((q) => q.id === questionId);
    if (qIndex < QUESTIONS.length - 1) {
      setStep(qIndex + 1);
    } else {
      const results = scoreAndRank(newAnswers);
      const key = getArchetypeKey(newAnswers.location);
      setRanked(results);
      setArchetype(getArchetype(newAnswers.location));
      setArchetypeKey(key);
      setStep("analyzing");
    }
  }

  function handleSend() {
    if (!message.trim()) return;
    setToast(true);
    setMessage("");
    setTimeout(() => setToast(false), 4000);
  }

  function startOver() {
    setStep("intro");
    setAnswers({});
    setRanked([]);
    setArchetype(null);
    setArchetypeKey(null);
    setMessage("");
    setToast(false);
  }

  function scrollToDetails() {
    setTimeout(() => detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans">
      {step === "intro" && <IntroView onStart={() => setStep(0)} />}

      {typeof step === "number" && (
        <QuestionView
          question={QUESTIONS[step]}
          questionIndex={step}
          total={QUESTIONS.length}
          answers={answers}
          onAnswer={handleAnswer}
          onBack={() => (step > 0 ? setStep(step - 1) : setStep("intro"))}
        />
      )}

      {step === "analyzing" && <AnalyzingView onDone={() => setStep("results")} />}

      {step === "results" && archetype && (
        <>
          <ArchetypeCard
            archetypeKey={archetypeKey}
            archetype={archetype}
            match={ranked[0]}
            onScrollDown={scrollToDetails}
          />
          <ListingSection
            ranked={ranked}
            message={message}
            onMessageChange={setMessage}
            onSend={handleSend}
            onStartOver={startOver}
            toast={toast}
            detailsRef={detailsRef}
          />
        </>
      )}
    </div>
  );
}
