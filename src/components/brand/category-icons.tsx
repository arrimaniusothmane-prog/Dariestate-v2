import type { ReactElement, SVGProps } from "react";
import { PropertyCategory } from "@/types";
import { cn } from "@/lib/utils";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

function base(props: IconProps) {
  const { className, ...rest } = props;
  return {
    className: cn("size-5", className),
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    ...rest,
  };
}

export function IconVilla(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10.5V20h14v-9.5" />
      <path d="M10 20v-5h4v5" />
      <path d="M9 8.5h6" />
    </svg>
  );
}

export function IconApartment(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
    </svg>
  );
}

export function IconHouse(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v10h12V10" />
      <path d="M10 20v-4h4v4" />
    </svg>
  );
}

export function IconLand(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 18h18" />
      <path d="M5 18 9 9l4 5 3-4 3 8" />
      <circle cx="17" cy="7" r="1.5" />
    </svg>
  );
}

export function IconCommercial(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 20V8l8-4 8 4v12" />
      <path d="M9 20v-6h6v6" />
      <path d="M9 11h.01M15 11h.01M12 11h.01" />
    </svg>
  );
}

export const categoryIcon: Record<
  PropertyCategory,
  (props: IconProps) => ReactElement
> = {
  [PropertyCategory.VILLA]: IconVilla,
  [PropertyCategory.APARTMENT]: IconApartment,
  [PropertyCategory.HOUSE]: IconHouse,
  [PropertyCategory.LAND]: IconLand,
  [PropertyCategory.COMMERCIAL]: IconCommercial,
};
