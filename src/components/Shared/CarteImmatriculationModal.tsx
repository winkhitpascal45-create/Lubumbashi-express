import React from 'react';
import { useDelivery } from '../../context/DeliveryContext';
import {
  IdCard,
  X,
  Printer,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Bike,
  Car,
  Download,
  Award,
  Sparkles
} from 'lucide-react';

export const CarteImmatriculationModal: React.FC = () => {
  const {
    isCarteImmatriculationModalOpen,
    closeCarteModal,
    carteDriverId,
    drivers,
    currentDriver,
    language
  } = useDelivery();

  const driver = drivers.find((d) => d.id === carteDriverId) || currentDriver;

  if (!isCarteImmatriculationModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const getVehicleIcon = () => {
    switch (driver.vehicleType) {
      case 'velo':
        return '🚲';
      case 'moto':
        return '🏍️';
      case 'voiture':
        return '🚗';
      case 'van':
        return '🚐';
      default:
        return '🏍️';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <IdCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {language === 'sw' ? 'Kadi Rasmi ya Usajili wa Dereva' : 'Carte Officielle d’Immatriculation Conducteur'}
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold px-2 py-0.5 rounded border border-amber-500/30">
                  Hôtel de Ville & Propriétaire
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Lubumbashi Express · Titre d’accréditation professionnel officiel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow"
              title="Imprimer au format badge plastifié"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimer Badge</span>
            </button>

            <button
              type="button"
              onClick={closeCarteModal}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container with the High-Security ID Card */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          <div className="text-xs text-slate-400 text-center">
            Badge d'identification obligatoire lors des courses et contrôles municipaux à Lubumbashi.
          </div>

          {/* FRONT OF THE CARD (RECTO) */}
          <div className="relative mx-auto max-w-lg bg-gradient-to-br from-slate-900 via-slate-850 to-amber-950/60 rounded-3xl border-2 border-amber-500/60 p-5 shadow-2xl text-white overflow-hidden space-y-4">
            {/* Hologram Effect Overlay */}
            <div className="absolute -top-16 -right-16 w-44 h-44 bg-gradient-to-br from-amber-400/20 via-sky-400/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            {/* Official Header */}
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
              <div>
                <div className="text-[9px] uppercase tracking-wider text-amber-300 font-bold">
                  RÉPUBLIQUE DÉMOCRATIQUE DU CONGO
                </div>
                <div className="text-[10px] text-slate-300 font-semibold">
                  PROVINCE DU HAUT-KATANGA · VILLE DE LUBUMBASHI
                </div>
                <div className="text-sm font-black text-amber-400 tracking-tight flex items-center gap-1.5 mt-0.5">
                  <span>LUBUMBASHI EXPRESS</span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold">
                    PRO
                  </span>
                </div>
              </div>

              <div className="w-10 h-10 rounded-full border-2 border-amber-400/80 bg-amber-500/10 flex items-center justify-center font-bold text-amber-300 text-xs shadow-inner">
                LX
              </div>
            </div>

            {/* Driver Identity & Photo */}
            <div className="flex items-start gap-4">
              {/* Photo Box with Security Frame */}
              <div className="relative shrink-0">
                <div className="w-24 h-28 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-950 shadow-xl flex items-center justify-center">
                  {driver.avatarUrl ? (
                    <img src={driver.avatarUrl} alt={driver.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">{driver.avatar}</span>
                  )}
                </div>
                <span className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-slate-950 rounded-full shadow" title="Accrédité">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Data Fields */}
              <div className="space-y-1.5 flex-1 min-w-0 text-xs">
                <div>
                  <span className="text-[9px] uppercase text-slate-400 font-bold block">Nom & Post-Nom</span>
                  <div className="font-extrabold text-sm text-white truncate">{driver.name}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 font-bold block">Matricule Sécurisé</span>
                    <span className="font-mono font-black text-amber-400 text-xs">{driver.matriculeId}</span>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase text-slate-400 font-bold block">Catégorie</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-400 text-[11px]">
                      <span>{getVehicleIcon()}</span>
                      <span className="truncate">{driver.vehicleCategoryLabel}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 font-bold block">Plaque / N° Cadre</span>
                    <span className="font-mono font-bold text-slate-200 text-xs">{driver.plateNumber}</span>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase text-slate-400 font-bold block">Commune d'Attache</span>
                    <span className="text-slate-300 text-[11px] truncate block">{driver.commune}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] uppercase text-slate-400 font-bold block">Modèle du Véhicule</span>
                  <span className="text-slate-300 text-[11px] truncate block">{driver.vehicleModel}</span>
                </div>
              </div>
            </div>

            {/* Bottom Security Bar with Owner Signature Stamp & QR Code */}
            <div className="pt-3 border-t border-amber-500/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                {/* Simulated QR Code */}
                <div className="w-12 h-12 bg-white rounded-lg p-1 shrink-0 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-900 rounded flex items-center justify-center text-white text-[8px] font-mono font-bold">
                    QR-LX
                  </div>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-slate-400 font-semibold block">Carte N°</span>
                  <span className="font-mono font-bold text-slate-200 text-[11px]">
                    {driver.carteImmatriculationId || 'CI-LSH-2026-0842'}
                  </span>
                  <span className="text-[9px] text-emerald-400 block font-semibold">● Validité : 2026 / 2027</span>
                </div>
              </div>

              {/* Owner Signature & Stamp */}
              <div className="text-right">
                <span className="text-[9px] uppercase text-amber-300 font-bold block">Signature du Propriétaire</span>
                <div className="font-serif italic font-black text-xs text-amber-400">
                  Direction Générale
                </div>
                <div className="text-[8px] text-slate-400 font-mono">Lubumbashi Express</div>
              </div>
            </div>
          </div>

          {/* BACK OF THE CARD (VERSO) */}
          <div className="relative mx-auto max-w-lg bg-slate-950 rounded-3xl border border-slate-800 p-5 shadow-xl text-slate-300 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                VERSO · DISPOSITIONS RÉGLEMENTAIRES
              </span>
              <span className="text-[10px] text-amber-400 font-mono font-bold">LUBUMBASHI EXPRESS</span>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-400">
              1. Cette carte est strictement personnelle, incessible et délivrée sous la signature de la Direction Générale du réseau Lubumbashi Express.
            </p>
            <p className="text-[11px] leading-relaxed text-slate-400">
              2. <strong>Règle du Code PIN :</strong> Le titulaire a l'obligation formelle d'authentifier chaque remise par le code PIN unique à 4 chiffres généré par l'application client.
            </p>
            <p className="text-[11px] leading-relaxed text-slate-400">
              3. En cas de perte, vol ou contrôle de police : Contacter immédiatement le central des opérations Lubumbashi au <strong>+243 81 700 1122</strong> ou <strong>+243 99 876 5432</strong>.
            </p>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Hôtel de Ville de Lubumbashi</span>
              <span>Propriété Privée Enregistrée RDC</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400">
            Carte certifiée avec signature officielle du propriétaire.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Imprimer Format Badge</span>
            </button>

            <button
              type="button"
              onClick={closeCarteModal}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
