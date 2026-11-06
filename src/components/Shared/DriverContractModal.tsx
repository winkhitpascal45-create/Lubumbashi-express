import React, { useRef, useState, useEffect } from 'react';
import { useDelivery } from '../../context/DeliveryContext';
import {
  FileText,
  X,
  Printer,
  CheckCircle2,
  ShieldCheck,
  PenTool,
  RotateCcw,
  Bike,
  Car,
  Download
} from 'lucide-react';

export const DriverContractModal: React.FC = () => {
  const {
    isContractModalOpen,
    closeContractModal,
    contractDriverId,
    drivers,
    signDriverContract,
    currentDriver,
    language
  } = useDelivery();

  const driver = drivers.find((d) => d.id === contractDriverId) || currentDriver;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasSignature, setHasSignature] = useState<boolean>(Boolean(driver.driverSignatureDataUrl));

  useEffect(() => {
    if (isContractModalOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // If driver already signed, draw existing signature
        if (driver.driverSignatureDataUrl) {
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          };
          img.src = driver.driverSignatureDataUrl;
          setHasSignature(true);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          setHasSignature(false);
        }
      }
    }
  }, [isContractModalOpen, driver.driverSignatureDataUrl]);

  if (!isContractModalOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSaveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;
    const dataUrl = canvas.toDataURL('image/png');
    signDriverContract(driver.id, dataUrl);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {language === 'sw' ? 'Mkataba Rasmi wa Dereva / Msafirishaji' : 'Contrat d’Engagement & Affiliation Conducteur'}
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  PDF Officiel
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Lubumbashi Express · Direction Générale & Propriétaire de la Plateforme
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow"
              title="Imprimer ou Enregistrer en PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimer / PDF</span>
            </button>

            <button
              type="button"
              onClick={closeContractModal}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Contract Paper */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-200">
          <div
            id="printable-driver-contract"
            className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 print:m-0 print:p-0 print:border-none print:shadow-none"
          >
            {/* Official Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-5 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-amber-600 tracking-tight">LUBUMBASHI EXPRESS</span>
                  <span className="text-[10px] bg-slate-900 text-amber-400 font-bold px-2 py-0.5 rounded uppercase">
                    RDC · Katanga
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Société d’Opérations de Transport Express & Logistique Urbaine
                </p>
                <p className="text-[11px] text-slate-500">
                  Siège Social : Boulevard M’siri, Immeuble Hypnose, Commune de Lubumbashi (Haut-Katanga)
                </p>
              </div>

              <div className="text-left sm:text-right bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500">Matricule Officiel Sécurisé</div>
                <div className="text-sm font-extrabold font-mono text-slate-900">{driver.matriculeId}</div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                  ✓ Accréditation Propriétaire Actée
                </div>
              </div>
            </div>

            {/* Title Document */}
            <div className="text-center py-2 space-y-1">
              <h1 className="text-lg sm:text-xl font-black uppercase tracking-wide text-slate-900">
                CONTRAT D’AFFILIATION & D’ENGAGEMENT CONDUCTEUR
              </h1>
              <p className="text-xs text-slate-600 font-serif italic">
                Régissant les activités des conducteurs de vélos, motos, véhicules particuliers et utilitaires
              </p>
            </div>

            {/* Parties Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] border-b border-slate-200 pb-1">
                  1. LA DIRECTION / LE PROPRIÉTAIRE
                </h4>
                <p><strong>Entité :</strong> Direction Générale Lubumbashi Express</p>
                <p><strong>Représentant :</strong> Copropriétaire & Direction des Opérations</p>
                <p><strong>Juridiction :</strong> Ville de Lubumbashi, Province du Haut-Katanga</p>
                <p><strong>Agrément :</strong> N° LSH-TRANS-2026-KAT</p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] border-b border-slate-200 pb-1">
                  2. LE CONDUCTEUR / TRANSPORTEUR AFFILIÉ
                </h4>
                <p><strong>Nom complet :</strong> {driver.name}</p>
                <p><strong>Téléphone :</strong> {driver.phone}</p>
                <p><strong>Commune de base :</strong> {driver.commune}</p>
                <p><strong>Catégorie :</strong> <span className="font-bold text-amber-800">{driver.vehicleCategoryLabel}</span></p>
                <p><strong>Véhicule / Modèle :</strong> {driver.vehicleModel}</p>
                <p><strong>Plaque / N° Cadre :</strong> <span className="font-mono font-bold">{driver.plateNumber}</span></p>
                <p><strong>Pièce d'Identité :</strong> {driver.idCardNumber || 'CNI-KAT-2025-09841'}</p>
              </div>
            </div>

            {/* Articles of the Contract */}
            <div className="space-y-3.5 text-xs text-slate-800 leading-relaxed font-sans">
              <div>
                <strong className="text-slate-900">ARTICLE 1 — OBJET DE L’ENGAGEMENT</strong>
                <p className="text-slate-600 mt-0.5">
                  Le présent contrat confère au conducteur affilié le statut officiel de transporteur agréé sur le réseau de la plateforme Lubumbashi Express, couvrant les 7 communes (Lubumbashi, Kamalondo, Kenya, Katuba, Kampemba, Ruashi et Annexe). Le conducteur s’engage à assurer les courses de courriers, plis administratifs, colis, et provisions de supermarchés.
                </p>
              </div>

              <div>
                <strong className="text-slate-900">ARTICLE 2 — RÈGLE DU CODE PIN OBLIGATOIRE ET BLOQUANT</strong>
                <p className="text-slate-600 mt-0.5">
                  Conformément au protocole de sécurité inviolable de la plateforme, le conducteur s’engage formellement à <strong>ne jamais remettre un colis sans avoir exigé et saisi avec succès le code PIN secret à 4 chiffres</strong> fourni au destinataire. La clôture de la mission est subordonnée à cette authentification unique, gage de lutte contre toute fraude ou contestation.
                </p>
              </div>

              <div>
                <strong className="text-slate-900">ARTICLE 3 — TARIFICATION KILOMÉTRIQUE & RÉMUNÉRATION DIRECTE</strong>
                <p className="text-slate-600 mt-0.5">
                  Toute mission est calculée au mètre près selon le barème officiel de Lubumbashi Express en Francs Congolais (CDF) et dollars américains (USD). Les gains sont crédités instantanément dans le portefeuille numérique du conducteur à l’issue de la validation du code PIN.
                </p>
              </div>

              <div>
                <strong className="text-slate-900">ARTICLE 4 — DISCIPLINE, SÉCURITÉ ROUTIÈRE & CIVISME</strong>
                <p className="text-slate-600 mt-0.5">
                  Le conducteur s’engage à respecter scrupuleusement le code de la route congolais, à porter les équipements de sécurité réglementaires (casque homologué pour les motards et cyclistes, ceinture pour les automobilistes), et à arborer sa Carte d’Immatriculation officielle Lubumbashi Express lors de tous contrôles municipaux ou policiers.
                </p>
              </div>
            </div>

            {/* Signatures & Certification Block */}
            <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Owner Official Stamp & Signature */}
              <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/60 text-xs space-y-2 relative">
                <div className="font-bold text-slate-900 uppercase text-[11px] flex items-center justify-between">
                  <span>Pour Lubumbashi Express</span>
                  <span className="text-[10px] text-amber-700 font-mono">Sceau Officiel</span>
                </div>
                <p className="text-[11px] text-slate-600">Le Copropriétaire & Direction Générale :</p>
                
                {/* Official Stamp Vector Graphic */}
                <div className="py-2 flex items-center justify-center">
                  <div className="border-2 border-dashed border-amber-600 rounded-2xl p-3 text-center bg-white/80 shadow-inner">
                    <div className="text-[10px] uppercase font-black text-amber-800 tracking-wider">
                      ★ DIRECTION GÉNÉRALE LUBUMBASHI EXPRESS ★
                    </div>
                    <div className="text-xs font-serif italic text-slate-900 font-bold py-1">
                      Certifié Conforme & Accrédité
                    </div>
                    <div className="text-[9px] font-mono text-slate-600">
                      RÉGISTRE DU PROPRIÉTAIRE · HAUT-KATANGA
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 text-center font-mono">
                  Signé électroniquement à Lubumbashi
                </div>
              </div>

              {/* Driver Signature Block */}
              <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 text-xs space-y-2">
                <div className="font-bold text-slate-900 uppercase text-[11px] flex items-center justify-between">
                  <span>Le Conducteur Affilié</span>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    {hasSignature ? '✓ Signé' : 'En attente'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Mention manuscrite : <em>"Lu et approuvé, bon pour accord"</em>
                </p>

                {/* Signature Display if already signed */}
                {driver.driverSignatureDataUrl ? (
                  <div className="h-20 rounded-xl bg-white border border-slate-300 flex items-center justify-center overflow-hidden p-2">
                    <img
                      src={driver.driverSignatureDataUrl}
                      alt="Signature Conducteur"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-20 rounded-xl bg-white border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 italic text-[11px]">
                    Signature requise ci-dessous
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                  <span>Date : {driver.contractSignedDate || 'Aujourd’hui'}</span>
                  <span>Matricule : {driver.matriculeId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Digital Signature Pad for Driver */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Signature Manuscrite Numérique du Conducteur
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearSignature}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Effacer</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveSignature}
                  disabled={!hasSignature}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Enregistrer & Valider la Signature</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Signez avec votre doigt ou la souris dans la zone blanche ci-dessous pour certifier votre engagement :
            </p>

            <div className="rounded-xl overflow-hidden border-2 border-amber-500/40 bg-white">
              <canvas
                ref={canvasRef}
                width={700}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-36 cursor-crosshair touch-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400">
            Document juridique certifié conforme pour la Ville de Lubumbashi.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Télécharger le PDF</span>
            </button>

            <button
              type="button"
              onClick={closeContractModal}
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
