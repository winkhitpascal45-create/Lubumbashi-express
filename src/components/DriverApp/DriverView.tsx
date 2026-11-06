import React, { useState } from 'react';
import { useDelivery } from '../../context/DeliveryContext';
import { DeliveryOrder, VehicleType } from '../../types';
import { LubumbashiMap } from '../LubumbashiMap';
import { PinVerificationModal } from '../Shared/PinVerificationModal';
import { LiveCoordinationPanel } from '../Shared/LiveCoordinationPanel';
import {
  Bike,
  Power,
  Navigation,
  CheckCircle,
  Clock,
  Phone,
  Shield,
  AlertTriangle,
  Lock,
  Wallet,
  Star,
  ChevronRight,
  ArrowRight,
  MapPin,
  PackageCheck,
  Camera,
  Compass,
  MessageCircle,
  FileBadge,
  FileText,
  IdCard,
  ShoppingBag,
  Car
} from 'lucide-react';

export const DriverView: React.FC = () => {
  const {
    drivers,
    currentDriverId,
    setCurrentDriverId,
    currentDriver,
    toggleDriverOnline,
    availableOrdersForDriver,
    activeDriverOrder,
    acceptOrder,
    confirmPickup,
    orders,
    setSelectedOrderId,
    t,
    language,
    openProfileModal,
    openContractModal,
    openCarteModal,
    changeDriverVehicleType,
    supermarketOrders,
    updateSupermarketOrderStatus
  } = useDelivery();

  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [isCoordModalOpen, setIsCoordModalOpen] = useState<boolean>(false);
  const [selectedAvailableId, setSelectedAvailableId] = useState<string | null>(null);

  // Supermarket delivery PIN state
  const [smPinModalOrder, setSmPinModalOrder] = useState<any>(null);
  const [smEnteredPin, setSmEnteredPin] = useState<string>('');
  const [smPinError, setSmPinError] = useState<string>('');

  // Completed deliveries for this driver
  const completedDeliveries = orders.filter(
    (o) => o.assignedDriverId === currentDriver.id && o.status === 'delivered'
  );

  const vehicleOptions: { type: VehicleType; icon: string; label: string }[] = [
    { type: 'velo', icon: '🚲', label: 'Cycliste Cargo' },
    { type: 'moto', icon: '🏍️', label: 'Motard Express' },
    { type: 'voiture', icon: '🚗', label: 'Auto Berline' },
    { type: 'van', icon: '🚐', label: 'Chauffeur Van' }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Driver Status & Wallet Header */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative group shrink-0">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-400 bg-slate-900 flex items-center justify-center shadow-lg">
                {currentDriver.avatarUrl ? (
                  <img src={currentDriver.avatarUrl} alt={currentDriver.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">{currentDriver.avatar}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => openProfileModal('driver')}
                className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-emerald-500 text-slate-950 shadow hover:bg-emerald-400 transition"
                title="Modifier photo de profil et véhicule"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white">{currentDriver.name}</h1>
                <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 font-bold">
                  {currentDriver.plateNumber}
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-semibold uppercase flex items-center gap-1">
                  <span>{currentDriver.vehicleCategoryLabel}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">{currentDriver.vehicleModel}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-1">
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {currentDriver.rating}
                </span>
                <span>·</span>
                <span>{currentDriver.totalDeliveries} courses</span>
                <span>·</span>
                <span className="text-emerald-400 font-mono text-[11px]">Matricule: {currentDriver.matriculeId}</span>
                <span>·</span>
                <span className="text-sky-400 font-mono text-[11px]">GPS ± {currentDriver.gpsAccuracyMeters || 2.5}m</span>
              </div>
            </div>
          </div>

          {/* Vehicle photo thumbnail & Edit button */}
          <div className="flex items-center gap-3">
            {currentDriver.vehiclePhotoUrl && (
              <div className="w-13 h-13 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shrink-0 hidden md:block" title="Photo véhicule">
                <img src={currentDriver.vehiclePhotoUrl} alt="Véhicule" className="w-full h-full object-cover" />
              </div>
            )}

            <button
              type="button"
              onClick={() => openProfileModal('driver')}
              className="px-3 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'sw' ? 'Picha & Wasifu' : 'Photo'}</span>
            </button>

            {/* Online Toggle & Earnings */}
            <div className="flex items-center gap-3 border-l border-slate-700 pl-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-medium">{t.todayEarnings}</span>
                <span className="text-base font-extrabold text-amber-400 font-mono">
                  {currentDriver.todayEarningsCDF.toLocaleString()} CDF
                </span>
              </div>

              <button
                type="button"
                onClick={() => toggleDriverOnline()}
                className={`h-10 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-md ${
                  currentDriver.isOnline
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{currentDriver.isOnline ? 'En Ligne' : 'Hors Ligne'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Conductors Categories Selector + Official Contract PDF & Carte d'Immatriculation */}
        <div className="pt-3 border-t border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs text-slate-400 font-semibold shrink-0 mr-1">Catégorie Conducteur :</span>
            {vehicleOptions.map((v) => (
              <button
                key={v.type}
                type="button"
                onClick={() => changeDriverVehicleType(currentDriver.id, v.type)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap ${
                  currentDriver.vehicleType === v.type
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700/80'
                }`}
              >
                <span>{v.icon}</span>
                <span>{v.label}</span>
              </button>
            ))}
          </div>

          {/* Official Documents Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => openContractModal(currentDriver.id)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-750 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition shadow"
              title="Consulter le contrat officiel d'affiliation, signer et imprimer en PDF"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Contrat & Papiers PDF</span>
              {currentDriver.driverSignatureDataUrl && (
                <span className="text-[10px] text-emerald-400 font-bold">✓</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => openCarteModal(currentDriver.id)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-amber-500/20"
              title="Afficher la Carte d'Immatriculation officielle avec signature du propriétaire"
            >
              <IdCard className="w-3.5 h-3.5 text-slate-950" />
              <span>Carte d'Immatriculation</span>
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVE COURSE IN PROGRESS (SECTION 4.2 DU CAHIER DES CHARGES) */}
      {activeDriverOrder ? (
        <div className="bg-slate-800/80 rounded-2xl border-2 border-amber-500/60 p-5 shadow-2xl space-y-5">
          {/* Mission Status Header */}
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
              <h2 className="text-base font-bold text-white">{t.activeMission} #{activeDriverOrder.id}</h2>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-semibold">
                {activeDriverOrder.priceCDF.toLocaleString()} CDF (~${activeDriverOrder.priceUSD})
              </span>
            </div>

            <span className="text-xs text-slate-400 font-mono">
              Dist : {activeDriverOrder.distanceKm} km
            </span>
          </div>

          {/* TWO-STEP GPS GUIDANCE (GUIDAGE GPS EN 2 ÉTAPES) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Step 1 : Trajet vers Ramassage (Point A) */}
            <div
              className={`p-4 rounded-xl border transition ${
                activeDriverOrder.status === 'heading_to_pickup' || activeDriverOrder.status === 'accepted'
                  ? 'bg-amber-500/10 border-amber-500/60 ring-2 ring-amber-500/20'
                  : 'bg-slate-900/60 border-slate-800 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <span>{t.step1Title}</span>
                  {activeDriverOrder.status === 'picked_up' && (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  )}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Point A</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-0.5">{activeDriverOrder.pickup.name}</h4>
              <p className="text-xs text-slate-300">{activeDriverOrder.pickup.address}</p>
              {activeDriverOrder.pickup.landmark && (
                <p className="text-[11px] text-amber-300 font-medium mt-1">🧭 Repère : {activeDriverOrder.pickup.landmark}</p>
              )}
              <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
                <span>{t.sender} : {activeDriverOrder.senderName}</span>
                <a
                  href={`tel:${activeDriverOrder.senderPhone}`}
                  className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Phone className="w-3 h-3" />
                  <span>{language === 'sw' ? 'Piga Simu' : 'Appeler'}</span>
                </a>
              </div>
            </div>

            {/* Step 2 : Trajet vers Livraison (Point B) */}
            <div
              className={`p-4 rounded-xl border transition ${
                activeDriverOrder.status === 'picked_up'
                  ? 'bg-emerald-500/10 border-emerald-500/60 ring-2 ring-emerald-500/20'
                  : 'bg-slate-900/60 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <span>{t.step2Title}</span>
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Point B</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-0.5">{activeDriverOrder.delivery.name}</h4>
              <p className="text-xs text-slate-300">{activeDriverOrder.delivery.address}</p>
              {activeDriverOrder.delivery.landmark && (
                <p className="text-[11px] text-emerald-300 font-medium mt-1">🧭 Repère : {activeDriverOrder.delivery.landmark}</p>
              )}
              <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
                <span>{t.recipient} : {activeDriverOrder.recipientName}</span>
                <a
                  href={`tel:${activeDriverOrder.recipientPhone}`}
                  className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Phone className="w-3 h-3" />
                  <span>{language === 'sw' ? 'Piga Simu' : 'Appeler'}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Lubumbashi GPS Map for Active Course */}
          <div>
            <LubumbashiMap order={activeDriverOrder} heightClassName="h-[280px] sm:h-[320px]" />
          </div>

          {/* Content & Mileage Pricing Breakdown for Driver */}
          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800 text-xs space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="text-slate-400">{t.packageContent} : </span>
                <strong className="text-slate-200">{activeDriverOrder.packageDescription}</strong>
              </div>
              <span className="text-slate-500 font-mono text-[11px]">
                {new Date(activeDriverOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">
                {activeDriverOrder.distanceKm} km
              </span>
              <span className="font-mono text-amber-400 font-bold">
                {t.todayEarnings} : {activeDriverOrder.priceCDF.toLocaleString()} CDF (~${activeDriverOrder.priceUSD} USD)
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS ACCORDING TO CURRENT STEP */}
          <div className="pt-2 space-y-2">
            {activeDriverOrder.status === 'heading_to_pickup' || activeDriverOrder.status === 'accepted' ? (
              <button
                type="button"
                onClick={() => confirmPickup(activeDriverOrder.id)}
                className="w-full h-14 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20 active:scale-[0.98]"
              >
                <PackageCheck className="w-5 h-5" />
                <span>{t.step1ConfirmBtn}</span>
              </button>
            ) : (
              /* ÉTAPE 2 : ÉCRAN DE SAISIE DU CODE PIN DE VALIDATION (OBLIGATOIRE ET BLOQUANT) */
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(true)}
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-base flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                >
                  <Lock className="w-5 h-5" />
                  <span>{t.step2PinBtn}</span>
                </button>

                <p className="text-center text-[11px] text-amber-300 font-medium flex items-center justify-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.pinBlockingNotice} ({activeDriverOrder.recipientName}).</span>
                </p>
              </div>
            )}

            {/* Real-Time Precision Coordination with Recipient */}
            <button
              type="button"
              onClick={() => setIsCoordModalOpen(true)}
              className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700/80 text-sky-300 font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <Compass className="w-4 h-4 text-sky-400" />
              <span>{language === 'sw' ? 'Wasiliana na Mteja (Mahali Kamili GPS & Ujumbe)' : 'Coordonner avec le destinataire (Précision GPS & Messages)'}</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* MISSIONS DE RETRAIT EN SUPERMARCHÉ (HYPER PSARO, HYPNOSE, KIN-MARCHÉ) */}
      {supermarketOrders.filter((s) => s.status !== 'delivered').length > 0 && (
        <div className="bg-slate-800/80 rounded-2xl border-2 border-amber-500/40 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-1.5 bg-amber-500/20 text-amber-400 rounded-xl">🛒</span>
              <div>
                <h3 className="text-base font-bold text-white">
                  Missions Supermarchés Prêtes au Guichet
                </h3>
                <p className="text-xs text-slate-400">
                  Commandes passées en ligne par les clients : retirez au supermarché avec le code de retrait et livrez à domicile avec code PIN.
                </p>
              </div>
            </div>

            <span className="text-xs bg-amber-500/20 text-amber-300 font-mono font-bold px-2 py-0.5 rounded border border-amber-500/30">
              {supermarketOrders.filter((s) => s.status !== 'delivered').length} mission(s)
            </span>
          </div>

          <div className="space-y-3">
            {supermarketOrders
              .filter((s) => s.status !== 'delivered')
              .map((sm) => (
                <div
                  key={sm.id}
                  className="bg-slate-900/90 rounded-2xl border border-slate-700/80 p-4 space-y-3 hover:border-amber-500/50 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-sm text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                        {sm.preparationCode}
                      </span>
                      <span className="text-xs font-bold text-white">· Retrait chez {sm.supermarketName}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-extrabold text-emerald-400 text-xs">
                        +{sm.deliveryFeeCDF.toLocaleString()} CDF gains livraison
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <strong className="text-amber-400 block text-[11px] uppercase">
                        Point A (Guichet Retrait Supermarché)
                      </strong>
                      <div className="text-slate-200 mt-0.5">{sm.supermarketName}</div>
                      <div className="text-slate-400 text-[11px]">{sm.supermarketAddress}</div>
                      <div className="text-[10px] text-amber-300 font-mono mt-1">
                        Code retrait guichet : <strong>{sm.preparationCode}</strong>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <strong className="text-emerald-400 block text-[11px] uppercase">
                        Point B (Domicile Client · Saisie PIN Requise)
                      </strong>
                      <div className="text-slate-200 mt-0.5">{sm.recipientName} ({sm.recipientPhone})</div>
                      <div className="text-slate-400 text-[11px]">{sm.deliveryPoint.address}</div>
                      {sm.deliveryPoint.landmark && (
                        <div className="text-emerald-300 text-[10px]">🧭 {sm.deliveryPoint.landmark}</div>
                      )}
                    </div>
                  </div>

                  {/* Actions for this supermarket mission */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
                    <div className="text-[11px] text-slate-400">
                      Véhicule recommandé : <strong className="text-amber-300">{sm.vehicleTypeRecommended.toUpperCase()}</strong>
                      <span> · {sm.items.reduce((s, i) => s + i.quantity, 0)} article(s)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {sm.status === 'ordered_online' || sm.status === 'packed_by_supermarket' ? (
                        <button
                          type="button"
                          onClick={() => updateSupermarketOrderStatus(sm.id, 'heading_to_supermarket', currentDriver.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow"
                        >
                          Prendre en charge le retrait
                        </button>
                      ) : sm.status === 'heading_to_supermarket' ? (
                        <button
                          type="button"
                          onClick={() => updateSupermarketOrderStatus(sm.id, 'picked_up', currentDriver.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition shadow"
                        >
                          Colis récupéré au guichet
                        </button>
                      ) : sm.status === 'picked_up' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSmPinModalOrder(sm);
                            setSmEnteredPin('');
                            setSmPinError('');
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition shadow"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Valider la remise par Code PIN</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* RADAR DES COURSES DISPONIBLES À LUBUMBASHI */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-base font-bold text-white">{t.availableRadarTitle}</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {availableOrdersForDriver.length} {t.ordersWaiting}
          </span>
        </div>

        {!currentDriver.isOnline ? (
          <div className="bg-slate-900/60 rounded-xl p-8 text-center space-y-3 border border-slate-800">
            <Power className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">{t.driverStatusOffline}</p>
            <p className="text-xs text-slate-400">
              {t.driverOfflineNotice}
            </p>
            <button
              type="button"
              onClick={() => toggleDriverOnline()}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              {t.goOnline}
            </button>
          </div>
        ) : availableOrdersForDriver.length === 0 ? (
          <div className="bg-slate-900/60 rounded-xl p-8 text-center space-y-2 border border-slate-800">
            <Clock className="w-8 h-8 text-slate-600 mx-auto animate-spin" style={{ animationDuration: '8s' }} />
            <p className="text-sm font-semibold text-slate-300">{t.driverRadarListening}</p>
            <p className="text-xs text-slate-400">
              {language === 'sw'
                ? 'Mizigo mipya ya wateja na washirika itaonekana hapa bila kuchelewa.'
                : 'Les nouvelles courses clients ou signalements des partenaires s\'afficheront ici instantanément.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {availableOrdersForDriver.map((ord) => (
              <div
                key={ord.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-700/80 p-4 hover:border-amber-500/60 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white">Course #{ord.id}</span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 font-semibold">
                      {ord.serviceType === 'partner_dispatch' ? `Signalement : ${ord.partnerName}` : 'Course Particulier (A → B)'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ~{ord.distanceKm} km
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-200">{ord.packageDescription}</p>

                  <div className="text-xs text-slate-400 grid grid-cols-1 sm:grid-cols-2 gap-1">
                    <div>
                      <strong className="text-amber-400">A : </strong>
                      <span>{ord.pickup.name} ({ord.pickup.commune})</span>
                    </div>
                    <div>
                      <strong className="text-emerald-400">B : </strong>
                      <span>{ord.delivery.name} ({ord.delivery.commune})</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="text-left sm:text-right">
                    <span className="text-base font-extrabold text-amber-400 font-mono">
                      {ord.priceCDF.toLocaleString()} CDF
                    </span>
                    <span className="text-xs text-slate-400 block font-mono">
                      (~${ord.priceUSD} USD)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      acceptOrder(ord.id, currentDriver.id);
                      setSelectedOrderId(ord.id);
                    }}
                    className="h-10 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-amber-500/20"
                  >
                    <span>{t.acceptCourseBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COMPLETED DELIVERIES LOG */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          {t.certifiedDeliveriesLog} ({completedDeliveries.length})
        </h3>

        {completedDeliveries.length === 0 ? (
          <p className="text-xs text-slate-500 italic">
            {language === 'sw' ? 'Hakuna mizigo iliyomalizika bado leo.' : 'Aucune course encore terminée aujourd\'hui.'}
          </p>
        ) : (
          <div className="space-y-2">
            {completedDeliveries.map((del) => (
              <div
                key={del.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">#{del.id}</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold text-[11px]">
                      <CheckCircle className="w-3.5 h-3.5" /> {t.pinValidated} ({del.pinCode})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {del.pickup.name} → {del.delivery.name}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-amber-400">
                    +{del.priceCDF.toLocaleString()} CDF
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {del.deliveredAt ? new Date(del.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Clôturé'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blocking Mandatory PIN Modal */}
      {activeDriverOrder && (
        <PinVerificationModal
          isOpen={isPinModalOpen}
          order={activeDriverOrder}
          onClose={() => setIsPinModalOpen(false)}
        />
      )}

      {/* Supermarket Delivery PIN Verification Modal */}
      {smPinModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Clôture Livraison Supermarché</h3>
              </div>
              <button
                type="button"
                onClick={() => setSmPinModalOrder(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Demandez au client <strong>{smPinModalOrder.recipientName}</strong> son code PIN secret à 4 chiffres pour valider la remise.
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <input
                type="text"
                maxLength={4}
                autoFocus
                value={smEnteredPin}
                onChange={(e) => {
                  setSmEnteredPin(e.target.value.replace(/\D/g, ''));
                  setSmPinError('');
                }}
                placeholder="• • • •"
                className="w-full text-center text-3xl font-mono font-black tracking-[0.4em] bg-transparent text-amber-400 focus:outline-none placeholder:text-slate-700"
              />
            </div>

            {smPinError && (
              <p className="text-xs text-rose-400 font-bold text-center">{smPinError}</p>
            )}

            <button
              type="button"
              onClick={() => {
                if (smEnteredPin === smPinModalOrder.pinCode) {
                  updateSupermarketOrderStatus(smPinModalOrder.id, 'delivered', currentDriver.id);
                  setSmPinModalOrder(null);
                } else {
                  setSmPinError('Code PIN incorrect. Veuillez vérifier auprès du client.');
                }
              }}
              className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/20"
            >
              Valider la Remise (+{smPinModalOrder.deliveryFeeCDF.toLocaleString()} CDF)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
