import {
  DriverProfile,
  LocationPoint,
  PartnerEnterprise,
  DeliveryOrder,
  ClientProfile,
  RegisteredLubumbashiUser,
  CommunityScaleStats,
  AppReleaseInfo,
  PlatformBroadcastAlert,
  LubumbashiCommuneData,
  SupermarketProduct,
  SupermarketOrder
} from '../types';

export const LUBUMBASHI_COMMUNES_DETAILED: LubumbashiCommuneData[] = [
  {
    id: 'lubumbashi',
    name: 'Commune de Lubumbashi',
    shortName: 'Lubumbashi (Centre)',
    description: 'Cœur administratif, bancaire, diplomatique et commercial du Haut-Katanga',
    quartiers: [
      'Centre-Ville (Plateau)',
      'Gambela I',
      'Gambela II',
      'Kiwele',
      'Makutano',
      'Mampala',
      'Lido',
      'Kalubwe',
      'Baudouin'
    ],
    popularAvenues: [
      'Avenue Kasa-Vubu',
      'Boulevard M’siri',
      'Avenue Patrice Emery Lumumba',
      'Avenue Sendwe',
      'Avenue Laurent-Désiré Kabila',
      'Avenue Moero',
      'Avenue Droogmans',
      'Avenue Likasi',
      'Avenue Maniema',
      'Avenue Adoula',
      'Chaussée de Kasenga',
      'Avenue Ndjamena'
    ],
    landmarks: [
      'Hyper Psaro Centre-Ville',
      'Hôtel de Ville de Lubumbashi',
      'Gare Centrale SNCC',
      'Poste Centrale',
      'Bâtiment Hypnose',
      'Palais de Justice',
      'Grand Hôtel Karavia',
      'Place de la Poste',
      'Banque Centrale du Congo (BCC)'
    ],
    centerCoords: { x: 50, y: 50 }
  },
  {
    id: 'kamalondo',
    name: 'Commune de Kamalondo',
    shortName: 'Kamalondo',
    description: 'Foyer historique, berceau des Corbeaux du TP Mazembe et haut lieu culturel katangais',
    quartiers: [
      'Kitumaini',
      'N’Kulu',
      'Kamalondo Centre',
      'Bongonga'
    ],
    popularAvenues: [
      'Avenue des Sports',
      'Avenue Kasaï',
      'Avenue Sankuru',
      'Avenue Lomami',
      'Avenue Kipushi',
      'Avenue Luvua',
      'Avenue Upemba',
      'Avenue Tanganyika',
      'Avenue de l’Église',
      'Avenue de la Victoire'
    ],
    landmarks: [
      'Stade TP Mazembe',
      'Rond-point Kamalondo',
      'Paroisse Sainte-Thérèse',
      'Marché Kamalondo',
      'Hôpital Général Kamalondo',
      'Terrain des Corbeaux'
    ],
    centerCoords: { x: 42, y: 64 }
  },
  {
    id: 'kenya',
    name: 'Commune de Kenya',
    shortName: 'Kenya',
    description: 'Pôle commercial et populaire dynamique, célèbre pour son Grand Marché et sa Basilique',
    quartiers: [
      'Kenya I',
      'Kenya II',
      'Lualaba',
      'Luapula',
      'Masisi',
      'Matshipuka'
    ],
    popularAvenues: [
      'Avenue de la Basilique',
      'Avenue Luapula',
      'Avenue des Écoles',
      'Avenue Lualaba',
      'Avenue Marungu',
      'Avenue Circulaire',
      'Avenue Bas-Congo',
      'Avenue de la Jeunesse'
    ],
    landmarks: [
      'Basilique Sainte-Marie de la Kenya',
      'Grand Marché de la Kenya',
      'Rond-Point 6 Heures',
      'Place de la Jeunesse Kenya',
      'Station Cobil Kenya',
      'Terrain Kenya'
    ],
    centerCoords: { x: 34, y: 72 }
  },
  {
    id: 'katuba',
    name: 'Commune de Katuba',
    shortName: 'Katuba',
    description: 'Commune la plus populeuse de la ville au sud, réputée pour sa convivialité et ses grands boulevards',
    quartiers: [
      'Katuba I',
      'Katuba II',
      'Katuba III',
      'Musumba',
      'Bukama',
      'Upemba',
      'N’sele',
      'Sakania',
      'Kisanga (Nord)',
      'Lwama'
    ],
    popularAvenues: [
      'Avenue Centrale Katuba',
      'Avenue Bukama',
      'Avenue Musumba',
      'Avenue Sakania',
      'Avenue Kimbangu',
      'Avenue du 30 Juin',
      'Avenue Lupupa',
      'Avenue Munongo',
      'Avenue de la Paix Katuba'
    ],
    landmarks: [
      'Marché Central Katuba',
      'Hôpital Panda Katuba',
      'Rond-point Katuba',
      'Paroisse Saint-Jérôme',
      'Terrain Sakania',
      'Poste de Police Katuba III'
    ],
    centerCoords: { x: 28, y: 84 }
  },
  {
    id: 'kampemba',
    name: 'Commune de Kampemba',
    shortName: 'Kampemba',
    description: 'Bassin industriel, minier et résidentiel historique (Gécamines Usoke, Bel-Air, Kafubu)',
    quartiers: [
      'Bel-Air I',
      'Bel-Air II',
      'Industriel (Gécamines / SNCC)',
      'Kafubu',
      'Kigoma',
      'Taba-Congo',
      'Kimbembe',
      'Camp Vangu'
    ],
    popularAvenues: [
      'Route Munama',
      'Avenue des Usines',
      'Avenue Bel-Air',
      'Avenue Kafubu',
      'Avenue SNCC',
      'Avenue Kigoma',
      'Avenue de la Métallurgie',
      'Chaussée de Kasenga Km 5',
      'Avenue Taba-Congo'
    ],
    landmarks: [
      'Usines Métallurgiques Usoke Gécamines',
      'Marché Bel-Air',
      'Camp Militaire Vangu',
      'Pont Kafubu',
      'Complexe Scolaire Belle-Vue',
      'Entrepôts SNCC'
    ],
    centerCoords: { x: 68, y: 58 }
  },
  {
    id: 'ruashi',
    name: 'Commune de Ruashi',
    shortName: 'Ruashi',
    description: 'Corridor minier du Nord-Est et porte aérienne avec l’Aéroport International de Luano',
    quartiers: [
      'Ruashi I',
      'Ruashi II',
      'Luano (City & Hub)',
      'Kalukuluku',
      'Shindaika',
      'Bendera',
      'Kawama'
    ],
    popularAvenues: [
      'Route de l’Aéroport Luano',
      'Chaussée de Kasenga Ruashi',
      'Avenue Kalukuluku',
      'Avenue Bendera',
      'Avenue Shindaika',
      'Avenue de la Paix',
      'Avenue Congo-Mine',
      'Avenue Luano City'
    ],
    landmarks: [
      'Aéroport International de Luano (FBM)',
      'Luano City Mall & Résidences',
      'Complexe Minier Ruashi Mining',
      'Marché de la Ruashi',
      'Hôpital Général de la Ruashi',
      'Rond-point Luano City'
    ],
    centerCoords: { x: 78, y: 26 }
  },
  {
    id: 'annexe',
    name: 'Commune Annexe',
    shortName: 'Commune Annexe (Golf / Kasapa)',
    description: 'Grande commune périphérique en plein essor accueillant les quartiers résidentiels Golf, le Campus UNILU et Kalebuka',
    quartiers: [
      'Golf Météo',
      'Golf Les Battants',
      'Golf Plateau',
      'Golf Malela',
      'Kasapa (Campus Universitaire)',
      'Kalebuka',
      'Naviundu',
      'Munua',
      'Luwowoshi',
      'Kisanga (Annexe)',
      'Kasungami',
      'CRAA (Jardin Zoologique)'
    ],
    popularAvenues: [
      'Route du Golf',
      'Avenue des Palmiers',
      'Avenue Météo',
      'Route Kasapa (Campus)',
      'Avenue Munama',
      'Route Kipushi (Sortie Sud)',
      'Avenue Kalebuka',
      'Route Naviundu',
      'Avenue des Battants',
      'Boulevard des Écoles'
    ],
    landmarks: [
      'Campus Universitaire de Kasapa (UNILU)',
      'Clinique Universitaire de Lubumbashi',
      'Golf Club de Lubumbashi',
      'Supermarché Hypnose Golf',
      'Carrefour des Battants',
      'Village d’Enfants SOS',
      'Jardin Zoologique CRAA',
      'Rond-Point Météo'
    ],
    centerCoords: { x: 22, y: 32 }
  }
];

