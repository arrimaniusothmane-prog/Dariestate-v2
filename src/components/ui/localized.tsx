"use client";

import { useI18n } from "@/components/providers/i18n-provider";

export function LocalizedHeading({
  k,
  className,
}: {
  k: string;
  className?: string;
}) {
  const { t } = useI18n();
  return <h2 className={className}>{t(k)}</h2>;
}

export function LocalizedText({
  k,
  className,
}: {
  k: string;
  className?: string;
}) {
  const { t } = useI18n();
  return <p className={className}>{t(k)}</p>;
}

export function HeroTitle({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <h2 className={className}>
      {t("hero.headline")}{" "}
      <span className="text-rausch hero-accent">{t("hero.headlineAccent")}</span>
    </h2>
  );
}
