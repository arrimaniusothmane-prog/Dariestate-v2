"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building2, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { budgetSuggestions, filterPlaces } from "@/lib/places";
import { useI18n } from "@/components/providers/i18n-provider";

const propertyTypes = [
  { value: "", label: "Tous les biens" },
  { value: "VILLA", label: "Villa" },
  { value: "APARTMENT", label: "Appartement" },
  { value: "HOUSE", label: "Maison" },
  { value: "LAND", label: "Terrain" },
  { value: "COMMERCIAL", label: "Commercial" },
];

const copy = {
  fr: {
    buy: "Acheter",
    rent: "Louer",
    where: "Où",
    type: "Type",
    budget: "Budget max",
    search: "Rechercher",
    shortcuts: [
      { href: "/properties?category=VILLA&city=Marrakech", label: "Villas à Marrakech" },
      { href: "/properties?category=APARTMENT&city=Casablanca", label: "Appartements Casablanca" },
      { href: "/properties?category=LAND", label: "Terrains" },
    ],
  },
  en: {
    buy: "Buy",
    rent: "Rent",
    where: "Where",
    type: "Type",
    budget: "Max budget",
    search: "Search",
    shortcuts: [
      { href: "/properties?category=VILLA&city=Marrakech", label: "Villas in Marrakech" },
      { href: "/properties?category=APARTMENT&city=Casablanca", label: "Casablanca apartments" },
      { href: "/properties?category=LAND", label: "Land" },
    ],
  },
  ar: {
    buy: "شراء",
    rent: "كراء",
    where: "أين",
    type: "النوع",
    budget: "الميزانية",
    search: "بحث",
    shortcuts: [
      { href: "/properties?category=VILLA&city=Marrakech", label: "فيلات مراكش" },
      { href: "/properties?category=APARTMENT&city=Casablanca", label: "شقق الدار البيضاء" },
      { href: "/properties?category=LAND", label: "أراضٍ" },
    ],
  },
};

export function HeroSearch() {
  const { locale } = useI18n();
  const text = copy[locale];
  const [intent, setIntent] = useState<"sale" | "rent">("sale");
  const [city, setCity] = useState("");
  const [openPlaces, setOpenPlaces] = useState(false);
  const [type, setType] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const router = useRouter();
  const suggestions = useMemo(() => filterPlaces(city), [city]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("intent", intent);
    if (city) params.set("city", city);
    if (type) params.set("category", type);
    if (maxBudget) params.set("maxPrice", maxBudget);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="flex w-full max-w-[920px] flex-col items-center gap-4">
      <div className="flex rounded-full bg-white/15 p-1.5 backdrop-blur-md" role="tablist" aria-label="Acheter ou louer">
        {(["sale", "rent"] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={intent === value}
            onClick={() => setIntent(value)}
            className={cn(
              "rounded-full px-6 py-2 text-sm font-semibold transition-colors",
              intent === value ? "bg-white text-hof shadow-sm" : "text-white/90 hover:text-white"
            )}
          >
            {value === "sale" ? text.buy : text.rent}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="hero-search shadow-search flex w-full items-center gap-1 rounded-full bg-white p-2 sm:gap-0 sm:p-1.5"
        role="search"
      >
        <label className="relative flex min-w-0 flex-1 items-center gap-2 rounded-full px-3 py-2.5 hover:bg-faint focus-within:bg-faint sm:py-3.5 sm:pl-6">
          <MapPin className="size-4 shrink-0 text-hof/70" />
          <span className="flex min-w-0 flex-col">
            <span className="text-[10px] font-semibold text-hof sm:text-xs">{text.where}</span>
            <input
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setOpenPlaces(true);
              }}
              onFocus={() => setOpenPlaces(true)}
              onBlur={() => setTimeout(() => setOpenPlaces(false), 120)}
              placeholder="Maarif, Guéliz, Agdal…"
              className="w-full bg-transparent text-sm text-hof outline-none placeholder:text-grey-500"
              autoComplete="off"
              aria-autocomplete="list"
              aria-expanded={openPlaces}
            />
          </span>
          {openPlaces && suggestions.length > 0 && (
            <ul className="absolute left-0 top-[calc(100%+8px)] z-20 w-full overflow-hidden rounded-2xl border border-line bg-white py-1 text-left shadow-dropdown">
              {suggestions.map((place) => (
                <li key={place}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setCity(place);
                      setOpenPlaces(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-hof hover:bg-faint"
                  >
                    {place}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </label>
        <div className="hidden h-8 w-px shrink-0 bg-line sm:block" />
        <label className="flex min-w-0 flex-1 items-center gap-2 px-2 py-2.5 sm:px-4 sm:py-3.5">
          <Building2 className="size-4 shrink-0 text-hof/70" />
          <span className="flex min-w-0 flex-col">
            <span className="text-[10px] font-semibold text-hof sm:text-xs">{text.type}</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-transparent text-sm text-hof outline-none"
            >
              {propertyTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </span>
        </label>
        <div className="hidden h-8 w-px shrink-0 bg-line sm:block" />
        <label className="hidden min-w-0 flex-1 items-center gap-2 px-4 py-3.5 sm:flex">
          <Wallet className="size-4 shrink-0 text-hof/70" />
          <span className="flex min-w-0 flex-col">
            <span className="text-xs font-semibold text-hof">{text.budget}</span>
            <select
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="w-full bg-transparent text-sm text-hof outline-none"
            >
              <option value="">Tous les budgets</option>
              {budgetSuggestions.map((item) => (
                <option key={item.value} value={item.value}>
                  Jusqu’à {item.label} MAD
                </option>
              ))}
            </select>
          </span>
        </label>
        <button
          type="submit"
          aria-label={text.search}
          className="mr-1 flex size-11 shrink-0 items-center justify-center rounded-full bg-[#111111] text-white transition-colors hover:bg-rausch focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:mr-2 sm:size-12"
        >
          <Search className="size-5" strokeWidth={2.5} />
        </button>
      </form>

      <div className="flex flex-wrap justify-center gap-2">
        {text.shortcuts.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