export const LUBUMBASHI_COMMUNES = LUBUMBASHI_COMMUNES_DETAILED.map((c) => c.name);

export function getCommuneDataByName(nameOrShort: string): LubumbashiCommuneData {
  const found = LUBUMBASHI_COMMUNES_DETAILED.find(
    (c) => c.name.toLowerCase().includes(nameOrShort.toLowerCase()) ||
           c.shortName.toLowerCase().includes(nameOrShort.toLowerCase()) ||
           nameOrShort.toLowerCase().includes(c.id)
  );
  return found || LUBUMBASHI_COMMUNES_DETAILED[0];
}

export function formatFullAddress(loc: Partial<LocationPoint>): string {
  const parts: string[] = [];
  if (loc.numeroParcelle) parts.push(loc.numeroParcelle.startsWith('N°') ? loc.numeroParcelle : `N° ${loc.numeroParcelle}`);
  if (loc.avenue) parts.push(loc.avenue);
  if (loc.quartier) parts.push(`Quartier ${loc.quartier}`);
  if (loc.commune) parts.push(loc.commune);
  if (loc.landmark) parts.push(`(Repère : ${loc.landmark})`);
  
  if (parts.length === 0) return loc.address || 'Adresse à Lubumbashi';
  return parts.join(', ');
}

