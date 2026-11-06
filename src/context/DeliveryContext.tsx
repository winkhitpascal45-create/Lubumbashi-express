import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  DeliveryOrder,
  DriverProfile,
  ClientProfile,
  PartnerEnterprise,
  ActiveAppView,
  DeliveryPackageType,
  LocationPoint,
  VehicleType,
  PricingConfig,
  PriceBreakdown,
  CoordinationMessage,
  RegisteredLubumbashiUser,
  CommunityScaleStats,
  AppReleaseInfo,
  PlatformBroadcastAlert,
  SupermarketProduct,
  SupermarketOrder,
  SupermarketCartItem
} from '../types';
import {
  INITIAL_DRIVERS,
  INITIAL_ORDERS,
  INITIAL_CLIENT_PROFILE,
  PARTNER_ENTERPRISES,
  LUBUMBASHI_PRESET_LOCATIONS,
  COMMUNITY_SCALE_DATA,
  SAMPLE_REGISTERED_USERS,
  INITIAL_RELEASES,
  INITIAL_BROADCASTS,
  LUBUMBASHI_SUPERMARKET_PRODUCTS,
  INITIAL_SUPERMARKET_ORDERS
} from '../data/mockData';
import { sounds } from '../utils/audio';
import {
  DEFAULT_PRICING_CONFIG,
  calculateLubumbashiDistance,
  computePriceBreakdown
} from '../utils/pricing';
import { Language, Translations, translations } from '../i18n/translations';

interface ToastInfo {
  id: string;
  text: string;
  subtext?: string;
  type: 'info' | 'success' | 'error' | 'alert';
}

interface DeliveryContextValue {
  orders: DeliveryOrder[];
  drivers: DriverProfile[];
  partners: PartnerEnterprise[];
  clientProfile: ClientProfile;
  updateClientProfile: (updates: Partial<ClientProfile>) => void;
  updateDriverProfile: (driverId: string, updates: Partial<DriverProfile>) => void;
  activeView: ActiveAppView;
  setActiveView: (view: ActiveAppView) => void;
  currentDriverId: string;
  setCurrentDriverId: (id: string) => void;
  currentDriver: DriverProfile;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  selectedOrder: DeliveryOrder | null;
  activeDriverOrder: DeliveryOrder | null;
  availableOrdersForDriver: DeliveryOrder[];
  pricingConfig: PricingConfig;
  updatePricingConfig: (newConfig: Partial<PricingConfig>) => void;
  getMileageQuote: (distanceKm: number, vehicleType: VehicleType) => PriceBreakdown;
  calculateDistance: (p1: { x: number; y: number }, p2: { x: number; y: number }) => number;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  toasts: ToastInfo[];
  dismissToast: (id: string) => void;
  showToast: (text: string, subtext?: string, type?: ToastInfo['type']) => void;

  // Coordination & Community Scale
  sendCoordinationMessage: (orderId: string, text: string, senderRole: 'client' | 'driver') => void;
  scaleStats: CommunityScaleStats;
  registeredUsers: RegisteredLubumbashiUser[];
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  profileModalRole: 'client' | 'driver';
  openProfileModal: (role?: 'client' | 'driver') => void;
  closeProfileModal: () => void;
  isCommunityModalOpen: boolean;
  setIsCommunityModalOpen: (open: boolean) => void;
  isCoordinationOpen: boolean;
  setIsCoordinationOpen: (open: boolean) => void;
  isCommunesModalOpen: boolean;
  setIsCommunesModalOpen: (open: boolean) => void;

  // Owner App Updates & Broadcasts
  releases: AppReleaseInfo[];
  broadcasts: PlatformBroadcastAlert[];
  deployNewRelease: (version: string, codename: string, changelog: string[], isMandatory: boolean) => void;
  publishBroadcast: (title: string, message: string, type: 'info' | 'warning' | 'urgent', targetAudience: 'all' | 'drivers' | 'clients') => void;
  toggleBroadcastActive: (id: string) => void;
  forcePwaCacheReload: () => void;

  // Supermarket & Online Grocery
  supermarketProducts: SupermarketProduct[];
  supermarketOrders: SupermarketOrder[];
  createSupermarketOrder: (params: {
    supermarketId: string;
    items: SupermarketCartItem[];
    deliveryPoint: LocationPoint;
    recipientName: string;
    recipientPhone: string;
    vehicleTypeRecommended?: VehicleType;
  }) => SupermarketOrder;
  updateSupermarketOrderStatus: (orderId: string, status: SupermarketOrder['status'], assignedDriverId?: string) => void;

