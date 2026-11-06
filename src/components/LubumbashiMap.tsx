import React, { useState } from 'react';
import { LocationPoint, DriverProfile, DeliveryOrder } from '../types';
import { LUBUMBASHI_PRESET_LOCATIONS } from '../data/mockData';
import { MapPin, Navigation, Compass, Layers, ShieldCheck } from 'lucide-react';
import { calculateLubumbashiDistance } from '../utils/pricing';
import { useDelivery } from '../context/DeliveryContext';

interface LubumbashiMapProps {
  order?: DeliveryOrder | null;
  drivers?: DriverProfile[];
  interactiveSelection?: boolean;
  onSelectLocation?: (point: LocationPoint, target: 'pickup' | 'delivery') => void;
  selectionTarget?: 'pickup' | 'delivery';
  pickupPoint?: LocationPoint | null;
  deliveryPoint?: LocationPoint | null;
  heightClassName?: string;
  showAllDrivers?: boolean;
}

export const LubumbashiMap: React.FC<LubumbashiMapProps> = ({
  order,
  drivers = [],
  interactiveSelection = false,
  onSelectLocation,
  selectionTarget = 'pickup',
  pickupPoint: propPickup,
  deliveryPoint: propDelivery,
  heightClassName = 'h-[360px] md:h-[440px]',
  showAllDrivers = true
}) => {
  const { t, language } = useDelivery();
  const [selectedPoint, setSelectedPoint] = useState<LocationPoint | null>(null);
  const [mapLayer, setMapLayer] = useState<'streets' | 'satellite'>('streets');

  const effectivePickup = order ? order.pickup : propPickup;
  const effectiveDelivery = order ? order.delivery : propDelivery;
  const assignedDriver = order?.assignedDriver;

  const previewDistanceKm =
    effectivePickup && effectiveDelivery
      ? calculateLubumbashiDistance(effectivePickup.coords, effectiveDelivery.coords)
      : null;


  // Compute interpolated position for active driver if in transit
  let driverPos: { x: number; y: number } | null = null;
  if (order && order.status !== 'delivered' && order.status !== 'cancelled') {
    if (order.status === 'heading_to_pickup') {
      // Driver moving towards pickup Point A
      const start = assignedDriver?.coords || { x: 46, y: 48 };
      const dest = effectivePickup?.coords || { x: 50, y: 50 };
      driverPos = {
        x: start.x + (dest.x - start.x) * 0.65,
        y: start.y + (dest.y - start.y) * 0.65
      };
    } else if (order.status === 'picked_up') {
      // Driver moving between Point A and Point B
      const start = effectivePickup?.coords || { x: 46, y: 48 };
      const dest = effectiveDelivery?.coords || { x: 26, y: 38 };
      driverPos = {
        x: start.x + (dest.x - start.x) * 0.58,
        y: start.y + (dest.y - start.y) * 0.58
      };
    }
  }

  // Predefined route curved control point for natural road simulation
  const getCurvePath = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    // slight curve offset
    const ctrlX = midX + (p2.y - p1.y) * 0.15;
    const ctrlY = midY - (p2.x - p1.x) * 0.15;
    return `M ${p1.x} ${p1.y} Q ${ctrlX} ${ctrlY} ${p2.x} ${p2.y}`;
  };

  return (
    <div className={`relative w-full ${heightClassName} rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-950 select-none shadow-xl flex flex-col`}>
      {/* Map Header Overlay Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-md">
          <Compass className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '24s' }} />
          <span className="text-xs font-semibold tracking-wide text-slate-200">{t.lubumbashiLiveGps}</span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">11.6608° S, 27.4794° E</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {order ? (
            <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {language === 'sw' ? 'Njia' : 'Trajet'} : {order.distanceKm} km · ~{order.estimatedMinutes} min
              </span>
            </div>
          ) : previewDistanceKm !== null ? (
            <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/40 text-xs font-medium text-slate-200 flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>A → B : {previewDistanceKm} km</span>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setMapLayer((prev) => (prev === 'streets' ? 'satellite' : 'streets'))}
            className="bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl border border-slate-700 text-xs flex items-center gap-1 transition shadow-md"
            title={language === 'sw' ? 'Badilisha mtazamo' : 'Changer de vue'}
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline capitalize">{mapLayer === 'streets' ? (language === 'sw' ? 'Ramani' : 'Plan') : 'Satellite'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Selection Helper Banner */}
      {interactiveSelection && (
        <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none">
          <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-amber-500/40 text-xs text-slate-200 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full flex items-center justify-center text-[9px] font-bold text-black ${selectionTarget === 'pickup' ? 'bg-amber-400' : 'bg-emerald-400'}`}>
                {selectionTarget === 'pickup' ? 'A' : 'B'}
              </span>
              <span>
                {language === 'sw' ? (
                  <>Gusa eneo ili kuchagua <strong className="text-white">{selectionTarget === 'pickup' ? 'Point A (Mwanzo)' : 'Point B (Mwisho)'}</strong></>
                ) : (
                  <>Touchez un lieu pour définir le <strong className="text-white">{selectionTarget === 'pickup' ? 'Point A (Ramassage)' : 'Point B (Destination)'}</strong></>
                )}
              </span>
            </div>
            <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
              {selectionTarget === 'pickup' ? (language === 'sw' ? 'Kuchukua' : 'Ramassage') : (language === 'sw' ? 'Kuleta' : 'Livraison')}
            </span>
          </div>
        </div>
      )}

      {/* SVG Vector Map Container */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className={`w-full h-full ${mapLayer === 'satellite' ? 'filter contrast-125 brightness-90' : ''}`}
      >
        <defs>
          {/* Street map background */}
          <linearGradient id="mapBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0b1120" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#0a0f1d" />
          </linearGradient>

          {/* Communes area gradient */}
          <radialGradient id="centreGlow" cx="50%" cy="50%" r="40%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.1" />
          </radialGradient>

          {/* Route path gradient */}
          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.15" />
          </pattern>
        </defs>

        {/* Base Canvas Layer */}
        <rect width="100" height="100" fill="url(#mapBgGrad)" />
        <rect width="100" height="100" fill="url(#grid)" opacity="0.6" />

        {/* Lac Kipopo / Rivers of Lubumbashi */}
        <path
          d="M 15 10 Q 20 18 24 24 T 18 36 T 12 50"
          fill="none"
          stroke="#0369a1"
          strokeWidth="1.2"
          strokeOpacity="0.35"
        />
        <text x="14" y="32" fill="#38bdf8" opacity="0.3" fontSize="2.2" fontStyle="italic">
          Rivière Lubumbashi
        </text>

        {/* Communes Zones outlines */}
        {/* Golf / Annexe */}
        <ellipse cx="28" cy="38" rx="16" ry="14" fill="#3b82f6" fillOpacity="0.04" stroke="#3b82f6" strokeWidth="0.2" strokeDasharray="1,1" />
        <text x="22" y="32" fill="#94a3b8" opacity="0.4" fontSize="2.2" fontWeight="600">GOLF / ANNEXE</text>

        {/* Centre-Ville */}
        <ellipse cx="50" cy="50" rx="14" ry="12" fill="url(#centreGlow)" stroke="#f59e0b" strokeWidth="0.25" strokeDasharray="1,1" />
        <text x="44" y="44" fill="#fbbf24" opacity="0.6" fontSize="2.4" fontWeight="700">CENTRE-VILLE</text>

        {/* Kamalondo */}
        <ellipse cx="44" cy="64" rx="10" ry="8" fill="#10b981" fillOpacity="0.04" stroke="#10b981" strokeWidth="0.2" strokeDasharray="1,1" />
        <text x="40" y="66" fill="#94a3b8" opacity="0.4" fontSize="2.2" fontWeight="600">KAMALONDO</text>

        {/* Kenya */}
        <ellipse cx="32" cy="74" rx="12" ry="9" fill="#8b5cf6" fillOpacity="0.04" stroke="#8b5cf6" strokeWidth="0.2" strokeDasharray="1,1" />
        <text x="28" y="76" fill="#94a3b8" opacity="0.4" fontSize="2.2" fontWeight="600">KENYA</text>

        {/* Katuba */}
        <ellipse cx="28" cy="84" rx="12" ry="9" fill="#a855f7" fillOpacity="0.04" stroke="#a855f7" strokeWidth="0.2" strokeDasharray="1,1" />
        <text x="24" y="86" fill="#94a3b8" opacity="0.4" fontSize="2.2" fontWeight="600">KATUBA</text>

        {/* Ruashi & Luano */}
        <ellipse cx="78" cy="28" rx="15" ry="13" fill="#ec4899" fillOpacity="0.04" stroke="#ec4899" strokeWidth="0.2" strokeDasharray="1,1" />
        <text x="74" y="22" fill="#94a3b8" opacity="0.4" fontSize="2.2" fontWeight="600">RUASHI / LUANO</text>

        {/* Kampemba / Bel-Air */}
        <ellipse cx="68" cy="60" rx="12" ry="11" fill="#06b6d4" fillOpacity="0.04" stroke="#06b6d4" strokeWidth="0.2" strokeDasharray="1,1" />
        <text x="63" y="62" fill="#94a3b8" opacity="0.4" fontSize="2.2" fontWeight="600">KAMPEMBA</text>

        {/* Main Road Network of Lubumbashi */}
        {/* Chaussée Laurent-Désiré Kabila */}
        <path d="M 12 78 L 34 72 L 45 58 L 52 46 L 74 28 L 88 18" fill="none" stroke="#334155" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 12 78 L 34 72 L 45 58 L 52 46 L 74 28 L 88 18" fill="none" stroke="#f59e0b" strokeWidth="0.4" strokeOpacity="0.4" />

        {/* Boulevard M'siri */}
        <path d="M 36 30 L 48 50 L 58 70" fill="none" stroke="#334155" strokeWidth="1.4" />
        <path d="M 36 30 L 48 50 L 58 70" fill="none" stroke="#94a3b8" strokeWidth="0.3" strokeOpacity="0.4" />

        {/* Route du Golf */}
        <path d="M 50 48 L 38 42 L 26 38 L 16 32" fill="none" stroke="#334155" strokeWidth="1.2" />

        {/* Route Kasapa (UNILU) */}
        <path d="M 38 42 L 28 30 L 18 22" fill="none" stroke="#334155" strokeWidth="1.0" />

        {/* Route Kipushi */}
        <path d="M 45 58 L 34 72 L 24 88" fill="none" stroke="#334155" strokeWidth="1.2" />

        {/* Avenue Kasa-Vubu */}
        <path d="M 42 54 L 56 46 L 68 54" fill="none" stroke="#334155" strokeWidth="1.0" />

        {/* Road Labels */}
        <text x="56" y="38" fill="#64748b" opacity="0.6" fontSize="1.6" transform="rotate(-30 56 38)">
          Chaussée L.D. Kabila
        </text>
        <text x="43" y="36" fill="#64748b" opacity="0.6" fontSize="1.5" transform="rotate(58 43 36)">
          Blvd M’siri
        </text>

        {/* Active Route Rendering between Point A and Point B */}
        {effectivePickup && effectiveDelivery && (
          <g>
            {/* Outer route shadow */}
            <path
              d={getCurvePath(effectivePickup.coords, effectiveDelivery.coords)}
              fill="none"
              stroke="#000000"
              strokeWidth="2.2"
              strokeOpacity="0.7"
              strokeLinecap="round"
            />
            {/* Glowing route backbone */}
            <path
              d={getCurvePath(effectivePickup.coords, effectiveDelivery.coords)}
              fill="none"
              stroke="url(#routeGrad)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeDasharray="2, 1"
            />
          </g>
        )}

        {/* Preset Lubumbashi Landmarks (Clickable for quick selection) */}
        {LUBUMBASHI_PRESET_LOCATIONS.map((loc) => {
          const isPickup = effectivePickup?.name === loc.name;
          const isDelivery = effectiveDelivery?.name === loc.name;
          const isSelected = selectedPoint?.name === loc.name;

          return (
            <g
              key={loc.name}
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => {
                setSelectedPoint(loc);
                if (interactiveSelection && onSelectLocation) {
                  onSelectLocation(loc, selectionTarget);
                }
              }}
            >
              {/* Landmark point dot */}
              <circle
                cx={loc.coords.x}
                cy={loc.coords.y}
                r={isPickup || isDelivery ? 2.6 : 1.2}
                fill={isPickup ? '#f59e0b' : isDelivery ? '#10b981' : isSelected ? '#38bdf8' : '#64748b'}
                stroke="#0f172a"
                strokeWidth="0.4"
              />

              {/* Landmark pulse if chosen */}
              {(isPickup || isDelivery) && (
                <circle
                  cx={loc.coords.x}
                  cy={loc.coords.y}
                  r="4"
                  fill="none"
                  stroke={isPickup ? '#f59e0b' : '#10b981'}
                  strokeWidth="0.4"
                  opacity="0.6"
                  className="animate-map-pulse"
                />
              )}

              {/* Landmark Name label */}
              <text
                x={loc.coords.x}
                y={loc.coords.y + 3.2}
                textAnchor="middle"
                fill={isPickup ? '#fbbf24' : isDelivery ? '#34d399' : '#94a3b8'}
                fontSize="1.7"
                fontWeight={isPickup || isDelivery ? '700' : '500'}
                stroke="#020617"
                strokeWidth="0.3"
                paintOrder="stroke"
              >
                {loc.name.split(' ')[0]} {loc.name.split(' ')[1] || ''}
              </text>
            </g>
          );
        })}

        {/* Point A Marker (Ramassage) */}
        {effectivePickup && (
          <g transform={`translate(${effectivePickup.coords.x}, ${effectivePickup.coords.y})`}>
            <circle cx="0" cy="0" r="3.2" fill="#f59e0b" stroke="#ffffff" strokeWidth="0.6" />
            <text x="0" y="1.1" textAnchor="middle" fill="#000000" fontSize="2.4" fontWeight="800">
              A
            </text>
          </g>
        )}

        {/* Point B Marker (Livraison) */}
        {effectiveDelivery && (
          <g transform={`translate(${effectiveDelivery.coords.x}, ${effectiveDelivery.coords.y})`}>
            <circle cx="0" cy="0" r="3.2" fill="#10b981" stroke="#ffffff" strokeWidth="0.6" />
            <text x="0" y="1.1" textAnchor="middle" fill="#000000" fontSize="2.4" fontWeight="800">
              B
            </text>
          </g>
        )}

        {/* Active Driver animated marker if order is in progress */}
        {driverPos && (
          <g transform={`translate(${driverPos.x}, ${driverPos.y})`}>
            {/* Radar wave */}
            <circle cx="0" cy="0" r="5" fill="#38bdf8" opacity="0.25" className="animate-ping" />
            <circle cx="0" cy="0" r="3" fill="#0284c7" stroke="#ffffff" strokeWidth="0.6" />
            <text x="0" y="0.9" textAnchor="middle" fill="#ffffff" fontSize="2.2" fontWeight="bold">
              🏍️
            </text>
          </g>
        )}

        {/* Other online fleet drivers across Lubumbashi */}
        {showAllDrivers &&
          drivers
            .filter((d) => d.isOnline && (!assignedDriver || d.id !== assignedDriver.id))
            .map((drv) => (
              <g key={drv.id} transform={`translate(${drv.coords.x}, ${drv.coords.y})`} opacity="0.8">
                <circle cx="0" cy="0" r="1.8" fill="#334155" stroke="#38bdf8" strokeWidth="0.5" />
                <circle cx="0" cy="0" r="0.9" fill="#38bdf8" />
              </g>
            ))}
      </svg>

      {/* Map Legend Footer */}
      <div className="bg-slate-900/90 border-t border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span>{t.legendPointA}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span>{t.legendPointB}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
            <span>{t.legendDrivers} ({drivers.filter((d) => d.isOnline).length})</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.legendSecurePin}</span>
        </div>
      </div>
    </div>
  );
};
