import React, { useState, useRef } from 'react';
import { useDelivery } from '../../context/DeliveryContext';
import { PRESET_AVATARS, LUBUMBASHI_COMMUNES, LUBUMBASHI_COMMUNES_DETAILED } from '../../data/mockData';
import {
  X,
  User,
  Bike,
  Camera,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Star,
  MapPin,
  Phone,
  Mail,
  Award,
  Wallet,
  Compass,
  FileBadge
} from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    closeProfileModal,
    profileModalRole,
    clientProfile,
    updateClientProfile,
    currentDriver,
    updateDriverProfile,
    language,
    t
  } = useDelivery();

  const [activeTab, setActiveTab] = useState<'client' | 'driver'>(profileModalRole);

  // Client form states
  const [clientName, setClientName] = useState(clientProfile.name);
  const [clientPhone, setClientPhone] = useState(clientProfile.phone);
  const [clientEmail, setClientEmail] = useState(clientProfile.email);
  const [clientCommune, setClientCommune] = useState(clientProfile.commune);
  const [clientAvatarUrl, setClientAvatarUrl] = useState(clientProfile.avatarUrl || '');

  // Driver form states
  const [driverName, setDriverName] = useState(currentDriver.name);
  const [driverPhone, setDriverPhone] = useState(currentDriver.phone);
  const [driverPlate, setDriverPlate] = useState(currentDriver.plateNumber);
  const [driverModel, setDriverModel] = useState(currentDriver.vehicleModel);
  const [driverMatricule, setDriverMatricule] = useState(currentDriver.matriculeId || 'HV-LSH-0842-MOT');
  const [driverLicense, setDriverLicense] = useState(currentDriver.licenseNumber || 'PERMIS-RDC-KAT-994821');
  const [driverAvatarUrl, setDriverAvatarUrl] = useState(currentDriver.avatarUrl || '');
  const [driverVehicleUrl, setDriverVehicleUrl] = useState(currentDriver.vehiclePhotoUrl || '');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const vehicleFileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isProfileModalOpen) return null;

  // Handle local file upload and convert to base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'client' | 'driver' | 'vehicle') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (target === 'client') {
          setClientAvatarUrl(result);
        } else if (target === 'driver') {
          setDriverAvatarUrl(result);
        } else if (target === 'vehicle') {
          setDriverVehicleUrl(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    updateClientProfile({
      name: clientName,
      phone: clientPhone,
      email: clientEmail,
      commune: clientCommune,
      avatarUrl: clientAvatarUrl
    });
    closeProfileModal();
  };

  const handleSaveDriver = (e: React.FormEvent) => {
    e.preventDefault();
    updateDriverProfile(currentDriver.id, {
      name: driverName,
      phone: driverPhone,
      plateNumber: driverPlate,
      vehicleModel: driverModel,
      matriculeId: driverMatricule,
      licenseNumber: driverLicense,
      avatarUrl: driverAvatarUrl,
      vehiclePhotoUrl: driverVehicleUrl
    });
    closeProfileModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">
                {language === 'sw' ? 'Wasifu & Picha za Utambulisho' : 'Profil & Photos d’Identification'}
              </h2>
              <span className="text-[11px] bg-amber-500/10 text-amber-400 font-semibold px-2 py-0.5 rounded border border-amber-500/20">
                Lubumbashi Express
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'sw'
                ? 'Tofauti wazi kati ya Mteja na Motard: Kitambulisho, picha ya wasifu na kadi ya kazi.'
                : 'Distinction claire entre Client et Livreur : Rôles, matricules, photo de profil et coordination.'}
            </p>
          </div>

          <button
            onClick={closeProfileModal}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Switcher Tabs (Client vs Livreur) */}
        <div className="px-5 pt-3 bg-slate-900 border-b border-slate-800 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('client')}
            className={`flex-1 pb-3 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition ${
              activeTab === 'client'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{language === 'sw' ? '1. Wasifu wa Mteja' : '1. Profil Client Particulier'}</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">
              {clientProfile.clientNumber}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('driver')}
            className={`flex-1 pb-3 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition ${
              activeTab === 'driver'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>{language === 'sw' ? '2. Wasifu wa Motard Pro' : '2. Profil Livreur / Motard Pro'}</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono">
              Certifié
            </span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {activeTab === 'client' ? (
            /* ================= CLIENT PROFILE FORM ================= */
            <form onSubmit={handleSaveClient} className="space-y-5">
              {/* Client Distinction Banner */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    {language === 'sw' ? 'Akaunti ya Mteja (Mtumaji na Mpokeaji)' : 'Compte Client Donneur d’Ordre'}
                  </h4>
                  <p className="text-xs text-amber-200/80 leading-relaxed mt-0.5">
                    {language === 'sw'
                      ? 'Kama mteja, unaomba motard kutoka Point A hadi Point B, unapata kodi ya PIN ya siri na unafuata motard wako kwenye ramani ya GPS.'
                      : 'En tant que client, vous commandez des courses Point A → B, recevez le code PIN secret à 4 chiffres et suivez votre motard en direct sur la carte.'}
                  </p>
                </div>
              </div>

              {/* Photo de profil section */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-4">
                <label className="text-xs font-bold text-slate-300 block">
                  {language === 'sw' ? 'Picha ya Wasifu wa Mteja' : 'Photo de profil du Client'}
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-700 flex items-center justify-center shadow-lg">
                      {clientAvatarUrl ? (
                        <img src={clientAvatarUrl} alt={clientName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl">{clientProfile.avatar}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-amber-500 text-slate-950 shadow-md hover:bg-amber-400 transition"
                      title="Téléverser une photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleFileUpload(e, 'client')}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-650 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>{language === 'sw' ? 'Pakia Picha Mpya' : 'Téléverser votre photo'}</span>
                      </button>
                      <span className="text-[11px] text-slate-400">
                        {language === 'sw' ? 'au chagua avatar ya haraka :' : 'ou choisissez un avatar :'}
                      </span>
                    </div>

                    {/* Presets Gallery */}
                    <div className="flex items-center gap-2 pt-1 overflow-x-auto justify-center sm:justify-start">
                      {PRESET_AVATARS.map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => setClientAvatarUrl(av.url)}
                          className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition ${
                            clientAvatarUrl === av.url ? 'border-amber-400 scale-105 ring-2 ring-amber-400/30' : 'border-slate-700 opacity-70 hover:opacity-100'
                          }`}
                          title={av.label}
                        >
                          <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Info Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {language === 'sw' ? 'Jina Kamili la Mteja' : 'Nom complet du Client'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {language === 'sw' ? 'Nambari ya Simu' : 'Numéro de Téléphone (RDC)'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {language === 'sw' ? 'Barua Pepe' : 'Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {language === 'sw' ? 'Wilaya ya Makazi (Commune)' : 'Commune de résidence'}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={clientCommune}
                      onChange={(e) => setClientCommune(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                    >
                      {LUBUMBASHI_COMMUNES_DETAILED.map((com) => (
                        <option key={com.id} value={com.name}>
                          {com.name} ({com.quartiers.length} quartiers)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Client Status Badge & Katanga Rewards */}
              <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700 text-xs text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">{language === 'sw' ? 'Mwanachama' : 'Identifiant'}</span>
                  <span className="font-mono font-bold text-amber-400">{clientProfile.clientNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">{language === 'sw' ? 'Alama za Uaminifu' : 'Points Katanga'}</span>
                  <span className="font-mono font-bold text-emerald-400">{clientProfile.loyaltyPoints} pts</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">{language === 'sw' ? 'Mizigo Iliyotumwa' : 'Commandes'}</span>
                  <span className="font-mono font-bold text-white">{clientProfile.totalOrders}</span>
                </div>
              </div>

              {/* Save Client Button */}
              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20 active:scale-[0.99]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'sw' ? 'Hifadhi Wasifu wa Mteja' : 'Enregistrer le Profil Client'}</span>
              </button>
            </form>
          ) : (
            /* ================= DRIVER PROFILE FORM ================= */
            <form onSubmit={handleSaveDriver} className="space-y-5">
              {/* Driver Distinction Banner */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <FileBadge className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                    {language === 'sw' ? 'Akaunti ya Motard Pro (Dereva wa Lubumbashi Express)' : 'Compte Motard Pro Certifié'}
                  </h4>
                  <p className="text-xs text-emerald-200/80 leading-relaxed mt-0.5">
                    {language === 'sw'
                      ? 'Kama dereva, unapokea tahadhari za radar, unathibitisha kuchukua mzigo, na unapaswa kuomba kodi ya PIN ya siri kwa mteja ili kufunga safari.'
                      : 'En tant que motard certifié, vous recevez les alertes du radar, confirmez la récupération et devez impérativement saisir le code PIN du client pour clôturer la course.'}
                  </p>
                </div>
              </div>

              {/* Photos Section: Motard Photo + Vehicle Photo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Driver Portrait Photo */}
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-3">
                  <label className="text-xs font-bold text-slate-300 block">
                    {language === 'sw' ? 'Picha ya Motard' : 'Photo de profil du Motard'}
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-400 bg-slate-700 flex items-center justify-center">
                        {driverAvatarUrl ? (
                          <img src={driverAvatarUrl} alt={driverName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">{currentDriver.avatar}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-emerald-500 text-slate-950"
                      >
                        <Camera className="w-3 h-3" />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleFileUpload(e, 'driver')}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>

                    <div className="flex-1 space-y-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-emerald-400 hover:underline block font-semibold"
                      >
                        {language === 'sw' ? 'Pakia Picha ya Uso' : 'Téléverser photo visage'}
                      </button>
                      <span className="text-[10px] text-slate-400 block">
                        Visible par le client pour la remise
                      </span>
                    </div>
                  </div>
                </div>

                {/* Driver Vehicle Photo */}
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-3">
                  <label className="text-xs font-bold text-slate-300 block">
                    {language === 'sw' ? 'Picha ya Chombo / Pikipiki' : 'Photo de la Moto / Véhicule'}
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-700 flex items-center justify-center">
                        {driverVehicleUrl ? (
                          <img src={driverVehicleUrl} alt="Véhicule" className="w-full h-full object-cover" />
                        ) : (
                          <Bike className="w-6 h-6 text-amber-400" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => vehicleFileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-amber-500 text-slate-950"
                      >
                        <Camera className="w-3 h-3" />
                      </button>
                      <input
                        type="file"
                        ref={vehicleFileInputRef}
                        onChange={(e) => handleFileUpload(e, 'vehicle')}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>

                    <div className="flex-1 space-y-1">
                      <button
                        type="button"
                        onClick={() => vehicleFileInputRef.current?.click()}
                        className="text-xs text-amber-400 hover:underline block font-semibold"
                      >
                        {language === 'sw' ? 'Pakia Picha ya Pikipiki' : 'Téléverser photo moto'}
                      </button>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Plaque : {driverPlate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver Professional Credentials Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {language === 'sw' ? 'Jina la Motard' : 'Nom du Motard'}
                  </label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {language === 'sw' ? 'Nambari ya Simu ya Kazi' : 'Téléphone direct'}
                  </label>
                  <input
                    type="text"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {language === 'sw' ? 'Namba ya Plaque (Haut-Katanga)' : 'Plaque d’immatriculation'}
                  </label>
                  <input
                    type="text"
                    value={driverPlate}
                    onChange={(e) => setDriverPlate(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-mono font-bold text-amber-400 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {language === 'sw' ? 'Mfano wa Pikipiki' : 'Modèle de Moto / Véhicule'}
                  </label>
                  <input
                    type="text"
                    value={driverModel}
                    onChange={(e) => setDriverModel(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Matricule Officiel Hôtel de Ville
                  </label>
                  <input
                    type="text"
                    value={driverMatricule}
                    onChange={(e) => setDriverMatricule(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-emerald-400 text-xs font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    N° Permis de Conduire National RDC
                  </label>
                  <input
                    type="text"
                    value={driverLicense}
                    onChange={(e) => setDriverLicense(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Driver Stats & GPS Precision Bar */}
              <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700 text-xs text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">Courses Certifiées</span>
                  <span className="font-mono font-bold text-emerald-400">{currentDriver.totalDeliveries}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Note Motard</span>
                  <span className="font-mono font-bold text-amber-400 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {currentDriver.rating}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Précision GPS</span>
                  <span className="font-mono font-bold text-sky-400">± {currentDriver.gpsAccuracyMeters || 2.5}m</span>
                </div>
              </div>

              {/* Save Driver Button */}
              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 active:scale-[0.99]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'sw' ? 'Hifadhi Wasifu wa Motard Pro' : 'Enregistrer le Profil Motard Pro'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