  // Driver Official Enrollment, Contract PDF & Carte d'Immatriculation
  isContractModalOpen: boolean;
  setIsContractModalOpen: (open: boolean) => void;
  contractDriverId: string | null;
  openContractModal: (driverId?: string) => void;
  closeContractModal: () => void;
  signDriverContract: (driverId: string, signatureDataUrl: string) => void;

  isCarteImmatriculationModalOpen: boolean;
  setIsCarteImmatriculationModalOpen: (open: boolean) => void;
  carteDriverId: string | null;
  openCarteModal: (driverId?: string) => void;
  closeCarteModal: () => void;
  certifyDriverMatricule: (driverId: string) => void;
  changeDriverVehicleType: (driverId: string, vehicleType: VehicleType) => void;

  createCourierOrder: (params: {
    pickup: LocationPoint;
    delivery: LocationPoint;
    packageType: DeliveryPackageType;
    packageDescription: string;
    recipientName: string;
    recipientPhone: string;
    senderName: string;
    senderPhone: string;
    vehicleType: VehicleType;
  }) => DeliveryOrder;
  createPartnerDispatch: (params: {
    partnerId: string;
    delivery: LocationPoint;
    packageType: DeliveryPackageType;
    packageDescription: string;
    recipientName: string;
    recipientPhone: string;
    vehicleType?: VehicleType;
    priceCDF?: number;
  }) => DeliveryOrder;
  acceptOrder: (orderId: string, driverId?: string) => void;
  confirmPickup: (orderId: string) => void;
  validatePinAndDeliver: (orderId: string, enteredPin: string) => { success: boolean; message: string; remainingAttempts?: number };
  toggleDriverOnline: (driverId?: string) => void;
  resetDemoData: () => void;
}

const DeliveryContext = createContext<DeliveryContextValue | undefined>(undefined);

const STORAGE_ORDERS_KEY = 'lubumbashi_express_orders_v3';
const STORAGE_DRIVERS_KEY = 'lubumbashi_express_drivers_v3';
const STORAGE_PRICING_KEY = 'lubumbashi_express_pricing_v3';
const STORAGE_LANG_KEY = 'lubumbashi_express_lang_v3';
const STORAGE_CLIENT_KEY = 'lubumbashi_express_client_v3';
const STORAGE_RELEASES_KEY = 'lubumbashi_express_releases_v3';
const STORAGE_BROADCASTS_KEY = 'lubumbashi_express_broadcasts_v3';

// Generate a random 4-digit code (e.g. 9142, 4820)
function generate4DigitPin(): string {
  const pin = Math.floor(1000 + Math.random() * 9000);
  return pin.toString();
}

