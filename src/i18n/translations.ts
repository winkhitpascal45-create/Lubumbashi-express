export type Language = 'fr' | 'sw';

export interface Translations {
  // Brand & Header
  appName: string;
  appSubtitle: string;
  clientApp: string;
  driverApp: string;
  partnerAdmin: string;
  splitView: string;
  activePinBadge: string;
  exchangeRateText: string;

  // Client App
  clientSpaceTitle: string;
  clientSpaceSubtitle: string;
  tabTracking: string;
  tabCourier: string;
  tabServices: string;
  tabHistory: string;

  // Courier Form
  courierSectionTitle: string;
  courierSectionSubtitle: string;
  pickupLabel: string;
  pickupSublabel: string;
  deliveryLabel: string;
  deliverySublabel: string;
  packageNatureLabel: string;
  packageDescPlaceholder: string;
  recipientTitle: string;
  recipientNameLabel: string;
  recipientPhoneLabel: string;
  senderNameLabel: string;
  senderPhoneLabel: string;
  transportRecommended: string;
  pricingGridBtn: string;
  routePreviewTitle: string;
  selectPointA: string;
  selectPointB: string;
  priceMileageTitle: string;
  baseFare: string;
  distanceBilled: string;
  pinSecurityIncluded: string;
  totalTripPrice: string;
  officialRateNotice: string;
  pinNoticeText: string;
  submitCourierOrder: string;

  // Tracking & PIN
  activeCourse: string;
  noActiveCourse: string;
  orderWaitingDriver: string;
  orderDriverAssigned: string;
  orderHeadingPickup: string;
  orderPickedUp: string;
  orderDelivered: string;
  pinCodeTitle: string;
  pinCodeSubtitle: string;
  pinCodeUniqueLabel: string;
  pinHelpText: string;
  copyPin: string;
  pinCopied: string;
  shareRecipient: string;
  switchDriverTest: string;
  shipmentDetails: string;
  sender: string;
  recipient: string;
  assignedDriverTitle: string;
  callDriver: string;
  searchingDriver: string;
  packageContent: string;
  stepsTimeline: string;

  // Driver App
  driverStatusOnline: string;
  driverStatusOffline: string;
  todayEarnings: string;
  goOnline: string;
  goOffline: string;
  activeMission: string;
  step1Title: string;
  step1Desc: string;
  step1ConfirmBtn: string;
  step2Title: string;
  step2Desc: string;
  step2PinBtn: string;
  pinBlockingNotice: string;
  availableRadarTitle: string;
  ordersWaiting: string;
  driverOfflineNotice: string;
  driverRadarListening: string;
  acceptCourseBtn: string;
  certifiedDeliveriesLog: string;
  pinValidated: string;

  // PIN Modal
  pinModalTitle: string;
  pinModalBlocking: string;
  pinModalNoticeTitle: string;
  pinModalNoticeText: string;
  pinModalSuccessTitle: string;
  pinModalSuccessText: string;
  pinModalEarningsCredited: string;
  pinModalClear: string;
  pinModalSubmitBtn: string;
  pinModalDemoHint: string;

  // Partner & Admin
  partnerAdminTitle: string;
  partnerAdminSubtitle: string;
  tabPartnerDispatch: string;
  tabFleetSupervision: string;
  tabPricingGrid: string;
  tabSecurityAudit: string;
  activeDriversCount: string;
  transitCoursesCount: string;
  certifiedDeliveriesCount: string;
  totalVolumeCount: string;
  emitDispatchTitle: string;
  emitDispatchBtn: string;
  mileageFormulaLabel: string;

  // Map & Locations
  lubumbashiLiveGps: string;
  legendPointA: string;
  legendPointB: string;
  legendDrivers: string;
  legendSecurePin: string;
}