export const LUBUMBASHI_PRESET_LOCATIONS: LocationPoint[] = [
  {
    name: 'Hyper Psaro Centre-Ville',
    address: 'N° 124, Avenue Kasa-Vubu, Quartier Centre-Ville, Commune de Lubumbashi',
    commune: 'Commune de Lubumbashi',
    quartier: 'Centre-Ville (Plateau)',
    avenue: 'Avenue Kasa-Vubu',
    numeroParcelle: 'N° 124',
    landmark: 'Croisement avec le Boulevard M’siri',
    coords: { x: 50, y: 52 },
    phone: '+243 81 700 1122'
  },
  {
    name: 'Supermarché Hypnose Golf',
    address: 'N° 45, Route du Golf, Quartier Golf Les Battants, Commune Annexe',
    commune: 'Commune Annexe',
    quartier: 'Golf Les Battants',
    avenue: 'Route du Golf',
    numeroParcelle: 'N° 45',
    landmark: 'Près du Carrefour des Battants',
    coords: { x: 26, y: 38 },
    phone: '+243 82 444 3322'
  },
  {
    name: 'Kin-Marché Lumumba',
    address: 'N° 88, Avenue Patrice Emery Lumumba, Quartier Makutano, Commune de Lubumbashi',
    commune: 'Commune de Lubumbashi',
    quartier: 'Makutano',
    avenue: 'Avenue Patrice Emery Lumumba',
    numeroParcelle: 'N° 88',
    landmark: 'En face de l’agence Vodacom Makutano',
    coords: { x: 53, y: 48 },
    phone: '+243 99 888 7766'
  },
  {
    name: 'Pharmacie Principale M’siri',
    address: 'N° 12, Boulevard M’siri, Quartier Centre-Ville, Commune de Lubumbashi',
    commune: 'Commune de Lubumbashi',
    quartier: 'Centre-Ville (Plateau)',
    avenue: 'Boulevard M’siri',
    numeroParcelle: 'N° 12',
    landmark: 'Face à la Grande Poste Centrale',
    coords: { x: 48, y: 50 },
    phone: '+243 85 123 4567'
  },
  {
    name: 'Clinique Universitaire de Lubumbashi (UNILU)',
    address: 'N° 1, Route Kasapa (Campus), Quartier Kasapa, Commune Annexe',
    commune: 'Commune Annexe',
    quartier: 'Kasapa (Campus Universitaire)',
    avenue: 'Route Kasapa (Campus)',
    numeroParcelle: 'N° 1 Campus',
    landmark: 'Campus Universitaire UNILU, Pavillon Médical',
    coords: { x: 18, y: 22 },
    phone: '+243 81 223 3445'
  },
  {
    name: 'Stade TP Mazembe',
    address: 'N° 10, Avenue des Sports, Quartier Kamalondo Centre, Commune de Kamalondo',
    commune: 'Commune de Kamalondo',
    quartier: 'Kamalondo Centre',
    avenue: 'Avenue des Sports',
    numeroParcelle: 'N° 10',
    landmark: 'Grand portail d’honneur du Stade',
    coords: { x: 42, y: 64 },
    phone: '+243 89 555 4433'
  },
  {
    name: 'Grand Marché de la Kenya',
    address: 'N° 55, Avenue Kipushi, Quartier Kenya I, Commune de Kenya',
    commune: 'Commune de Kenya',
    quartier: 'Kenya I',
    avenue: 'Avenue Kipushi',
    numeroParcelle: 'N° 55',
    landmark: 'Entrée principale du Grand Marché Kenya',
    coords: { x: 34, y: 72 },
    phone: '+243 85 999 8877'
  },
  {
    name: 'Marché Central Katuba & Rond-Point',
    address: 'N° 120, Avenue Centrale Katuba, Quartier Katuba I, Commune de Katuba',
    commune: 'Commune de Katuba',
    quartier: 'Katuba I',
    avenue: 'Avenue Centrale Katuba',
    numeroParcelle: 'N° 120',
    landmark: 'Près de la Paroisse Saint-Jérôme',
    coords: { x: 28, y: 84 },
    phone: '+243 97 000 3344'
  },
  {
    name: 'Bel-Air Centre Commercial & Écoles',
    address: 'N° 76, Avenue Bel-Air, Quartier Bel-Air I, Commune de Kampemba',
    commune: 'Commune de Kampemba',
    quartier: 'Bel-Air I',
    avenue: 'Avenue Bel-Air',
    numeroParcelle: 'N° 76',
    landmark: 'À côté du Complexe Scolaire Belle-Vue',
    coords: { x: 68, y: 58 },
    phone: '+243 97 333 2211'
  },
  {
    name: 'Luano City Mall & Résidences',
    address: 'N° 200, Route de l’Aéroport Luano, Quartier Luano, Commune de Ruashi',
    commune: 'Commune de Ruashi',
    quartier: 'Luano (City & Hub)',
    avenue: 'Route de l’Aéroport Luano',
    numeroParcelle: 'N° 200 Mall',
    landmark: 'Entrée principale Luano City',
    coords: { x: 74, y: 28 },
    phone: '+243 81 999 0011'
  },
  {
    name: 'Aéroport International de Luano (FBM)',
    address: 'Terminal Principal, Route de l’Aéroport Luano, Quartier Luano, Commune de Ruashi',
    commune: 'Commune de Ruashi',
    quartier: 'Luano (City & Hub)',
    avenue: 'Route de l’Aéroport Luano',
    numeroParcelle: 'Terminal FBM',
    landmark: 'Zone Dépose-Minute Passagers',
    coords: { x: 86, y: 20 },
    phone: '+243 84 000 1122'
  },
  {
    name: 'Résidence Privée Golf Plateau',
    address: 'N° 24, Avenue des Palmiers, Quartier Golf Plateau, Commune Annexe',
    commune: 'Commune Annexe',
    quartier: 'Golf Plateau',
    avenue: 'Avenue des Palmiers',
    numeroParcelle: 'N° 24',
    landmark: 'Deuxième portail noir après la station Engen Golf',
    coords: { x: 24, y: 34 },
    phone: '+243 81 234 5678'
  }
];

export const PARTNER_ENTERPRISES: PartnerEnterprise[] = [
  {
    id: 'part-1',
    name: 'Hyper Psaro Lubumbashi',
    category: 'supermarket',
    commune: 'Commune de Lubumbashi',
    address: 'Av. Kasa-Vubu & Blvd M’siri',
    phone: '+243 81 700 1122',
    logo: '🛒',
    coords: { x: 50, y: 52 }
  },
  {
    id: 'part-2',
    name: 'Pharmacie Principale Lubumbashi',
    category: 'pharmacy',
    commune: 'Commune de Lubumbashi',
    address: 'Blvd M’siri face Poste',
    phone: '+243 85 123 4567',
    logo: '💊',
    coords: { x: 48, y: 50 }
  },
  {
    id: 'part-3',
    name: 'Supermarché Hypnose (Golf)',
    category: 'supermarket',
    commune: 'Commune Annexe (Golf)',
    address: 'Carrefour Battants, Golf',
    phone: '+243 82 444 3322',
    logo: '🛍️',
    coords: { x: 26, y: 38 }
  },
  {
    id: 'part-4',
    name: 'Cabinet Notarial & Juridique Katanga Express',
    category: 'corporate',
    commune: 'Commune de Lubumbashi',
    address: 'Av. Maniema, Centre d’affaires',
    phone: '+243 81 999 1234',
    logo: '📁',
    coords: { x: 52, y: 46 }
  },
  {
    id: 'part-5',
    name: 'Restaurant Le Cercle & Grill',
    category: 'restaurant',
    commune: 'Commune de Lubumbashi',
    address: 'Av. Sendwe, Makutano',
    phone: '+243 82 777 6655',
    logo: '🍽️',
    coords: { x: 38, y: 44 }
  }
];

export const PRESET_AVATARS = [
  {
    id: 'av-1',
    label: 'Mireille (Cliente Golf)',
    role: 'client',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
    emoji: '👩🏾‍💼'
  },
  {
    id: 'av-2',
    label: 'Christian (Motard Pro)',
    role: 'driver',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=256&auto=format&fit=crop&q=80',
    emoji: '👨🏾‍✈️'
  },
  {
    id: 'av-3',
    label: 'Patrick (Client Entreprise)',
    role: 'client',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&auto=format&fit=crop&q=80',
    emoji: '👨🏾‍💼'
  },
  {
    id: 'av-4',
    label: 'Serge (Motard Express)',
    role: 'driver',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&auto=format&fit=crop&q=80',
    emoji: '🏍️'
  },
  {
    id: 'av-5',
    label: 'Nadine (Commerçante Marché)',
    role: 'client',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80',
    emoji: '👩🏾'
  },
  {
    id: 'av-6',
    label: 'Arsène (Motard Rapide)',
    role: 'driver',
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=256&auto=format&fit=crop&q=80',
    emoji: '🛵'
  }
];

