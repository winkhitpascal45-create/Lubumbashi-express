/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DeliveryProvider, useDelivery } from './context/DeliveryContext';
import { Header } from './components/Shared/Header';
import { ClientView } from './components/ClientApp/ClientView';
import { DriverView } from './components/DriverApp/DriverView';
import { PartnerAdminView } from './components/PartnerAdmin/PartnerAdminView';
import { SplitTrioView } from './components/Shared/SplitTrioView';
import { ToastContainer } from './components/Shared/ToastContainer';
import { ProfileModal } from './components/Shared/ProfileModal';
import { CommunityDirectoryModal } from './components/Shared/CommunityDirectoryModal';
import { CommunesDirectoryModal } from './components/Shared/CommunesDirectoryModal';
import { DriverContractModal } from './components/Shared/DriverContractModal';
import { CarteImmatriculationModal } from './components/Shared/CarteImmatriculationModal';
import { Shield, MapPin, CheckCircle, Smartphone, Bike, Building2, User, Users, Compass } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    activeView,
    setActiveView,
    t,
    language,
    setLanguage,
    clientProfile,
    currentDriver,
    openProfileModal,
    setIsCommunityModalOpen,
    isCommunesModalOpen,
    setIsCommunesModalOpen
  } = useDelivery();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />

      {/* Main interface body */}
      <main className="flex-1 pb-16">
        {activeView === 'client' && <ClientView />}
        {activeView === 'driver' && <DriverView />}
        {activeView === 'partner_admin' && <PartnerAdminView />}
        {activeView === 'split' && <SplitTrioView />}
      </main>

      {/* Bottom Sticky Mobile Navigation for Quick Thumb Ergonomics */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 grid grid-cols-5 h-15">
        <button
          type="button"
          onClick={() => setActiveView('client')}
          className={`flex flex-col items-center justify-center gap-0.5 ${
            activeView === 'client' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span className="text-[9px] truncate max-w-[65px]">{t.clientApp}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('driver')}
          className={`flex flex-col items-center justify-center gap-0.5 ${
            activeView === 'driver' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span className="text-[9px] truncate max-w-[65px]">{t.driverApp}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsCommunityModalOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 text-emerald-400 font-semibold"
          title="Réseau 1M+ Utilisateurs"
        >
          <Users className="w-4 h-4" />
          <span className="text-[9px]">+1.2M</span>
        </button>

        <button
          type="button"
          onClick={() => openProfileModal(activeView === 'driver' ? 'driver' : 'client')}
          className="flex flex-col items-center justify-center gap-0.5 text-slate-300"
          title="Mon Profil & Photo"
        >
          <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-400/80 bg-slate-800 flex items-center justify-center">
            {activeView === 'driver' ? (
              currentDriver.avatarUrl ? (
                <img src={currentDriver.avatarUrl} alt="Livreur" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px]">{currentDriver.avatar}</span>
              )
            ) : clientProfile.avatarUrl ? (
              <img src={clientProfile.avatarUrl} alt="Client" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px]">{clientProfile.avatar}</span>
            )}
          </div>
          <span className="text-[9px]">
            {activeView === 'driver' ? 'Motard' : 'Profil'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setLanguage(language === 'fr' ? 'sw' : 'fr')}
          className="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-amber-400 transition"
          title="Changer de langue / Badilisha lugha"
        >
          <span className="w-4 h-4 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-[9px] font-bold text-amber-400">
            {language.toUpperCase()}
          </span>
          <span className="text-[9px] text-slate-300 font-semibold">{language === 'fr' ? 'SW' : 'FR'}</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-400 hidden lg:block">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">{t.appName} (V3)</span>
            <span>·</span>
            <span className="text-amber-400">Lubumbashi, Haut-Katanga (RDC)</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span>Restauration · Supermarchés · Pharmacies · Courrier & Colis (Point A → B)</span>
            <span>·</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <Shield className="w-3.5 h-3.5" /> {t.legendSecurePin}
            </span>
          </div>
        </div>
      </footer>


      <ToastContainer />
      <ProfileModal />
      <CommunityDirectoryModal />
      <CommunesDirectoryModal
        isOpen={isCommunesModalOpen}
        onClose={() => setIsCommunesModalOpen(false)}
      />
      <DriverContractModal />
      <CarteImmatriculationModal />
    </div>
  );
};

export default function App() {
  return (
    <DeliveryProvider>
      <MainContent />
    </DeliveryProvider>
  );
}
