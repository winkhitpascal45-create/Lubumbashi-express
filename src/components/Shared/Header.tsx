import React from 'react';
import { ActiveAppView } from '../../types';
import { useDelivery } from '../../context/DeliveryContext';
import { Smartphone, Bike, Building2, Columns, RefreshCw, Bell, Shield, Users, Compass } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    orders,
    resetDemoData,
    availableOrdersForDriver,
    language,
    setLanguage,
    t,
    clientProfile,
    currentDriver,
    openProfileModal,
    setIsCommunityModalOpen,
    setIsCommunesModalOpen,
    broadcasts
  } = useDelivery();

  const latestActiveBroadcast = broadcasts.find((b) => b.isActive);

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'accepted' || o.status === 'heading_to_pickup' || o.status === 'picked_up'
  ).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 md:gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
            <span className="text-base tracking-tighter">LX</span>
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
              {t.appName}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="text-amber-400 font-semibold">Lubumbashi (RDC)</span>
              <span>·</span>
              <span>{t.appSubtitle}</span>
            </div>
          </div>
        </div>

        {/* Zone 2: Interface Switcher (Client, Livreur, Partenaire/Admin, Split) */}
        <nav className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveView('client')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition whitespace-nowrap shrink-0 ${
              activeView === 'client'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{t.clientApp}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('driver')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition whitespace-nowrap shrink-0 relative ${
              activeView === 'driver'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>{t.driverApp}</span>
            {availableOrdersForDriver.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveView('partner_admin')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition whitespace-nowrap shrink-0 ${
              activeView === 'partner_admin'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{t.partnerAdmin}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('split')}
            className={`hidden lg:flex px-3 py-1.5 text-xs font-semibold rounded-lg items-center gap-1.5 transition whitespace-nowrap shrink-0 ${
              activeView === 'split'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
            title="Afficher les 3 interfaces simultanément"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>{t.splitView}</span>
          </button>
        </nav>

        {/* Zone 3: Community 1M+, Profile Photo, Language & Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* 7 Communes & Quartiers Button */}
          <button
            type="button"
            onClick={() => setIsCommunesModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition shadow-sm"
            title="Consulter les 7 Communes & tous les Quartiers de Lubumbashi"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">7 Communes</span>
          </button>

          {/* 1 Million+ Community Network Button */}
          <button
            type="button"
            onClick={() => setIsCommunityModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition shadow-sm"
            title="Réseau de +1 Million d'utilisateurs à Lubumbashi"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">+1.2M</span>
          </button>

          {/* Profile Photo Button (Client or Motard) */}
          <button
            type="button"
            onClick={() => openProfileModal(activeView === 'driver' ? 'driver' : 'client')}
            className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs transition"
            title="Modifier la photo de profil et coordonnées"
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-amber-400/60 bg-slate-700 flex items-center justify-center shrink-0">
              {activeView === 'driver' ? (
                currentDriver.avatarUrl ? (
                  <img src={currentDriver.avatarUrl} alt={currentDriver.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs">{currentDriver.avatar}</span>
                )
              ) : clientProfile.avatarUrl ? (
                <img src={clientProfile.avatarUrl} alt={clientProfile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs">{clientProfile.avatar}</span>
              )}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-[11px] font-bold text-white leading-tight truncate max-w-[85px]">
                {activeView === 'driver' ? currentDriver.name.split(' ')[0] : clientProfile.name.split(' ')[0]}
              </span>
              <span className="text-[9px] text-amber-400 font-semibold leading-none">
                {activeView === 'driver' ? 'Motard Pro' : 'Client'}
              </span>
            </div>
          </button>

          {/* Language Selector (Français / Swahili) */}
          <div className="flex items-center bg-slate-800/90 p-0.5 rounded-xl border border-slate-700/80 shadow-inner">
            <button
              type="button"
              onClick={() => setLanguage('fr')}
              className={`px-2 py-1 text-xs font-bold rounded-lg transition ${
                language === 'fr'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Changer de langue : Français"
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => setLanguage('sw')}
              className={`px-2 py-1 text-xs font-bold rounded-lg transition ${
                language === 'sw'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Badilisha lugha : Kiswahili (Lubumbashi)"
            >
              SW
            </button>
          </div>

          <button
            type="button"
            onClick={resetDemoData}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/50 transition hidden sm:flex"
            title="Réinitialiser les données"
            aria-label="Réinitialiser données"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <div className="relative hidden md:block">
            <div className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.activePinBadge}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Flash Alert Ticker */}
      {latestActiveBroadcast && (
        <div className={`w-full py-1.5 px-4 text-xs font-medium flex items-center justify-between border-t transition ${
          latestActiveBroadcast.type === 'urgent'
            ? 'bg-rose-950/90 text-rose-200 border-rose-800'
            : latestActiveBroadcast.type === 'warning'
            ? 'bg-amber-950/80 text-amber-200 border-amber-800'
            : 'bg-slate-800/90 text-slate-300 border-slate-700'
        }`}>
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold flex items-center gap-1 shrink-0">
                <Bell className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>[{latestActiveBroadcast.title}]</span>
              </span>
              <span className="truncate text-[11px] opacity-90">{latestActiveBroadcast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveView('partner_admin')}
              className="text-[10px] text-amber-400 hover:underline font-bold shrink-0 hidden sm:inline"
            >
              Console Propriétaire →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

