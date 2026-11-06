import React, { useState } from 'react';
import { useDelivery } from '../../context/DeliveryContext';
import {
  LocationPoint,
  DeliveryPackageType,
  VehicleType,
  DeliveryOrder
} from '../../types';
import {
  LUBUMBASHI_PRESET_LOCATIONS,
  PARTNER_ENTERPRISES
} from '../../data/mockData';
import { LubumbashiMap } from '../LubumbashiMap';
import {
  Package,
  FileText,
  Shield,
  Clock,
  ArrowRight,
  Phone,
  User,
  CheckCircle2,
  Share2,
  Copy,
  Bike,
  Car,
  ShoppingBag,
  Utensils,
  Pill,
  Sparkles,
  MapPin,
  ChevronRight,
  AlertCircle,
  Camera,
  MessageCircle,
  Compass,
  Users
} from 'lucide-react';
import { LiveCoordinationPanel } from '../Shared/LiveCoordinationPanel';
import { AddressInputBlock } from '../Shared/AddressInputBlock';
import { SupermarketCartItem, SupermarketOrder, SupermarketProduct } from '../../types';

export const ClientView: React.FC = () => {
  const {
    orders,
    createCourierOrder,
    selectedOrder,
    setSelectedOrderId,
    showToast,
    setActiveView,
    getMileageQuote,
    calculateDistance,
    pricingConfig,
    t,
    language,
    clientProfile,
    openProfileModal,
    setIsCommunityModalOpen,
    setIsCommunesModalOpen,
    scaleStats,
    supermarketProducts,
    supermarketOrders,
    createSupermarketOrder
  } = useDelivery();

  const [activeTab, setActiveTab] = useState<'courier' | 'services' | 'tracking' | 'history'>('tracking');
  const [showPricingModal, setShowPricingModal] = useState<boolean>(false);
  const [isCoordinationModalOpen, setIsCoordinationModalOpen] = useState<boolean>(false);

  // Form states for New Courier Point A -> Point B
  const [pickupPoint, setPickupPoint] = useState<LocationPoint>(LUBUMBASHI_PRESET_LOCATIONS[9]); // Gouvernorat
  const [deliveryPoint, setDeliveryPoint] = useState<LocationPoint>(LUBUMBASHI_PRESET_LOCATIONS[1]); // Hypnose Golf
  const [packageType, setPackageType] = useState<DeliveryPackageType>('envelope_urgent');
  const [packageDesc, setPackageDesc] = useState<string>(
    language === 'sw'
      ? 'Bahasha iliyofungwa yenye mikataba na nyaraka muhimu'
      : 'Enveloppe scellée avec documents administratifs et contrats'
  );
  const [recipientName, setRecipientName] = useState<string>('Jean-Marc Kabulo');
  const [recipientPhone, setRecipientPhone] = useState<string>('+243 81 555 4321');
  const [senderName, setSenderName] = useState<string>('Cabinet Juridique Lubumbashi');
  const [senderPhone, setSenderPhone] = useState<string>('+243 99 876 5432');
  const [vehicleType, setVehicleType] = useState<VehicleType>('moto');
  const [mapTarget, setMapTarget] = useState<'pickup' | 'delivery'>('pickup');
  const [copiedPin, setCopiedPin] = useState<boolean>(false);

  // Supermarket shopping states
  const [selectedSupermarketId, setSelectedSupermarketId] = useState<string>('part-1');
  const [supermarketCategory, setSupermarketCategory] = useState<string>('all');
  const [supermarketCart, setSupermarketCart] = useState<Record<string, number>>({});
  const [supermarketDeliveryAddress, setSupermarketDeliveryAddress] = useState<LocationPoint>(LUBUMBASHI_PRESET_LOCATIONS[11]); // Golf Plateau
  const [supermarketRecipientName, setSupermarketRecipientName] = useState<string>(clientProfile.name);
  const [supermarketRecipientPhone, setSupermarketRecipientPhone] = useState<string>(clientProfile.phone);
  const [supermarketVehicleType, setSupermarketVehicleType] = useState<VehicleType>('moto');

  // Dynamic real-time calculation based on mileage
  const currentDistanceKm = calculateDistance(pickupPoint.coords, deliveryPoint.coords);
  const currentQuote = getMileageQuote(currentDistanceKm, vehicleType);

  // Active client orders
  const activeOrders = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  );

  const displayedOrder: DeliveryOrder | null =
    selectedOrder || (activeOrders.length > 0 ? activeOrders[0] : orders[0] || null);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupPoint || !deliveryPoint) {
      showToast(
        language === 'sw' ? 'Kosa' : 'Erreur',
        language === 'sw' ? 'Tafadhali chagua mahali pa kuchukulia na pa kupeleka.' : 'Veuillez sélectionner un point de ramassage et de livraison.',
        'error'
      );
      return;
    }
    if (!recipientName.trim() || !recipientPhone.trim()) {
      showToast(
        language === 'sw' ? 'Kosa' : 'Erreur',
        language === 'sw' ? 'Habari za mpokeaji ni za lazima.' : 'Coordonnées du destinataire obligatoires.',
        'error'
      );
      return;
    }

    const newOrder = createCourierOrder({
      pickup: pickupPoint,
      delivery: deliveryPoint,
      packageType,
      packageDescription: packageDesc,
      recipientName,
      recipientPhone,
      senderName,
      senderPhone,
      vehicleType
    });

    setActiveTab('tracking');
    setSelectedOrderId(newOrder.id);
  };

  const copyPinToClipboard = (pin: string) => {
    navigator.clipboard?.writeText(pin).catch(() => {});
    setCopiedPin(true);
    showToast(
      language === 'sw' ? 'Kodi ya PIN imekopiwa !' : 'Code PIN copié !',
      language === 'sw' ? `PIN ${pin} iko tayari kutumwa kwa mpokeaji.` : `PIN ${pin} prêt à être envoyé au destinataire.`,
      'success'
    );
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const packageTypeOptions: { id: DeliveryPackageType; label: string; icon: string; subtitle: string }[] = [
    {
      id: 'envelope_urgent',
      label: language === 'sw' ? 'Barua / Bahasha ya Haraka' : 'Courrier / Enveloppe Urgent',
      icon: '✉️',
      subtitle: language === 'sw' ? 'Mikataba, pasipoti, karatasi za siri' : 'Contrats, passeports, plis confidentiels'
    },
    {
      id: 'admin_doc',
      label: language === 'sw' ? 'Nyaraka za Kiserikali' : 'Document Administratif',
      icon: '📁',
      subtitle: language === 'sw' ? 'Faili za benki, kodi, serikali' : 'Dossiers banques, impôts, gouvernorat'
    },
    {
      id: 'parcel_fragile',
      label: language === 'sw' ? 'Mzigo wa Kuvunjika' : 'Colis Fragile',
      icon: '📦',
      subtitle: language === 'sw' ? 'Simu, vifaa vya elektroniki, chupa' : 'Électronique, échantillons, flacons'
    },
    {
      id: 'medical',
      label: language === 'sw' ? 'Dawa & Vifaa vya Afya' : 'Médicaments & Santé',
      icon: '💊',
      subtitle: language === 'sw' ? 'Cheti cha daktari, chanjo, maabara' : 'Ordonnances, vaccins, laboratoire'
    },
    {
      id: 'standard_box',
      label: language === 'sw' ? 'Mzigo wa Kawaida' : 'Colis Standard',
      icon: '🧰',
      subtitle: language === 'sw' ? 'Nguo, vipuri, zawadi' : 'Vêtements, pièces détachées, cadeaux'
    }
  ];


  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Client Identity & 1M+ Ecosystem Card */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative group shrink-0">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-900 flex items-center justify-center shadow-lg">
              {clientProfile.avatarUrl ? (
                <img src={clientProfile.avatarUrl} alt={clientProfile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">{clientProfile.avatar}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => openProfileModal('client')}
              className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-amber-500 text-slate-950 shadow hover:bg-amber-400 transition"
              title="Changer la photo de profil"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">{clientProfile.name}</h2>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold px-2 py-0.5 rounded border border-amber-500/30">
                {clientProfile.clientNumber}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span className="text-emerald-400 font-semibold">{clientProfile.commune}</span>
              <span>·</span>
              <span className="text-amber-400 font-bold">{clientProfile.loyaltyPoints} pts Katanga</span>
              <span>·</span>
              <span className="text-slate-300">{clientProfile.totalOrders} courses</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsCommunityModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'sw' ? 'Jumuiya (+1.2M)' : 'Réseau (+1.2M)'}</span>
          </button>

          <button
            type="button"
            onClick={() => openProfileModal('client')}
            className="px-3 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'sw' ? 'Picha ya Wasifu' : 'Photo & Profil'}</span>
          </button>
        </div>
      </div>

      {/* Top Banner & Quick Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span>{t.clientSpaceTitle}</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-md border border-amber-500/30">
              Lubumbashi
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.clientSpaceSubtitle}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('tracking')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'tracking'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{t.tabTracking}</span>
            {activeOrders.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-slate-950 text-amber-400 text-[10px] font-bold flex items-center justify-center">
                {activeOrders.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('courier')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'courier'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>{t.tabCourier}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'services'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t.tabServices}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.tabHistory} ({orders.length})</span>
          </button>
        </div>
      </div>


      {/* TAB 1: LIVE TRACKING & PIN DISPLAY (PRIMARY FOCUS OF SPEC) */}
      {activeTab === 'tracking' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Map & Route Progress (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-4 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-bold text-white">
                    {displayedOrder ? `Course ${displayedOrder.id}` : 'Aucune course sélectionnée'}
                  </span>
                  {displayedOrder && (
                    <span className="text-xs text-slate-400">
                      · {displayedOrder.distanceKm} km · {displayedOrder.priceCDF.toLocaleString()} CDF (~${displayedOrder.priceUSD})
                    </span>
                  )}
                </div>

                {displayedOrder && (
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                      displayedOrder.status === 'delivered'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : displayedOrder.status === 'picked_up'
                        ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {displayedOrder.status === 'pending' && 'Recherche de coursier...'}
                    {displayedOrder.status === 'accepted' && 'Coursier assigné'}
                    {displayedOrder.status === 'heading_to_pickup' && 'En approche de Point A'}
                    {displayedOrder.status === 'picked_up' && 'Colis en transit vers Point B'}
                    {displayedOrder.status === 'delivered' && 'Colis livré & Certifié'}
                  </span>
                )}
              </div>

              {/* Dynamic Interactive Vector Map of Lubumbashi */}
              <LubumbashiMap order={displayedOrder} heightClassName="h-[340px] md:h-[400px]" />
            </div>

            {/* Stepper Timeline */}
            {displayedOrder && (
              <div className="bg-slate-800/60 rounded-2xl border border-slate-700/60 p-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Étapes de la livraison
                </h3>
                <div className="space-y-3">
                  {displayedOrder.timeline.map((event, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">
                        ✓
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-100">{event.label}</strong>
                          <span className="text-slate-400 font-mono text-[11px]">{event.timestamp}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-0.5">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Prominent Code PIN Card & Order Details (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {displayedOrder ? (
              <>
                {/* 🔒 THE MANDATORY CODE PIN CARD (SECTION 3 OF PDF) */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-2xl border-2 border-amber-500/50 p-5 shadow-2xl relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-white">Code PIN de Sécurité (OTP)</h2>
                        <span className="text-[10px] text-amber-400 font-medium">Requis pour valider la remise</span>
                      </div>
                    </div>

                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                      Course #{displayedOrder.id}
                    </span>
                  </div>

                  {/* Gigantic PIN display */}
                  <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-4 text-center my-3">
                    <span className="text-xs uppercase tracking-widest text-slate-400 block mb-1 font-semibold">
                      Code Unique de Clôture
                    </span>
                    <div className="text-4xl sm:text-5xl font-extrabold font-mono tracking-[0.25em] text-amber-400 drop-shadow-md">
                      {displayedOrder.pinCode}
                    </div>
                    <span className="text-[11px] text-slate-400 mt-2 block">
                      {displayedOrder.status === 'delivered' ? (
                        <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Code PIN certifié par le livreur
                        </span>
                      ) : (
                        'Le livreur doit obligatoirement saisir ce code dans son application pour clôturer la course.'
                      )}
                    </span>
                  </div>

                  {/* Actions for PIN: Copy and Share */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => copyPinToClipboard(displayedOrder.pinCode)}
                      className="h-10 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition active:scale-95"
                    >
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                      <span>{copiedPin ? 'Copié !' : 'Copier le PIN'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const msg = `Bonjour ${displayedOrder.recipientName}, un colis vous a été expédié via Lubumbashi Express (Course ${displayedOrder.id}). Votre Code PIN secret de réception est : ${displayedOrder.pinCode}. Remettez-le au coursier pour récupérer le colis.`;
                        navigator.clipboard?.writeText(msg).catch(() => {});
                        showToast('Message de remise copié !', 'Collez-le sur WhatsApp ou SMS.', 'info');
                      }}
                      className="h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-amber-500/10"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Partager au Destinataire</span>
                    </button>
                  </div>

                  {/* Quick shortcut to Driver View for testing */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>Tester la clôture côté livreur :</span>
                    <button
                      type="button"
                      onClick={() => setActiveView('driver')}
                      className="text-amber-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Basculer vers App Livreur</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sender & Recipient Summary Card */}
                <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-4 space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Détails de l'expédition
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    {/* Point A */}
                    <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        A
                      </span>
                      <div>
                        <div className="font-semibold text-slate-200">{displayedOrder.pickup.name}</div>
                        <div className="text-[11px] text-slate-400">{displayedOrder.pickup.address}</div>
                        {displayedOrder.pickup.landmark && (
                          <div className="text-[10px] text-amber-300 font-medium">🧭 Repère : {displayedOrder.pickup.landmark}</div>
                        )}
                        <div className="text-[10px] text-amber-400/90 font-medium">Émetteur : {displayedOrder.senderName} ({displayedOrder.senderPhone})</div>
                      </div>
                    </div>

                    {/* Point B */}
                    <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        B
                      </span>
                      <div>
                        <div className="font-semibold text-slate-200">{displayedOrder.delivery.name}</div>
                        <div className="text-[11px] text-slate-400">{displayedOrder.delivery.address}</div>
                        {displayedOrder.delivery.landmark && (
                          <div className="text-[10px] text-emerald-300 font-medium">🧭 Repère : {displayedOrder.delivery.landmark}</div>
                        )}
                        <div className="text-[10px] text-emerald-400/90 font-medium">Destinataire : {displayedOrder.recipientName} ({displayedOrder.recipientPhone})</div>
                      </div>
                    </div>
                  </div>

                  {/* Assigned Driver Box with Photo, Plate, and Precision Coordination Trigger */}
                  {displayedOrder.assignedDriver ? (
                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-emerald-400 bg-slate-800 flex items-center justify-center">
                              {displayedOrder.assignedDriver.avatarUrl ? (
                                <img
                                  src={displayedOrder.assignedDriver.avatarUrl}
                                  alt={displayedOrder.assignedDriver.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-2xl">{displayedOrder.assignedDriver.avatar}</span>
                              )}
                            </div>
                            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs">{displayedOrder.assignedDriver.name}</span>
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold px-1.5 py-0.2 rounded">
                                {displayedOrder.assignedDriver.plateNumber}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400">{displayedOrder.assignedDriver.vehicleModel}</div>
                            <div className="flex items-center gap-2 text-[10px] text-emerald-400 mt-0.5">
                              <span>Matricule : {displayedOrder.assignedDriver.matriculeId || 'HV-LSH-0842-MOT'}</span>
                              <span>·</span>
                              <span className="font-mono text-sky-400 font-semibold">GPS ± 2.5m</span>
                            </div>
                          </div>
                        </div>

                        {displayedOrder.assignedDriver.vehiclePhotoUrl && (
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shrink-0 hidden sm:block" title="Photo moto">
                            <img src={displayedOrder.assignedDriver.vehiclePhotoUrl} alt="Moto" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      {/* Coordination Action Button */}
                      <button
                        type="button"
                        onClick={() => setIsCoordinationModalOpen(true)}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-500/20 active:scale-[0.98]"
                      >
                        <Compass className="w-4 h-4 text-slate-950" />
                        <span>{language === 'sw' ? 'Wasiliana na Motard (Mahali Kamili GPS & Ujumbe)' : 'Coordonner avec le motard (Précision GPS & Messages)'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      <span>Recherche du coursier le plus proche à Lubumbashi...</span>
                    </div>
                  )}

                  {/* Content Nature */}
                  <div className="text-xs text-slate-400 pt-2 border-t border-slate-800 flex justify-between">
                    <span>Nature du colis :</span>
                    <strong className="text-slate-200 text-right">{displayedOrder.packageDescription}</strong>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-slate-800/60 rounded-2xl border border-slate-700/60 p-8 text-center space-y-3">
                <Package className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-sm font-bold text-white">Aucune course active</h3>
                <p className="text-xs text-slate-400">
                  Commandez un coursier pour envoyer des courriers administratifs, plis ou colis personnels d'un point à un autre à Lubumbashi.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('courier')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Créer une expédition
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: NOUVELLE COMMANDE COURSIER (POINT A VERS POINT B - MODULE CLÉ) */}
      {activeTab === 'courier' && (
        <form onSubmit={handleCreateOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Points A & B, Recipient & Nature (7 cols) */}
          <div className="lg:col-span-7 space-y-5 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" />
                <div>
                  <h2 className="text-base font-bold text-white">Service Coursier, Courriers & Colis</h2>
                  <p className="text-xs text-slate-400">Transport rapide de Point A vers Point B avec code PIN de remise</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCommunesModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-700/80 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition shadow-sm"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Voir les 7 Communes & Quartiers</span>
              </button>
            </div>

            {/* Selection Point A (Ramassage complet) */}
            <AddressInputBlock
              label={language === 'sw' ? 'Mahali pa kuchukua mzigo (Point A)' : 'Adresse de ramassage complète (Point A)'}
              pointType="pickup"
              value={pickupPoint}
              onChange={(updatedPoint) => setPickupPoint(updatedPoint)}
            />

            {/* Selection Point B (Livraison complète) */}
            <AddressInputBlock
              label={language === 'sw' ? 'Mahali pa kupeleka mzigo (Point B)' : 'Adresse de destination finale (Point B)'}
              pointType="delivery"
              value={deliveryPoint}
              onChange={(updatedPoint) => setDeliveryPoint(updatedPoint)}
            />

            {/* Nature of Package (Section 2.A du cahier des charges) */}
            <div className="space-y-2 pt-2 border-t border-slate-700/80">
              <label className="text-xs font-bold text-slate-300">
                Nature du contenu (Exigences opérationnelles)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {packageTypeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPackageType(opt.id)}
                    className={`p-2.5 rounded-xl border text-left transition flex items-start gap-2.5 ${
                      packageType === opt.id
                        ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-sm'
                        : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">{opt.label}</div>
                      <div className="text-[10px] text-slate-400 truncate">{opt.subtitle}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div>
                <input
                  type="text"
                  value={packageDesc}
                  onChange={(e) => setPackageDesc(e.target.value)}
                  placeholder="Précisez le contenu (ex: Enveloppe courrier urgent, Colis fragile...)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 mt-2"
                />
              </div>
            </div>

            {/* Recipient Coordinates (Section 2.A) */}
            <div className="space-y-3 pt-2 border-t border-slate-700/80">
              <label className="text-xs font-bold text-slate-300">
                Coordonnées du destinataire
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Nom complet du destinataire</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="ex: Jean-Luc Banze"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Téléphone RDC (Airtel / Vodacom / Orange)</label>
                  <input
                    type="tel"
                    required
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="+243 81 000 0000"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Selection with Live Mileage Rates */}
            <div className="space-y-2 pt-2 border-t border-slate-700/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">Type de transport recommandé</label>
                <button
                  type="button"
                  onClick={() => setShowPricingModal(true)}
                  className="text-[11px] text-amber-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Grille tarifaire au km</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setVehicleType('velo')}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    vehicleType === 'velo'
                      ? 'bg-amber-500/20 border-amber-500 text-white shadow-md shadow-amber-500/10'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xl block mb-0.5">🚲</span>
                  <div className="text-[11px] font-bold">Vélo Cargo</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                    {pricingConfig.vehicleRates.velo.perKmCDF.toLocaleString()} CDF/km
                  </div>
                  <div className="text-[9px] text-slate-500">Base: {pricingConfig.vehicleRates.velo.baseCDF.toLocaleString()} CDF</div>
                </button>

                <button
                  type="button"
                  onClick={() => setVehicleType('moto')}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    vehicleType === 'moto'
                      ? 'bg-amber-500/20 border-amber-500 text-white shadow-md shadow-amber-500/10'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xl block mb-0.5">🏍️</span>
                  <div className="text-[11px] font-bold">Motard Express</div>
                  <div className="text-[10px] text-amber-400 font-mono mt-0.5">
                    {pricingConfig.vehicleRates.moto.perKmCDF.toLocaleString()} CDF/km
                  </div>
                  <div className="text-[9px] text-slate-500">Base: {pricingConfig.vehicleRates.moto.baseCDF.toLocaleString()} CDF</div>
                </button>

                <button
                  type="button"
                  onClick={() => setVehicleType('voiture')}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    vehicleType === 'voiture'
                      ? 'bg-amber-500/20 border-amber-500 text-white shadow-md shadow-amber-500/10'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xl block mb-0.5">🚗</span>
                  <div className="text-[11px] font-bold">Auto Berline</div>
                  <div className="text-[10px] text-sky-400 font-mono mt-0.5">
                    {pricingConfig.vehicleRates.voiture.perKmCDF.toLocaleString()} CDF/km
                  </div>
                  <div className="text-[9px] text-slate-500">Base: {pricingConfig.vehicleRates.voiture.baseCDF.toLocaleString()} CDF</div>
                </button>

                <button
                  type="button"
                  onClick={() => setVehicleType('van')}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    vehicleType === 'van'
                      ? 'bg-amber-500/20 border-amber-500 text-white shadow-md shadow-amber-500/10'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xl block mb-0.5">🚐</span>
                  <div className="text-[11px] font-bold">Van Utilitaire</div>
                  <div className="text-[10px] text-purple-400 font-mono mt-0.5">
                    {pricingConfig.vehicleRates.van.perKmCDF.toLocaleString()} CDF/km
                  </div>
                  <div className="text-[9px] text-slate-500">Base: {pricingConfig.vehicleRates.van.baseCDF.toLocaleString()} CDF</div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Route Preview on Map & Pricing (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Aperçu du trajet sur Lubumbashi</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setMapTarget('pickup')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      mapTarget === 'pickup' ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    Sélection A
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapTarget('delivery')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      mapTarget === 'delivery' ? 'bg-emerald-400 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    Sélection B
                  </button>
                </div>
              </div>

              {/* Map with Interactive Pin Placement */}
              <LubumbashiMap
                interactiveSelection
                selectionTarget={mapTarget}
                pickupPoint={pickupPoint}
                deliveryPoint={deliveryPoint}
                onSelectLocation={(loc, target) => {
                  if (target === 'pickup') {
                    setPickupPoint(loc);
                    setMapTarget('delivery');
                    showToast('Point A défini', loc.name, 'info');
                  } else {
                    setDeliveryPoint(loc);
                    showToast('Point B défini', loc.name, 'success');
                  }
                }}
                heightClassName="h-[240px]"
              />

              {/* DYNAMIC PRICING BREAKDOWN BASED ON MILEAGE */}
              <div className="bg-slate-900/95 rounded-xl p-3.5 border border-slate-700/80 space-y-2.5 text-xs shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span>Prix en fonction du kilométrage</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                      {currentDistanceKm} km
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ~{currentQuote.estimatedMinutes} min de trajet
                  </span>
                </div>

                <div className="space-y-1.5 text-slate-300">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Prise en charge ({pricingConfig.vehicleRates[vehicleType].label})</span>
                    <span className="font-mono">{currentQuote.baseFeeCDF.toLocaleString()} CDF</span>
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">
                      Distance facturée ({currentDistanceKm} km × {currentQuote.perKmRateCDF.toLocaleString()} CDF/km)
                    </span>
                    <span className="font-mono text-amber-300 font-semibold">
                      +{currentQuote.distanceCostCDF.toLocaleString()} CDF
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Certification Code PIN / OTP</span>
                    <span className="text-emerald-400 font-medium">Inclus (0 CDF)</span>
                  </div>
                </div>

                {/* Formula summary tag */}
                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between font-mono">
                  <span>Formule : Base + (Km × Taux/km)</span>
                  <span className="text-slate-300">{currentQuote.baseFeeCDF.toLocaleString()} + ({currentDistanceKm} × {currentQuote.perKmRateCDF.toLocaleString()})</span>
                </div>

                {/* Total Line */}
                <div className="pt-2 border-t border-slate-800 flex items-baseline justify-between">
                  <div>
                    <span className="font-bold text-white text-sm block">Total de la Course</span>
                    <span className="text-[10px] text-slate-400">Taux officiel : 1$ = 2 800 CDF</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-amber-400 font-mono tracking-tight">
                      {currentQuote.totalCDF.toLocaleString()} CDF
                    </span>
                    <span className="text-xs text-slate-400 font-mono ml-2 block">
                      (~${currentQuote.totalUSD} USD)
                    </span>
                  </div>
                </div>
              </div>

              {/* Security notice regarding PIN */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Génération automatique du Code PIN :</strong> Dès validation, un code secret à 4 chiffres vous sera délivré pour le destinataire.
                </p>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20"
              >
                <Package className="w-4 h-4" />
                <span>Valider et Générer le Code PIN ({currentQuote.totalCDF.toLocaleString()} CDF)</span>
              </button>
            </div>
          </div>

        </form>
      )}

      {/* TAB 3: COMMANDES SUPERMARCHÉS EN LIGNE & LIVRAISON À DOMICILE */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          {/* Supermarket Header Card */}
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-2xl">
                  🛒
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">
                      {language === 'sw' ? 'Ununuzi wa Supermarket & Utoaji Nyumbani' : 'Supermarchés & Provisions en Ligne'}
                    </h2>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                      Commande à Domicile
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Commandez depuis votre maison. Le supermarché prépare votre commande, et un livreur (moto, vélo, auto ou van) la retire au guichet pour vous la déposer avec code PIN.
                  </p>
                </div>
              </div>

              {/* View Supermarket Orders Shortcut */}
              {supermarketOrders.length > 0 && (
                <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
                  <span className="text-slate-400">Commandes actives :</span>
                  <span className="font-mono font-bold text-amber-400">{supermarketOrders.length}</span>
                </div>
              )}
            </div>

            {/* Select Supermarket Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-slate-700/80">
              {[
                { id: 'part-1', name: 'Hyper Psaro Centre-Ville', address: 'Av. Kasa-Vubu & Blvd M’siri', logo: '🛒' },
                { id: 'part-3', name: 'Supermarché Hypnose Golf', address: 'Carrefour des Battants, Golf', logo: '🛍️' },
                { id: 'part-6', name: 'Kin-Marché Lumumba', address: 'Av. Patrice Lumumba, Makutano', logo: '🏬' }
              ].map((sm) => (
                <button
                  key={sm.id}
                  type="button"
                  onClick={() => {
                    setSelectedSupermarketId(sm.id);
                    setSupermarketCart({});
                  }}
                  className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
                    selectedSupermarketId === sm.id
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                      : 'bg-slate-900/70 border-slate-700/80 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="text-2xl p-2 bg-slate-800 rounded-xl shrink-0">{sm.logo}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate text-white">{sm.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{sm.address}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Supermarket Orders Tracking Section */}
          {supermarketOrders.length > 0 && (
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-sm font-bold text-white">
                    Vos Commandes Supermarché en Cours ({supermarketOrders.length})
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Retrait & Dépôt sécurisé PIN</span>
              </div>

              <div className="space-y-3">
                {supermarketOrders.map((smOrder) => (
                  <div
                    key={smOrder.id}
                    className="bg-slate-900/90 rounded-2xl border border-amber-500/30 p-4 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-white">{smOrder.preparationCode}</span>
                        <span className="text-xs text-amber-400">· {smOrder.supermarketName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                            smOrder.status === 'delivered'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : smOrder.status === 'packed_by_supermarket'
                              ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {smOrder.status === 'ordered_online' && '1. Transmis en ligne au supermarché'}
                          {smOrder.status === 'packed_by_supermarket' && '2. Emballé & Prêt au guichet'}
                          {smOrder.status === 'heading_to_supermarket' && '3. Livreur en route vers supermarché'}
                          {smOrder.status === 'picked_up' && '4. Récupéré, en livraison vers chez vous'}
                          {smOrder.status === 'delivered' && '5. Livré & Clôturé par PIN'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Articles commandés</span>
                        <div className="text-slate-200 mt-0.5 space-y-0.5">
                          {smOrder.items.map((it, idx) => (
                            <div key={idx} className="truncate">
                              {it.quantity}x {it.product.name}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Livraison à domicile</span>
                        <div className="text-slate-200 mt-0.5">{smOrder.deliveryPoint.name}</div>
                        <div className="text-slate-400 text-[11px] truncate">{smOrder.deliveryPoint.address}</div>
                        {smOrder.deliveryPoint.landmark && (
                          <div className="text-amber-300 text-[10px]">🧭 {smOrder.deliveryPoint.landmark}</div>
                        )}
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                          Code PIN de Remise
                        </span>
                        <span className="text-2xl font-black font-mono text-amber-400 tracking-widest block my-0.5">
                          {smOrder.pinCode}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Total : <strong>{smOrder.totalPriceCDF.toLocaleString()} CDF</strong> (~${smOrder.totalPriceUSD})
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Supermarket Catalog and Cart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 cols: Products Catalog */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Rayons du Supermarché</span>
                    <span className="text-xs text-amber-400 font-normal">
                      ({supermarketProducts.filter((p) => p.supermarketId === selectedSupermarketId).length} articles)
                    </span>
                  </h3>
                  <span className="text-xs text-slate-400">Prix officiels en magasin</span>
                </div>

                {/* Product Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {supermarketProducts
                    .filter((p) => p.supermarketId === selectedSupermarketId)
                    .map((prod) => {
                      const qty = supermarketCart[prod.id] || 0;
                      return (
                        <div
                          key={prod.id}
                          className={`p-3.5 rounded-2xl border transition flex flex-col justify-between ${
                            qty > 0
                              ? 'bg-amber-500/10 border-amber-500/50 text-white'
                              : 'bg-slate-900/90 border-slate-700/70 text-slate-200 hover:border-slate-600'
                          }`}
                        >
                          <div>
                            <div className="flex items-start gap-2.5">
                              <span className="text-2xl p-2 rounded-xl bg-slate-800 shrink-0">{prod.emoji}</span>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-bold leading-tight">{prod.name}</h4>
                                <span className="text-[10px] text-amber-400 font-medium block mt-0.5">
                                  {prod.unit} · {prod.category}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 mt-2 border-t border-slate-800 flex items-center justify-between">
                            <div>
                              <div className="font-mono font-bold text-amber-400 text-xs">
                                {prod.priceCDF.toLocaleString()} CDF
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">~${prod.priceUSD} USD</div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                              <button
                                type="button"
                                onClick={() => {
                                  if (qty > 0) {
                                    setSupermarketCart((prev) => {
                                      const next = { ...prev };
                                      if (next[prod.id] === 1) delete next[prod.id];
                                      else next[prod.id] -= 1;
                                      return next;
                                    });
                                  }
                                }}
                                disabled={qty === 0}
                                className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-bold text-xs flex items-center justify-center transition"
                              >
                                -
                              </button>
                              <span className="w-6 text-center text-xs font-mono font-bold text-white">{qty}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setSupermarketCart((prev) => ({
                                    ...prev,
                                    [prod.id]: (prev[prod.id] || 0) + 1
                                  }));
                                }}
                                className="w-6 h-6 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center transition"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Right 5 cols: Cart, Address, Transport Choice & Order Checkout */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">Mon Panier Supermarché</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {Object.values(supermarketCart).reduce((a, b) => a + b, 0)} articles
                  </span>
                </div>

                {/* Items in Cart */}
                {Object.keys(supermarketCart).length === 0 ? (
                  <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 text-center space-y-2">
                    <span className="text-3xl block">🛒</span>
                    <p className="text-xs font-semibold text-slate-300">Votre panier est vide</p>
                    <p className="text-[11px] text-slate-400">
                      Sélectionnez des articles dans le catalogue (riz 25kg, bidon d'huile, eau, lait, etc.).
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {Object.entries(supermarketCart).map(([prodId, qty]) => {
                      const prod = supermarketProducts.find((p) => p.id === prodId);
                      if (!prod) return null;
                      return (
                        <div
                          key={prodId}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs"
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <span className="font-semibold text-white block truncate">{prod.name}</span>
                            <span className="text-[10px] text-slate-400">
                              {qty} x {prod.priceCDF.toLocaleString()} CDF
                            </span>
                          </div>
                          <span className="font-mono font-bold text-amber-400">
                            {(prod.priceCDF * qty).toLocaleString()} CDF
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Delivery Address Input */}
                <div className="pt-2 border-t border-slate-700/80">
                  <AddressInputBlock
                    label="Votre adresse de livraison complète (Avenue, N° Parcelle, Quartier, Repère)"
                    pointType="delivery"
                    value={supermarketDeliveryAddress}
                    onChange={(newLoc) => setSupermarketDeliveryAddress(newLoc)}
                  />
                </div>

                {/* Transport Vehicle Choice for Supermarket Delivery */}
                <div className="space-y-2 pt-2 border-t border-slate-700/80">
                  <label className="text-xs font-bold text-slate-300">
                    Véhicule de livraison (Selon volume & poids)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'velo' as VehicleType, icon: '🚲', label: 'Vélo', note: '< 5 kg' },
                      { id: 'moto' as VehicleType, icon: '🏍️', label: 'Moto', note: 'Standard' },
                      { id: 'voiture' as VehicleType, icon: '🚗', label: 'Auto', note: 'Cartons' },
                      { id: 'van' as VehicleType, icon: '🚐', label: 'Van', note: 'Gros sacs' }
                    ].map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSupermarketVehicleType(v.id)}
                        className={`p-2 rounded-xl border text-center transition ${
                          supermarketVehicleType === v.id
                            ? 'bg-amber-500/20 border-amber-500 text-white shadow-sm'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        <span className="text-lg block">{v.icon}</span>
                        <div className="text-[11px] font-bold">{v.label}</div>
                        <div className="text-[9px] text-slate-500">{v.note}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pricing & Checkout Summary */}
                {(() => {
                  const smPartner = PARTNER_ENTERPRISES.find((p) => p.id === selectedSupermarketId) || PARTNER_ENTERPRISES[0];
                  const subtotalCDF = Object.entries(supermarketCart).reduce((sum, [id, q]) => {
                    const prod = supermarketProducts.find((p) => p.id === id);
                    return sum + (prod ? prod.priceCDF * q : 0);
                  }, 0);
                  const distKm = calculateDistance(smPartner.coords, supermarketDeliveryAddress.coords);
                  const deliveryQuote = getMileageQuote(distKm, supermarketVehicleType);
                  const totalCDF = subtotalCDF + (subtotalCDF > 0 ? deliveryQuote.totalCDF : 0);
                  const totalUSD = Math.round((totalCDF / pricingConfig.exchangeRateUSD) * 10) / 10;

                  return (
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Sous-total supermarché :</span>
                        <span className="font-mono text-slate-200">{subtotalCDF.toLocaleString()} CDF</span>
                      </div>

                      <div className="flex justify-between text-slate-400">
                        <span>Frais de livraison ({distKm} km · {supermarketVehicleType}) :</span>
                        <span className="font-mono text-amber-300">
                          {subtotalCDF > 0 ? `+${deliveryQuote.totalCDF.toLocaleString()} CDF` : '0 CDF'}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-baseline justify-between">
                        <div>
                          <strong className="text-sm font-bold text-white block">Total à payer</strong>
                          <span className="text-[10px] text-emerald-400 font-medium">Code PIN unique généré</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-black text-amber-400 font-mono">
                            {totalCDF.toLocaleString()} CDF
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">~${totalUSD} USD</span>
                        </div>
                      </div>

                      {/* Checkout Button */}
                      <button
                        type="button"
                        disabled={subtotalCDF === 0}
                        onClick={() => {
                          const items: SupermarketCartItem[] = Object.entries(supermarketCart).map(([id, qty]) => {
                            const prod = supermarketProducts.find((p) => p.id === id)!;
                            return { product: prod, quantity: qty };
                          });

                          createSupermarketOrder({
                            supermarketId: selectedSupermarketId,
                            items,
                            deliveryPoint: supermarketDeliveryAddress,
                            recipientName: supermarketRecipientName || clientProfile.name,
                            recipientPhone: supermarketRecipientPhone || clientProfile.phone,
                            vehicleTypeRecommended: supermarketVehicleType
                          });

                          setSupermarketCart({});
                        }}
                        className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20 active:scale-[0.98] mt-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Commander au Supermarché (Code PIN)</span>
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HISTORIQUE DES COURSES */}
      {activeTab === 'history' && (
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Historique de vos courses</h2>
            <span className="text-xs text-slate-400">{orders.length} courses enregistrées</span>
          </div>

          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                onClick={() => {
                  setSelectedOrderId(ord.id);
                  setActiveTab('tracking');
                }}
                className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 hover:border-slate-700 cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white">#{ord.id}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {ord.status === 'delivered' ? 'Livré par PIN' : 'En cours'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      PIN : <strong className="text-amber-400">{ord.pinCode}</strong>
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium">{ord.packageDescription}</p>
                  <p className="text-[11px] text-slate-400">
                    {ord.pickup.name} → {ord.delivery.name} ({ord.distanceKm} km)
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-amber-400 font-mono">
                    {ord.priceCDF.toLocaleString()} CDF
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {ord.distanceKm} km · (~${ord.priceUSD} USD)
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Destinataire : {ord.recipientName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL DU BARÈME KILOMÉTRIQUE OFFICIEL (LUBUMBASHI EXPRESS) */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Barème Kilométrique Officiel</span>
                  <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/30">
                    Lubumbashi (RDC)
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tarification transparente calculée au kilomètre selon l'itinéraire routier réel et le véhicule choisi.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPricingModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            {/* Formula Explanation Banner */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 space-y-1">
              <strong className="text-amber-300 font-bold block">Formule Officielle de Facturation :</strong>
              <p className="font-mono text-sm text-white">
                Prix Total (CDF) = Prise en Charge de Base + (Distance en km × Tarif au km)
              </p>
              <p className="text-[11px] text-amber-200/70">
                Conversion bidevise en temps réel : 1 USD = {pricingConfig.exchangeRateUSD.toLocaleString()} CDF.
              </p>
            </div>

            {/* Rates Table by Vehicle */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Moto */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-amber-500/40 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏍️</span>
                  <div>
                    <h4 className="text-xs font-bold text-white">Moto Express</h4>
                    <span className="text-[10px] text-amber-400 font-semibold">Prioritaire / Rapide</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-700/80 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Base fixe :</span>
                    <strong className="text-slate-100 font-mono">{pricingConfig.vehicleRates.moto.baseCDF.toLocaleString()} CDF</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Par kilomètre :</span>
                    <strong className="text-amber-400 font-mono">{pricingConfig.vehicleRates.moto.perKmCDF.toLocaleString()} CDF/km</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Vitesse moyenne :</span>
                    <span className="text-slate-300">~2.8 min / km</span>
                  </div>
                </div>
              </div>

              {/* Velo */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-emerald-500/40 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚲</span>
                  <div>
                    <h4 className="text-xs font-bold text-white">Vélo Cargo</h4>
                    <span className="text-[10px] text-emerald-400 font-semibold">Éco & Proximité</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-700/80 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Base fixe :</span>
                    <strong className="text-slate-100 font-mono">{pricingConfig.vehicleRates.velo.baseCDF.toLocaleString()} CDF</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Par kilomètre :</span>
                    <strong className="text-emerald-400 font-mono">{pricingConfig.vehicleRates.velo.perKmCDF.toLocaleString()} CDF/km</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Vitesse moyenne :</span>
                    <span className="text-slate-300">~4.5 min / km</span>
                  </div>
                </div>
              </div>

              {/* Voiture */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-sky-500/40 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚙</span>
                  <div>
                    <h4 className="text-xs font-bold text-white">Voiture / Van</h4>
                    <span className="text-[10px] text-sky-400 font-semibold">Gros volumes</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-700/80 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Base fixe :</span>
                    <strong className="text-slate-100 font-mono">{pricingConfig.vehicleRates.voiture.baseCDF.toLocaleString()} CDF</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Par kilomètre :</span>
                    <strong className="text-sky-400 font-mono">{pricingConfig.vehicleRates.voiture.perKmCDF.toLocaleString()} CDF/km</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Vitesse moyenne :</span>
                    <span className="text-slate-300">~3.8 min / km</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Typical Route Simulation Examples in Lubumbashi */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Exemples de Tarifs Réels à Lubumbashi (Moto Express)
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-200">Golf Les Battants → Centre-Ville Carrefour (4.2 km)</strong>
                    <div className="text-[11px] text-slate-400">4 000 CDF + (4.2 × 1 200 CDF)</div>
                  </div>
                  <span className="font-mono font-bold text-amber-400">9 040 CDF (~$3.20)</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-200">Centre-Ville → Luano City / Aéroport (8.5 km)</strong>
                    <div className="text-[11px] text-slate-400">4 000 CDF + (8.5 × 1 200 CDF)</div>
                  </div>
                  <span className="font-mono font-bold text-amber-400">14 200 CDF (~$5.10)</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-200">Kamalondo → UNILU Campus Kasapa (7.5 km)</strong>
                    <div className="text-[11px] text-slate-400">4 000 CDF + (7.5 × 1 200 CDF)</div>
                  </div>
                  <span className="font-mono font-bold text-amber-400">13 000 CDF (~$4.60)</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPricingModal(false)}
              className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
            >
              Compris, Retourner à la Commande
            </button>
          </div>
        </div>
      )}

      {/* Real-Time Precision Coordination Panel */}
      {displayedOrder && (
        <LiveCoordinationPanel
          order={displayedOrder}
          isOpen={isCoordinationModalOpen}
          onClose={() => setIsCoordinationModalOpen(false)}
          activeRole="client"
        />
      )}
    </div>
  );
};

