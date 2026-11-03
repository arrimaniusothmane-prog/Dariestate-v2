import { STOCK } from './imageLibrary';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  shortRole: string;
  city: string;
  bio: string;
  photo: string;
  phone: string;
  email: string;
  languages: string;
}

/** The real faces behind the atelier — used on the homepage, about and contact pages. */
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Youssef El Amrani',
    role: 'Associé fondateur & directeur général',
    shortRole: 'Fondateur',
    city: 'Casablanca',
    bio: "Quinze ans à accompagner des familles et des investisseurs. Youssef ouvre chaque projet par une conversation, un café, et une question simple : « comment voulez-vous vivre ici ? ».",
    photo: STOCK.team.youssef,
    phone: '+212 6 61 00 11 22',
    email: 'youssef@dar-atelier.ma',
    languages: 'Français, Arabe, Anglais',
  },
  {
    id: 'team-2',
    name: 'Leila Tazi',
    role: "Directrice de l'atelier design & architecture",
    shortRole: 'Architecture',
    city: 'Casablanca · Marrakech',
    bio: "Diplômée de l'École Spéciale d'Architecture de Paris, Leila dessine des intérieurs où le marbre, le bois et la lumière se répondent. Elle vous accompagne jusqu'au choix de la dernière poignée de porte.",
    photo: STOCK.team.leila,
    phone: '+212 6 64 77 88 99',
    email: 'leila@dar-atelier.ma',
    languages: 'Français, Arabe, Anglais',
  },
  {
    id: 'team-3',
    name: 'Mehdi Bennani',
    role: 'Directeur des chantiers & maîtrise d’œuvre',
    shortRole: 'Chantiers',
    city: 'Casablanca · Rabat',
    bio: "Ingénieur en génie civil, Mehdi passe sur chaque chantier au moins deux fois par semaine. C'est lui qui vous envoie les photos d'avancement et qui tient la promesse des délais.",
    photo: STOCK.team.mehdi,
    phone: '+212 6 63 55 66 77',
    email: 'mehdi@dar-atelier.ma',
    languages: 'Français, Arabe',
  },
  {
    id: 'team-4',
    name: 'Karim Alami',
    role: 'Conseiller immobilier de prestige',
    shortRole: 'Immobilier',
    city: 'Casablanca · Tanger',
    bio: "Karim connaît chaque quartier de la côte. Il organise vos visites privées, vous montre les biens sans pression et négocie avec discrétion, toujours dans votre intérêt.",
    photo: STOCK.team.karim,
    phone: '+212 6 62 33 44 55',
    email: 'karim@dar-atelier.ma',
    languages: 'Français, Arabe, Espagnol',
  },
];

export const ATELIER_VALUES = [
  {
    title: 'Un vrai interlocuteur',
    text: 'Pas de standard, pas de formulaire perdu. La personne qui répond est celle qui suivra votre projet du premier croquis à la remise des clés.',
  },
  {
    title: 'Des visites avec vous',
    text: 'Nous prenons le temps d’arpenter les lieux, d’imaginer vos matins et de vérifier ce qui ne se voit pas sur les photos.',
  },
  {
    title: 'La transparence, toujours',
    text: 'Budget clair, devis détaillé, photos de chantier régulières. Vous savez où en est votre projet, sans avoir à le demander.',
  },
];