export const DeliveryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_LANG_KEY);
      if (stored === 'fr' || stored === 'sw') {
        return stored;
      }
    } catch {
      // fallback
    }
    return 'fr';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
    } catch {
      // ignore
    }
  }, []);

  const t = useMemo(() => translations[language] || translations.fr, [language]);

  const [orders, setOrders] = useState<DeliveryOrder[]>(() => {

    try {
      const stored = localStorage.getItem(STORAGE_ORDERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return INITIAL_ORDERS;
  });

  const [drivers, setDrivers] = useState<DriverProfile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_DRIVERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return INITIAL_DRIVERS;
  });

  const [clientProfile, setClientProfile] = useState<ClientProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CLIENT_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return INITIAL_CLIENT_PROFILE;
  });

  const [partners] = useState<PartnerEnterprise[]>(PARTNER_ENTERPRISES);
  const [activeView, setActiveView] = useState<ActiveAppView>('client');
  const [currentDriverId, setCurrentDriverId] = useState<string>('drv-1');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('LB-9142');
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [profileModalRole, setProfileModalRole] = useState<'client' | 'driver'>('client');
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState<boolean>(false);
  const [isCoordinationOpen, setIsCoordinationOpen] = useState<boolean>(false);
  const [isCommunesModalOpen, setIsCommunesModalOpen] = useState<boolean>(false);

  const [scaleStats] = useState<CommunityScaleStats>(COMMUNITY_SCALE_DATA);
  const [registeredUsers] = useState<RegisteredLubumbashiUser[]>(SAMPLE_REGISTERED_USERS);

  // Supermarket products & orders
  const [supermarketProducts] = useState<SupermarketProduct[]>(LUBUMBASHI_SUPERMARKET_PRODUCTS);
  const [supermarketOrders, setSupermarketOrders] = useState<SupermarketOrder[]>(() => {
    try {
      const stored = localStorage.getItem('lubumbashi_express_sm_orders_v3');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_SUPERMARKET_ORDERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('lubumbashi_express_sm_orders_v3', JSON.stringify(supermarketOrders));
    } catch {
      // ignore
    }
  }, [supermarketOrders]);

  // Driver Contract & Carte d'Immatriculation modals state
  const [isContractModalOpen, setIsContractModalOpen] = useState<boolean>(false);
  const [contractDriverId, setContractDriverId] = useState<string | null>(null);
  const [isCarteImmatriculationModalOpen, setIsCarteImmatriculationModalOpen] = useState<boolean>(false);
  const [carteDriverId, setCarteDriverId] = useState<string | null>(null);

  // Owner App Updates & Broadcasts State
  const [releases, setReleases] = useState<AppReleaseInfo[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_RELEASES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_RELEASES;
  });

  const [broadcasts, setBroadcasts] = useState<PlatformBroadcastAlert[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_BROADCASTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_BROADCASTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_RELEASES_KEY, JSON.stringify(releases));
    } catch {
      // ignore
    }
  }, [releases]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BROADCASTS_KEY, JSON.stringify(broadcasts));
    } catch {
      // ignore
    }
  }, [broadcasts]);

  // Persist orders, drivers, and clientProfile
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DRIVERS_KEY, JSON.stringify(drivers));
    } catch {
      // ignore
    }
  }, [drivers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CLIENT_KEY, JSON.stringify(clientProfile));
    } catch {
      // ignore
    }
  }, [clientProfile]);

  const showToast = useCallback((text: string, subtext?: string, type: ToastInfo['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev.slice(-3), { id, text, subtext, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const deployNewRelease = useCallback(
    (version: string, codename: string, changelog: string[], isMandatory: boolean) => {
      const newRel: AppReleaseInfo = {
        id: `rel-${Date.now()}`,
        version,
        codename,
        releasedAt: 'À l’instant',
        changelog,
        minSupportedVersion: 'v3.0.0',
        isMandatoryUpdate: isMandatory,
        channel: 'production',
        deployedBy: 'Propriétaire Direction Générale'
      };
      setReleases((prev) => [newRel, ...prev]);
      sounds.playPinSuccess();
      showToast(
        `Mise à jour ${version} déployée !`,
        `Le patch "${codename}" est diffusé aux 1.2M d'utilisateurs et 18,450 motards.`,
        'success'
      );
    },
    [showToast]
  );

  const publishBroadcast = useCallback(
    (
      title: string,
      message: string,
      type: 'info' | 'warning' | 'urgent',
      targetAudience: 'all' | 'drivers' | 'clients'
    ) => {
      const newAlert: PlatformBroadcastAlert = {
        id: `bc-${Date.now()}`,
        title,
        message,
        type,
        targetAudience,
        publishedAt: 'À l’instant',
        isActive: true,
        author: 'Propriétaire Direction'
      };
      setBroadcasts((prev) => [newAlert, ...prev]);
      sounds.playKeypadTap();
      showToast(
        'Flash Info Diffusé !',
        `Notification envoyée au réseau Lubumbashi (${targetAudience === 'all' ? 'Tous' : targetAudience === 'drivers' ? 'Motards' : 'Clients'}).`,
        'success'
      );
    },
    [showToast]
  );

  const toggleBroadcastActive = useCallback((id: string) => {
    setBroadcasts((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  }, []);

  const forcePwaCacheReload = useCallback(() => {
    sounds.playPinSuccess();
    showToast(
      'Cache PWA Actualisé',
      'Le cache réseau a été invalidé. La dernière version sera chargée immédiatement sur tous les appareils.',
      'info'
    );
  }, [showToast]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const currentDriver = useMemo(() => {
    return drivers.find((d) => d.id === currentDriverId) || drivers[0];
  }, [drivers, currentDriverId]);

  const selectedOrder = useMemo(() => {
    return orders.find((o) => o.id === selectedOrderId) || null;
  }, [orders, selectedOrderId]);

  // Order currently assigned to and handled by this driver that is not yet finalized
  const activeDriverOrder = useMemo(() => {
    return (
      orders.find(
        (o) =>
          o.assignedDriverId === currentDriverId &&
          (o.status === 'accepted' || o.status === 'heading_to_pickup' || o.status === 'picked_up')
      ) || null
    );
  }, [orders, currentDriverId]);

  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PRICING_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return DEFAULT_PRICING_CONFIG;
  });

  // Persist pricingConfig
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PRICING_KEY, JSON.stringify(pricingConfig));
    } catch {
      // ignore
    }
  }, [pricingConfig]);

  const updatePricingConfig = useCallback((newConfig: Partial<PricingConfig>) => {
    setPricingConfig((prev) => ({
      ...prev,
      ...newConfig,
      vehicleRates: {
        ...prev.vehicleRates,
        ...(newConfig.vehicleRates || {})
      }
    }));
  }, []);

  const calculateDistance = useCallback((p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return calculateLubumbashiDistance(p1, p2);
  }, []);

  const getMileageQuote = useCallback(
    (distanceKm: number, vehicleType: VehicleType) => {
      return computePriceBreakdown(distanceKm, vehicleType, pricingConfig);
    },
    [pricingConfig]
  );

  // Orders waiting for acceptance
  const availableOrdersForDriver = useMemo(() => {
    return orders.filter((o) => o.status === 'pending');
  }, [orders]);

  // Create a client courier order (Point A -> Point B)
  const createCourierOrder = useCallback(
    ({
      pickup,
      delivery,
      packageType,
      packageDescription,
      recipientName,
      recipientPhone,
      senderName,
      senderPhone,
      vehicleType
    }: {
      pickup: LocationPoint;
      delivery: LocationPoint;
      packageType: DeliveryPackageType;
      packageDescription: string;
      recipientName: string;
      recipientPhone: string;
      senderName: string;
      senderPhone: string;
      vehicleType: VehicleType;
    }) => {
      const distance = calculateLubumbashiDistance(pickup.coords, delivery.coords);
      const quote = computePriceBreakdown(distance, vehicleType, pricingConfig);
      const priceCDF = quote.totalCDF;
      const priceUSD = quote.totalUSD;
      const estimatedMinutes = quote.estimatedMinutes;
      const pinCode = generate4DigitPin();
      const orderId = `LB-${Math.floor(1000 + Math.random() * 9000)}`;

      const newOrder: DeliveryOrder = {
        id: orderId,
        pinCode,
        serviceType: 'courier',
        packageType,
        packageDescription,
        pickup,
        delivery,
        recipientName,
        recipientPhone,
        senderName,
        senderPhone,
        vehicleType,
        priceCDF,
        priceUSD,
        estimatedMinutes,
        distanceKm: distance,
        priceBreakdown: quote,
        status: 'pending',
        createdAt: new Date().toISOString(),
        pinValidationAttempts: 0,
        timeline: [
          {
            status: 'pending',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            label: 'Course créée & Code PIN généré',
            description: `Tarif calculé : ${quote.baseFeeCDF.toLocaleString()} CDF (base) + ${distance} km × ${quote.perKmRateCDF.toLocaleString()} CDF = ${priceCDF.toLocaleString()} CDF. Code PIN : ${pinCode}.`
          }
        ]
      };

      setOrders((prev) => [newOrder, ...prev]);
      setSelectedOrderId(newOrder.id);
      sounds.playIncomingCourse();
      showToast(
        `Course ${newOrder.id} validée (${distance} km) !`,
        `Prix : ${priceCDF.toLocaleString()} CDF (~$${priceUSD}). Code PIN : ${pinCode}`,
        'success'
      );

      return newOrder;
    },
    [pricingConfig, showToast]
  );

  // Create partner dispatch (supermarket, pharmacy, etc.)
  const createPartnerDispatch = useCallback(
    ({
      partnerId,
      delivery,
      packageType,
      packageDescription,
      recipientName,
      recipientPhone,
      vehicleType = 'moto',
      priceCDF: customPrice
    }: {
      partnerId: string;
      delivery: LocationPoint;
      packageType: DeliveryPackageType;
      packageDescription: string;
      recipientName: string;
      recipientPhone: string;
      vehicleType?: VehicleType;
      priceCDF?: number;
    }) => {
      const partner = partners.find((p) => p.id === partnerId) || partners[0];
      const pickup: LocationPoint = {
        name: partner.name,
        address: partner.address,
        commune: partner.commune,
        coords: partner.coords,
        phone: partner.phone
      };

      const distance = calculateLubumbashiDistance(pickup.coords, delivery.coords);
      const quote = computePriceBreakdown(distance, vehicleType, pricingConfig);
      const priceCDF = customPrice !== undefined && customPrice > 0 ? customPrice : quote.totalCDF;
      const priceUSD = Math.round((priceCDF / pricingConfig.exchangeRateUSD) * 10) / 10;
      const estimatedMinutes = quote.estimatedMinutes;
      const pinCode = generate4DigitPin();
      const orderId = `LB-${Math.floor(1000 + Math.random() * 9000)}`;

      const newOrder: DeliveryOrder = {
        id: orderId,
        pinCode,
        serviceType: 'partner_dispatch',
        packageType,
        packageDescription,
        pickup,
        delivery,
        recipientName,
        recipientPhone,
        senderName: partner.name,
        senderPhone: partner.phone,
        partnerId: partner.id,
        partnerName: partner.name,
        vehicleType,
        priceCDF,
        priceUSD,
        estimatedMinutes,
        distanceKm: distance,
        priceBreakdown: quote,
        status: 'pending',
        createdAt: new Date().toISOString(),
        pinValidationAttempts: 0,
        timeline: [
          {
            status: 'pending',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            label: `Signalement émis par ${partner.name}`,
            description: `Distance : ${distance} km (${priceCDF.toLocaleString()} CDF). Livré vers ${recipientName}. Code PIN : ${pinCode}`
          }
        ]
      };

      setOrders((prev) => [newOrder, ...prev]);
      setSelectedOrderId(newOrder.id);
      sounds.playIncomingCourse();
      showToast(
        `Signalement ${newOrder.id} émis (${distance} km) !`,
        `Diffusé aux livreurs. Montant : ${priceCDF.toLocaleString()} CDF. PIN : ${pinCode}`,
        'info'
      );

      return newOrder;
    },
    [partners, pricingConfig, showToast]
  );


  // Driver accepts order
  const acceptOrder = useCallback(
    (orderId: string, driverId?: string) => {
      const dId = driverId || currentDriverId;
      const driver = drivers.find((d) => d.id === dId) || currentDriver;

      setOrders((prev) =>
        prev.map((ord) => {
          if (ord.id === orderId) {
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return {
              ...ord,
              status: 'heading_to_pickup',
              assignedDriverId: dId,
              assignedDriver: driver,
              timeline: [
                ...ord.timeline,
                {
                  status: 'accepted',
                  timestamp: timeStr,
                  label: `Acceptée par ${driver.name}`,
                  description: `${driver.vehicleModel} (${driver.plateNumber}) en route pour ramasser le colis.`
                }
              ]
            };
          }
          return ord;
        })
      );

      setSelectedOrderId(orderId);
      sounds.playKeypadTap();
      showToast(
        `Course ${orderId} acceptée !`,
        `Étape 1 : Dirigez-vous vers le point de ramassage (Point A)`,
        'success'
      );
    },
    [currentDriverId, drivers, currentDriver, showToast]
  );

  // Step 1 Completed: Driver picks up package at Point A
  const confirmPickup = useCallback(
    (orderId: string) => {
      setOrders((prev) =>
        prev.map((ord) => {
          if (ord.id === orderId) {
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return {
              ...ord,
              status: 'picked_up',
              timeline: [
                ...ord.timeline,
                {
                  status: 'picked_up',
                  timestamp: timeStr,
                  label: 'Colis récupéré au Point A',
                  description: 'En route vers le destinataire (Point B). Code PIN obligatoire à l’arrivée.'
                }
              ]
            };
          }
          return ord;
        })
      );

      sounds.playKeypadTap();
      showToast(
        'Colis récupéré !',
        'Étape 2 activée : Guidage vers le destinataire. Demandez le code PIN à l’arrivée.',
        'info'
      );
    },
    [showToast]
  );

  // Step 2 Finalization: Mandatory blocking PIN validation
  const validatePinAndDeliver = useCallback(
    (orderId: string, enteredPin: string) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) {
        return { success: false, message: 'Commande introuvable.' };
      }

      if (order.status === 'delivered') {
        return { success: true, message: 'Cette course est déjà clôturée.' };
      }

      const cleanPin = enteredPin.trim();

      // Check PIN validity
      if (cleanPin !== order.pinCode) {
        sounds.playPinError();
        const nextAttempts = (order.pinValidationAttempts || 0) + 1;

        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, pinValidationAttempts: nextAttempts }
              : o
          )
        );

        return {
          success: false,
          remainingAttempts: Math.max(0, 3 - nextAttempts),
          message: `Code PIN erroné (${cleanPin}). Vérifiez avec le destinataire.`
        };
      }

      // PIN is CORRECT! Finalize the delivery!
      const deliveryTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const deliveredAtISO = new Date().toISOString();

      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === orderId) {
            return {
              ...o,
              status: 'delivered',
              deliveredAt: deliveredAtISO,
              pinValidationAttempts: (o.pinValidationAttempts || 0) + 1,
              timeline: [
                ...o.timeline,
                {
                  status: 'delivered',
                  timestamp: deliveryTime,
                  label: 'Course clôturée avec succès',
                  description: `Authentification réussie par code PIN unique (${order.pinCode}). Remise certifiée.`
                }
              ]
            };
          }
          return o;
        })
      );

      // Credit the driver's earnings
      if (order.assignedDriverId) {
        setDrivers((prev) =>
          prev.map((d) => {
            if (d.id === order.assignedDriverId) {
              return {
                ...d,
                totalDeliveries: d.totalDeliveries + 1,
                todayEarningsCDF: d.todayEarningsCDF + order.priceCDF,
                todayEarningsUSD: Math.round((d.todayEarningsUSD + order.priceUSD) * 10) / 10
              };
            }
            return d;
          })
        );
      }

      sounds.playPinSuccess();
      showToast(
        'Livraison certifiée et clôturée !',
        `Code PIN ${order.pinCode} vérifié. +${order.priceCDF.toLocaleString()} CDF crédités.`,
        'success'
      );

      return {
        success: true,
        message: 'Code PIN certifié ! Livraison clôturée avec succès.'
      };
    },
    [orders, showToast]
  );

  // Toggle driver availability
  const toggleDriverOnline = useCallback(
    (driverId?: string) => {
      const dId = driverId || currentDriverId;
      setDrivers((prev) =>
        prev.map((d) => {
          if (d.id === dId) {
            const nextState = !d.isOnline;
            showToast(
              nextState ? 'Livreur En Ligne' : 'Livreur Hors Ligne',
              nextState ? 'Prêt à recevoir les courses de Lubumbashi' : 'Courses désactivées',
              nextState ? 'success' : 'info'
            );
            return { ...d, isOnline: nextState };
          }
          return d;
        })
      );
    },
    [currentDriverId, showToast]
  );

  const updateClientProfile = useCallback(
    (updates: Partial<ClientProfile>) => {
      setClientProfile((prev) => ({ ...prev, ...updates }));
      showToast('Profil client mis à jour', 'Informations et photo de profil enregistrées.', 'success');
    },
    [showToast]
  );

  const updateDriverProfile = useCallback(
    (driverId: string, updates: Partial<DriverProfile>) => {
      setDrivers((prev) =>
        prev.map((drv) => (drv.id === driverId ? { ...drv, ...updates } : drv))
      );
      showToast('Profil livreur mis à jour', 'Matricule, véhicule et photo enregistrés.', 'success');
    },
    [showToast]
  );

  const sendCoordinationMessage = useCallback(
    (orderId: string, text: string, senderRole: 'client' | 'driver') => {
      if (!text.trim()) return;
      const targetDriver = currentDriver;
      const newMsg: CoordinationMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        senderRole,
        senderName: senderRole === 'client' ? clientProfile.name : targetDriver.name,
        senderAvatar: senderRole === 'client' ? clientProfile.avatar : targetDriver.avatar,
        senderAvatarUrl: senderRole === 'client' ? clientProfile.avatarUrl : targetDriver.avatarUrl,
        text: text.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setOrders((prev) =>
        prev.map((ord) => {
          if (ord.id === orderId) {
            return {
              ...ord,
              coordinationMessages: [...(ord.coordinationMessages || []), newMsg]
            };
          }
          return ord;
        })
      );

      sounds.playKeypadTap();
    },
    [clientProfile, currentDriver]
  );

  const openProfileModal = useCallback((role?: 'client' | 'driver') => {
    if (role) setProfileModalRole(role);
    setIsProfileModalOpen(true);
  }, []);

  const closeProfileModal = useCallback(() => {
    setIsProfileModalOpen(false);
  }, []);

  // Driver Contract & Enrollment
  const openContractModal = useCallback((driverId?: string) => {
    setContractDriverId(driverId || currentDriverId);
    setIsContractModalOpen(true);
  }, [currentDriverId]);

  const closeContractModal = useCallback(() => {
    setIsContractModalOpen(false);
  }, []);

  const signDriverContract = useCallback((driverId: string, signatureDataUrl: string) => {
    const todayStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    setDrivers((prev) =>
      prev.map((drv) =>
        drv.id === driverId
          ? {
              ...drv,
              driverSignatureDataUrl: signatureDataUrl,
              contractSignedDate: todayStr,
              isOwnerCertified: true
            }
          : drv
      )
    );
    sounds.playPinSuccess();
    showToast('Contrat officiel signé !', 'Papiers d’engagement affiliés enregistrés avec succès. Exportable en PDF.', 'success');
  }, [showToast]);

  // Driver Carte d'Immatriculation & Owner Certification
  const openCarteModal = useCallback((driverId?: string) => {
    setCarteDriverId(driverId || currentDriverId);
    setIsCarteImmatriculationModalOpen(true);
  }, [currentDriverId]);

  const closeCarteModal = useCallback(() => {
    setIsCarteImmatriculationModalOpen(false);
  }, []);

  const certifyDriverMatricule = useCallback((driverId: string) => {
    setDrivers((prev) =>
      prev.map((drv) => {
        if (drv.id === driverId) {
          const carteId = drv.carteImmatriculationId || `CI-LSH-2026-${drv.matriculeId.split('-').pop() || '0842'}`;
          return {
            ...drv,
            isOwnerCertified: true,
            carteImmatriculationId: carteId
          };
        }
        return drv;
      })
    );
    sounds.playPinSuccess();
    showToast('Conducteur certifié & Carte validée !', 'Signature officielle du propriétaire apposée sur la carte d’immatriculation.', 'success');
  }, [showToast]);

  const changeDriverVehicleType = useCallback((driverId: string, newType: VehicleType) => {
    const labelMap: Record<VehicleType, { label: string; model: string; plate: string }> = {
      velo: { label: 'Cycliste Cargo', model: 'Vélo Cargo Phoenix Katanga (Écologique)', plate: 'CADRE-VELO-0193' },
      moto: { label: 'Motard Express', model: 'TVS Apache RTR 180 (Moto Rapide)', plate: 'HK-2490-BB' },
      voiture: { label: 'Auto-Conducteur Berline', model: 'Toyota Corolla Berline (Coffre Sécurisé)', plate: 'HK-3810-BA' },
      van: { label: 'Chauffeur Véhicule Utilitaire / Van', model: 'Toyota HiAce Grand Volume', plate: 'HK-9921-BB' }
    };
    const info = labelMap[newType];
    setDrivers((prev) =>
      prev.map((drv) =>
        drv.id === driverId
          ? {
              ...drv,
              vehicleType: newType,
              vehicleCategoryLabel: info.label,
              vehicleModel: info.model,
              plateNumber: info.plate
            }
          : drv
      )
    );
    showToast('Véhicule mis à jour', `Catégorie changée pour : ${info.label}`, 'info');
  }, [showToast]);

  // Supermarket Online Ordering & Store Picking Flow
  const createSupermarketOrder = useCallback(
    ({
      supermarketId,
      items,
      deliveryPoint,
      recipientName,
      recipientPhone,
      vehicleTypeRecommended
    }: {
      supermarketId: string;
      items: SupermarketCartItem[];
      deliveryPoint: LocationPoint;
      recipientName: string;
      recipientPhone: string;
      vehicleTypeRecommended?: VehicleType;
    }) => {
      const supermarketPartner = partners.find((p) => p.id === supermarketId) || partners[0];
      const itemsSubtotalCDF = items.reduce((sum, item) => sum + item.product.priceCDF * item.quantity, 0);
      const distanceKm = calculateLubumbashiDistance(supermarketPartner.coords, deliveryPoint.coords);
      const chosenVehicle =
        vehicleTypeRecommended ||
        (itemsSubtotalCDF > 60000 || items.some((i) => i.product.name.includes('25 kg') || i.product.name.includes('Bidon'))
          ? 'voiture'
          : 'moto');
      const quote = computePriceBreakdown(distanceKm, chosenVehicle, pricingConfig);
      const deliveryFeeCDF = quote.totalCDF;
      const totalPriceCDF = itemsSubtotalCDF + deliveryFeeCDF;
      const totalPriceUSD = Math.round((totalPriceCDF / pricingConfig.exchangeRateUSD) * 10) / 10;
      const pinCode = generate4DigitPin();
      const randNum = Math.floor(1000 + Math.random() * 9000);
      const cleanSupermarketSlug = supermarketPartner.name.split(' ')[0].replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      const prepCode = `CMD-${cleanSupermarketSlug}-${randNum}`;
      const orderId = `SM-${randNum}`;

      const newSmOrder: SupermarketOrder = {
        id: orderId,
        supermarketId,
        supermarketName: supermarketPartner.name,
        supermarketAddress: supermarketPartner.address,
        supermarketCommune: supermarketPartner.commune,
        supermarketCoords: supermarketPartner.coords,
        items,
        itemsSubtotalCDF,
        deliveryFeeCDF,
        totalPriceCDF,
        totalPriceUSD,
        deliveryPoint,
        recipientName,
        recipientPhone,
        pinCode,
        vehicleTypeRecommended: chosenVehicle,
        status: 'ordered_online',
        createdAt: new Date().toISOString(),
        preparationCode: prepCode
      };

      setSupermarketOrders((prev) => [newSmOrder, ...prev]);
      sounds.playIncomingCourse();
      showToast(
        `Commande en ligne ${prepCode} validée !`,
        `Préparée par ${supermarketPartner.name}. Livraison par code PIN : ${pinCode}`,
        'success'
      );
      return newSmOrder;
    },
    [partners, pricingConfig, showToast]
  );

  const updateSupermarketOrderStatus = useCallback(
    (orderId: string, status: SupermarketOrder['status'], assignedDriverId?: string) => {
      setSupermarketOrders((prev) =>
        prev.map((ord) => {
          if (ord.id === orderId) {
            const assignedDriver = assignedDriverId
              ? drivers.find((d) => d.id === assignedDriverId) || currentDriver
              : ord.assignedDriver;
            return {
              ...ord,
              status,
              assignedDriverId: assignedDriverId || ord.assignedDriverId,
              assignedDriver: assignedDriver || ord.assignedDriver
            };
          }
          return ord;
        })
      );
      sounds.playKeypadTap();
      showToast('Statut supermarché actualisé', `La commande est maintenant : ${status}`, 'info');
    },
    [drivers, currentDriver, showToast]
  );

  const resetDemoData = useCallback(() => {
    setOrders(INITIAL_ORDERS);
    setDrivers(INITIAL_DRIVERS);
    setClientProfile(INITIAL_CLIENT_PROFILE);
    setSupermarketOrders(INITIAL_SUPERMARKET_ORDERS);
    setSelectedOrderId('LB-9142');
    showToast('Données réinitialisées', 'Profils, courses et simulation Lubumbashi prêts', 'info');
  }, [showToast]);

  const value = useMemo(
    () => ({
      orders,
      drivers,
      partners,
      clientProfile,
      updateClientProfile,
      updateDriverProfile,
      activeView,
      setActiveView,
      currentDriverId,
      setCurrentDriverId,
      currentDriver,
      selectedOrderId,
      setSelectedOrderId,
      selectedOrder,
      activeDriverOrder,
      availableOrdersForDriver,
      pricingConfig,
      updatePricingConfig,
      getMileageQuote,
      calculateDistance,
      language,
      setLanguage,
      t,
      toasts,
      dismissToast,
      showToast,
      sendCoordinationMessage,
      scaleStats,
      registeredUsers,
      isProfileModalOpen,
      setIsProfileModalOpen,
      profileModalRole,
      openProfileModal,
      closeProfileModal,
      isCommunityModalOpen,
      setIsCommunityModalOpen,
      isCoordinationOpen,
      setIsCoordinationOpen,
      isCommunesModalOpen,
      setIsCommunesModalOpen,
      releases,
      broadcasts,
      deployNewRelease,
      publishBroadcast,
      toggleBroadcastActive,
      forcePwaCacheReload,
      supermarketProducts,
      supermarketOrders,
      createSupermarketOrder,
      updateSupermarketOrderStatus,
      isContractModalOpen,
      setIsContractModalOpen,
      contractDriverId,
      openContractModal,
      closeContractModal,
      signDriverContract,
      isCarteImmatriculationModalOpen,
      setIsCarteImmatriculationModalOpen,
      carteDriverId,
      openCarteModal,
      closeCarteModal,
      certifyDriverMatricule,
      changeDriverVehicleType,
      createCourierOrder,
      createPartnerDispatch,
      acceptOrder,
      confirmPickup,
      validatePinAndDeliver,
      toggleDriverOnline,
      resetDemoData
    }),
    [
      orders,
      drivers,
      partners,
      clientProfile,
      updateClientProfile,
      updateDriverProfile,
      activeView,
      currentDriverId,
      currentDriver,
      selectedOrderId,
      selectedOrder,
      activeDriverOrder,
      availableOrdersForDriver,
      pricingConfig,
      updatePricingConfig,
      getMileageQuote,
      calculateDistance,
      language,
      setLanguage,
      t,
      toasts,
      dismissToast,
      showToast,
      sendCoordinationMessage,
      scaleStats,
      registeredUsers,
      isProfileModalOpen,
      profileModalRole,
      openProfileModal,
      closeProfileModal,
      isCommunityModalOpen,
      isCoordinationOpen,
      isCommunesModalOpen,
      releases,
      broadcasts,
      deployNewRelease,
      publishBroadcast,
      toggleBroadcastActive,
      forcePwaCacheReload,
      supermarketProducts,
      supermarketOrders,
      createSupermarketOrder,
      updateSupermarketOrderStatus,
      isContractModalOpen,
      contractDriverId,
      openContractModal,
      closeContractModal,
      signDriverContract,
      isCarteImmatriculationModalOpen,
      carteDriverId,
      openCarteModal,
      closeCarteModal,
      certifyDriverMatricule,
      changeDriverVehicleType,
      createCourierOrder,
      createPartnerDispatch,
      acceptOrder,
      confirmPickup,
      validatePinAndDeliver,
      toggleDriverOnline,
      resetDemoData
    ]
  );



  return <DeliveryContext.Provider value={value}>{children}</DeliveryContext.Provider>;
};

export const useDelivery = () => {
  const ctx = useContext(DeliveryContext);
  if (!ctx) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return ctx;
};