export const translations: Record<Language, Translations> = {
  fr: {
    appName: 'Lubumbashi Express',
    appSubtitle: 'Colis & Courriers Sécurisés',
    clientApp: 'App Client',
    driverApp: 'App Livreur',
    partnerAdmin: 'Partenaire & Admin',
    splitView: 'Vue Trio Simultanée',
    activePinBadge: 'PIN Actif',
    exchangeRateText: '1$ = 2 800 CDF',

    clientSpaceTitle: 'Espace Client & Expéditeur',
    clientSpaceSubtitle: 'Commandez un coursier express de point A vers B ou suivez votre colis en temps réel avec validation par code PIN unique.',
    tabTracking: 'Suivi Live & PIN',
    tabCourier: 'Envoyer un Colis (A → B)',
    tabServices: 'Multi-Services',
    tabHistory: 'Historique',

    courierSectionTitle: 'Service Coursier, Courriers & Colis',
    courierSectionSubtitle: 'Transport rapide de Point A vers Point B avec code PIN de remise',
    pickupLabel: 'Adresse de ramassage (Point A)',
    pickupSublabel: 'Sélection Lubumbashi',
    deliveryLabel: 'Adresse de livraison (Point B)',
    deliverySublabel: 'Destination finale',
    packageNatureLabel: 'Nature du contenu (Exigences opérationnelles)',
    packageDescPlaceholder: 'Précisez le contenu (ex: Enveloppe courrier urgent, Colis fragile...)',
    recipientTitle: 'Coordonnées du destinataire',
    recipientNameLabel: 'Nom complet du destinataire',
    recipientPhoneLabel: 'Téléphone RDC (Airtel / Vodacom / Orange)',
    senderNameLabel: 'Nom de l’expéditeur',
    senderPhoneLabel: 'Téléphone expéditeur',
    transportRecommended: 'Type de transport recommandé',
    pricingGridBtn: 'Grille tarifaire au km',
    routePreviewTitle: 'Aperçu du trajet sur Lubumbashi',
    selectPointA: 'Sélection A',
    selectPointB: 'Sélection B',
    priceMileageTitle: 'Prix en fonction du kilométrage',
    baseFare: 'Prise en charge',
    distanceBilled: 'Distance facturée',
    pinSecurityIncluded: 'Certification Code PIN / OTP',
    totalTripPrice: 'Total de la Course',
    officialRateNotice: 'Taux officiel : 1$ = 2 800 CDF',
    pinNoticeText: 'Génération automatique du Code PIN : Dès validation, un code secret à 4 chiffres vous sera délivré pour le destinataire.',
    submitCourierOrder: 'Valider et Générer le Code PIN',

    activeCourse: 'Course en cours',
    noActiveCourse: 'Aucune course sélectionnée',
    orderWaitingDriver: 'Recherche de coursier...',
    orderDriverAssigned: 'Coursier assigné',
    orderHeadingPickup: 'En approche de Point A',
    orderPickedUp: 'Colis en transit vers Point B',
    orderDelivered: 'Colis livré & Certifié',
    pinCodeTitle: 'Code PIN de Sécurité (OTP)',
    pinCodeSubtitle: 'Requis pour valider la remise',
    pinCodeUniqueLabel: 'Code Unique de Clôture',
    pinHelpText: 'Le livreur doit obligatoirement saisir ce code dans son application pour clôturer la course.',
    copyPin: 'Copier le PIN',
    pinCopied: 'Copié !',
    shareRecipient: 'Partager au Destinataire',
    switchDriverTest: 'Basculer vers App Livreur',
    shipmentDetails: 'Détails de l’expédition',
    sender: 'Émetteur',
    recipient: 'Destinataire',
    assignedDriverTitle: 'Coursier assigné',
    callDriver: 'Appeler le coursier',
    searchingDriver: 'Recherche du coursier le plus proche à Lubumbashi...',
    packageContent: 'Contenu transporté',
    stepsTimeline: 'Étapes de la livraison',

    driverStatusOnline: 'En Ligne',
    driverStatusOffline: 'Hors Ligne',
    todayEarnings: 'Gains du jour',
    goOnline: 'Passer En Ligne',
    goOffline: 'Passer Hors Ligne',
    activeMission: 'Course en cours',
    step1Title: 'Étape 1 : Ramassage (Point A)',
    step1Desc: 'En route vers l’expéditeur',
    step1ConfirmBtn: 'Confirmer la récupération du colis (Passer à l’étape 2)',
    step2Title: 'Étape 2 : Livraison Finale (Point B)',
    step2Desc: 'En route vers le destinataire final',
    step2PinBtn: 'Saisir le Code PIN pour Clôturer la Course',
    pinBlockingNotice: 'Champ obligatoire et bloquant : demandez le code PIN au destinataire.',
    availableRadarTitle: 'Radar des courses disponibles à proximité',
    ordersWaiting: 'demande(s) en attente',
    driverOfflineNotice: 'Vous êtes actuellement Hors Ligne. Passez en ligne pour recevoir des courses.',
    driverRadarListening: 'En veille sur le réseau de Lubumbashi...',
    acceptCourseBtn: 'Accepter la course',
    certifiedDeliveriesLog: 'Vos courses clôturées par code PIN',
    pinValidated: 'PIN validé',

    pinModalTitle: 'Code PIN Obligatoire',
    pinModalBlocking: 'Bloquant',
    pinModalNoticeTitle: 'Certification de livraison (Règlement v3)',
    pinModalNoticeText: 'Le destinataire ou l’émetteur détient le code PIN à 4 chiffres généré lors de la commande. La clôture est impossible sans ce code.',
    pinModalSuccessTitle: 'Livraison Certifiée !',
    pinModalSuccessText: 'vérifié avec succès. Remise garantie.',
    pinModalEarningsCredited: 'crédités à votre portefeuille.',
    pinModalClear: 'Effacer',
    pinModalSubmitBtn: 'Valider le PIN & Clôturer la Course',
    pinModalDemoHint: 'Code PIN émis au client pour le test :',

    partnerAdminTitle: 'Console Entreprise & Administration',
    partnerAdminSubtitle: 'Signalement express de livraisons pour les supermarchés, pharmacies et supervision globale de la flotte.',
    tabPartnerDispatch: 'Signalement Partenaire',
    tabFleetSupervision: 'Supervision Flotte',
    tabPricingGrid: 'Barème au Km',
    tabSecurityAudit: 'Sécurité & PINs',
    activeDriversCount: 'Livreurs en Service',
    transitCoursesCount: 'Courses en Transit',
    certifiedDeliveriesCount: 'Clôturées par PIN',
    totalVolumeCount: 'Volume Total Traité',
    emitDispatchTitle: 'Signalement Partenaire / Entreprise',
    emitDispatchBtn: 'Diffuser le Signalement aux Livreurs de Lubumbashi',
    mileageFormulaLabel: 'Prix Total = Prise en Charge + (Km × Tarif au km)',

    lubumbashiLiveGps: 'Lubumbashi GPS Live',
    legendPointA: 'Point A (Ramassage)',
    legendPointB: 'Point B (Livraison)',
    legendDrivers: 'Coursiers en patrouille',
    legendSecurePin: 'Sécurisé par Code PIN'
  },

  sw: {
    appName: 'Lubumbashi Express',
    appSubtitle: 'Mizigo & Barua Salama',
    clientApp: 'App ya Mteja',
    driverApp: 'App ya Motard (Livreur)',
    partnerAdmin: 'Washirika & Admin',
    splitView: 'Mtazamo wa Pamoja (Trio)',
    activePinBadge: 'PIN Iko Tayari',
    exchangeRateText: '1$ = 2 800 CDF',

    clientSpaceTitle: 'Nafasi ya Mteja & Mtumaji Mzigo',
    clientSpaceSubtitle: 'Omba motard wa haraka kutoka Point A mpaka Point B ao fuata mzigo wako moja kwa moja na kodi ya siri ya PIN.',
    tabTracking: 'Kufuata Mzigo & PIN',
    tabCourier: 'Kutuma Mzigo (A → B)',
    tabServices: 'Maduka & Huduma',
    tabHistory: 'Mambo Yaliyopita',

    courierSectionTitle: 'Huduma ya Motard, Barua & Mizigo',
    courierSectionSubtitle: 'Kusafirisha kwa haraka kutoka Point A mpaka Point B na kodi ya PIN ya kumaliza',
    pickupLabel: 'Mahali pa kuchukulia (Point A)',
    pickupSublabel: 'Chaguo Lubumbashi',
    deliveryLabel: 'Mahali pa kupeleka (Point B)',
    deliverySublabel: 'Mwisho wa safari',
    packageNatureLabel: 'Aina ya Mzigo (Vitu vya ndani)',
    packageDescPlaceholder: 'Eleza mzigo (mfano: Barua ya haraka, Vitu vya kuvunjika, Dawa...)',
    recipientTitle: 'Habari za mpokeaji',
    recipientNameLabel: 'Jina kamili ya mpokeaji',
    recipientPhoneLabel: 'Numero ya simu RDC (Airtel / Vodacom / Orange)',
    senderNameLabel: 'Jina la mtumaji',
    senderPhoneLabel: 'Numero ya mtumaji',
    transportRecommended: 'Chombo cha usafiri kinachofaa',
    pricingGridBtn: 'Bei kwa kila kilometa',
    routePreviewTitle: 'Ramani ya safari ndani ya Lubumbashi',
    selectPointA: 'Chagua A',
    selectPointB: 'Chagua B',
    priceMileageTitle: 'Bei kulingana na Kilometa',
    baseFare: 'Kuanza safari (Base)',
    distanceBilled: 'Kilometa zilizohesabiwa',
    pinSecurityIncluded: 'Ulinzi wa Kodi ya PIN / OTP',
    totalTripPrice: 'Jumla ya Malipo',
    officialRateNotice: 'Bei rasmi : 1$ = 2 800 CDF',
    pinNoticeText: 'Kodi ya PIN inatoka mara moja : Utapata kodi ya tarakimu 4 ya kumupatia mpokeaji wakati mzigo unafika.',
    submitCourierOrder: 'Kuhakikisha na Kutoa Kodi ya PIN',

    activeCourse: 'Safari inayoendelea',
    noActiveCourse: 'Hakuna safari iliyochaguliwa',
    orderWaitingDriver: 'Kutafuta motard aliye karibu...',
    orderDriverAssigned: 'Motard amekubali safari',
    orderHeadingPickup: 'Motard anakuja Point A',
    orderPickedUp: 'Mzigo uko njiani kuelekea Point B',
    orderDelivered: 'Mzigo umefika & Umethibitishwa',
    pinCodeTitle: 'Kodi ya Siri ya PIN (OTP)',
    pinCodeSubtitle: 'Inatakiwa ili kumaliza uwasilishaji',
    pinCodeUniqueLabel: 'Kodi ya Kufunga Safari',
    pinHelpText: 'Motard LAZIMA aingize kodi hii kwenye simu yake ili kufunga safari. Hawezi kufunga bila kodi hii.',
    copyPin: 'Kopi PIN',
    pinCopied: 'Imekopiwa !',
    shareRecipient: 'Tuma kwa Mpokeaji',
    switchDriverTest: 'Badilisha kwenda App ya Motard',
    shipmentDetails: 'Habari za mzigo',
    sender: 'Mtumaji',
    recipient: 'Mpokeaji',
    assignedDriverTitle: 'Motard aliyepewa mzigo',
    callDriver: 'Piga simu kwa motard',
    searchingDriver: 'Kutafuta motard aliye karibu Lubumbashi...',
    packageContent: 'Mzigo uliobebwa',
    stepsTimeline: 'Hatua za safari',

    driverStatusOnline: 'Uko Kazi (Online)',
    driverStatusOffline: 'Umetulia (Offline)',
    todayEarnings: 'Faida ya Leo',
    goOnline: 'Ingia Kazini',
    goOffline: 'Toka Kazini',
    activeMission: 'Kazi Inayoendelea',
    step1Title: 'Hatua 1 : Kuchukua Mzigo (Point A)',
    step1Desc: 'Nenda mahali pa mtumaji',
    step1ConfirmBtn: 'Nimeshachukua Mzigo (Nenda Hatua 2)',
    step2Title: 'Hatua 2 : Kupeleka Mzigo (Point B)',
    step2Desc: 'Nenda kwa mpokeaji wa mwisho',
    step2PinBtn: 'Ingiza Kodi ya PIN ili Kufunga Safari',
    pinBlockingNotice: 'Lazima kabisa : Omba kodi ya PIN kutoka kwa mpokeaji mzigo.',
    availableRadarTitle: 'Mizigo iliyo karibu nawe',
    ordersWaiting: 'mizigo inayosubiri',
    driverOfflineNotice: 'Hauko kazini sasa hivi. Bonyeza kitufe cha mtandao ili kuanza kupokea mizigo.',
    driverRadarListening: 'Kuangalia mtandao wa Lubumbashi...',
    acceptCourseBtn: 'Kubali Mzigo',
    certifiedDeliveriesLog: 'Mizigo iliyokamilika na PIN',
    pinValidated: 'PIN Imekubalika',

    pinModalTitle: 'Kodi ya PIN ya Lazima',
    pinModalBlocking: 'Inafunga Kazi',
    pinModalNoticeTitle: 'Uthibitisho wa Mzigo (Kanuni v3)',
    pinModalNoticeText: 'Mpokeaji ao mtumaji ana kodi ya siri ya tarakimu 4. Haiwezekani kufunga safari bila kodi hii.',
    pinModalSuccessTitle: 'Mzigo Umefika Salama !',
    pinModalSuccessText: 'imethibitishwa vizuri. Uwasilishaji umekamilika.',
    pinModalEarningsCredited: 'zimeongezwa kwenye mfuko wako.',
    pinModalClear: 'Futa',
    pinModalSubmitBtn: 'Hakikisha PIN & Funga Safari',
    pinModalDemoHint: 'Kodi ya PIN kwa ajili ya jaribio :',

    partnerAdminTitle: 'Usimamizi wa Makampuni & Admin',
    partnerAdminSubtitle: 'Kutuma mizigo ya haraka kutoka ma-supermarché, maduka ya dawa na kusimamia motards wote.',
    tabPartnerDispatch: 'Kutuma Mzigo wa Duka',
    tabFleetSupervision: 'Kusimamia Motards',
    tabPricingGrid: 'Bei kwa Kilometa',
    tabSecurityAudit: 'Ulinzi & PINs',
    activeDriversCount: 'Motards Kazini',
    transitCoursesCount: 'Mizigo Iko Njiani',
    certifiedDeliveriesCount: 'Mizigo Iliyofungwa na PIN',
    totalVolumeCount: 'Jumla ya Pesa Zote',
    emitDispatchTitle: 'Kutuma Mzigo wa Kampuni / Duka',
    emitDispatchBtn: 'Sambaza kwa Motards wa Lubumbashi',
    mileageFormulaLabel: 'Bei Yote = Kuanza + (Kilometa × Bei ya km)',

    lubumbashiLiveGps: 'Lubumbashi GPS Moja kwa Moja',
    legendPointA: 'Point A (Kuchukulia)',
    legendPointB: 'Point B (Kupeleka)',
    legendDrivers: 'Motards wako doria',
    legendSecurePin: 'Salama kwa Kodi ya PIN'
  }
};
