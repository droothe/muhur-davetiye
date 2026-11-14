import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cartSubtotal, useStore, type Order } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { formatTL, lineTotal, shippingFor } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const PAYMENTS: Order["payment"][] = ["Kapıda Ödeme", "Kredi Kartı", "Havale / EFT"];
const inp = "h-10 w-full rounded-xl border bg-paper px-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20";

export function Checkout() {
  const { checkoutOpen, setCheckoutOpen } = useUI();
  const { cart, placeOrder } = useStore();
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "İstanbul", address: "" });
  const [payment, setPayment] = useState<Order["payment"]>("Kapıda Ödeme");
  const [done, setDone] = useState<Order | null>(null);
  const subtotal = cartSubtotal(cart);
  const shipping = shippingFor(subtotal);
  const valid = form.name.trim() && /^[0-9 +()-]{10,}$/.test(form.phone) && /\S+@\S+\.\S+/.test(form.email) && form.address.trim().length > 8;

  const close = (o: boolean) => {
    setCheckoutOpen(o);
    if (!o) setDone(null);
  };

  return (
    <Dialog open={checkoutOpen} onOpenChange={close}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto bg-background sm:rounded-3xl">
        {done ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 py-8 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-gold" />
            <DialogTitle className="font-serif text-4xl font-medium">Teşekkür ederiz!</DialogTitle>
            <DialogDescription>
              Sipariş numaranız <strong className="text-foreground">{done.id}</strong>. Grafik tasarımınız 24 saat içinde WhatsApp ve e-posta ile onayınıza sunulacak.
            </DialogDescription>
            <p className="font-serif text-2xl">{formatTL(done.total)} · {done.payment}</p>
            <Button variant="luxe" onClick={() => close(false)}>Alışverişe Devam Et</Button>
          </motion.div>
        ) : (
          <div className="grid gap-8 md:grid-cols-[1fr_280px]">
            <div className="space-y-4">
              <DialogTitle className="font-serif text-3xl font-medium">Teslimat & Ödeme</DialogTitle>
              <DialogDescription>Bilgilerinizi girin, siparişinizi önizleyin.</DialogDescription>
              <input className={inp} placeholder="Ad Soyad" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input className={inp} placeholder="Telefon (+90 555 000 00 00)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <input className={inp} placeholder="E-posta (ornek@muhurdavetiye.example)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <input className={inp} placeholder="Şehir" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <textarea className={cn(inp, "h-20 resize-none py-2")} placeholder="Örnek Mahallesi, Demo Sokak No: 0, Kadıköy / İstanbul" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <p className="pt-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Ödeme Yöntemi</p>
              <div className="grid grid-cols-3 gap-2">
                {PAYMENTS.map((p) => (
                  <button key={p} onClick={() => setPayment(p)} className={cn("rounded-xl border py-3 text-xs transition", payment === p ? "border-gold bg-blush font-semibold" : "bg-paper hover:border-gold")}>{p}</button>
                ))}
              </div>
            </div>
            <aside className="space-y-3 rounded-2xl bg-paper p-5 text-sm">
              <p className="font-serif text-xl">Sipariş Özeti</p>
              {cart.map((c) => (
                <div key={c.key} className="flex justify-between gap-2">
                  <span className="truncate text-muted-foreground">{c.title} × {c.qty}</span>
                  <span>{formatTL(lineTotal(c.basePrice, c.qty, c.extras))}</span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-3 text-muted-foreground"><span>Kargo</span><span>{shipping ? formatTL(shipping) : "Ücretsiz"}</span></div>
              <div className="flex justify-between font-serif text-2xl"><span>Toplam</span><span>{formatTL(subtotal + shipping)}</span></div>
              <Button
                variant="gold"
                className="h-12 w-full"
                disabled={!valid || cart.length === 0}
                onClick={() => setDone(placeOrder({ customer: form, payment, items: cart, subtotal, shipping, total: subtotal + shipping }))}
              >
                Siparişi Onayla
              </Button>
              {!valid && <p className="text-center text-[11px] text-muted-foreground">Tüm alanları doldurun</p>}
            </aside>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
