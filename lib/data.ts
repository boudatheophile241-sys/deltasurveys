/**
 * Source de données centrale (mock/fallback) pour Delta Surveys.
 * Le catalogue réel est servi depuis Supabase ; ces données servent de repli.
 */

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  count: number;
  accent: "navy" | "red";
};

export type Brand = {
  name: string;
  origin: string;
  monogram: string;
  logo?: string;
};

export type Badge = "Nouveau" | "Promo" | "Top Vente";

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  warranty: string;
  delivery: string;
  badges: Badge[];
  icon: string;
  accent: "navy" | "red" | "sky" | "amber";
  shortDescription: string;
  specs: { label: string; value: string }[];
  image?: string;
  images?: string[];
};

export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  accent: "navy" | "red";
};

export type Solution = {
  title: string;
  description: string;
  icon: string;
  sectors: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  icon: string;
  content?: string;
  cover?: string;
};

/* -------------------------------------------------------------------------- */
/*  Entreprise                                                                */
/* -------------------------------------------------------------------------- */

export const company = {
  name: "Delta Surveys",
  legalName: "Delta Surveys SARL",
  tagline:
    "Les solutions de topographie et de génie civil au service de votre développement",
  phone: "+226 61 57 19 13",
  phoneHref: "+22661571913",
  phones: [
    { display: "+226 61 57 19 13", href: "+22661571913" },
    { display: "+226 67 96 26 22", href: "+22667962622" },
    { display: "+226 44 44 89 89", href: "+22644448989" },
  ],
  email: "contact.deltasurveys@gmail.com",
  address: "Ouagadougou, Burkina Faso",
  addressLong:
    "Zone du Bois, Ouagadougou, Burkina Faso — Livraison partout en Afrique de l'Ouest",
  hours: "Lun — Sam : 08h00 — 18h30",
  socials: {
    facebook: "https://www.facebook.com/profile.php?id=61592596782727",
    tiktok: "https://www.tiktok.com/@babayaga_fx?_r=1&_t=ZS-98d6g5I3tQ4",
  },
};

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                */
/* -------------------------------------------------------------------------- */

