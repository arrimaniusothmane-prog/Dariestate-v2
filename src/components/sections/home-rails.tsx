"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { NotifyForm } from "@/components/forms/notify-form";

export type RailItem = {
  label: string;
  href: string;
  image: string;
  count: number;
};

export function HomeRail({ items }: { items: RailItem[] }) {
  return (
    <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
      {items.map((item) => (
        <RailCard key={item.label} item={item} />
      ))}
    </div>
  );
}

function RailCard({ item }: { item: RailItem }) {
  const [alert, setAlert] = useState(false);
  const empty = item.count === 0;

  const media = (
    <>
      <Image
        src={item.image}
        alt={item.label}
        fill
        sizes="(max-width: 768px) 50vw, 20vw"
        quality={68}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/88 via-[#0a0a0a]/20 to-transparent" />
    </>
  );

  return (
    <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-deco">
      {empty ? (
        <button
          type="button"
          onClick={() => setAlert((value) => !value)}
          className="absolute inset-0 text-left"
          aria-expanded={alert}
        >
          {media}
        </button>
      ) : (
        <Link href={item.href} className="absolute inset-0">
          {media}
          <span className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-md">
            <ArrowUpRight className="size-4" />
          </span>
        </Link>
      )}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
        <span className="block text-base font-semibold text-white">{item.label}</span>
        <span className="mt-0.5 block text-xs text-white/80">
          {empty ? "Bientôt disponible" : `${item.count} biens`}
        </span>
      </span>
      {empty && alert && (
        <div className="absolute inset-x-3 bottom-16 z-10">
          <NotifyForm subject={item.label} compact />
        </div>
      )}
    </div>
  );
}
