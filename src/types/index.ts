export type DeliveryServiceType = 'courier' | 'food' | 'grocery' | 'pharmacy' | 'partner_dispatch';

export type DeliveryPackageType =
  | 'envelope_urgent'
  | 'parcel_fragile'
  | 'admin_doc'
  | 'electronics'
  | 'medical'
  | 'food_box'
  | 'standard_box';

export type DeliveryStatus =
  | 'pending'           // En attente d'un livreur
  | 'accepted'          // Livreur assigné
  | 'heading_to_pickup' // Étape 1 : En route vers Point A
  | 'picked_up'         // Étape 2 : Colis récupéré, en route vers Point B
  | 'delivered'         // Clôturé par saisie obligatoire du code PIN
  | 'cancelled';

export type VehicleType = 'moto' | 'velo' | 'voiture' | 'van';

export interface LocationPoint {
  name: string;
  address: string;
  commune: string;
  quartier?: string;
  avenue?: string;
  numeroParcelle?: string;
  landmark?: string; // Point de repère local indispensable à Lubumbashi
  coords: { x: number; y: number }; // normalized 0-100 on Lubumbashi map
  phone?: string;
}

export interface LubumbashiCommuneData {
  id: string;
  name: string;
  shortName: string;
  description: string;
  quartiers: string[];
  popularAvenues: string[];
  landmarks: string[];
  centerCoords: { x: number; y: number };
}

export interface ClientProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  commune: string;
  avatar: string; // emoji fallback
  avatarUrl?: string; // photo URL or base64 data URL
  clientNumber: string; // e.g. "LX-1084920" (member of 1M+ network)
  loyaltyPoints: number;
  totalOrders: number;
  rating: number;
  joinedDate: string;
  favoriteAddresses: LocationPoint[];
}

export interface DriverProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  commune: string;
  avenue?: string;
  avatar: string;
  avatarUrl?: string; // photo URL or base64 data URL
  vehicleType: VehicleType;
  vehicleCategoryLabel: string; // e.g. "Motard Express", "Cycliste Cargo", "Auto-Conducteur Berline", "Chauffeur Véhicule Utilitaire"
  vehicleModel: string;
  vehiclePhotoUrl?: string;
  plateNumber: string; // Plaque d'immatriculation ou N° de cadre vélo
  matriculeId: string; // Matricule Officiel sécurisé : e.g. "LX-KAT-MOT-0842", "LX-KAT-AUTO-0112"
  licenseNumber?: string; // Permis de conduire national Katanga
  rating: number;
  totalDeliveries: number;
  todayEarningsCDF: number;
  todayEarningsUSD: number;
  isOnline: boolean;
  currentCommune: string;
  coords: { x: number; y: number };
  gpsAccuracyMeters?: number;
  liveGpsLat?: number;
  liveGpsLng?: number;

  // Accréditation officielle Propriétaire & Papiers PDF
  carteImmatriculationId?: string; // e.g. "CI-LSH-2026-0842"
  contractSignedDate?: string;
  driverSignatureDataUrl?: string; // Signature manuscrite du conducteur
  ownerSignatureUrl?: string; // Signature certifiée du Propriétaire de l'application
  isOwnerCertified: boolean; // Validé par le copropriétaire/administrateur
  registeredDate?: string;
  idCardNumber?: string;
}

export interface SupermarketProduct {
  id: string;
  name: string;
  category: string;
  priceCDF: number;
  priceUSD: number;
  unit: string;
  supermarketId: string;
  supermarketName: string;
  inStock: boolean;
  imageUrl?: string;
  emoji: string;
}

export interface SupermarketCartItem {
  product: SupermarketProduct;
  quantity: number;
}

