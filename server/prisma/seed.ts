import { PrismaClient } from '@prisma/client';
import { UserRole, PropertyType, TransactionType, PropertyStatus, InquiryStatus, Priority, QuoteStatus, ConstructionStatus, DesignCategory } from '../src/types/enums.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Prisma's SQLite connector does not support scalar lists or Json fields.
// The API therefore stores array fields as JSON strings and parses them on read.
function serializeStringArray(values: string[]): string {
  return JSON.stringify(values);
}

let referenceSequence = 0;

function propertyReference(prefix: string): string {
  referenceSequence += 1;
  return `DAR-${prefix}-${new Date().getFullYear()}-${String(referenceSequence).padStart(4, '0')}`;
}

async function main() {
  console.log('Seeding DAR & ATELIER database...');

  // 1. Password hashing
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('AdminSecure2025!', salt);
  const staffPassword = await bcrypt.hash('StaffSecure2025!', salt);
  const clientPassword = await bcrypt.hash('ClientSecure2025!', salt);

  // Clean existing data
  await prisma.activityLog.deleteMany();
  await prisma.inquiryNote.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.quoteRequest.deleteMany();
  await prisma.constructionMilestone.deleteMany();
  await prisma.constructionProject.deleteMany();
  await prisma.propertyFeature.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.property.deleteMany();
  await prisma.designProject.deleteMany();
  await prisma.review.deleteMany();
  await prisma.companySettings.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@dar-atelier.ma',
      passwordHash: adminPassword,
      name: 'Youssef El Amrani',
      phone: '+212 6 61 00 11 22',
      role: UserRole.SUPER_ADMIN,
      isEmailVerified: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
  });

  const agent = await prisma.user.create({
    data: {
      email: 'karim.alami@dar-atelier.ma',
      passwordHash: staffPassword,
      name: 'Karim Alami',
      phone: '+212 6 62 33 44 55',
      role: UserRole.AGENT,
      isEmailVerified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
  });

  const constructionManager = await prisma.user.create({
    data: {
      email: 'mehdi.bennani@dar-atelier.ma',
      passwordHash: staffPassword,
      name: 'Ing. Mehdi Bennani',
      phone: '+212 6 63 55 66 77',
      role: UserRole.CONSTRUCTION_MANAGER,
      isEmailVerified: true,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
  });

  const interiorDesigner = await prisma.user.create({
    data: {
      email: 'leila.tazi@dar-atelier.ma',
      passwordHash: staffPassword,
      name: 'Architecte Leila Tazi',
      phone: '+212 6 64 77 88 99',
      role: UserRole.INTERIOR_DESIGNER,
      isEmailVerified: true,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
  });

  const clientUser = await prisma.user.create({
    data: {
      email: 'client@example.com',
      passwordHash: clientPassword,
      name: 'Dr. Omar Kabbaj',
      phone: '+212 6 61 88 99 00',
      role: UserRole.CLIENT,
      isEmailVerified: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    },
  });

  console.log('Created 5 staff and client users.');

  // 3. Properties
  const prop1 = await prisma.property.create({
    data: {
      title: 'Villa Al Manara — Panorama Océan & Architecture Minimaliste',
      slug: 'villa-al-manara-anfa-superieur-casablanca',
      reference: propertyReference('V'),
      description: 'Chef-d’œuvre d’architecture contemporaine érigé sur les hauteurs d’Anfa Supérieur. Volumes magistraux baignés de lumière naturelle, finitions en marbre d’Oued Ykem et noyer massif. Piscine à débordement suspendue vers l’Atlantique, domotique intégrale Lutron, et suite de maître d’exception.',
      type: PropertyType.VILLA,
      transactionType: TransactionType.BUY,
      price: 18500000,
      currency: 'MAD',
      city: 'Casablanca',
      neighborhood: 'Anfa Supérieur',
      address: 'Avenue des Crêtes, Anfa Supérieur',
      surfaceArea: 780,
      bedrooms: 5,
      bathrooms: 6,
      status: PropertyStatus.AVAILABLE,
      isPublished: true,
      isFeatured: true,
      coverImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=85',
      energyRating: 'A+',
      yearBuilt: 2024,
      metaTitle: 'Villa Al Manara Anfa Supérieur | DAR & ATELIER',
      metaDescription: 'Superbe villa d’architecte de 780m² avec vue panoramique sur l’océan à Casablanca.',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=85', alt: 'Façade contemporaine et piscine', isCover: true, order: 0 },
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85', alt: 'Salon monumental ouvert sur le jardin', order: 1 },
          { url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85', alt: 'Cuisine haut de gamme avec îlot en quartz', order: 2 },
          { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85', alt: 'Suite parentale avec terrasse privative', order: 3 },
        ],
      },
      features: {
        create: [
          { name: 'Piscine à débordement chauffée' },
          { name: 'Vue panoramique sur l’Atlantique' },
          { name: 'Système domotique Lutron & sono Sonos' },
          { name: 'Hammam traditionnel et espace bien-être' },
          { name: 'Ascenseur vitré privatif' },
          { name: 'Garage fermé pour 4 véhicules' },
          { name: 'Logement pour le personnel' },
        ],
      },
    },
  });

  const prop2 = await prisma.property.create({
    data: {
      title: 'Palais des Oliviers — Quintessence Orientale & Confort Moderne',
      slug: 'palais-des-oliviers-palmeraie-marrakech',
      reference: propertyReference('V'),
      description: 'Somptueuse propriété nichée au cœur d’un hectare d’oliviers centenaires dans la prestigieuse Palmeraie de Marrakech. Alliance subtile du savoir-faire artisanal marocain (zelliges géométriques ciselés main, plafonds de cèdre) et des équipements les plus modernes.',
      type: PropertyType.VILLA,
      transactionType: TransactionType.BUY,
      price: 29000000,
      currency: 'MAD',
      city: 'Marrakech',
      neighborhood: 'La Palmeraie',
      address: 'Circuit de la Palmeraie, Marrakech',
      surfaceArea: 1450,
      bedrooms: 7,
      bathrooms: 8,
      status: PropertyStatus.AVAILABLE,
      isPublished: true,
      isFeatured: true,
      coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
      energyRating: 'A',
      yearBuilt: 2023,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85', alt: 'Palais et parc arboré', isCover: true, order: 0 },
          { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85', alt: 'Patio avec fontaine en marbre', order: 1 },
          { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=85', alt: 'Spa privatif et salle de massage', order: 2 },
        ],
      },
      features: {
        create: [
          { name: 'Parc privé arboré de 10 000 m²' },
          { name: 'Piscine semi-olympique de 25m' },
          { name: 'Court de tennis en terre battue' },
          { name: 'Spa privatif, hammam et sauna' },
          { name: 'Pavillon d’invités indépendant' },
          { name: 'Système d’irrigation écologique' },
        ],
      },
    },
  });

  const prop3 = await prisma.property.create({
    data: {
      title: 'Penthouse L’Horizon — Vue 360° sur la Marina & l’Océan',
      slug: 'penthouse-lhorizon-marina-casablanca',
      reference: propertyReference('P'),
      description: 'Perché au dernier étage d’une tour emblématique de la Marina de Casablanca, ce penthouse d’exception offre des panoramas époustouflants sur la grande mosquée Hassan II et le grand large. Terrasses paysagées de 120m² avec jacuzzi extérieur.',
      type: PropertyType.PENTHOUSE,
      transactionType: TransactionType.BUY,
      price: 8400000,
      currency: 'MAD',
      city: 'Casablanca',
      neighborhood: 'Marina Casablanca',
      address: 'Boulevard des Almohades, Marina',
      surfaceArea: 340,
      bedrooms: 3,
      bathrooms: 4,
      status: PropertyStatus.AVAILABLE,
      isPublished: true,
      isFeatured: true,
      coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=85',
      energyRating: 'A',
      yearBuilt: 2024,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=85', alt: 'Séjour baigné de lumière', isCover: true, order: 0 },
          { url: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1600&q=85', alt: 'Terrasse avec jacuzzi vue mer', order: 1 },
        ],
      },
      features: {
        create: [
          { name: 'Grande terrasse avec jacuzzi suspendu' },
          { name: 'Sécurité 24/7 et conciergerie VIP' },
          { name: '2 places de parking sous-sol sécurisé' },
          { name: 'Cuisine Boffi entièrement équipée' },
          { name: 'Climatisation réversible Daikin' },
        ],
      },
    },
  });

  const prop4 = await prisma.property.create({
    data: {
      title: 'Villa Serenity — Lignes Épurées & Jardin d’Eden à Souissi',
      slug: 'villa-serenity-souissi-rabat',
      reference: propertyReference('V'),
      description: 'Dans le quartier diplomatique le plus recherché de la capitale, cette villa de plain-pied et R+1 combine intimité absolue et architecture bioclimatique. Grands vitrages sans montants, piscine chauffée en pierre de Bali.',
      type: PropertyType.VILLA,
      transactionType: TransactionType.BUY,
      price: 14200000,
      currency: 'MAD',
      city: 'Rabat',
      neighborhood: 'Souissi',
      address: 'Avenue Mohammed VI, Souissi',
      surfaceArea: 820,
      bedrooms: 5,
      bathrooms: 5,
      status: PropertyStatus.AVAILABLE,
      isPublished: true,
      isFeatured: false,
      coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
      energyRating: 'A+',
      yearBuilt: 2023,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85', alt: 'Villa Souissi', isCover: true, order: 0 },
        ],
      },
      features: {
        create: [
          { name: 'Piscine en pierre naturelle de Bali' },
          { name: 'Panneaux solaires photovoltaïques' },
          { name: 'Système d’alarme périmétrique' },
          { name: 'Cuisine d’été et pool house' },
        ],
      },
    },
  });

  const prop5 = await prisma.property.create({
    data: {
      title: 'Résidence Bel-Air — Appartement de Prestige en Front de Mer',
      slug: 'residence-bel-air-malabata-tanger',
      reference: propertyReference('A'),
      description: 'À louer : élégant appartement d’architecte surplombant la baie de Tanger et le détroit de Gibraltar. Décoré avec raffinement, matériaux nobles, service de conciergerie haut de gamme.',
      type: PropertyType.APARTMENT,
      transactionType: TransactionType.RENT,
      price: 28000,
      currency: 'MAD',
      city: 'Tanger',
      neighborhood: 'Malabata',
      address: 'Corniche de Malabata, Tanger',
      surfaceArea: 185,
      bedrooms: 3,
      bathrooms: 2,
      status: PropertyStatus.AVAILABLE,
      isPublished: true,
      isFeatured: true,
      coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
      energyRating: 'B',
      yearBuilt: 2024,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85', alt: 'Appartement Malabata Tanger', isCover: true, order: 0 },
        ],
      },
      features: {
        create: [
          { name: 'Vue imprenable sur le détroit' },
          { name: 'Entièrement meublé par un designer' },
          { name: 'Accès direct à la promenade côtière' },
          { name: 'Service de ménage et conciergerie inclus' },
        ],
      },
    },
  });

  const prop6 = await prisma.property.create({
    data: {
      title: 'Domaine de la Forêt — Villa Contemporaine en Lisière Boisée',
      slug: 'domaine-de-la-foret-bouskoura-casablanca',
      reference: propertyReference('V'),
      description: 'Havre de paix à seulement 15 minutes du centre d’affaires CFC. Villa contemporaine nichée dans la verdure de Bouskoura, conçue pour une vie de famille sereine et des réceptions prestigieuses.',
      type: PropertyType.VILLA,
      transactionType: TransactionType.BUY,
      price: 9800000,
      currency: 'MAD',
      city: 'Casablanca',
      neighborhood: 'Bouskoura Golf City',
      address: 'Route de Bouskoura, Casablanca',
      surfaceArea: 540,
      bedrooms: 4,
      bathrooms: 4,
      status: PropertyStatus.AVAILABLE,
      isPublished: true,
      isFeatured: false,
      coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
      energyRating: 'A',
      yearBuilt: 2023,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85', alt: 'Jardin et piscine Bouskoura', isCover: true, order: 0 },
        ],
      },
      features: {
        create: [
          { name: 'Proximité immédiate du golf 18 trous' },
          { name: 'Jardin paysager avec oliviers et palmiers' },
          { name: 'Cheminée contemporaine au bioéthanol' },
          { name: 'Domotique complète et surveillance HD' },
        ],
      },
    },
  });

  console.log('Created 6 luxury properties with images and amenities.');

  // 4. Construction Projects
  const proj1 = await prisma.constructionProject.create({
    data: {
      title: 'Villa K — Construction Neuve Bioclimatique',
      clientName: 'M. Rachid Benjelloun',
      clientEmail: 'r.benjelloun@example.com',
      clientPhone: '+212 6 61 12 34 56',
      category: 'Villa Contemporaine Haut Standing',
      location: 'Anfa Supérieur, Casablanca',
      contractAmount: 13500000,
      startDate: new Date('2024-03-01'),
      expectedCompletionDate: new Date('2025-08-30'),
      status: ConstructionStatus.STRUCTURE,
      progressPercentage: 65,
      projectManagerId: constructionManager.id,
      coverImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1600&q=85',
      description: 'Chantier clé en main comprenant terrassement rocheux, structure en béton armé post-contraint, pose des façades rideaux en double vitrage thermique et préparation du second œuvre.',
      milestones: {
        create: [
          { title: 'Études architecturales et permis de construire', isCompleted: true, order: 1, targetDate: new Date('2024-02-15'), completedDate: new Date('2024-02-10') },
          { title: 'Terrassement et fondations spéciales', isCompleted: true, order: 2, targetDate: new Date('2024-05-30'), completedDate: new Date('2024-05-25') },
          { title: 'Gros œuvre et élévation des 2 niveaux', isCompleted: true, order: 3, targetDate: new Date('2024-11-15'), completedDate: new Date('2024-11-10') },
          { title: 'Étanchéité et menuiseries aluminium minimalistes', isCompleted: false, order: 4, targetDate: new Date('2025-02-28') },
          { title: 'Revêtements intérieurs marbre et second œuvre', isCompleted: false, order: 5, targetDate: new Date('2025-05-31') },
          { title: 'Aménagements extérieurs et livraison finale', isCompleted: false, order: 6, targetDate: new Date('2025-08-30') },
        ],
      },
    },
  });

  const proj2 = await prisma.constructionProject.create({
    data: {
      title: 'Domaine Oasis — Rénovation Intégrale et Extension',
      clientName: 'Mme Sofia Chraibi',
      clientEmail: 's.chraibi@example.com',
      clientPhone: '+212 6 62 88 77 66',
      category: 'Rénovation & Restructuration Lourde',
      location: 'La Palmeraie, Marrakech',
      contractAmount: 8900000,
      startDate: new Date('2024-06-15'),
      expectedCompletionDate: new Date('2025-04-15'),
      status: ConstructionStatus.FINISHING,
      progressPercentage: 82,
      projectManagerId: constructionManager.id,
      coverImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85',
      description: 'Transformation complète d’une propriété traditionnelle en un complexe résidentiel contemporain avec pavillon bien-être et piscine miroir.',
      milestones: {
        create: [
          { title: 'Démolition sélective et confortement structurel', isCompleted: true, order: 1, targetDate: new Date('2024-08-01'), completedDate: new Date('2024-07-28') },
          { title: 'Nouvelle plomberie et réseau électrique basse consommation', isCompleted: true, order: 2, targetDate: new Date('2024-10-15'), completedDate: new Date('2024-10-12') },
          { title: 'Pose du tadelakt traditionnel et parquets en chêne', isCompleted: true, order: 3, targetDate: new Date('2024-12-20'), completedDate: new Date('2024-12-18') },
          { title: 'Finitions intérieures et luminaires intégrés', isCompleted: false, order: 4, targetDate: new Date('2025-03-15') },
          { title: 'Livraison réception sans réserve', isCompleted: false, order: 5, targetDate: new Date('2025-04-15') },
        ],
      },
    },
  });

  console.log('Created construction projects with progress milestones.');

  // 5. Design Projects (Portfolio)
  await prisma.designProject.create({
    data: {
      title: 'Salon Monumental & Noyer Sculpté — Villa Anfa',
      slug: 'salon-monumental-noyer-sculpte-villa-anfa',
      category: DesignCategory.LIVING_ROOM,
      location: 'Casablanca',
      surfaceArea: 140,
      year: 2024,
      description: 'Conception d’un espace de réception contemporain mêlant claustras verticaux en noyer d’Amérique, cheminée centrale suspendue et mobilier sur mesure habillé de bouclettes Pierre Frey.',
      designApproach: 'Privilégier la fluidité des circulations et l’acoustique feutrée grâce à des panneaux bois micro-perforés intégrés.',
      materials: serializeStringArray(['Noyer d’Amérique', 'Pierre calcaire de Bourgogne', 'Laiton brossé', 'Tissus Pierre Frey']),
      coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
      galleryImages: serializeStringArray([
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
      ]),
      isFeatured: true,
      isPublished: true,
    },
  });

  await prisma.designProject.create({
    data: {
      title: 'Cuisine Monolithe & Marbre Noir Marquina',
      slug: 'cuisine-monolithe-marbre-noir-marquina',
      category: DesignCategory.KITCHEN,
      location: 'Marrakech',
      surfaceArea: 65,
      year: 2024,
      description: 'Îlot central sculpté en marbre Nero Marquina avec découpes invisibles et cuisson à induction sous plan TPB Tech.',
      designApproach: 'Épure totale : dissimulation de tout l’électroménager derrière des parois affleurantes en laque mate anti-traces.',
      materials: serializeStringArray(['Marbre Nero Marquina', 'Chêne teinté sombre', 'Inox brossé mat']),
      coverImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
      galleryImages: serializeStringArray([
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
      ]),
      isFeatured: true,
      isPublished: true,
    },
  });

  await prisma.designProject.create({
    data: {
      title: 'Hammam Privatif & Espace Bien-être Minéral',
      slug: 'hammam-privatif-espace-bien-etre-mineral',
      category: DesignCategory.BATHROOM,
      location: 'Rabat',
      surfaceArea: 48,
      year: 2024,
      description: 'Réinterprétation architecturale du rituel marocain du hammam avec voûte douce en tadelakt gris perle et banquettes chauffantes.',
      designApproach: 'Lumière rasante indirecte et jeu d’ombres pour une atmosphère contemplative et régénérante.',
      materials: serializeStringArray(['Tadelakt artisanal', 'Marbre vert d’Oued Zem', 'Robinetterie Vola en bronze fumé']),
      coverImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=85',
      galleryImages: serializeStringArray([
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=85',
      ]),
      isFeatured: true,
      isPublished: true,
    },
  });

  console.log('Created design portfolio projects.');

  // 6. Inquiries (CRM Leads)
  await prisma.inquiry.create({
    data: {
      name: 'Amine Guessous',
      email: 'a.guessous@holding-invest.ma',
      phone: '+212 6 61 45 67 89',
      propertyId: prop1.id,
      subject: 'Demande de visite privée — Villa Al Manara',
      message: 'Bonjour, je souhaiterais organiser une visite confidentielle de la villa ce jeudi en fin d’après-midi avec mon architecte conseil.',
      preferredContactMethod: 'PHONE',
      source: 'SITE_WEB_DETAIL_BIEN',
      priority: Priority.HIGH,
      status: InquiryStatus.VISIT_SCHEDULED,
      assignedToId: agent.id,
      followUpDate: new Date(Date.now() + 86400000 * 2),
      notes: {
        create: [
          { authorId: agent.id, content: 'Client vérifié, capacité de financement confirmée. Visite confirmée pour jeudi 16h.' },
        ],
      },
    },
  });

  await prisma.inquiry.create({
    data: {
      name: 'Nadia Bernoussi',
      email: 'nadia.bernoussi@gmail.com',
      phone: '+212 6 63 11 22 33',
      propertyId: prop3.id,
      subject: 'Renseignements Penthouse Marina',
      message: 'Intéressée par le penthouse à la Marina, pourriez-vous me transmettre le dossier technique complet et les charges de copropriété ?',
      preferredContactMethod: 'EMAIL',
      source: 'CATALOGUE_IMMOBILIER',
      priority: Priority.MEDIUM,
      status: InquiryStatus.CONTACTED,
      assignedToId: agent.id,
      followUpDate: new Date(Date.now() + 86400000 * 3),
    },
  });

  // 7. Quote Requests
  await prisma.quoteRequest.create({
    data: {
      fullName: 'Tariq Mansouri',
      email: 'tariq.mansouri@globaltech.ma',
      phone: '+212 6 61 99 88 77',
      city: 'Casablanca (Bouskoura)',
      projectType: 'VILLA_CONSTRUCTION',
      plotSize: 1200,
      estimatedArea: 650,
      numberOfFloors: 2,
      budgetRange: '10M - 15M MAD',
      expectedStartDate: 'T2 2025',
      description: 'Nous avons acquis un terrain viabilisé en lisière du golf de Bouskoura. Nous cherchons un contractant général d’élite pour concevoir les plans d’architecte et assurer la construction clé en main avec piscine et sous-sol aménagé.',
      status: QuoteStatus.SITE_VISIT_REQUIRED,
      proposedPrice: 12800000,
      assignedToId: constructionManager.id,
      internalNotes: 'Topographie du terrain vérifiée. Visite sur site prévue avec l’ingénieur géomètre vendredi matin.',
    },
  });

  await prisma.quoteRequest.create({
    data: {
      fullName: 'Hajar Lahlou',
      email: 'hajar.lahlou@creadesign.ma',
      phone: '+212 6 64 55 44 33',
      city: 'Rabat',
      projectType: 'INTERIOR_DESIGN',
      plotSize: null,
      estimatedArea: 280,
      numberOfFloors: 1,
      budgetRange: '1.5M - 2.5M MAD',
      expectedStartDate: 'Immédiat',
      description: 'Rénovation et aménagement intérieur d’un grand appartement de standing situé au Haut Agdal. Réfection de la cuisine, salon double, suite parentale et boiseries murales.',
      status: QuoteStatus.QUOTE_PREPARED,
      proposedPrice: 1850000,
      assignedToId: interiorDesigner.id,
      internalNotes: 'Moodboards et sélection des matériaux validés par Leila Tazi. Devis chiffré prêt à l’envoi.',
    },
  });

  // 8. Reviews (Genuine Demonstration Testimonials)
  await prisma.review.create({
    data: {
      clientName: 'M. & Mme El Fassi',
      clientRole: 'Propriétaires Villa Anfa',
      rating: 5,
      comment: 'La réalisation de notre villa à Anfa par DAR & ATELIER a dépassé toutes nos attentes. Rigueur de la maîtrise d’ouvrage, respect scrupuleux du planning et une sensibilité architecturale d’une rare élégance.',
      projectType: 'Construction Villa Clé en Main',
      isVerified: true,
      isPublished: true,
    },
  });

  await prisma.review.create({
    data: {
      clientName: 'Karim Bouziane',
      clientRole: 'Acquéreur Penthouse Marina',
      rating: 5,
      comment: 'Un accompagnement discret, précis et hautement professionnel pour l’acquisition de notre penthouse. Chaque détail technique a été anticipé avec un sens du service irréprochable.',
      projectType: 'Transaction Immobilière de Prestige',
      isVerified: true,
      isPublished: true,
    },
  });

  await prisma.review.create({
    data: {
      clientName: 'Dr. Kenza Naciri',
      clientRole: 'Propriétaire Résidence Palmeraie',
      rating: 5,
      comment: 'L’équipe d’architecture d’intérieur a su magnifier les volumes de notre propriété en alliant matériaux nobles marocains et design contemporain. Une collaboration passionnante.',
      projectType: 'Architecture d’Intérieur & Mobilier',
      isVerified: true,
      isPublished: true,
    },
  });

  // 9. Company Settings
  await prisma.companySettings.create({
    data: {
      id: 'default',
      companyName: 'DAR & ATELIER Architecture & Immobilier',
      logoUrl: '/logo.svg',
      email: 'contact@dar-atelier.ma',
      phone: '+212 5 22 45 80 90',
      whatsapp: '+212 6 61 23 45 67',
      address: 'Boulevard d’Anfa, Tour Casablanca Finance City, Étage 14',
      city: 'Casablanca',
      country: 'Maroc',
      defaultCurrency: 'MAD',
      defaultLanguage: 'fr',
      facebookUrl: 'https://facebook.com/daratelier.ma',
      instagramUrl: 'https://instagram.com/daratelier.ma',
      linkedinUrl: 'https://linkedin.com/company/daratelier',
      metaTitle: 'DAR & ATELIER | Immobilier de Prestige & Construction au Maroc',
      metaDescription: 'Villas d’architectes, appartements de luxe et maîtrise d’œuvre de construction haut standing à Casablanca, Marrakech, Rabat et Tanger.',
      emailNotificationsEnabled: true,
    },
  });

  console.log('Database seeded successfully with premium Moroccan architectural & real estate records.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
