import React from 'react';
import { ClientView } from '../ClientApp/ClientView';
import { DriverView } from '../DriverApp/DriverView';
import { PartnerAdminView } from '../PartnerAdmin/PartnerAdminView';
import { useDelivery } from '../../context/DeliveryContext';
import { Smartphone, Bike, Building2 } from 'lucide-react';

export const SplitTrioView: React.FC = () => {
  const { t, language } = useDelivery();

  return (
    <div className="w-full max-w-[1700px] mx-auto px-2 sm:px-4 py-4 space-y-4">
      <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 text-center">
        <h2 className="text-sm font-bold text-white">
          {t.splitView} — {language === 'sw' ? 'Jaribio Kamili la Lubumbashi Express' : 'Simulation Intégrale Lubumbashi Express'}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {language === 'sw'
            ? 'Kila kitendo (kuomba mzigo, kodi ya PIN, kukubali kwa dereva, uthibitisho wa PIN) kinaonekana mara moja kwenye paneli zote tatu.'
            : 'Toute action effectuée dans une interface (création de course, génération de PIN, acceptation livreur, validation bloquante) est instantanément répercutée sur les autres.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Panel 1: App Client */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-750 overflow-hidden shadow-xl flex flex-col max-h-[85vh] overflow-y-auto">
          <div className="sticky top-0 z-10 bg-slate-850 px-4 py-2.5 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">1. {t.clientApp}</span>
            </div>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-semibold">
              {language === 'sw' ? 'Kodi ya PIN' : 'Génération & Affichage PIN'}
            </span>
          </div>
          <div className="p-2 sm:p-3">
            <ClientView />
          </div>
        </div>

        {/* Panel 2: App Livreur */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-750 overflow-hidden shadow-xl flex flex-col max-h-[85vh] overflow-y-auto">
          <div className="sticky top-0 z-10 bg-slate-850 px-4 py-2.5 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bike className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">2. {t.driverApp}</span>
            </div>
            <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30 font-semibold uppercase">
              {t.pinModalBlocking}
            </span>
          </div>
          <div className="p-2 sm:p-3">
            <DriverView />
          </div>
        </div>

        {/* Panel 3: Interface Partenaire & Admin */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-750 overflow-hidden shadow-xl flex flex-col max-h-[85vh] overflow-y-auto">
          <div className="sticky top-0 z-10 bg-slate-850 px-4 py-2.5 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">3. {t.partnerAdmin}</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
              Supervision
            </span>
          </div>
          <div className="p-2 sm:p-3">
            <PartnerAdminView />
          </div>
        </div>
      </div>
    </div>
  );
};
