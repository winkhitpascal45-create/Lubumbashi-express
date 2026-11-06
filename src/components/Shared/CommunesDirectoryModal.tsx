import React, { useState } from 'react';
import { LUBUMBASHI_COMMUNES_DETAILED } from '../../data/mockData';
import { LubumbashiCommuneData, LocationPoint } from '../../types';
import { X, Search, MapPin, Building, Compass, Landmark, Check, ArrowRight } from 'lucide-react';

interface CommunesDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation?: (location: LocationPoint) => void;
}

export const CommunesDirectoryModal: React.FC<CommunesDirectoryModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommuneId, setSelectedCommuneId] = useState<string>(LUBUMBASHI_COMMUNES_DETAILED[0].id);

  if (!isOpen) return null;

  const totalQuartiers = LUBUMBASHI_COMMUNES_DETAILED.reduce((sum, c) => sum + c.quartiers.length, 0);

  // Filtered communes / quartiers
  const filteredCommunes = LUBUMBASHI_COMMUNES_DETAILED.filter((c) => {
    const query = searchQuery.toLowerCase();
    const matchName = c.name.toLowerCase().includes(query) || c.shortName.toLowerCase().includes(query);
    const matchQuartier = c.quartiers.some((q) => q.toLowerCase().includes(query));
    const matchAvenue = c.popularAvenues.some((a) => a.toLowerCase().includes(query));
    const matchLandmark = c.landmarks.some((lm) => lm.toLowerCase().includes(query));
    return matchName || matchQuartier || matchAvenue || matchLandmark;
  });

  const activeCommune = LUBUMBASHI_COMMUNES_DETAILED.find((c) => c.id === selectedCommuneId) || LUBUMBASHI_COMMUNES_DETAILED[0];

  const handleChooseAvenue = (av: string, q: string) => {
    if (!onSelectLocation) return;
    const loc: LocationPoint = {
      name: `${av}, ${q}`,
      address: `N° 10, ${av}, Quartier ${q}, ${activeCommune.name}`,
      commune: activeCommune.name,
      quartier: q,
      avenue: av,
      numeroParcelle: 'N° 10',
      landmark: activeCommune.landmarks[0] || 'Repère local',
      coords: activeCommune.centerCoords
    };
    onSelectLocation(loc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Répertoire Officiel des Communes & Quartiers de Lubumbashi
                </h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30 font-mono">
                  7 Communes · {totalQuartiers} Quartiers
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Explorez l'ensemble des avenues, quartiers et repères de la capitale du cuivre
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une avenue, un quartier, une commune ou un repère (ex: Golf, Bel-Air, Av. Kasa-Vubu, Stade Mazembe)..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Body Content: Commune Tabs & Detailed Info */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* Left Column: 7 Communes Nav (4 cols) */}
          <div className="md:col-span-4 p-3 space-y-2 overflow-y-auto bg-slate-950/40">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 block">
              Les 7 Communes Officielles
            </span>
            <div className="space-y-1">
              {filteredCommunes.map((commune) => (
                <button
                  key={commune.id}
                  type="button"
                  onClick={() => setSelectedCommuneId(commune.id)}
                  className={`w-full p-2.5 rounded-xl text-left transition flex items-center justify-between ${
                    selectedCommuneId === commune.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">{commune.name}</div>
                    <div className={`text-[10px] ${selectedCommuneId === commune.id ? 'text-slate-900' : 'text-slate-400'}`}>
                      {commune.quartiers.length} quartiers répertoriés
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Active Commune Details (8 cols) */}
          <div className="md:col-span-8 p-4 sm:p-5 space-y-5 overflow-y-auto">
            {/* Header of selected commune */}
            <div className="space-y-1.5 pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>{activeCommune.name}</span>
                </h3>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  Couverture Lubumbashi Express 100%
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeCommune.description}
              </p>
            </div>

            {/* All Quartiers of this commune */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 block">
                Quartiers Officiels ({activeCommune.quartiers.length})
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {activeCommune.quartiers.map((q) => (
                  <div
                    key={q}
                    className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 flex items-center gap-2"
                  >
                    <Building className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-semibold truncate">{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Avenues */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <label className="text-xs font-bold text-slate-200 block">
                Avenues et Artères Principales ({activeCommune.popularAvenues.length})
              </label>
              <div className="flex flex-wrap gap-1.5">
                {activeCommune.popularAvenues.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => handleChooseAvenue(av, activeCommune.quartiers[0])}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs transition flex items-center gap-1.5"
                    title="Utiliser cette avenue pour commander"
                  >
                    <span>{av}</span>
                    {onSelectLocation && <ArrowRight className="w-3 h-3 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Landmarks */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <label className="text-xs font-bold text-slate-200 block">
                Points de Repère Majeurs (Orientation des Motards)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeCommune.landmarks.map((lm) => (
                  <div
                    key={lm}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-center gap-2"
                  >
                    <Landmark className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{lm}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Précision d'adressage conforme aux normes de l'Hôtel de Ville de Lubumbashi</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
