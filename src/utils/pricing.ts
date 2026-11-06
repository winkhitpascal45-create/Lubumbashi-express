import { PricingConfig, VehicleType, PriceBreakdown } from '../types';

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  exchangeRateUSD: 2800,
  vehicleRates: {
    velo: {
      baseCDF: 2500,
      perKmCDF: 800,
      label: 'Vélo Cargo',
      description: 'Écologique et agile pour courtes distances intra-commune (< 5 km)',
      speedAvgMinPerKm: 4.5,
      icon: '🚲'
    },
    moto: {
      baseCDF: 4000,
      perKmCDF: 1200,
      label: 'Motard Express',
      description: 'Ultra rapide dans le trafic katangais, courriers urgents et colis légers',
      speedAvgMinPerKm: 2.8,
      icon: '🏍️'
    },
    voiture: {
      baseCDF: 8500,
      perKmCDF: 2200,
      label: 'Auto-Conducteur (Berline)',
      description: 'Chauffeur auto, coffre spacieux, idéal pour colis fragiles et courses sous la pluie',
      speedAvgMinPerKm: 3.2,
      icon: '🚗'
    },
    van: {
      baseCDF: 15000,
      perKmCDF: 3500,
      label: 'Véhicule Utilitaire / Van',
      description: 'Gros volumes, provisions de supermarchés, malles et cartons multiples',
      speedAvgMinPerKm: 3.9,
      icon: '🚐'
    }
  }
};

/**
 * Calcule la distance approximative en km sur la carte de Lubumbashi
 * en tenant compte de la géographie urbaine (rayon d'environ 16 km traversée)
 */
export function calculateLubumbashiDistance(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const euclidean = Math.sqrt(dx * dx + dy * dy);
  // Facteur d'étalonnage pour Lubumbashi (100 unités SVG ~ 22 km de réseau routier réel)
  const roadFactor = 1.25; // Détours urbains
  const km = (euclidean * 0.18) * roadFactor;
  // Distance minimale 1.2 km (course intra-quartier)
  return Math.max(1.2, Math.round(km * 10) / 10);
}

/**
 * Calcule le devis détaillé en fonction du kilométrage exact et du type de véhicule
 */
export function computePriceBreakdown(
  distanceKm: number,
  vehicleType: VehicleType = 'moto',
  config: PricingConfig = DEFAULT_PRICING_CONFIG
): PriceBreakdown {
  const plan = config.vehicleRates[vehicleType] || config.vehicleRates.moto;
  const roundedKm = Math.round(distanceKm * 10) / 10;
  const baseFeeCDF = plan.baseCDF;
  const perKmRateCDF = plan.perKmCDF;
  const distanceCostCDF = Math.round(roundedKm * perKmRateCDF);
  const totalCDF = baseFeeCDF + distanceCostCDF;
  const totalUSD = Math.round((totalCDF / config.exchangeRateUSD) * 10) / 10;
  // Temps estimé : prise en charge (4 min) + temps par km
  const estimatedMinutes = Math.max(8, Math.round(roundedKm * plan.speedAvgMinPerKm) + 4);

  return {
    distanceKm: roundedKm,
    baseFeeCDF,
    perKmRateCDF,
    distanceCostCDF,
    totalCDF,
    totalUSD,
    vehicleType,
    estimatedMinutes
  };
}
