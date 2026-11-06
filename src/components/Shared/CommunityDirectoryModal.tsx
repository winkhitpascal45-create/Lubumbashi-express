import React, { useState } from 'react';
import { useDelivery } from '../../context/DeliveryContext';
import { LUBUMBASHI_COMMUNES } from '../../data/mockData';
import {
  X,
  Users,
  Search,
  CheckCircle2,
  Bike,
  Building2,
  Star,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Award,
  Globe2
} from 'lucide-react';

export const CommunityDirectoryModal: React.FC = () => {
  const {
    isCommunityModalOpen,
    setIsCommunityModalOpen,
    scaleStats,
    registeredUsers,
    language
  } = useDelivery();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'client' | 'driver' | 'partner'>('all');
  const [selectedCommune, setSelectedCommune] = useState<string>('all');

  if (!isCommunityModalOpen) return null;

  const filteredUsers = registeredUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.commune.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.membershipNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    const matchesCommune = selectedCommune === 'all' || u.commune.includes(selectedCommune);
    return matchesSearch && matchesRole && matchesCommune;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header with 1M+ Scale Badge */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                {language === 'sw'
                  ? 'Jumuiya ya Watumiaji Zaidi ya Milioni 1 (Lubumbashi)'
                  : 'Écosystème & Annuaire : Plus de 1 Million d’Utilisateurs'}
              </h2>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                +1,280,000 Inscrits
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'sw'
                ? 'Mtandao mkubwa zaidi wa usafirishaji wa haraka na salama kwa kodi ya PIN katika mkoa wa Haut-Katanga (RDC).'
                : 'Plateforme leader de livraison certifiée par PIN à Lubumbashi, connectant particuliers, motards et commerçants.'}
            </p>
          </div>

          <button
            onClick={() => setIsCommunityModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1 Million+ Scale Real-Time KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-4 bg-slate-950 border-b border-slate-800 text-xs">
          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Utilisateurs Enregistrés</span>
            <span className="text-base sm:text-xl font-extrabold text-amber-400 font-mono block mt-0.5">
              {scaleStats.totalUsersRegistered.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +1,450 ajouts/jour
            </span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Motards Partenaires</span>
            <span className="text-base sm:text-xl font-extrabold text-emerald-400 font-mono block mt-0.5">
              {scaleStats.activeDriversCount.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">7 communes couvertes</span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Courses Traitées / Jour</span>
            <span className="text-base sm:text-xl font-extrabold text-sky-400 font-mono block mt-0.5">
              {scaleStats.dailyDeliveries.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Point A → Point B</span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Sécurité Code PIN</span>
            <span className="text-base sm:text-xl font-extrabold text-amber-400 font-mono block mt-0.5">
              {scaleStats.satisfactionRate}%
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3" /> Zéro litige de remise
            </span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'sw'
                    ? 'Tafuta mteja, motard, wilaya (Golf, Ruashi, Kenya)...'
                    : 'Rechercher un client, motard, matricule ou commune (Golf, Ruashi)...'
                }
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Role Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedRole('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  selectedRole === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
                }`}
              >
                Tous (+1.2M)
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('client')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  selectedRole === 'client' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
                }`}
              >
                Clients
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('driver')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  selectedRole === 'driver' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
                }`}
              >
                Motards Pro
              </button>
            </div>
          </div>
        </div>

        {/* User Directory Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              {language === 'sw'
                ? `Matokeo : ${filteredUsers.length} akaunti zilizothibitishwa`
                : `Affichage : ${filteredUsers.length} comptes certifiés Lubumbashi Express`}
            </span>
            <span className="text-[11px] text-amber-400 font-mono">Grand Katanga (RDC)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredUsers.map((usr) => (
              <div
                key={usr.id}
                className="bg-slate-850 hover:bg-slate-800/90 border border-slate-750 p-3.5 rounded-2xl flex items-center gap-3.5 transition shadow-sm hover:border-amber-500/40"
              >
                {/* Avatar Photo */}
                <div className="relative shrink-0">
                  <div className="w-13 h-13 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-800 flex items-center justify-center">
                    {usr.avatarUrl ? (
                      <img src={usr.avatarUrl} alt={usr.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">{usr.avatarEmoji}</span>
                    )}
                  </div>
                  {usr.isVerified && (
                    <span
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] shadow"
                      title="Compte Vérifié"
                    >
                      ✓
                    </span>
                  )}
                </div>

                {/* User Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-white truncate">{usr.name}</h4>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        usr.role === 'driver'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : usr.role === 'partner'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {usr.role === 'driver' ? 'Motard Pro' : usr.role === 'partner' ? 'Partenaire' : 'Client'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>{usr.commune}</span>
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1.5 border-t border-slate-800">
                    <span className="font-mono text-slate-300">{usr.membershipNumber}</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {usr.rating}
                      </span>
                      <span>·</span>
                      <span className="text-slate-300">{usr.totalTransactions} courses</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-emerald-400" />
            <span>Infrastructure haute capacité dimensionnée pour +1,500,000 comptes en RDC</span>
          </div>

          <button
            type="button"
            onClick={() => setIsCommunityModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
          >
            Fermer l'Annuaire
          </button>
        </div>
      </div>
    </div>
  );
};