export interface SupermarketOrder {
  id: string;
  supermarketId: string;
  supermarketName: string;
  supermarketAddress: string;
  supermarketCommune: string;
  supermarketCoords: { x: number; y: number };
  items: SupermarketCartItem[];
  itemsSubtotalCDF: number;
  deliveryFeeCDF: number;
  totalPriceCDF: number;
  totalPriceUSD: number;
  deliveryPoint: LocationPoint;
  recipientName: string;
  recipientPhone: string;
  pinCode: string; // Mandatory 4-digit PIN for drop-off
  vehicleTypeRecommended: VehicleType;
  status: 'ordered_online' | 'packed_by_supermarket' | 'driver_assigned' | 'heading_to_supermarket' | 'picked_up' | 'delivered';
  assignedDriverId?: string;
  assignedDriver?: DriverProfile;
  createdAt: string;
  preparationCode: string; // Code de retrait pour le guichet supermarché (ex: "CMD-PSARO-842")
}

export interface CoordinationMessage {
  id: string;
  senderRole: 'client' | 'driver';
  senderName: string;
  senderAvatar: string;
  senderAvatarUrl?: string;
  text: string;
  timestamp: string;
  isQuickPrompt?: boolean;
}

export interface RegisteredLubumbashiUser {
  id: string;
  name: string;
  role: 'client' | 'driver' | 'partner';
  commune: string;
  phoneMasked: string;
  avatarUrl?: string;
  avatarEmoji: string;
  totalTransactions: number;
  rating: number;
  isVerified: boolean;
  membershipNumber: string;
}

export interface CommunityScaleStats {
  totalUsersRegistered: number;
  activeDriversCount: number;
  dailyDeliveries: number;
  satisfactionRate: number;
  communesCovered: number;
  totalVolumeDeliveredUSD: number;
}

export interface PartnerEnterprise {
  id: string;
  name: string;
  category: 'supermarket' | 'pharmacy' | 'restaurant' | 'corporate';
  commune: string;
  address: string;
  phone: string;
  logo: string;
  coords: { x: number; y: number };
}

export interface DeliveryTimelineEvent {
  status: DeliveryStatus;
  timestamp: string;
  label: string;
  description: string;
}

export interface DeliveryOrder {
  id: string;
  pinCode: string; // 4 digits (ex: 9142) - mandatory and blocking
  serviceType: DeliveryServiceType;
  packageType: DeliveryPackageType;
  packageDescription: string;
  pickup: LocationPoint;
  delivery: LocationPoint;
  recipientName: string;
  recipientPhone: string;
  senderName: string;
  senderPhone: string;
  partnerId?: string;
  partnerName?: string;
  vehicleType: VehicleType;
  priceCDF: number;
  priceUSD: number;
  estimatedMinutes: number;
  distanceKm: number;
  status: DeliveryStatus;
  assignedDriverId?: string;
  assignedDriver?: DriverProfile;
  createdAt: string;
  deliveredAt?: string;
  timeline: DeliveryTimelineEvent[];
  pinValidationAttempts: number;
  driverNotes?: string;
  recipientSignature?: string;
  senderAvatarUrl?: string;
  coordinationMessages?: CoordinationMessage[];
  priceBreakdown?: PriceBreakdown;
}

export interface PriceBreakdown {
  distanceKm: number;
  baseFeeCDF: number;
  perKmRateCDF: number;
  distanceCostCDF: number;
  totalCDF: number;
  totalUSD: number;
  vehicleType: VehicleType;
  estimatedMinutes: number;
}

export interface VehicleRatePlan {
  baseCDF: number;
  perKmCDF: number;
  label: string;
  description: string;
  speedAvgMinPerKm: number;
  icon: string;
}

export interface PricingConfig {
  exchangeRateUSD: number;
  vehicleRates: Record<VehicleType, VehicleRatePlan>;
}

export type Language = 'fr' | 'sw';

export type ActiveAppView = 'client' | 'driver' | 'partner_admin' | 'split';

export interface AppReleaseInfo {
  id: string;
  version: string;
  codename: string;
  releasedAt: string;
  changelog: string[];
  minSupportedVersion: string;
  isMandatoryUpdate: boolean;
  channel: 'production' | 'beta';
  deployedBy: string;
}

export interface PlatformBroadcastAlert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'urgent';
  targetAudience: 'all' | 'drivers' | 'clients';
  publishedAt: string;
  isActive: boolean;
  author: string;
}


