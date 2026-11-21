export const places = [
  "Casablanca",
  "Maarif, Casablanca",
  "Anfa, Casablanca",
  "Californie, Casablanca",
  "Ain Diab, Casablanca",
  "Racine, Casablanca",
  "Bouskoura, Casablanca",
  "Centre-Ville, Casablanca",
  "Ain Sebaa, Casablanca",
  "Dar Bouazza",
  "Marrakech",
  "Guéliz, Marrakech",
  "Hivernage, Marrakech",
  "Palmeraie, Marrakech",
  "Rabat",
  "Agdal, Rabat",
  "Souissi, Rabat",
  "Hassan, Rabat",
  "Tanger",
  "Malabata, Tanger",
  "Agadir",
  "Founty, Agadir",
  "Settat",
];

export const budgetSuggestions = [
  { label: "1 M", value: "1000000" },
  { label: "2 M", value: "2000000" },
  { label: "3 M", value: "3000000" },
  { label: "5 M", value: "5000000" },
  { label: "10 M", value: "10000000" },
];

export function filterPlaces(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return places.slice(0, 6);
  return places.filter((place) => place.toLowerCase().includes(q)).slice(0, 6);
}