export const mainNav: NavItem[] = [
  { label: "Accueil", href: "/" },
  {
    label: "Produits",
    href: "/produits",
    children: [
      { label: "Stations Totales", href: "/produits?categorie=stations-totales", description: "Mesure angulaire et distance haute précision" },
      { label: "GPS GNSS", href: "/produits?categorie=gps-gnss", description: "Récepteurs RTK centimétriques" },
      { label: "Drones", href: "/produits?categorie=drones", description: "Cartographie et photogrammétrie" },
      { label: "Niveaux Automatiques", href: "/produits?categorie=niveaux-automatiques", description: "Nivellement de chantier" },
      { label: "Lasers", href: "/produits?categorie=laser", description: "Lasers rotatifs et lignes" },
      { label: "Accessoires", href: "/produits?categorie=accessoires", description: "Trépieds, prismes, cannes" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Topographie", href: "/services#topographie", description: "Levés, implantation, cartographie" },
      { label: "Géomatique", href: "/services#geomatique", description: "SIG et traitement de données" },
      { label: "Expertise foncière", href: "/services#expertise-fonciere", description: "Délimitation et gestion du foncier" },
      { label: "BTP", href: "/services#btp", description: "Matériaux, outils et équipements" },
      { label: "Gestion immobilière", href: "/services#gestion-immobiliere", description: "Suivi et valorisation des biens" },
    ],
  },
  { label: "Solutions", href: "/solutions" },
  { label: "À propos", href: "/a-propos" },
  { label: "Blog", href: "/blog" },
  { label: "Carrières", href: "/carrieres" },
  { label: "Contact", href: "/contact" },
];

/* -------------------------------------------------------------------------- */
/*  Catégories                                                                */
/* -------------------------------------------------------------------------- */

export const categories: Category[] = [
  { slug: "stations-totales", name: "Stations Totales", description: "Mesure angulaire et distance", icon: "Crosshair", count: 24, accent: "navy" },
  { slug: "gps-gnss", name: "GPS GNSS", description: "Récepteurs RTK de précision", icon: "Satellite", count: 18, accent: "red" },
  { slug: "drones", name: "Drones", description: "Cartographie aérienne", icon: "Send", count: 12, accent: "navy" },
  { slug: "niveaux-automatiques", name: "Niveaux Automatiques", description: "Nivellement de chantier", icon: "Ruler", count: 16, accent: "red" },
  { slug: "laser", name: "Laser", description: "Lasers rotatifs & lignes", icon: "Zap", count: 14, accent: "navy" },
  { slug: "trepieds", name: "Trépieds", description: "Supports et embases", icon: "Triangle", count: 20, accent: "red" },
  { slug: "accessoires", name: "Accessoires", description: "Prismes, cannes, batteries", icon: "Boxes", count: 40, accent: "navy" },
  { slug: "equipements-btp", name: "Équipements BTP", description: "Matériel de chantier", icon: "HardHat", count: 30, accent: "red" },
  { slug: "pieces-detachees", name: "Pièces détachées", description: "Composants d'origine", icon: "Cog", count: 60, accent: "navy" },
];

/* -------------------------------------------------------------------------- */
/*  Marques partenaires                                                       */
/* -------------------------------------------------------------------------- */

export const brands: Brand[] = [
  { name: "Leica", origin: "Suisse", monogram: "LG" },
  { name: "Trimble", origin: "USA", monogram: "TR" },
  { name: "Hi-Target", origin: "Chine", monogram: "HT" },
  { name: "DJI", origin: "Chine", monogram: "DJI" },
  { name: "Topcon", origin: "Japon", monogram: "TP" },
  { name: "Sokkia", origin: "Japon", monogram: "SK" },
  { name: "CHCNAV", origin: "Chine", monogram: "CH" },
  { name: "Geomax", origin: "Suisse", monogram: "GX" },
];

/* -------------------------------------------------------------------------- */
/*  Produits (repli)                                                          */
/* -------------------------------------------------------------------------- */

export const products: Product[] = [
  {
    id: "p1",
    slug: "leica-ts07",
    name: "Leica TS07",
    brand: "Leica",
    category: "stations-totales",
    price: 1800000,
    rating: 5,
    reviews: 12,
    inStock: true,
    warranty: "2 ans constructeur",
    delivery: "Livraison 48h — Ouaga",
    badges: ["Nouveau"],
    icon: "Crosshair",
    accent: "navy",
    shortDescription:
      "Station totale électronique manuelle, précision angulaire 1'' à 5'', idéale pour l'implantation et les levés de précision.",
    specs: [
      { label: "Précision angulaire", value: "1\" — 5\"" },
      { label: "Portée sans prisme", value: "1 000 m" },
      { label: "Écran", value: "Tactile couleur" },
      { label: "Autonomie", value: "30 h" },
    ],
  },
  {
    id: "p2",
    slug: "hi-target-v200",
    name: "Hi-Target V200",
    brand: "Hi-Target",
    category: "gps-gnss",
    price: 2500000,
    rating: 4.5,
    reviews: 10,
    inStock: true,
    warranty: "2 ans constructeur",
    delivery: "Livraison 48h — Ouaga",
    badges: ["Top Vente"],
    icon: "Satellite",
    accent: "red",
    shortDescription:
      "Récepteur GPS GNSS RTK compact, 1408 canaux, correction centimétrique et connexion IMU pour levés inclinés.",
    specs: [
      { label: "Canaux", value: "1408" },
      { label: "Précision RTK", value: "8 mm + 1 ppm" },
      { label: "IMU", value: "Compensation d'inclinaison" },
      { label: "Autonomie", value: "16 h" },
    ],
  },
  {
    id: "p3",
    slug: "dji-matrice-350-rtk",
    name: "DJI Matrice 350 RTK",
    brand: "DJI",
    category: "drones",
    price: 6900000,
    oldPrice: 7500000,
    rating: 5,
    reviews: 8,
    inStock: true,
    warranty: "1 an constructeur",
    delivery: "Livraison 72h",
    badges: ["Promo"],
    icon: "Send",
    accent: "navy",
    shortDescription:
      "Drone professionnel de cartographie, autonomie 55 min, double batterie et compatibilité charges utiles multiples.",
    specs: [
      { label: "Autonomie", value: "55 min" },
      { label: "Portée", value: "20 km (O3 Enterprise)" },
      { label: "Indice", value: "IP55" },
      { label: "Charges utiles", value: "Jusqu'à 3" },
    ],
  },
  {
    id: "p4",
    slug: "niveau-automatique-leica-na320",
    name: "Niveau Automatique NA320",
    brand: "Leica",
    category: "niveaux-automatiques",
    price: 450000,
    rating: 4.5,
    reviews: 9,
    inStock: true,
    warranty: "2 ans constructeur",
    delivery: "Disponible en magasin",
    badges: [],
    icon: "Ruler",
    accent: "red",
    shortDescription:
      "Niveau optique automatique robuste, grossissement 20x, précision 2,5 mm, parfait pour le nivellement de chantier.",
    specs: [
      { label: "Grossissement", value: "20x" },
      { label: "Précision", value: "2,5 mm / km" },
      { label: "Compensateur", value: "Magnétique" },
      { label: "Étanchéité", value: "IP54" },
    ],
  },
  {
    id: "p5",
    slug: "trimble-r12i",
    name: "Trimble R12i",
    brand: "Trimble",
    category: "gps-gnss",
    price: 4200000,
    rating: 5,
    reviews: 6,
    inStock: true,
    warranty: "2 ans constructeur",
    delivery: "Livraison 72h",
    badges: ["Nouveau"],
    icon: "Satellite",
    accent: "navy",
    shortDescription:
      "Récepteur GNSS haut de gamme avec technologie ProPoint et compensation d'inclinaison sans calibration.",
    specs: [
      { label: "Canaux", value: "672" },
      { label: "Précision", value: "8 mm + 0,5 ppm" },
      { label: "TIP", value: "Inclinaison jusqu'à 60°" },
      { label: "Autonomie", value: "En continu (hot-swap)" },
    ],
  },
  {
    id: "p6",
    slug: "topcon-gt-1200",
    name: "Topcon GT-1200",
    brand: "Topcon",
    category: "stations-totales",
    price: 5200000,
    rating: 4.5,
    reviews: 5,
    inStock: true,
    warranty: "2 ans constructeur",
    delivery: "Livraison 72h",
    badges: ["Top Vente"],
    icon: "Crosshair",
    accent: "red",
    shortDescription:
      "Station totale robotisée ultra-compacte, suivi UltraTrac, idéale pour l'implantation en une personne.",
    specs: [
      { label: "Précision", value: "1\"" },
      { label: "Portée prisme", value: "6 000 m" },
      { label: "Robotisation", value: "Oui — 1 opérateur" },
      { label: "Suivi", value: "UltraTrac" },
    ],
  },
  {
    id: "p7",
    slug: "laser-rotatif-geomax-zone20",
    name: "Laser Rotatif Zone20 H",
    brand: "Geomax",
    category: "laser",
    price: 620000,
    oldPrice: 720000,
    rating: 4.5,
    reviews: 7,
    inStock: true,
    warranty: "2 ans constructeur",
    delivery: "Disponible en magasin",
    badges: ["Promo"],
    icon: "Zap",
    accent: "navy",
    shortDescription:
      "Laser rotatif horizontal auto-nivelant, portée 800 m avec récepteur, robuste pour le chantier.",
    specs: [
      { label: "Portée", value: "800 m (diamètre)" },
      { label: "Précision", value: "1 mm / 10 m" },
      { label: "Indice", value: "IP66" },
      { label: "Auto-nivellement", value: "± 5°" },
    ],
  },
  {
    id: "p8",
    slug: "chcnav-i93",
    name: "CHCNAV i93",
    brand: "CHCNAV",
    category: "gps-gnss",
    price: 3100000,
    rating: 4.5,
    reviews: 4,
    inStock: false,
    warranty: "2 ans constructeur",
    delivery: "Sur commande — 10 jours",
    badges: [],
    icon: "Satellite",
    accent: "red",
    shortDescription:
      "Récepteur GNSS IMU-RTK tout-en-un avec visualisation AR, 1408 canaux et autonomie longue durée.",
    specs: [
      { label: "Canaux", value: "1408" },
      { label: "Précision RTK", value: "8 mm + 1 ppm" },
      { label: "AR Stakeout", value: "Oui" },
      { label: "Autonomie", value: "15 h" },
    ],
  },
];

export const featuredProducts = products.slice(0, 4);

/* -------------------------------------------------------------------------- */
/*  Pourquoi choisir Delta Surveys                                            */
/* -------------------------------------------------------------------------- */

export const whyChooseUs = [
  { title: "Produits certifiés", description: "Matériel neuf, authentique et calibré en usine.", icon: "ShieldCheck" },
  { title: "Support technique", description: "Une équipe d'ingénieurs topographes à votre écoute.", icon: "Headset" },
  { title: "Livraison rapide", description: "Ouagadougou en 48h, Afrique de l'Ouest sous 10 jours.", icon: "Truck" },
  { title: "Garantie constructeur", description: "Jusqu'à 2 ans de garantie officielle sur nos marques.", icon: "BadgeCheck" },
  { title: "Formation incluse", description: "Prise en main terrain et sessions de perfectionnement.", icon: "GraduationCap" },
  { title: "Service après-vente", description: "Réparation, calibration et maintenance préventive.", icon: "Wrench" },
  { title: "Pièces disponibles", description: "Stock de pièces détachées d'origine pour chaque marque.", icon: "Cog" },
];

/* -------------------------------------------------------------------------- */
/*  Services                                                                  */
/* -------------------------------------------------------------------------- */

export const services: Service[] = [
  {
    slug: "topographie",
    title: "Topographie",
    description: "Levés, implantation et cartographie de précision pour vos projets d'aménagement.",
    icon: "MountainSnow",
    features: ["Levés topographiques", "Implantation d'ouvrages", "Cartographie & plans"],
    accent: "navy",
  },
  {
    slug: "geomatique",
    title: "Géomatique",
    description: "Conception de SIG, traitement et modélisation de données géospatiales.",
    icon: "Map",
    features: ["Systèmes d'information géographique", "Traitement de données", "Modélisation 3D"],
    accent: "red",
  },
  {
    slug: "expertise-fonciere",
    title: "Expertise foncière",
    description: "Délimitation, bornage et sécurisation de vos titres fonciers.",
    icon: "Landmark",
    features: ["Délimitation & bornage", "Dossiers fonciers", "Conseil juridique foncier"],
    accent: "navy",
  },
  {
    slug: "btp",
    title: "BTP",
    description: "Matériaux, outils et accompagnement pour vos chantiers de construction.",
    icon: "Building2",
    features: ["Matériel de chantier", "Suivi de travaux", "Contrôle qualité"],
    accent: "red",
  },
  {
    slug: "gestion-immobiliere",
    title: "Gestion immobilière",
    description: "Suivi, valorisation et gestion locative de votre patrimoine immobilier.",
    icon: "Home",
    features: ["Gestion locative", "Valorisation de biens", "États des lieux"],
    accent: "navy",
  },
  {
    slug: "formation",
    title: "Formation",
    description: "Sessions certifiantes sur les équipements et logiciels de topographie.",
    icon: "GraduationCap",
    features: ["Prise en main terrain", "Logiciels métiers", "Certification"],
    accent: "red",
  },
  {
    slug: "maintenance",
    title: "Maintenance",
    description: "Calibration, réparation et maintenance préventive de vos instruments.",
    icon: "Wrench",
    features: ["Calibration en atelier", "Réparation multimarque", "Contrats d'entretien"],
    accent: "navy",
  },
];

/* -------------------------------------------------------------------------- */
/*  Solutions par secteur                                                     */
/* -------------------------------------------------------------------------- */

export const solutions: Solution[] = [
  {
    title: "Cadastre & Foncier",
    description: "Chaîne complète pour la délimitation parcellaire et la gestion cadastrale.",
    icon: "Landmark",
    sectors: ["État & collectivités", "Géomètres-experts", "Notaires"],
  },
  {
    title: "Mines & Carrières",
    description: "Suivi de volumes, topographie de fond et sécurité des exploitations.",
    icon: "Pickaxe",
    sectors: ["Mines industrielles", "Carrières", "Bureaux d'études"],
  },
  {
    title: "Génie civil & BTP",
    description: "Implantation, contrôle et suivi d'exécution des grands ouvrages.",
    icon: "Building2",
    sectors: ["Routes & ponts", "Bâtiments", "Barrages"],
  },
  {
    title: "Agriculture de précision",
    description: "Cartographie des parcelles et guidage pour une agriculture optimisée.",
    icon: "Sprout",
    sectors: ["Agro-industrie", "Coopératives", "Aménagements hydro-agricoles"],
  },
  {
    title: "Aménagement urbain",
    description: "Données géospatiales fiables pour la planification des villes.",
    icon: "Building",
    sectors: ["Urbanisme", "Réseaux (VRD)", "Smart city"],
  },
  {
    title: "Énergie & Réseaux",
    description: "Relevés précis pour les infrastructures énergétiques et télécoms.",
    icon: "Zap",
    sectors: ["Solaire", "Lignes électriques", "Télécoms"],
  },
];

/* -------------------------------------------------------------------------- */
/*  Blog (repli)                                                              */
/* -------------------------------------------------------------------------- */

export const blogPosts: BlogPost[] = [
  {
    slug: "choisir-station-totale",
    title: "Comment choisir sa station totale en 2026 ?",
    excerpt:
      "Précision angulaire, portée, robotisation : notre guide complet pour investir dans la bonne station totale selon vos chantiers.",
    category: "Guide d'achat",
    date: "12 juillet 2026",
    readTime: "6 min",
    author: "Delta Surveys",
    icon: "Crosshair",
  },
  {
    slug: "gps-gnss-rtk-afrique",
    title: "GPS GNSS RTK : maximiser la précision en Afrique de l'Ouest",
    excerpt:
      "Réseaux de correction, bases locales, IMU : nos conseils pour obtenir une précision centimétrique fiable sur le terrain.",
    category: "Technique",
    date: "28 juin 2026",
    readTime: "8 min",
    author: "Delta Surveys",
    icon: "Satellite",
  },
  {
    slug: "drones-cartographie-mines",
    title: "Drones de cartographie : révolution pour les mines et carrières",
    excerpt:
      "Calcul de volumes, suivi d'exploitation, sécurité : comment la photogrammétrie par drone transforme le secteur minier.",
    category: "Cas d'usage",
    date: "10 juin 2026",
    readTime: "5 min",
    author: "Delta Surveys",
    icon: "Send",
  },
];

/* -------------------------------------------------------------------------- */
/*  Moyens de paiement                                                        */
/* -------------------------------------------------------------------------- */

export const paymentMethods = [
  { name: "Orange Money", available: true, monogram: "OM" },
  { name: "Moov Money", available: true, monogram: "MM" },
  { name: "Wave", available: true, monogram: "W" },
  { name: "Coris Money", available: true, monogram: "CM" },
  { name: "Visa", available: false, monogram: "V" },
  { name: "Mastercard", available: false, monogram: "MC" },
  { name: "PayPal", available: false, monogram: "PP" },
];

/* -------------------------------------------------------------------------- */
/*  Statistiques                                                              */
/* -------------------------------------------------------------------------- */

export const stats = [
  { value: "500+", label: "Équipements livrés" },
  { value: "8", label: "Marques partenaires" },
  { value: "12", label: "Pays desservis" },
  { value: "5 ans", label: "D'expérience" },
];

/* -------------------------------------------------------------------------- */
/*  Assistant IA — suggestions                                                */
/* -------------------------------------------------------------------------- */

export const aiSuggestions = [
  "Quel équipement est le plus adapté pour un levé topographique ?",
  "Quelle est la portée d'un GPS GNSS ?",
  "Comment choisir une station totale ?",
  "Quel drone est adapté à la cartographie ?",
];
