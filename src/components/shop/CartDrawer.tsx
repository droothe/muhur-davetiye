import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cartSubtotal, useStore } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { FREE_SHIPPING_THRESHOLD, QUANTITY_TIERS, formatTL, lineTotal, shippingFor, EXTRAS, type QuantityTier } from "@/lib/pricing";

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty } = useStore();
  const setCheckoutOpen = useUI((s) => s.setCheckoutOpen);
  const subtotal = cartSubtotal(cart);
  const shipping = shippingFor(subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col bg-background p-0 sm:max-w-md">
        <SheetHeader className="border-b p-6">
          <SheetTitle className="font-serif text-3xl font-medium">Sepetim</SheetTitle>
          <SheetDescription>{cart.length} ürün</SheetDescription>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-blush text-gold"><ShoppingBag /></span>
            <p className="font-serif text-2xl">Sepetiniz henüz boş</p>
            <Button variant="luxe" onClick={() => setCartOpen(false)}>Alışverişe Başla</Button>
          </div>
        ) : (
          <>
            <div className="px-6 pt-4">
              <p className="text-xs text-muted-foreground">
                {shipping === 0 ? "Ücretsiz kargo kazandınız ✓" : `Ücretsiz kargo için ${formatTL(FREE_SHIPPING_THRESHOLD - subtotal)} kaldı`}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-blush">
                <motion.div animate={{ width: `${progress}%` }} className="h-full bg-gradient-gold" />
              </div>
            </div>
            <ul className="flex-1 space-y-4 overflow-y-auto p-6">
              <AnimatePresence initial={false}>
                {cart.map((c) => (
                  <motion.li key={c.key} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} className="flex gap-4 rounded-2xl bg-paper p-3">
                    <img src={c.image} alt="" className="h-24 w-20 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-lg leading-tight">{c.title}</p>
                      <p className="truncate font-script text-lg text-gold">{c.personalization.bride} & {c.personalization.groom}</p>
                      {c.extras.length > 0 && <p className="truncate text-[11px] text-muted-foreground">{c.extras.map((e) => EXTRAS[e].label).join(", ")}</p>}
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <select value={c.qty} onChange={(e) => updateQty(c.key, Number(e.target.value) as QuantityTier)} aria-label="Adet" className="h-8 rounded-full border bg-background px-2 text-xs">
                          {QUANTITY_TIERS.map((t) => <option key={t} value={t}>{t} Adet</option>)}
                        </select>
                        <span className="text-sm font-semibold">{formatTL(lineTotal(c.basePrice, c.qty, c.extras))}</span>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(c.key)} aria-label="Kaldır" className="self-start rounded-full p-1.5 text-muted-foreground hover:bg-blush hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            <div className="space-y-2 border-t bg-paper p-6 text-sm">
              <Row l="Ara Toplam" r={formatTL(subtotal)} />
              <Row l="Kargo" r={shipping === 0 ? "Ücretsiz" : formatTL(shipping)} />
              <div className="flex justify-between pt-2 font-serif text-2xl"><span>Toplam</span><span>{formatTL(subtotal + shipping)}</span></div>
              <Button variant="gold" className="mt-3 h-12 w-full" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>Siparişi Tamamla</Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

const Row = ({ l, r }: { l: string; r: string }) => (
  <div className="flex justify-between text-muted-foreground"><span>{l}</span><span className="text-foreground">{r}</span></div>
);
