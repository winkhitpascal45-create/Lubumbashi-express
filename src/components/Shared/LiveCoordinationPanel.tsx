import React, { useState } from 'react';
import { useDelivery } from '../../context/DeliveryContext';
import { DeliveryOrder } from '../../types';
import {
  X,
  Phone,
  MessageCircle,
  Navigation,
  Compass,
  Send,
  User,
  Bike,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface LiveCoordinationPanelProps {
  order: DeliveryOrder;
  isOpen: boolean;
  onClose: () => void;
  activeRole?: 'client' | 'driver';
}

export const LiveCoordinationPanel: React.FC<LiveCoordinationPanelProps> = ({
  order,
  isOpen,
  onClose,
  activeRole = 'client'
}) => {
  const {
    clientProfile,
    currentDriver,
    sendCoordinationMessage,
    language
  } = useDelivery();

  const [messageInput, setMessageInput] = useState('');

  if (!isOpen) return null;

  const quickChips =
    language === 'sw'
      ? [
          'Niko mbele ya geti nyeusi',
          'Niko kwenye makutano ya barabara',
          'Mbele ya duka la dawa',
          'Ninawasili ndani ya dakika 2',
          'Tafadhali piga honi'
        ]
      : [
          'Je suis devant le portail noir',
          'Au croisement de l’avenue',
          'Devant la pharmacie / boutique',
          'J’arrive dans 2 minutes',
          'Pouvez-vous klaxonner ?'
        ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || messageInput;
    if (!text.trim()) return;
    sendCoordinationMessage(order.id, text, activeRole);
    if (!textToSend) setMessageInput('');
  };

  const assignedDriver = order.assignedDriver || currentDriver;
  const targetPhone = activeRole === 'client' ? assignedDriver.phone : order.recipientPhone;
  const whatsappUrl = `https://wa.me/${targetPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Bonjour Lubumbashi Express, je vous contacte pour la course #${order.id}.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header with GPS Precision Badge */}
        <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '18s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  {language === 'sw' ? 'Uratibu wa Mahali Kamili (GPS)' : 'Coordination Précision GPS & Contact'}
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">
                  ± 2.5m
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Course #{order.id} · {order.pickup.name} → {order.delivery.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live GPS Coordination Bar */}
        <div className="bg-slate-950 p-3.5 border-b border-slate-800 grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Navigation className="w-3.5 h-3.5 text-sky-400" />
              <span>{language === 'sw' ? 'Umbali wa Sasa' : 'Distance au point de remise'}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold text-white font-mono">~320 mètres</span>
              <span className="text-[10px] text-emerald-400 font-semibold">Arrivée ~2 min</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">Lat: -11.660892° | Lng: 27.479415°</p>
          </div>

          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 block font-medium">
              {language === 'sw' ? 'Mawasiliano ya Moja kwa Moja' : 'Contact d’urgence'}
            </span>
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`tel:${targetPhone}`}
                className="flex-1 py-1.5 px-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{language === 'sw' ? 'Piga Simu' : 'Appeler'}</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 px-2 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Counterpart Identification Card (Client sees Motard / Motard sees Client) */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800">
          {activeRole === 'client' ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-400/50 bg-slate-800 shrink-0">
                {assignedDriver.avatarUrl ? (
                  <img src={assignedDriver.avatarUrl} alt={assignedDriver.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl flex items-center justify-center h-full">{assignedDriver.avatar}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white truncate">{assignedDriver.name}</h4>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold">
                    {assignedDriver.plateNumber}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{assignedDriver.vehicleModel}</p>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Motard officiel ({assignedDriver.matriculeId || 'HV-LSH-0842-MOT'})
                </span>
              </div>
              {assignedDriver.vehiclePhotoUrl && (
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shrink-0" title="Photo moto">
                  <img src={assignedDriver.vehiclePhotoUrl} alt="Moto" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-400/50 bg-slate-800 shrink-0">
                {order.senderAvatarUrl || clientProfile.avatarUrl ? (
                  <img src={order.senderAvatarUrl || clientProfile.avatarUrl} alt="Client" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl flex items-center justify-center h-full">👩🏾‍💼</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white truncate">{order.recipientName}</h4>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded">
                    Destinataire
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{order.delivery.address}</p>
                {order.delivery.landmark && (
                  <span className="text-[10px] text-emerald-400 block font-medium">
                    🧭 Repère : {order.delivery.landmark}
                  </span>
                )}
                <span className="text-[10px] text-amber-300">
                  Code PIN secret détenu par le destinataire
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Coordination Chat Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[220px]">
          {(!order.coordinationMessages || order.coordinationMessages.length === 0) ? (
            <div className="py-8 text-center space-y-2">
              <Compass className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">
                {language === 'sw'
                  ? 'Hakuna ujumbe bado. Tumia vifungo vilivyo hapa chini ili kumweleza motard mahali ulipo kamili.'
                  : 'Aucun message de coordination échangé. Utilisez les phrases rapides ci-dessous pour guider l’arrivée.'}
              </p>
            </div>
          ) : (
            order.coordinationMessages.map((msg) => {
              const isMe = msg.senderRole === activeRole;
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <div className="w-7 h-7 rounded-lg overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
                      {msg.senderAvatarUrl ? (
                        <img src={msg.senderAvatarUrl} alt={msg.senderName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs flex items-center justify-center h-full">{msg.senderAvatar}</span>
                      )}
                    </div>
                  )}

                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-xs shadow-md ${
                      isMe
                        ? 'bg-amber-500 text-slate-950 rounded-br-none font-medium'
                        : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 mb-0.5">
                      <span className="font-bold">{msg.senderName}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>

                  {isMe && (
                    <div className="w-7 h-7 rounded-lg overflow-hidden border border-amber-500/50 bg-slate-800 shrink-0">
                      {msg.senderAvatarUrl ? (
                        <img src={msg.senderAvatarUrl} alt={msg.senderName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs flex items-center justify-center h-full">{msg.senderAvatar}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Quick Coordination Chips */}
        <div className="px-3 pt-2 pb-1 bg-slate-900 border-t border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{language === 'sw' ? 'Ujumbe wa haraka wa kuelekeza :' : 'Coordination en 1 clic :'}</span>
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-[11px] whitespace-nowrap transition active:scale-95"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={
              language === 'sw'
                ? 'Andika ujumbe wa kuelekeza mahali kamili...'
                : 'Indiquez un détail précis (ex: portail noir, bâtiment)...'
            }
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className={`p-2.5 rounded-xl transition ${
              messageInput.trim()
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