export const INITIAL_CLIENT_PROFILE: ClientProfile = {
  id: 'cli-1084920',
  name: 'Mireille Kabange',
  phone: '+243 81 234 5678',
  email: 'mireille.kabange@katanga.cd',
  commune: 'Commune Annexe (Golf)',
  avatar: '👩🏾‍💼',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
  clientNumber: 'LX-1084920',
  loyaltyPoints: 1840,
  totalOrders: 42,
  rating: 4.96,
  joinedDate: 'Mars 2024',
  favoriteAddresses: [
    {
      name: 'Résidence Privée Golf Les Battants',
      address: 'Avenue des Palmiers N° 45, Golf',
      commune: 'Commune Annexe (Golf)',
      coords: { x: 24, y: 36 },
      phone: '+243 81 234 5678'
    },
    {
      name: 'Bureau Makutano Centre',
      address: 'Avenue Sendwe, Immeuble Hypnose',
      commune: 'Commune de Lubumbashi',
      coords: { x: 49, y: 49 },
      phone: '+243 81 234 5678'
    }
  ]
};

export const INITIAL_DRIVERS: DriverProfile[] = [
  {
    id: 'drv-1',
    name: 'Christian Mwamba',
    phone: '+243 99 712 3456',
    email: 'christian.mwamba@katanga.cd',
    commune: 'Commune de Lubumbashi (Centre)',
    avenue: 'Avenue Sendwe N° 45',
    avatar: '👨🏾‍✈️',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=256&auto=format&fit=crop&q=80',
    vehicleType: 'moto',
    vehicleCategoryLabel: 'Motard Express',
    vehicleModel: 'TVS Apache RTR 180 (Moto Rapide)',
    vehiclePhotoUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=300&auto=format&fit=crop&q=80',
    plateNumber: 'HK-2490-BB',
    matriculeId: 'LX-KAT-MOT-0842',
    licenseNumber: 'PERMIS-RDC-KAT-994821',
    rating: 4.9,
    totalDeliveries: 342,
    todayEarningsCDF: 32500,
    todayEarningsUSD: 11.5,
    isOnline: true,
    currentCommune: 'Commune de Lubumbashi (Centre)',
    coords: { x: 46, y: 48 },
    gpsAccuracyMeters: 2.5,
    liveGpsLat: -11.660892,
    liveGpsLng: 27.479415,
    carteImmatriculationId: 'CI-LSH-2026-0842',
    contractSignedDate: '15 Janvier 2025',
    isOwnerCertified: true,
    idCardNumber: 'ID-KAT-88402910'
  },
  {
    id: 'drv-2',
    name: 'Patrice Ilunga',
    phone: '+243 81 445 6789',
    email: 'patrice.ilunga@katanga.cd',
    commune: 'Commune Annexe (Golf)',
    avenue: 'Route du Golf N° 12',
    avatar: '🚲',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&auto=format&fit=crop&q=80',
    vehicleType: 'velo',
    vehicleCategoryLabel: 'Cycliste Cargo',
    vehicleModel: 'Vélo Cargo Phoenix Katanga (Écologique)',
    vehiclePhotoUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300&auto=format&fit=crop&q=80',
    plateNumber: 'CADRE-VELO-0193',
    matriculeId: 'LX-KAT-VELO-0193',
    licenseNumber: 'CERTIF-CYCLISTE-KAT-0193',
    rating: 4.85,
    totalDeliveries: 185,
    todayEarningsCDF: 19500,
    todayEarningsUSD: 7.0,
    isOnline: true,
    currentCommune: 'Commune Annexe (Golf)',
    coords: { x: 28, y: 42 },
    gpsAccuracyMeters: 2.0,
    liveGpsLat: -11.642105,
    liveGpsLng: 27.441890,
    carteImmatriculationId: 'CI-LSH-2026-0193',
    contractSignedDate: '20 Février 2025',
    isOwnerCertified: true,
    idCardNumber: 'ID-KAT-99401200'
  },
  {
    id: 'drv-3',
    name: 'Michel Kalenga',
    phone: '+243 85 333 9911',
    email: 'michel.kalenga@katanga.cd',
    commune: 'Commune de Kamalondo',
    avenue: 'Avenue des Sports N° 8',
    avatar: '🚗',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=256&auto=format&fit=crop&q=80',
    vehicleType: 'voiture',
    vehicleCategoryLabel: 'Auto-Conducteur Berline',
    vehicleModel: 'Toyota Corolla Berline (Coffre Sécurisé)',
    vehiclePhotoUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300&auto=format&fit=crop&q=80',
    plateNumber: 'HK-3810-BA',
    matriculeId: 'LX-KAT-AUTO-0045',
    licenseNumber: 'PERMIS-RDC-KAT-771940',
    rating: 4.95,
    totalDeliveries: 210,
    todayEarningsCDF: 48000,
    todayEarningsUSD: 17.1,
    isOnline: true,
    currentCommune: 'Commune de Kamalondo',
    coords: { x: 44, y: 62 },
    gpsAccuracyMeters: 2.5,
    liveGpsLat: -11.684510,
    liveGpsLng: 27.469112,
    carteImmatriculationId: 'CI-LSH-2026-0045',
    contractSignedDate: '02 Mars 2025',
    isOwnerCertified: true,
    idCardNumber: 'ID-KAT-77401188'
  },
  {
    id: 'drv-4',
    name: 'Godefroid Kasongo',
    phone: '+243 97 888 1200',
    email: 'godefroid.kasongo@katanga.cd',
    commune: 'Commune de Kampemba (Bel-Air)',
    avenue: 'Avenue Bel-Air N° 104',
    avatar: '🚐',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&auto=format&fit=crop&q=80',
    vehicleType: 'van',
    vehicleCategoryLabel: 'Chauffeur Véhicule Utilitaire / Van',
    vehicleModel: 'Toyota HiAce Fourgonnette Grand Volume',
    vehiclePhotoUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=300&auto=format&fit=crop&q=80',
    plateNumber: 'HK-9921-BB',
    matriculeId: 'LX-KAT-VAN-0012',
    licenseNumber: 'PERMIS-POIDS-LOURD-KAT-661204',
    rating: 5.0,
    totalDeliveries: 160,
    todayEarningsCDF: 65000,
    todayEarningsUSD: 23.2,
    isOnline: true,
    currentCommune: 'Commune de Kampemba',
    coords: { x: 66, y: 56 },
    gpsAccuracyMeters: 2.0,
    liveGpsLat: -11.632014,
    liveGpsLng: 27.521045,
    carteImmatriculationId: 'CI-LSH-2026-0012',
    contractSignedDate: '10 Janvier 2025',
    isOwnerCertified: true,
    idCardNumber: 'ID-KAT-66100234'
  }
];

