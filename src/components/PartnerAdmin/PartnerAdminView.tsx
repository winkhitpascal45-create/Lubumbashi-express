import React, { useState } from 'react';
import { useDelivery } from '../../context/DeliveryContext';
import {
  PartnerEnterprise,
  LocationPoint,
  DeliveryPackageType,
  VehicleType
} from '../../types';
import { LUBUMBASHI_PRESET_LOCATIONS } from '../../data/mockData';
import { LubumbashiMap } from '../LubumbashiMap';
import { AddressInputBlock } from '../Shared/AddressInputBlock';
import {
  Building2,
  Send,
  ShieldCheck,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
  Filter,
  DollarSign,
  Crown,
  Rocket,
  Bell,
  Smartphone,
  Zap,
  Sparkles,
  RefreshCw,
  Radio,
  Check,
  Layers,
  Laptop,
  FileText,
  IdCard,
  Lock,
  Bike,
  Car
} from 'lucide-react';

export const PartnerAdminView: React.FC = () => {
  const {
    partners,
    drivers,
    orders,
    createPartnerDispatch,
    showToast,
    setSelectedOrderId,
    setActiveView,
    getMileageQuote,
    calculateDistance,
    pricingConfig,
    updatePricingConfig,
    t,
    language,
    releases,
    broadcasts,
    deployNewRelease,
    publishBroadcast,
    toggleBroadcastActive,
    forcePwaCacheReload,
    scaleStats,
    openContractModal,
    openCarteModal,
    certifyDriverMatricule
  } = useDelivery();

  // Active subtab
  const [activeTab, setActiveTab] = useState<'dispatch' | 'supervision' | 'audit' | 'pricing' | 'owner_updates'>('owner_updates');

  // Form states for Owner Release Deployment
  const [newVersion, setNewVersion] = useState<string>('v3.3.0');
  const [newCodename, setNewCodename] = useState<string>('Katanga Express Corridor & Mobile Money');
  const [newChangelog, setNewChangelog] = useState<string>(
    'Intégration passerelle Airtel Money & M-Pesa RDC\nExtension des corridors vers Kasumbalesa\nOptimisation du cache offline pour connexions lentes'
  );
  const [isMandatoryRelease, setIsMandatoryRelease] = useState<boolean>(false);

  // Form states for Owner Broadcast Alerts
  const [broadcastTitle, setBroadcastTitle] = useState<string>('Flash Trafic Lubumbashi');
  const [broadcastMessage, setBroadcastMessage] = useState<string>(
    'Pluie battante signalée sur la Commune Annexe (Golf). Prudence aux motards et majoration automatique de sécurité.'
  );
  const [broadcastType, setBroadcastType] = useState<'info' | 'warning' | 'urgent'>('warning');
  const [broadcastAudience, setBroadcastAudience] = useState<'all' | 'drivers' | 'clients'>('all');

  // Form states for Enterprise Quick Dispatch
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(partners[0].id);
  const [deliveryPoint, setDeliveryPoint] = useState<LocationPoint>(LUBUMBASHI_PRESET_LOCATIONS[5]); // Stade TP Mazembe
  const [recipientName, setRecipientName] = useState<string>('Alain Mwilambwe');
  const [recipientPhone, setRecipientPhone] = useState<string>('+243 82 101 2020');
  const [packageType, setPackageType] = useState<DeliveryPackageType>('medical');
  const [packageDescription, setPackageDescription] = useState<string>(
    'Commande urgente de produits pharmaceutiques et ordonnance'
  );
  const [customPriceCDF, setCustomPriceCDF] = useState<number | null>(null);

  // Mileage simulator in admin tab
  const [simulatedKm, setSimulatedKm] = useState<number>(6.5);

  const currentPartner = partners.find((p) => p.id === selectedPartnerId) || partners[0];
  const partnerDistanceKm = calculateDistance(currentPartner.coords, deliveryPoint.coords);
  const partnerAutoQuote = getMileageQuote(partnerDistanceKm, 'moto');
  const effectivePriceCDF = customPriceCDF !== null ? customPriceCDF : partnerAutoQuote.totalCDF;

  const handleEmitDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !recipientPhone.trim()) {
      showToast('Formulaire incomplet', 'Le nom et téléphone du client sont requis.', 'error');
      return;
    }

    const newOrder = createPartnerDispatch({
      partnerId: selectedPartnerId,
      delivery: deliveryPoint,
      packageType,
      packageDescription,
      recipientName,
      recipientPhone,
      priceCDF: effectivePriceCDF
    });

    showToast(
      language === 'sw' ? 'Mzigo umetumwa kwa mafanikio !' : 'Signalement émis avec succès !',
      `Course ${newOrder.id} (${newOrder.distanceKm} km). Montant : ${effectivePriceCDF.toLocaleString()} CDF. PIN : ${newOrder.pinCode}`,
      'success'
    );
  };

  // KPI Calculations
  const totalVolumeCDF = orders.reduce((sum, o) => sum + o.priceCDF, 0);
  const totalVolumeUSD = Math.round((totalVolumeCDF / pricingConfig.exchangeRateUSD) * 10) / 10;
  const activeFleetCount = drivers.filter((d) => d.isOnline).length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const inProgressCount = orders.filter(
    (o) => o.status === 'accepted' || o.status === 'heading_to_pickup' || o.status === 'picked_up'
  ).length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header and Subnav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">{t.partnerAdminTitle}</h1>
            <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/30">
              Lubumbashi Hub
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.partnerAdminSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('dispatch')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'dispatch'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.tabPartnerDispatch}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('supervision')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'supervision'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t.tabFleetSupervision}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pricing'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.tabPricingGrid}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.tabSecurityAudit} ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('owner_updates')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'owner_updates'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Propriétaire & Mises à Jour</span>
            <span className="text-[10px] bg-slate-950/80 text-amber-300 px-1.5 py-0.2 rounded font-bold font-mono">
              V3.2
            </span>
          </button>
        </div>
      </div>

      {/* KPI METRICS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-800/70 rounded-2xl border border-slate-700/70 p-4">
          <span className="text-[11px] text-slate-400 block font-medium">{t.activeDriversCount}</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-white font-mono">{activeFleetCount}</span>
            <span className="text-xs text-slate-400">/ {drivers.length}</span>
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 block">Patrouille Lubumbashi</span>
        </div>

        <div className="bg-slate-800/70 rounded-2xl border border-slate-700/70 p-4">
          <span className="text-[11px] text-slate-400 block font-medium">{t.transitCoursesCount}</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-amber-400 font-mono">{inProgressCount}</span>
            <span className="text-xs text-slate-400">en direct</span>
          </div>
          <span className="text-[10px] text-amber-300/80 mt-1 block">GPS Live</span>
        </div>

        <div className="bg-slate-800/70 rounded-2xl border border-slate-700/70 p-4">
          <span className="text-[11px] text-slate-400 block font-medium">{t.certifiedDeliveriesCount}</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">{deliveredCount}</span>
            <span className="text-xs text-emerald-400 font-semibold">100% PIN OK</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">0 litige</span>
        </div>

        <div className="bg-slate-800/70 rounded-2xl border border-slate-700/70 p-4">
          <span className="text-[11px] text-slate-400 block font-medium">{t.totalVolumeCount}</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg sm:text-xl font-extrabold text-amber-400 font-mono truncate">
              {totalVolumeCDF.toLocaleString()} CDF
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
            ~${totalVolumeUSD} USD
          </span>
        </div>
      </div>

      {/* SUBTAB 1: FAST ENTERPRISE DISPATCH (SECTION 2.B DU CAHIER DES CHARGES) */}
      {activeTab === 'dispatch' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Dispatch Form (7 cols) */}
          <form
            onSubmit={handleEmitDispatch}
            className="lg:col-span-7 bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 space-y-4 shadow-xl"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
              <Building2 className="w-5 h-5 text-amber-400" />
              <div>
                <h2 className="text-base font-bold text-white">Signalement Partenaire / Entreprise</h2>
                <p className="text-xs text-slate-400">
                  Émettez immédiatement une livraison depuis votre établissement vers votre client
                </p>
              </div>
            </div>

            {/* Select Partner Establishment */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Établissement expéditeur (Point de ramassage A)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {partners.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPartnerId(p.id)}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
                      selectedPartnerId === p.id
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-sm'
                        : 'bg-slate-900 border-slate-700/60 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-xl">{p.logo}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{p.commune}</div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 italic mt-1">
                Adresse de retrait : {currentPartner.address} ({currentPartner.phone})
              </p>
            </div>

            {/* Destination Point B (Adresse Complète & Précise) */}
            <div className="pt-2 border-t border-slate-700/80">
              <AddressInputBlock
                label="Adresse de livraison client (Point B : Commune, Quartier, Avenue, N°, Repère)"
                pointType="delivery"
                value={deliveryPoint}
                onChange={(updatedPoint) => setDeliveryPoint(updatedPoint)}
              />
            </div>

            {/* Client Coordinates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-700/80">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Nom du client destinataire</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="ex: Alain Mwilambwe"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Téléphone client (RDC)</label>
                <input
                  type="tel"
                  required
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="+243 82 000 0000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Package details */}
            <div className="space-y-2 pt-2 border-t border-slate-700/80">
              <label className="text-xs font-bold text-slate-300">Description du colis à livrer</label>
              <input
                type="text"
                value={packageDescription}
                onChange={(e) => setPackageDescription(e.target.value)}
                placeholder="ex: Commande de produits pharmaceutiques / Cartons provisions"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Dynamic Mileage & Auto Rate for Partner */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Itinéraire {currentPartner.name.split(' ')[0]} → {deliveryPoint.name.split(' ')[0]}</span>
                </span>
                <span className="font-mono text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  {partnerDistanceKm} km
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Calcul selon barème kilométrique :</span>
                <span className="font-mono text-slate-200">
                  {partnerAutoQuote.baseFeeCDF.toLocaleString()} + ({partnerDistanceKm} km × {partnerAutoQuote.perKmRateCDF.toLocaleString()} CDF)
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-300 font-semibold block">Montant Facturé au Client :</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ~${Math.round((effectivePriceCDF / pricingConfig.exchangeRateUSD) * 10) / 10} USD
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="500"
                    value={effectivePriceCDF}
                    onChange={(e) => setCustomPriceCDF(Number(e.target.value))}
                    className="w-32 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-amber-400 text-right focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-xs font-mono text-slate-400">CDF</span>
                  {customPriceCDF !== null && (
                    <button
                      type="button"
                      onClick={() => setCustomPriceCDF(null)}
                      className="text-[10px] text-amber-400 hover:underline"
                      title="Réinitialiser au barème kilométrique automatique"
                    >
                      Auto
                    </button>
                  )}
                </div>
              </div>
            </div>


            {/* Submit Dispatch */}
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20"
            >
              <Send className="w-4 h-4" />
              <span>Diffuser le Signalement aux Livreurs de Lubumbashi</span>
            </button>
          </form>

          {/* Right Column: Fleet Live Radar & Partner Benefits (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Radar Flotte Lubumbashi</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {drivers.filter((d) => d.isOnline).length} livreurs connectés
                </span>
              </div>

              {/* Map highlighting partner location */}
              <LubumbashiMap
                pickupPoint={{
                  name: currentPartner.name,
                  address: currentPartner.address,
                  commune: currentPartner.commune,
                  coords: currentPartner.coords
                }}
                deliveryPoint={deliveryPoint}
                heightClassName="h-[250px]"
              />

              <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Protection Anti-Perte & Fraude</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Le livreur ne pourra en aucun cas clôturer la course sans que votre client lui fournisse le <strong>code PIN unique à 4 chiffres</strong>.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                <span>Passer sur l'app livreur pour accepter :</span>
                <button
                  type="button"
                  onClick={() => setActiveView('driver')}
                  className="text-amber-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Vue Livreur</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: GLOBAL FLEET & ORDERS SUPERVISION */}
      {activeTab === 'supervision' && (
        <div className="space-y-6">
          {/* Central Map of Lubumbashi */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">Carte Centrale de Surveillance des Opérations</h2>
                <p className="text-xs text-slate-400">
                  Suivi des positions en direct et des trajets en cours à travers les 7 communes de Lubumbashi
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {orders.length} courses suivies
              </span>
            </div>

            <LubumbashiMap heightClassName="h-[380px] md:h-[460px]" showAllDrivers />
          </div>

          {/* All Active & Past Orders Table */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Toutes les Livraisons de la Journée</h3>
              <span className="text-xs text-slate-400">Filtrage temps réel</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pl-2">ID</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Ramassage (A)</th>
                    <th className="pb-3">Destination (B)</th>
                    <th className="pb-3">Livreur</th>
                    <th className="pb-3">Montant (CDF)</th>
                    <th className="pb-3">Code PIN</th>
                    <th className="pb-3">Statut</th>
                    <th className="pb-3 pr-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-750/50 transition">
                      <td className="py-3 pl-2 font-mono font-bold text-white">{ord.id}</td>
                      <td className="py-3">
                        <span className="text-[11px] text-slate-300">
                          {ord.serviceType === 'partner_dispatch' ? 'Entreprise' : 'Particulier'}
                        </span>
                      </td>
                      <td className="py-3 text-slate-300">{ord.pickup.name}</td>
                      <td className="py-3 text-slate-300">{ord.delivery.name}</td>
                      <td className="py-3">
                        {ord.assignedDriver ? (
                          <span className="text-amber-400 font-semibold">{ord.assignedDriver.name}</span>
                        ) : (
                          <span className="text-slate-500 italic">En attente</span>
                        )}
                      </td>
                      <td className="py-3 font-mono font-bold text-slate-200">
                        {ord.priceCDF.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className="font-mono font-extrabold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          {ord.pinCode}
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : ord.status === 'picked_up'
                              ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {ord.status === 'delivered' ? 'Certifié PIN' : ord.status}
                        </span>
                      </td>
                      <td className="py-3 pr-2 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrderId(ord.id);
                            setActiveView('client');
                          }}
                          className="text-amber-400 hover:underline font-semibold"
                        >
                          Voir Suivi
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: CONFIGURATION DU BARÈME KILOMÉTRIQUE & SIMULATEUR */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Barème Kilométrique Officiel — Lubumbashi</h2>
                  <p className="text-xs text-slate-400">
                    Configuration des tarifs au kilomètre et de la prise en charge pour chaque catégorie de véhicule.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
                <span className="text-slate-400">Taux USD :</span>
                <span className="font-mono font-bold text-emerald-400">1$ = {pricingConfig.exchangeRateUSD.toLocaleString()} CDF</span>
              </div>
            </div>

            {/* Editable Vehicle Rates Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Moto Express */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏍️</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">Moto Express</h4>
                      <span className="text-[10px] text-amber-400 font-semibold">Trafic & Courriers Rapides</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Prise en charge de base (CDF)</label>
                    <input
                      type="number"
                      step="500"
                      value={pricingConfig.vehicleRates.moto.baseCDF}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        updatePricingConfig({
                          vehicleRates: {
                            ...pricingConfig.vehicleRates,
                            moto: { ...pricingConfig.vehicleRates.moto, baseCDF: val }
                          }
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Tarif par kilomètre (CDF / km)</label>
                    <input
                      type="number"
                      step="100"
                      value={pricingConfig.vehicleRates.moto.perKmCDF}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        updatePricingConfig({
                          vehicleRates: {
                            ...pricingConfig.vehicleRates,
                            moto: { ...pricingConfig.vehicleRates.moto, perKmCDF: val }
                          }
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Vélo Cargo */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🚲</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">Vélo Cargo</h4>
                      <span className="text-[10px] text-emerald-400 font-semibold">Courtes Distances & Éco</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Prise en charge de base (CDF)</label>
                    <input
                      type="number"
                      step="500"
                      value={pricingConfig.vehicleRates.velo.baseCDF}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        updatePricingConfig({
                          vehicleRates: {
                            ...pricingConfig.vehicleRates,
                            velo: { ...pricingConfig.vehicleRates.velo, baseCDF: val }
                          }
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Tarif par kilomètre (CDF / km)</label>
                    <input
                      type="number"
                      step="100"
                      value={pricingConfig.vehicleRates.velo.perKmCDF}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        updatePricingConfig({
                          vehicleRates: {
                            ...pricingConfig.vehicleRates,
                            velo: { ...pricingConfig.vehicleRates.velo, perKmCDF: val }
                          }
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Voiture / Fourgonnette */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-sky-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🚙</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">Voiture / Van</h4>
                      <span className="text-[10px] text-sky-400 font-semibold">Gros Volumes & Malles</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Prise en charge de base (CDF)</label>
                    <input
                      type="number"
                      step="500"
                      value={pricingConfig.vehicleRates.voiture.baseCDF}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        updatePricingConfig({
                          vehicleRates: {
                            ...pricingConfig.vehicleRates,
                            voiture: { ...pricingConfig.vehicleRates.voiture, baseCDF: val }
                          }
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Tarif par kilomètre (CDF / km)</label>
                    <input
                      type="number"
                      step="100"
                      value={pricingConfig.vehicleRates.voiture.perKmCDF}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        updatePricingConfig({
                          vehicleRates: {
                            ...pricingConfig.vehicleRates,
                            voiture: { ...pricingConfig.vehicleRates.voiture, perKmCDF: val }
                          }
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-sky-400 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* INTERACTIVE MILEAGE SIMULATOR */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Simulateur Interactif de Prix au Kilomètre</h3>
                <p className="text-xs text-slate-400">
                  Déplacez le curseur pour tester le devis instantané selon la distance parcourue à Lubumbashi.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Distance simulée</span>
                <span className="text-xl font-black text-amber-400 font-mono">{simulatedKm} km</span>
              </div>
            </div>

            {/* Slider control */}
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="25"
                step="0.5"
                value={simulatedKm}
                onChange={(e) => setSimulatedKm(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1.0 km (Intra-Centre)</span>
                <span>5.0 km (Golf / Kamalondo)</span>
                <span>12.0 km (Ruashi / Luano)</span>
                <span>25.0 km (Périphérie / Kasapa)</span>
              </div>
            </div>

            {/* Results comparison grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {(['moto', 'velo', 'voiture'] as VehicleType[]).map((vType) => {
                const quote = getMileageQuote(simulatedKm, vType);
                const rate = pricingConfig.vehicleRates[vType];
                return (
                  <div
                    key={vType}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">{rate.icon}</span>
                        <strong className="text-slate-100">{rate.label}</strong>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">~{quote.estimatedMinutes} min</span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                      <div className="flex justify-between">
                        <span>Base fixe :</span>
                        <span className="font-mono text-slate-300">{rate.baseCDF.toLocaleString()} CDF</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{simulatedKm} km × {rate.perKmCDF.toLocaleString()} CDF :</span>
                        <span className="font-mono text-amber-400">+{quote.distanceCostCDF.toLocaleString()} CDF</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-baseline justify-between">
                      <span className="font-bold text-white">Prix Total</span>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-amber-400 font-mono">
                          {quote.totalCDF.toLocaleString()} CDF
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          (~${quote.totalUSD} USD)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: SECURITY AUDIT & PIN VALIDATION TRACEABILITY */}
      {activeTab === 'audit' && (
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white">Journal d'Audit des Codes PIN & Clôtures</h2>
              <p className="text-xs text-slate-400">
                Traçabilité cryptographique et certification des remises de colis de bout en bout à Lubumbashi
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">#{ord.id}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-300 font-semibold">{ord.packageDescription}</span>
                  </div>

                  <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                    <span>Émetteur : {ord.senderName} ({ord.senderPhone})</span>
                    <span>→</span>
                    <span>Destinataire : {ord.recipientName} ({ord.recipientPhone})</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t md:border-t-0 pt-2 md:pt-0 border-slate-800">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Code PIN Défini</span>
                    <span className="text-sm font-mono font-extrabold text-amber-400 tracking-wider">
                      {ord.pinCode}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Tentatives</span>
                    <span className="text-xs font-mono font-semibold text-slate-200">
                      {ord.pinValidationAttempts || (ord.status === 'delivered' ? 1 : 0)} / 3
                    </span>
                  </div>

                  <div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border flex items-center gap-1 ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {ord.status === 'delivered' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Certifié & Remis</span>
                        </>
                      ) : (
                        <span>En Attente PIN</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: OWNER & UPDATE GOVERNANCE (CONSOLE PROPRIÉTAIRE) */}
      {activeTab === 'owner_updates' && (
        <div className="space-y-6">
          {/* Owner Platform Status & Credentials Header */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/40 rounded-2xl border-2 border-amber-500/40 p-5 sm:p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 shrink-0">
                  <Crown className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-white">
                      Console Propriétaire & Gouvernance des Mises à Jour
                    </h2>
                    <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      Licence Fondateur
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    Vous êtes le propriétaire direct de la plateforme <strong>Lubumbashi Express</strong>. Supervisez le cycle de vie applicatif, déployez des versions OTA, ajustez vos barèmes économiques sans coder et alertez vos <strong>1,2M d'utilisateurs</strong> en temps réel.
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={forcePwaCacheReload}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 border border-slate-700 shadow transition"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Vider Cache PWA (Force Sync)</span>
                </button>
              </div>
            </div>

            {/* Platform Status Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-700/80">
              <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium uppercase">Version Active</span>
                <span className="text-sm font-extrabold text-amber-400 font-mono">v3.2.0 (Katanga)</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">● En Production Cloud</span>
              </div>

              <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium uppercase">Infrastructure Cloud</span>
                <span className="text-sm font-extrabold text-white font-mono">Cloud Run RDC</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Latence ~18ms Katanga</span>
              </div>

              <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium uppercase">Écosystème Connecté</span>
                <span className="text-sm font-extrabold text-white font-mono">{(scaleStats.totalUsersRegistered).toLocaleString()}</span>
                <span className="text-[10px] text-amber-400 block mt-0.5">{scaleStats.activeDriversCount.toLocaleString()} motards actifs</span>
              </div>

              <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium uppercase">Clé d'Accréditation</span>
                <span className="text-xs font-extrabold text-slate-300 font-mono">LX-KAT-2026-CLOUD</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Validée & Sécurisée</span>
              </div>
            </div>
          </div>

          {/* REGISTRE CONFIDENTIEL DES MATRICULES & CARTES D'IMMATRICULATION (ESPACE RÉSERVÉ PROPRIÉTAIRE) */}
          <div className="bg-slate-800/90 rounded-2xl border-2 border-amber-500/50 p-5 sm:p-6 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Registre des Matricules & Cartes d'Immatriculation
                    </h3>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold px-2.5 py-0.5 rounded-full border border-amber-500/40 uppercase">
                      Privé Copropriétaire
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Coordonnées administratives confidentielles. Chaque conducteur (vélo, moto, voiture, van) possède un matricule légal Katanga, une carte officielle avec votre signature et son contrat d'engagement PDF.
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 font-mono block">Conducteurs Référéncés</span>
                <span className="text-lg font-extrabold text-amber-400 font-mono">{drivers.length} Conducteurs Actifs</span>
              </div>
            </div>

            {/* Drivers Registry Cards Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {drivers.map((drv) => (
                <div
                  key={drv.id}
                  className="bg-slate-900/90 rounded-2xl border border-slate-700/80 p-4 space-y-3 hover:border-amber-500/40 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-13 h-13 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-950 flex items-center justify-center shrink-0">
                        {drv.avatarUrl ? (
                          <img src={drv.avatarUrl} alt={drv.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">{drv.avatar}</span>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white leading-tight">{drv.name}</h4>
                          <span className="text-[10px] px-2 py-0.2 rounded font-semibold bg-emerald-500/20 text-emerald-400">
                            {drv.vehicleCategoryLabel}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">{drv.commune} · {drv.phone}</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          Véhicule : <strong className="text-slate-200">{drv.vehicleModel}</strong> ({drv.plateNumber})
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        drv.isOwnerCertified
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {drv.isOwnerCertified ? '✓ Accrédité' : 'En Attente'}
                    </span>
                  </div>

                  {/* Secret Matricule Block */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Matricule Officiel</span>
                      <span className="font-mono font-black text-amber-400 text-xs tracking-wider">
                        {drv.matriculeId}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Carte d'Immatriculation N° :</span>
                      <span className="font-mono text-slate-200">
                        {drv.carteImmatriculationId || `CI-LSH-2026-${drv.matriculeId.split('-').pop()}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Contrat d'Affiliation PDF :</span>
                      <span className="text-emerald-400 font-medium">
                        {drv.driverSignatureDataUrl ? '✓ Signé par le conducteur' : 'Non signé'}
                      </span>
                    </div>
                  </div>

                  {/* Owner Controls on this Driver */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => openContractModal(drv.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>Contrat PDF</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {!drv.isOwnerCertified && (
                        <button
                          type="button"
                          onClick={() => certifyDriverMatricule(drv.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow"
                        >
                          Accréditer & Signer
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => openCarteModal(drv.id)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow"
                      >
                        <IdCard className="w-3.5 h-3.5" />
                        <span>Voir Carte Signée</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PRACTICAL GUIDE FOR THE OWNER: HOW TO MANAGE UPDATES */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-700">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-white">
                  Guide Pratique : Comment vous, Propriétaire, pilotez vos mises à jour ?
                </h3>
                <p className="text-xs text-slate-400">
                  Trois niveaux de contrôle complémentaires pour faire évoluer Lubumbashi Express en toute sérénité.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pillar 1: Economic & Pricing Updates */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-amber-500/20 space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  1
                </div>
                <h4 className="text-sm font-bold text-white">Mises à Jour Opérationnelles & Tarifs (Zéro Code)</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Vous n'avez pas besoin de toucher au code pour adapter votre modèle économique :
                </p>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                  <li>Ouvrez l'onglet <strong>"Barème Kilométrique"</strong> ci-dessus.</li>
                  <li>Modifiez le prix du kilomètre (ex: 750 CDF/km) et la prise en charge de base.</li>
                  <li>Modifiez le taux de conversion 1$ USD en Francs Congolais (CDF).</li>
                  <li><strong>Effet immédiat :</strong> Tous les calculs de devis des clients et motards sont actualisés sur le champ.</li>
                </ul>
                <button
                  type="button"
                  onClick={() => setActiveTab('pricing')}
                  className="mt-2 text-xs text-amber-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Accéder au Barème Kilométrique</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Pillar 2: Feature & App Logic Updates */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-sky-500/20 space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                  2
                </div>
                <h4 className="text-sm font-bold text-white">Mises à Jour Logicielles (Nouvelles Fonctions)</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Pour ajouter des fonctionnalités complexes (ex: Airtel Money, M-Pesa, dispatch automatique, corridors Kasumbalesa) :
                </p>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                  <li>Exprimez simplement votre besoin en français dans <strong>Google AI Studio</strong>.</li>
                  <li>L'IA conçoit l'architecture, intègre les API et vérifie les tests TypeScript sans régression.</li>
                  <li>La compilation et le déploiement sur le conteneur Cloud Run se font automatiquement.</li>
                  <li>Vous conservez la propriété intellectuelle complète du projet.</li>
                </ul>
              </div>

              {/* Pillar 3: Seamless Mobile Over-The-Air (PWA) */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-emerald-500/20 space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  3
                </div>
                <h4 className="text-sm font-bold text-white">Diffusion Invisible aux Utilisateurs (OTA)</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fini les téléchargements lourds et les frictions pour vos 1.2M d'utilisateurs :
                </p>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                  <li>L'application utilise l'architecture <strong>Progressive Web App (PWA)</strong>.</li>
                  <li>À chaque nouvelle publication, le Service Worker télécharge le patch en arrière-plan.</li>
                  <li>Dès que le client ou motard ouvre l'app, il bénéficie de la dernière version sans effort.</li>
                  <li>Vous pouvez forcer la synchronisation avec le bouton <em>"Vider Cache PWA"</em>.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* TWO INTERACTIVE OWNER WORKSPACES */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: OTA Release Deployment Form & Version History (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Deploy New Release Form */}
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">Déployer une Nouvelle Mise à Jour (OTA)</h3>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Canal : Production Katanga
                  </span>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newVersion.trim() || !newCodename.trim() || !newChangelog.trim()) {
                      showToast('Champs requis', 'Veuillez renseigner la version, le nom et les notes.', 'error');
                      return;
                    }
                    const notes = newChangelog
                      .split('\n')
                      .map((n) => n.trim())
                      .filter((n) => n.length > 0);
                    deployNewRelease(newVersion.trim(), newCodename.trim(), notes, isMandatoryRelease);
                    setNewVersion('v3.3.1');
                    setNewCodename('Correctifs & Optimisations');
                    setNewChangelog('Améliorations de performance\nOptimisation du signal GPS à Kamalondo');
                  }}
                  className="space-y-3.5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                        Numéro de Version
                      </label>
                      <input
                        type="text"
                        required
                        value={newVersion}
                        onChange={(e) => setNewVersion(e.target.value)}
                        placeholder="ex: v3.3.0"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                        Nom de Code de la Release
                      </label>
                      <input
                        type="text"
                        required
                        value={newCodename}
                        onChange={(e) => setNewCodename(e.target.value)}
                        placeholder="ex: Katanga Mobile Money & Corridors"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Notes de Version (Changelog — 1 point par ligne)
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newChangelog}
                      onChange={(e) => setNewChangelog(e.target.value)}
                      placeholder="Listez les nouveautés..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none font-sans"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-700/80">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={isMandatoryRelease}
                        onChange={(e) => setIsMandatoryRelease(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-800 border-slate-700"
                      />
                      <span>Mise à jour obligatoire (Forcer le rechargement immédiat)</span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">OTA Instant</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-[0.99]"
                  >
                    <Rocket className="w-4 h-4" />
                    <span>Diffuser la Mise à Jour aux 1,2M d'Utilisateurs</span>
                  </button>
                </form>
              </div>

              {/* Version History List */}
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Historique des Versions Déployées ({releases.length})</h3>
                  <span className="text-[10px] text-slate-400">Registre Propriétaire</span>
                </div>

                <div className="space-y-3">
                  {releases.map((rel, idx) => (
                    <div
                      key={rel.id}
                      className={`p-4 rounded-xl border transition ${
                        idx === 0
                          ? 'bg-amber-500/10 border-amber-500/40 text-slate-200 shadow-sm'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-white">{rel.version}</span>
                          <span className="text-xs font-semibold text-amber-400">· {rel.codename}</span>
                          {idx === 0 && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.2 rounded border border-emerald-500/30">
                              Active
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">{rel.releasedAt}</span>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                        <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                          {rel.changelog.map((log, lIdx) => (
                            <li key={lIdx} className="leading-snug">{log}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
                        <span>Par : {rel.deployedBy}</span>
                        <span>Canal : {rel.channel}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Platform Broadcast Flash Alerts & Fleet Approvals (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Broadcast Alert Form */}
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 shadow-xl space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
                  <Bell className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Diffuser un Flash Info en Direct</h3>
                    <p className="text-[11px] text-slate-400">
                      Notification push instantanée aux motards ou clients de Lubumbashi.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
                      showToast('Incomplet', 'Le titre et le message sont requis.', 'error');
                      return;
                    }
                    publishBroadcast(broadcastTitle.trim(), broadcastMessage.trim(), broadcastType, broadcastAudience);
                    setBroadcastTitle('');
                    setBroadcastMessage('');
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Titre de l'Alerte Flash
                    </label>
                    <input
                      type="text"
                      required
                      value={broadcastTitle}
                      onChange={(e) => setBroadcastTitle(e.target.value)}
                      placeholder="ex: Alerte Trafic / Bonus Spécial"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Message diffusé
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      placeholder="Détails du message..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Urgence</label>
                      <select
                        value={broadcastType}
                        onChange={(e) => setBroadcastType(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                      >
                        <option value="info">Info Générale</option>
                        <option value="warning">Avertissement Trafic</option>
                        <option value="urgent">Urgence Sécurité</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Destinataires</label>
                      <select
                        value={broadcastAudience}
                        onChange={(e) => setBroadcastAudience(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                      >
                        <option value="all">Tous (1.2M)</option>
                        <option value="drivers">18,450 Motards</option>
                        <option value="clients">Clients Seuls</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-10 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Radio className="w-3.5 h-3.5 text-amber-400" />
                    <span>Diffuser le Flash Info</span>
                  </button>
                </form>
              </div>

              {/* Active Broadcasts */}
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Alertes Réseau en Cours ({broadcasts.length})
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-mono">Temps Réel</span>
                </div>

                <div className="space-y-2.5">
                  {broadcasts.map((bc) => (
                    <div
                      key={bc.id}
                      className={`p-3 rounded-xl border space-y-1.5 text-xs ${
                        bc.isActive
                          ? bc.type === 'urgent'
                            ? 'bg-rose-500/10 border-rose-500/40 text-slate-200'
                            : bc.type === 'warning'
                            ? 'bg-amber-500/10 border-amber-500/40 text-slate-200'
                            : 'bg-sky-500/10 border-sky-500/40 text-slate-200'
                          : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <strong className="font-bold text-white flex items-center gap-1.5">
                          {bc.type === 'urgent' ? '🚨' : bc.type === 'warning' ? '⚠️' : '📢'}
                          <span>{bc.title}</span>
                        </strong>
                        <button
                          type="button"
                          onClick={() => toggleBroadcastActive(bc.id)}
                          className={`text-[10px] px-2 py-0.5 rounded font-bold transition ${
                            bc.isActive
                              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {bc.isActive ? 'Désactiver' : 'Réactiver'}
                        </button>
                      </div>

                      <p className="text-[11px] leading-relaxed text-slate-300">{bc.message}</p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                        <span>Cible : {bc.targetAudience === 'all' ? 'Tout le réseau' : bc.targetAudience === 'drivers' ? 'Motards' : 'Clients'}</span>
                        <span className="font-mono">{bc.publishedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Owner Security & Data Backup */}
              <div className="bg-slate-900/80 rounded-2xl border border-slate-700/60 p-4 space-y-2.5 text-xs text-slate-400">
                <div className="flex items-center gap-2 text-white font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Sécurité des Données Katanga</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Toutes les transactions, coordonnées GPS, photos des livreurs et validations PIN sont chiffrées de bout en bout et sauvegardées en continu.
                </p>
                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Sauvegarde Automatique : Activée</span>
                  <span className="text-emerald-400">100% Intègre</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
