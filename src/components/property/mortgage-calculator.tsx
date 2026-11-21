"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/utils";

export function MortgageCalculator({ price }: { price: number }) {
  const [apport, setApport] = useState(Math.round(price * 0.2));
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(4.5);

  const monthly = useMemo(() => {
    const principal = Math.max(price - apport, 0);
    const monthlyRate = rate / 100 / 12;
    const n = years * 12;
    if (principal <= 0) return 0;
    if (monthlyRate === 0) return principal / n;
    return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
  }, [price, apport, years, rate]);

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-semibold">Simulateur de crédit</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Estimation en dirhams, hors assurance. Le taux définitif dépend de la banque.
      </p>
      <div className="mt-4 grid gap-4 rounded-2xl border border-border/60 bg-card p-5 sm:grid-cols-3">
        <Field label="Apport (MAD)" value={apport} min={0} max={price} step={50000} onChange={setApport} />
        <Field label="Durée (années)" value={years} min={5} max={25} step={1} onChange={setYears} />
        <Field label="Taux (%)" value={rate} min={2} max={8} step={0.1} onChange={setRate} />
        <div className="sm:col-span-3">
          <p className="text-sm text-muted-foreground">Mensualité estimée</p>
          <p className="tnum mt-1 text-2xl font-semibold text-hof">{formatPrice(Math.round(monthly))}</p>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-hof">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </label>
  );
}