export const INITIAL_ORDERS: DeliveryOrder[] = [
  {
    id: 'LB-9142',
    pinCode: '9142', // As shown in Cahier des charges page 1 example: 9142
    serviceType: 'courier',
    packageType: 'envelope_urgent',
    packageDescription: 'Enveloppe courrier urgent - Acte notarié et documents bancaires',
    pickup: {
      name: 'Bâtiment du Gouvernorat du Haut-Katanga',
      address: 'Avenue Kasavubu, Centre Administratif',
      commune: 'Commune de Lubumbashi',
      coords: { x: 52, y: 46 },
      phone: '+243 81 112 2334'
    },
    delivery: {
      name: 'Résidence Privée Golf Les Battants',
      address: 'Avenue des Palmiers N° 45, Golf',
      commune: 'Commune Annexe (Golf)',
      coords: { x: 24, y: 36 },
      phone: '+243 81 900 4455'
    },
    senderName: 'Me. Patrice Kasongo (Greffier)',
    senderPhone: '+243 81 112 2334',
    recipientName: 'M. Jean-Luc Banze (Directeur Général)',
    recipientPhone: '+243 81 900 4455',
    vehicleType: 'moto',
    priceCDF: 8500,
    priceUSD: 3.0,
    estimatedMinutes: 14,
    distanceKm: 4.8,
    status: 'picked_up', // In active transit towards recipient B!
    assignedDriverId: 'drv-1',
    assignedDriver: INITIAL_DRIVERS[0],
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    pinValidationAttempts: 0,
    coordinationMessages: [
      {
        id: 'msg-1',
        senderRole: 'driver',
        senderName: 'Christian Mwamba',
        senderAvatar: '👨🏾‍✈️',
        senderAvatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=256&auto=format&fit=crop&q=80',
        text: 'Bonjour Mme Mireille, j’ai bien récupéré votre enveloppe au Gouvernorat. Je suis engagé sur la Chaussée Laurent-Désiré Kabila.',
        timestamp: '11:42'
      },
      {
        id: 'msg-2',
        senderRole: 'client',
        senderName: 'Mireille Kabange',
        senderAvatar: '👩🏾‍💼',
        senderAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
        text: 'Merci Christian ! Je suis devant le portail noir des Battants au Golf. Précision GPS active.',
        timestamp: '11:44'
      },
      {
        id: 'msg-3',
        senderRole: 'driver',
        senderName: 'Christian Mwamba',
        senderAvatar: '👨🏾‍✈️',
        senderAvatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=256&auto=format&fit=crop&q=80',
        text: 'Bien reçu ! Distance restante 400 mètres. Préparez le code PIN secret pour clôturer la remise.',
        timestamp: '11:47'
      }
    ],
    timeline: [
      {
        status: 'pending',
        timestamp: new Date(Date.now() - 25 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        label: 'Course créée & Code PIN généré',
        description: 'Code PIN unique à 4 chiffres (9142) transmis à l’émetteur'
      },
      {
        status: 'accepted',
        timestamp: new Date(Date.now() - 21 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        label: 'Acceptée par Christian Mwamba',
        description: 'Livreur en approche avec TVS Apache RTR 180'
      },
      {
        status: 'heading_to_pickup',
        timestamp: new Date(Date.now() - 17 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        label: 'Arrivé au point de ramassage (Point A)',
        description: 'Vérification du paquet au Gouvernorat'
      },
      {
        status: 'picked_up',
        timestamp: new Date(Date.now() - 8 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        label: 'Courrier récupéré - En route vers le destinataire (Point B)',
        description: 'Remise finale conditionnée par la saisie obligatoire du code PIN 9142'
      }
    ]
  },
  {
    id: 'LB-4720',
    pinCode: '4720',
    serviceType: 'partner_dispatch',
    packageType: 'medical',
    packageDescription: 'Boîte de médicaments thermosensibles & Sérums urgents',
    pickup: {
      name: 'Pharmacie Principale Lubumbashi',
      address: 'Blvd M’siri face Poste',
      commune: 'Commune de Lubumbashi',
      coords: { x: 48, y: 50 },
      phone: '+243 85 123 4567'
    },
    delivery: {
      name: 'Clinique Universitaire de Lubumbashi (UNILU)',
      address: 'Campus Kasapa, Route Munama',
      commune: 'Commune Annexe (Kasapa)',
      coords: { x: 18, y: 22 },
      phone: '+243 81 223 3445'
    },
    senderName: 'Pharmacie Principale (Dr. Kanku)',
    senderPhone: '+243 85 123 4567',
    recipientName: 'Service Urgences Pédiatriques UNILU',
    recipientPhone: '+243 81 223 3445',
    partnerId: 'part-2',
    partnerName: 'Pharmacie Principale Lubumbashi',
    vehicleType: 'moto',
    priceCDF: 11000,
    priceUSD: 3.9,
    estimatedMinutes: 22,
    distanceKm: 7.2,
    status: 'pending', // Waiting for driver acceptance
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    pinValidationAttempts: 0,
    timeline: [
      {
        status: 'pending',
        timestamp: new Date(Date.now() - 5 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        label: 'Signalement Partenaire émis',
        description: 'Diffusion instantanée aux livreurs à proximité du Centre-Ville'
      }
    ]
  },
  {
    id: 'LB-6385',
    pinCode: '6385',
    serviceType: 'grocery',
    packageType: 'standard_box',
    packageDescription: 'Carton provisions alimentaires fraîches + boissons',
    pickup: {
      name: 'Hyper Psaro Centre-Ville',
      address: 'Av. Kasa-Vubu & Blvd M’siri',
      commune: 'Commune de Lubumbashi',
      coords: { x: 50, y: 52 },
      phone: '+243 81 700 1122'
    },
    delivery: {
      name: 'Luano City Résidences',
      address: 'Villa 12, Route Luano',
      commune: 'Commune de Ruashi',
      coords: { x: 74, y: 28 },
      phone: '+243 99 111 2233'
    },
    senderName: 'Service Commandes Hyper Psaro',
    senderPhone: '+243 81 700 1122',
    recipientName: 'Mme. Claire Kyungu',
    recipientPhone: '+243 99 111 2233',
    partnerId: 'part-1',
    partnerName: 'Hyper Psaro Lubumbashi',
    vehicleType: 'moto',
    priceCDF: 12500,
    priceUSD: 4.4,
    estimatedMinutes: 26,
    distanceKm: 8.5,
    status: 'delivered',
    assignedDriverId: 'drv-2',
    assignedDriver: INITIAL_DRIVERS[1],
    createdAt: new Date(Date.now() - 95 * 60000).toISOString(),
    deliveredAt: new Date(Date.now() - 35 * 60000).toISOString(),
    pinValidationAttempts: 1,
    timeline: [
      {
        status: 'pending',
        timestamp: '11:15',
        label: 'Commande validée',
        description: 'Code PIN généré : 6385'
      },
      {
        status: 'accepted',
        timestamp: '11:20',
        label: 'Pris en charge par Serge Ilunga',
        description: 'Moto Haojue 125 CC'
      },
      {
        status: 'picked_up',
        timestamp: '11:32',
        label: 'Marchandises enlevées chez Hyper Psaro',
        description: 'En route vers Luano City'
      },
      {
        status: 'delivered',
        timestamp: '11:58',
        label: 'Livraison certifiée par Code PIN',
        description: 'Code PIN 6385 validé avec succès sur l’app livreur'
      }
    ]
  }
];

export const COMMUNITY_SCALE_DATA: CommunityScaleStats = {
  totalUsersRegistered: 1284920,
  activeDriversCount: 18450,
  dailyDeliveries: 45820,
  satisfactionRate: 99.4,
  communesCovered: 7,
  totalVolumeDeliveredUSD: 3485000
};

export const SAMPLE_REGISTERED_USERS: RegisteredLubumbashiUser[] = [
  {
    id: 'usr-1',
    name: 'Mireille Kabange',
    role: 'client',
    commune: 'Commune Annexe (Golf)',
    phoneMasked: '+243 81 234 ••••',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
    avatarEmoji: '👩🏾‍💼',
    totalTransactions: 42,
    rating: 4.96,
    isVerified: true,
    membershipNumber: 'LX-1084920'
  },
  {
    id: 'usr-2',
    name: 'Christian Mwamba',
    role: 'driver',
    commune: 'Commune de Lubumbashi (Centre)',
    phoneMasked: '+243 99 712 ••••',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=256&auto=format&fit=crop&q=80',
    avatarEmoji: '👨🏾‍✈️',
    totalTransactions: 342,
    rating: 4.90,
    isVerified: true,
    membershipNumber: 'MOT-0842-KAT'
  },
  {
    id: 'usr-3',
    name: 'Patrick Kalala',
    role: 'client',
    commune: 'Commune de Lubumbashi (Makutano)',
    phoneMasked: '+243 82 555 ••••',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&auto=format&fit=crop&q=80',
    avatarEmoji: '👨🏾‍💼',
    totalTransactions: 89,
    rating: 4.88,
    isVerified: true,
    membershipNumber: 'LX-0982310'
  },
  {
    id: 'usr-4',
    name: 'Serge Ilunga',
    role: 'driver',
    commune: 'Commune Annexe (Golf)',
    phoneMasked: '+243 81 445 ••••',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&auto=format&fit=crop&q=80',
    avatarEmoji: '🏍️',
    totalTransactions: 218,
    rating: 4.80,
    isVerified: true,
    membershipNumber: 'MOT-1102-KAT'
  },
  {
    id: 'usr-5',
    name: 'Nadine Tshibangu',
    role: 'client',
    commune: 'Commune de Kenya',
    phoneMasked: '+243 85 911 ••••',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80',
    avatarEmoji: '👩🏾',
    totalTransactions: 63,
    rating: 4.92,
    isVerified: true,
    membershipNumber: 'LX-1120485'
  },
  {
    id: 'usr-6',
    name: 'Arsène Kalombo',
    role: 'driver',
    commune: 'Commune de Kamalondo',
    phoneMasked: '+243 85 333 ••••',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=256&auto=format&fit=crop&q=80',
    avatarEmoji: '🛵',
    totalTransactions: 154,
    rating: 4.70,
    isVerified: true,
    membershipNumber: 'MOT-2304-KAT'
  },
  {
    id: 'usr-7',
    name: 'Jean-Luc Banze',
    role: 'client',
    commune: 'Commune de Ruashi (Luano)',
    phoneMasked: '+243 81 900 ••••',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&auto=format&fit=crop&q=80',
    avatarEmoji: '👨🏾‍🏫',
    totalTransactions: 55,
    rating: 5.0,
    isVerified: true,
    membershipNumber: 'LX-0874129'
  },
  {
    id: 'usr-8',
    name: 'Clarisse Mujinga',
    role: 'client',
    commune: 'Commune de Kampemba (Bel-Air)',
    phoneMasked: '+243 97 400 ••••',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
    avatarEmoji: '👩🏾‍⚕️',
    totalTransactions: 31,
    rating: 4.94,
    isVerified: true,
    membershipNumber: 'LX-1249301'
  },
  {
    id: 'usr-9',
    name: 'Jonathan Tshisekedi',
    role: 'driver',
    commune: 'Commune de Ruashi',
    phoneMasked: '+243 97 888 ••••',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&auto=format&fit=crop&q=80',
    avatarEmoji: '🚙',
    totalTransactions: 98,
    rating: 5.0,
    isVerified: true,
    membershipNumber: 'AUT-0045-KAT'
  },
  {
    id: 'usr-10',
    name: 'Dr. Roger Kanku',
    role: 'partner',
    commune: 'Commune de Lubumbashi',
    phoneMasked: '+243 85 123 ••••',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=256&auto=format&fit=crop&q=80',
    avatarEmoji: '💊',
    totalTransactions: 520,
    rating: 4.98,
    isVerified: true,
    membershipNumber: 'PAR-0002-LSH'
  }
];

export const INITIAL_RELEASES: AppReleaseInfo[] = [
  {
    id: 'rel-320',
    version: 'v3.2.0',
    codename: 'Katanga 1M & Précision GPS',
    releasedAt: 'Aujourd’hui à 08:30 (Lubumbashi)',
    changelog: [
      'Différenciation stricte Client vs Motard Pro avec rôles et badges dédiés',
      'Gestion complète de la photo de profil (upload personnalisé + presets haute résolution)',
      'Coordination GPS haute précision (±2.5m) avec balises repères de Lubumbashi',
      'Annuaire vérifié de l’écosystème 1M+ utilisateurs & 18,450 motards',
      'Console Propriétaire avec gestionnaire de mises à jour OTA et alertes broadcast'
    ],
    minSupportedVersion: 'v3.0.0',
    isMandatoryUpdate: false,
    channel: 'production',
    deployedBy: 'Propriétaire Direction Générale'
  },
  {
    id: 'rel-310',
    version: 'v3.1.0',
    codename: 'Bilingue Français / Swahili Katanga',
    releasedAt: '12 Mars 2025',
    changelog: [
      'Intégration du sélecteur bilingue Français / Swahili de Lubumbashi',
      'Calcul automatique du barème kilométrique au mètre près (CDF / km)',
      'Protection inviolable du code PIN à 4 chiffres anti-fraude'
    ],
    minSupportedVersion: 'v2.5.0',
    isMandatoryUpdate: true,
    channel: 'production',
    deployedBy: 'Propriétaire Direction Générale'
  },
  {
    id: 'rel-250',
    version: 'v2.5.0',
    codename: 'Katanga Speed Engine',
    releasedAt: '15 Février 2025',
    changelog: [
      'Radar de flotte en direct sur les 7 communes de Lubumbashi',
      'Signalement express partenaires (Hyper Psaro, Pharmacie M’siri)'
    ],
    minSupportedVersion: 'v2.0.0',
    isMandatoryUpdate: true,
    channel: 'production',
    deployedBy: 'Propriétaire Direction Générale'
  }
];

export const INITIAL_BROADCASTS: PlatformBroadcastAlert[] = [
  {
    id: 'bc-1',
    title: 'Alerte Trafic Lubumbashi',
    message: 'Ralentissement signalé sur l’Avenue Kasa-Vubu (Carrefour Laurent-Désiré Kabila). Les motards sont invités à privilégier l’Avenue Sendwe.',
    type: 'warning',
    targetAudience: 'all',
    publishedAt: 'Il y a 25 min',
    isActive: true,
    author: 'Direction des Opérations'
  },
  {
    id: 'bc-2',
    title: 'Bonus Kilométrique Spécial Golf - Ruashi',
    message: '+15% de prime pour toutes les courses reliant Golf et Ruashi entre 12h et 15h.',
    type: 'info',
    targetAudience: 'drivers',
    publishedAt: 'Il y a 1 heure',
    isActive: true,
    author: 'Gouvernance Lubumbashi Express'
  }
];

export const LUBUMBASHI_SUPERMARKET_PRODUCTS: SupermarketProduct[] = [
  // Hyper Psaro Centre-Ville
  {
    id: 'sp-psaro-1',
    name: 'Sac de Riz Blanc Super Lion (25 kg)',
    category: 'Épicerie & Féculents',
    priceCDF: 62000,
    priceUSD: 22.1,
    unit: 'Sac 25kg',
    supermarketId: 'part-1',
    supermarketName: 'Hyper Psaro Centre-Ville',
    inStock: true,
    emoji: '🌾'
  },
  {
    id: 'sp-psaro-2',
    name: 'Bidon d’Huile Végétale Mayor (5 Litres)',
    category: 'Huiles & Condiments',
    priceCDF: 28500,
    priceUSD: 10.2,
    unit: 'Bidon 5L',
    supermarketId: 'part-1',
    supermarketName: 'Hyper Psaro Centre-Ville',
    inStock: true,
    emoji: '🛢️'
  },
  {
    id: 'sp-psaro-3',
    name: 'Lait en Poudre Nido FortiGrow (900 g)',
    category: 'Produits Laitiers',
    priceCDF: 29000,
    priceUSD: 10.4,
    unit: 'Boîte 900g',
    supermarketId: 'part-1',
    supermarketName: 'Hyper Psaro Centre-Ville',
    inStock: true,
    emoji: '🥛'
  },
  {
    id: 'sp-psaro-4',
    name: 'Carton d’Eau Minérale Katanga Vive (6 x 1.5L)',
    category: 'Boissons & Eaux',
    priceCDF: 9500,
    priceUSD: 3.4,
    unit: 'Carton 6 bouteilles',
    supermarketId: 'part-1',
    supermarketName: 'Hyper Psaro Centre-Ville',
    inStock: true,
    emoji: '💧'
  },
  {
    id: 'sp-psaro-5',
    name: 'Sucre Blanc Raffiné Katanga (5 kg)',
    category: 'Épicerie & Féculents',
    priceCDF: 14000,
    priceUSD: 5.0,
    unit: 'Paquet 5kg',
    supermarketId: 'part-1',
    supermarketName: 'Hyper Psaro Centre-Ville',
    inStock: true,
    emoji: '🧂'
  },
  {
    id: 'sp-psaro-6',
    name: 'Lessive Poudre Omo Multi-Action (1.5 kg)',
    category: 'Entretien & Hygiène',
    priceCDF: 11500,
    priceUSD: 4.1,
    unit: 'Sachet 1.5kg',
    supermarketId: 'part-1',
    supermarketName: 'Hyper Psaro Centre-Ville',
    inStock: true,
    emoji: '🧼'
  },

  // Supermarché Hypnose Golf
  {
    id: 'sp-hyp-1',
    name: 'Pain Baguette Tradition Artisanale Fraîche (x2)',
    category: 'Boulangerie & Pâtisserie',
    priceCDF: 4000,
    priceUSD: 1.4,
    unit: 'Lot de 2 baguettes',
    supermarketId: 'part-3',
    supermarketName: 'Supermarché Hypnose Golf',
    inStock: true,
    emoji: '🥖'
  },
  {
    id: 'sp-hyp-2',
    name: 'Poulet Entier Fermier Congelé Katanga (1.3 kg)',
    category: 'Viandes & Surgelés',
    priceCDF: 18500,
    priceUSD: 6.6,
    unit: 'Pièce ~1.3kg',
    supermarketId: 'part-3',
    supermarketName: 'Supermarché Hypnose Golf',
    inStock: true,
    emoji: '🍗'
  },
  {
    id: 'sp-hyp-3',
    name: 'Pack Canettes Coca-Cola Original (6 x 330ml)',
    category: 'Boissons & Eaux',
    priceCDF: 12000,
    priceUSD: 4.3,
    unit: 'Pack 6 canettes',
    supermarketId: 'part-3',
    supermarketName: 'Supermarché Hypnose Golf',
    inStock: true,
    emoji: '🥤'
  },
  {
    id: 'sp-hyp-4',
    name: 'Fromage Gouda Hollandais Entier (500 g)',
    category: 'Produits Laitiers',
    priceCDF: 24500,
    priceUSD: 8.8,
    unit: 'Portion 500g',
    supermarketId: 'part-3',
    supermarketName: 'Supermarché Hypnose Golf',
    inStock: true,
    emoji: '🧀'
  },
  {
    id: 'sp-hyp-5',
    name: 'Café Pur Arabica Moulu Lac Kivu (250 g)',
    category: 'Épicerie & Féculents',
    priceCDF: 16000,
    priceUSD: 5.7,
    unit: 'Sachet 250g',
    supermarketId: 'part-3',
    supermarketName: 'Supermarché Hypnose Golf',
    inStock: true,
    emoji: '☕'
  },
  {
    id: 'sp-hyp-6',
    name: 'Spaghetti Rivo Katanga Export (5 x 500g)',
    category: 'Épicerie & Féculents',
    priceCDF: 9000,
    priceUSD: 3.2,
    unit: 'Lot de 5 paquets',
    supermarketId: 'part-3',
    supermarketName: 'Supermarché Hypnose Golf',
    inStock: true,
    emoji: '🍝'
  },

  // Kin-Marché Lumumba
  {
    id: 'sp-kin-1',
    name: 'Farine de Maïs Blanche Première Qualité (Semoule Bukari 25kg)',
    category: 'Épicerie & Féculents',
    priceCDF: 54000,
    priceUSD: 19.3,
    unit: 'Sac 25kg',
    supermarketId: 'part-6',
    supermarketName: 'Kin-Marché Lumumba',
    inStock: true,
    emoji: '🌽'
  },
  {
    id: 'sp-kin-2',
    name: 'Lot Boîtes Sardines Anny à l’Huile Pimentée (5 x 125g)',
    category: 'Conserves & Poissons',
    priceCDF: 8500,
    priceUSD: 3.0,
    unit: 'Lot de 5 boîtes',
    supermarketId: 'part-6',
    supermarketName: 'Kin-Marché Lumumba',
    inStock: true,
    emoji: '🐟'
  },
  {
    id: 'sp-kin-3',
    name: 'Pâte de Tomate Double Concentré Salsa (800 g)',
    category: 'Huiles & Condiments',
    priceCDF: 7000,
    priceUSD: 2.5,
    unit: 'Boîte 800g',
    supermarketId: 'part-6',
    supermarketName: 'Kin-Marché Lumumba',
    inStock: true,
    emoji: '🥫'
  },
  {
    id: 'sp-kin-4',
    name: 'Poudre Chocolatée Instantanée Ovaltine (400 g)',
    category: 'Petit-Déjeuner',
    priceCDF: 13500,
    priceUSD: 4.8,
    unit: 'Boîte 400g',
    supermarketId: 'part-6',
    supermarketName: 'Kin-Marché Lumumba',
    inStock: true,
    emoji: '🍫'
  }
];

export const INITIAL_SUPERMARKET_ORDERS: SupermarketOrder[] = [
  {
    id: 'SM-8492',
    supermarketId: 'part-1',
    supermarketName: 'Hyper Psaro Centre-Ville',
    supermarketAddress: 'N° 124, Avenue Kasa-Vubu, Quartier Centre-Ville, Commune de Lubumbashi',
    supermarketCommune: 'Commune de Lubumbashi',
    supermarketCoords: { x: 50, y: 52 },
    items: [
      { product: LUBUMBASHI_SUPERMARKET_PRODUCTS[1], quantity: 1 },
      { product: LUBUMBASHI_SUPERMARKET_PRODUCTS[2], quantity: 1 },
      { product: LUBUMBASHI_SUPERMARKET_PRODUCTS[3], quantity: 1 }
    ],
    itemsSubtotalCDF: 67000,
    deliveryFeeCDF: 9500,
    totalPriceCDF: 76500,
    totalPriceUSD: 27.3,
    deliveryPoint: {
      name: 'Résidence Privée Golf Malela',
      address: 'Avenue des Palmiers N° 45, Golf Les Battants',
      commune: 'Commune Annexe',
      quartier: 'Golf Les Battants',
      avenue: 'Avenue des Palmiers',
      numeroParcelle: 'N° 45',
      landmark: 'Portail noir en face du Complexe Bel-Air Golf',
      coords: { x: 24, y: 36 },
      phone: '+243 81 234 5678'
    },
    recipientName: 'Mireille Kabange',
    recipientPhone: '+243 81 234 5678',
    pinCode: '7391',
    vehicleTypeRecommended: 'moto',
    status: 'packed_by_supermarket',
    assignedDriverId: 'drv-1',
    assignedDriver: INITIAL_DRIVERS[0],
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
    preparationCode: 'CMD-PSARO-8492'
  }
];
