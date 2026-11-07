export const QUANTITY_TIERS = [100, 250, 500, 1000] as const;
export type QuantityTier = (typeof QUANTITY_TIERS)[number];

/** Per-piece discount by quantity tier. */
export const TIER_MULTIPLIER: Record<QuantityTier, number> = {
  100: 1,
  250: 0.92,
  500: 0.85,
  1000: 0.78,
};

export const EXTRAS = {
  waxSeal: { label: "Mühür (Balmumu)", perPiece: 4 },
  ribbon: { label: "Saten Kurdele", perPiece: 3 },
  goldFoil: { label: "Yaldız Baskı", perPiece: 5 },
} as const;
export type ExtraKey = keyof typeof EXTRAS;

export const FREE_SHIPPING_THRESHOLD = 2500;
export const SHIPPING_FEE = 149;

export function unitPrice(base: number, qty: QuantityTier, extras: ExtraKey[] = []) {
  const extra = extras.reduce((s, k) => s + EXTRAS[k].perPiece, 0);
  return Math.round((base * TIER_MULTIPLIER[qty] + extra) * 100) / 100;
}

export function lineTotal(base: number, qty: QuantityTier, extras: ExtraKey[] = []) {
  return Math.round(unitPrice(base, qty, extras) * qty * 100) / 100;
}

export function shippingFor(subtotal: number) {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

export const formatTL = (n: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 2 }).format(n);
