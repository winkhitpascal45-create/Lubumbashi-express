import React, { useState, useEffect } from 'react';
import { LocationPoint, LubumbashiCommuneData } from '../../types';
import {
  LUBUMBASHI_COMMUNES_DETAILED,
  LUBUMBASHI_PRESET_LOCATIONS,
  getCommuneDataByName,
  formatFullAddress
} from '../../data/mockData';
import { MapPin, Building, Compass, Sparkles, Check, ChevronDown, Landmark, Navigation } from 'lucide-react';

interface AddressInputBlockProps {
  label: string;
  pointType: 'pickup' | 'delivery';
  value: LocationPoint;
  onChange: (updatedPoint: LocationPoint) => void;
  compact?: boolean;
}

export const AddressInputBlock: React.FC<AddressInputBlockProps> = ({
  label,
  pointType,
  value,
  onChange,
  compact = false
}) => {
  // Mode: 'precise' (detailed avenue + quartier + commune) or 'preset' (famous landmark)
  const [inputMode, setInputMode] = useState<'precise' | 'preset'>('precise');

  // Internal detailed state
  const selectedCommuneData = getCommuneDataByName(value.commune || 'Commune de Lubumbashi');
  const [currentCommuneId, setCurrentCommuneId] = useState<string>(selectedCommuneData.id);
  const [quartier, setQuartier] = useState<string>(value.quartier || selectedCommuneData.quartiers[0]);
  const [avenue, setAvenue] = useState<string>(value.avenue || selectedCommuneData.popularAvenues[0]);
  const [numeroParcelle, setNumeroParcelle] = useState<string>(value.numeroParcelle || 'N° 14');
  const [landmark, setLandmark] = useState<string>(value.landmark || '');
  const [name, setName] = useState<string>(value.name || '');

  // Keep internal state synced when value changes from outside
  useEffect(() => {
    if (value.commune) {
      const cData = getCommuneDataByName(value.commune);
      setCurrentCommuneId(cData.id);
    }
    if (value.quartier) setQuartier(value.quartier);
    if (value.avenue) setAvenue(value.avenue);
    if (value.numeroParcelle) setNumeroParcelle(value.numeroParcelle);
    if (value.landmark) setLandmark(value.landmark);
    if (value.name) setName(value.name);
  }, [value.commune, value.quartier, value.avenue, value.numeroParcelle, value.landmark, value.name]);

  const activeCommune = LUBUMBASHI_COMMUNES_DETAILED.find((c) => c.id === currentCommuneId) || LUBUMBASHI_COMMUNES_DETAILED[0];

  // Helper to recompute coordinates based on commune and quartier
  const computeCoords = (commune: LubumbashiCommuneData, qName: string, avName: string): { x: number; y: number } => {
    const base = commune.centerCoords;
    // Small deterministic offset to give each avenue its distinct place on the map
    let hash = 0;
    const str = `${qName}-${avName}`;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const offsetX = ((Math.abs(hash) % 15) - 7) * 0.4;
    const offsetY = ((Math.abs(hash >> 3) % 15) - 7) * 0.4;
    return {
      x: Math.max(8, Math.min(92, Math.round((base.x + offsetX) * 10) / 10)),
      y: Math.max(8, Math.min(92, Math.round((base.y + offsetY) * 10) / 10))
    };
  };

  const handleCommuneChange = (newCommuneId: string) => {
    setCurrentCommuneId(newCommuneId);
    const newCommune = LUBUMBASHI_COMMUNES_DETAILED.find((c) => c.id === newCommuneId) || LUBUMBASHI_COMMUNES_DETAILED[0];
    const defaultQuartier = newCommune.quartiers[0];
    const defaultAvenue = newCommune.popularAvenues[0];
    setQuartier(defaultQuartier);
    setAvenue(defaultAvenue);

    const newCoords = computeCoords(newCommune, defaultQuartier, defaultAvenue);
    const fullAddress = formatFullAddress({
      commune: newCommune.name,
      quartier: defaultQuartier,
      avenue: defaultAvenue,
      numeroParcelle,
      landmark
    });

    onChange({
      ...value,
      name: name || `${defaultAvenue}, ${defaultQuartier}`,
      commune: newCommune.name,
      quartier: defaultQuartier,
      avenue: defaultAvenue,
      numeroParcelle,
      landmark,
      address: fullAddress,
      coords: newCoords
    });
  };

  const updatePreciseLocation = (updates: {
    q?: string;
    av?: string;
    num?: string;
    lm?: string;
    customName?: string;
  }) => {
    const nextQuartier = updates.q !== undefined ? updates.q : quartier;
    const nextAvenue = updates.av !== undefined ? updates.av : avenue;
    const nextNum = updates.num !== undefined ? updates.num : numeroParcelle;
    const nextLandmark = updates.lm !== undefined ? updates.lm : landmark;
    const nextName = updates.customName !== undefined ? updates.customName : name;

    if (updates.q !== undefined) setQuartier(updates.q);
    if (updates.av !== undefined) setAvenue(updates.av);
    if (updates.num !== undefined) setNumeroParcelle(updates.num);
    if (updates.lm !== undefined) setLandmark(updates.lm);
    if (updates.customName !== undefined) setName(updates.customName);

    const newCoords = computeCoords(activeCommune, nextQuartier, nextAvenue);
    const fullAddress = formatFullAddress({
      commune: activeCommune.name,
      quartier: nextQuartier,
      avenue: nextAvenue,
      numeroParcelle: nextNum,
      landmark: nextLandmark
    });

    const displayTitle = nextName.trim()
      ? nextName
      : `${nextNum ? nextNum + ', ' : ''}${nextAvenue}`;

    onChange({
      ...value,
      name: displayTitle,
      commune: activeCommune.name,
      quartier: nextQuartier,
      avenue: nextAvenue,
      numeroParcelle: nextNum,
      landmark: nextLandmark,
      address: fullAddress,
      coords: newCoords
    });
  };

  const handleSelectPreset = (presetName: string) => {
    const loc = LUBUMBASHI_PRESET_LOCATIONS.find((l) => l.name === presetName);
    if (loc) {
      onChange(loc);
    }
  };

  const isPointA = pointType === 'pickup';

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-3.5 shadow-md">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
        <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
          <span
            className={`w-5 h-5 rounded-full font-extrabold text-[10px] flex items-center justify-center shrink-0 ${
              isPointA ? 'bg-amber-400 text-slate-950' : 'bg-emerald-400 text-slate-950'
            }`}
          >
            {isPointA ? 'A' : 'B'}
          </span>
          <span>{label}</span>
        </label>

        {/* Mode Toggle Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setInputMode('precise')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition flex items-center gap-1.5 ${
              inputMode === 'precise'
                ? isPointA
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3 h-3" />
            <span>Adresse Complète (Avenue & N°)</span>
          </button>

          <button
            type="button"
            onClick={() => setInputMode('preset')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition flex items-center gap-1.5 ${
              inputMode === 'preset'
                ? isPointA
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Landmark className="w-3 h-3" />
            <span>Repères Connus</span>
          </button>
        </div>
      </div>

      {/* MODE 1: PRECISE ADDRESS WITH COMMUNE, QUARTIER, AVENUE, N°, LANDMARK */}
      {inputMode === 'precise' ? (
        <div className="space-y-3">
          {/* 1. Commune & Quartier Selection Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Commune Selection */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1 flex items-center justify-between">
                <span>1. Commune de Lubumbashi (7 Communes)</span>
                <span className="text-[10px] text-amber-400">Katanga</span>
              </label>
              <select
                value={currentCommuneId}
                onChange={(e) => handleCommuneChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-amber-500"
              >
                {LUBUMBASHI_COMMUNES_DETAILED.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.quartiers.length} quartiers)
                  </option>
                ))}
              </select>
            </div>

            {/* Quartier Selection */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1 flex items-center justify-between">
                <span>2. Quartier officiel ({activeCommune.quartiers.length})</span>
                <span className="text-[10px] text-slate-500">Zone</span>
              </label>
              <select
                value={quartier}
                onChange={(e) => updatePreciseLocation({ q: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-amber-500"
              >
                {activeCommune.quartiers.map((q) => (
                  <option key={q} value={q}>
                    Quartier {q}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Avenue & Parcelle Number Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            {/* Avenue Name & Suggestions (8 cols) */}
            <div className="sm:col-span-8 space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 block">
                3. Nom de l'Avenue / Rue (ou Route)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={avenue}
                  onChange={(e) => updatePreciseLocation({ av: e.target.value })}
                  placeholder="ex: Avenue des Palmiers, Boulevard M'siri..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Quick suggestions chips for popular avenues in this commune */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500 font-medium">Avenues fréquentes :</span>
                {activeCommune.popularAvenues.slice(0, 4).map((popAv) => (
                  <button
                    key={popAv}
                    type="button"
                    onClick={() => updatePreciseLocation({ av: popAv })}
                    className={`text-[10px] px-2 py-0.5 rounded-lg border transition ${
                      avenue === popAv
                        ? isPointA
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {popAv.replace('Avenue ', 'Av. ').replace('Boulevard ', 'Blvd ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Numéro de Parcelle / Porte (4 cols) */}
            <div className="sm:col-span-4">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                4. N° Porte / Parcelle
              </label>
              <input
                type="text"
                value={numeroParcelle}
                onChange={(e) => updatePreciseLocation({ num: e.target.value })}
                placeholder="ex: N° 45, N° 12B"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* 3. Point de Repère Local (Crucial pour Lubumbashi) */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-amber-400" />
                <span>5. Point de Repère Local (Indispensable pour le motard)</span>
              </span>
              <span className="text-[10px] text-slate-500 italic">ex: Boutique, Kiosque, Station, École</span>
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => updatePreciseLocation({ lm: e.target.value })}
              placeholder="ex: En face de la station Total, Deuxième portail noir, Près de l’école Saint-Boniface..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
            />

            {/* Quick landmark chips */}
            {activeCommune.landmarks.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <span className="text-[10px] text-slate-500">Repères suggérés :</span>
                {activeCommune.landmarks.slice(0, 3).map((lm) => (
                  <button
                    key={lm}
                    type="button"
                    onClick={() => updatePreciseLocation({ lm: `À proximité de ${lm}` })}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                  >
                    {lm}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* MODE 2: PRESET FAMOUS LOCATIONS */
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-slate-400 block">
            Sélectionnez un point d'intérêt officiel à Lubumbashi
          </label>
          <select
            value={value.name}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-amber-500"
          >
            {LUBUMBASHI_PRESET_LOCATIONS.map((loc) => (
              <option key={loc.name} value={loc.name}>
                {loc.name} — {loc.commune}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* LIVE ADDRESS PREVIEW CARD */}
      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5 text-xs">
        <MapPin
          className={`w-4 h-4 shrink-0 mt-0.5 ${isPointA ? 'text-amber-400' : 'text-emerald-400'}`}
        />
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white truncate">
              {value.numeroParcelle ? `${value.numeroParcelle}, ` : ''}
              {value.avenue || value.name}
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                isPointA
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {value.commune || 'Lubumbashi'}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed truncate">
            {value.address}
          </p>

          {value.landmark && (
            <p className="text-[10px] text-amber-400/90 font-medium">
              🧭 Repère pour coursier : {value.landmark}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
