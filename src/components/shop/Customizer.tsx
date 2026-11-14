import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStore, type Personalization } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { EXTRAS, QUANTITY_TIERS, formatTL, lineTotal, unitPrice, type ExtraKey, type QuantityTier } from "@/lib/pricing";
import { InvitationPreview } from "./InvitationPreview";
import { cn } from "@/lib/utils";

const EMPTY: Personalization = { bride: "", groom: "", date: "", time: "19:00", venue: "", message: "", font: "script", ink: "gold" };

export function Customizer() {
  const { customizeId, setCustomizeId } = useUI();
  const product = useStore((s) => s.products.find((p) => p.id === customizeId));
  const addToCart = useStore((s) => s.addToCart);
  const [p, setP] = useState<Personalization>(EMPTY);
  const [qty, setQty] = useState<QuantityTier>(250);
  const [extras, setExtras] = useState<ExtraKey[]>([]);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (customizeId) {
      setP(EMPTY);
      setQty(250);
      setExtras(product?.paper === "Mühürlü" ? ["waxSeal"] : []);
      setApproved(false);
    }
  }, [customizeId, product?.paper]);

  if (!product) return null;
  const set = <K extends keyof Personalization>(k: K, v: Personalization[K]) => setP((s) => ({ ...s, [k]: v }));
  const valid = p.bride.trim() && p.groom.trim() && p.date && p.venue.trim() && approved;

  const submit = () => {
    if (!valid) return;
    addToCart({ productId: product.id, title: product.title, image: product.image, basePrice: product.basePrice, qty, extras, personalization: p });
    toast.success("Sepete eklendi", { description: `${product.title} · ${qty} adet` });
    setCustomizeId(null);
  };

  return (
    <Dialog open={!!customizeId} onOpenChange={(o) => !o && setCustomizeId(null)}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto bg-background p-0 sm:rounded-3xl">
        <div className="grid md:grid-cols-2">
          <div className="flex flex-col items-center justify-center gap-4 bg-gradient-blush p-8 md:sticky md:top-0 md:max-h-[92vh]">
            <p className="eyebrow">Canlı Önizleme</p>
            <InvitationPreview p={p} paper={product.paper} />
            <p className="text-center text-xs text-muted-foreground">Nihai tasarım baskı öncesi grafik onayınıza sunulur.</p>
          </div>

          <div className="space-y-6 p-6 md:p-8">
            <div>
              <DialogTitle className="font-serif text-3xl font-medium">{product.title}</DialogTitle>
              <DialogDescription className="mt-1">{product.envelope}</DialogDescription>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Gelin Adı *"><input className={inp} value={p.bride} maxLength={24} onChange={(e) => set("bride", e.target.value)} placeholder="Ada" /></Field>
              <Field label="Damat Adı *"><input className={inp} value={p.groom} maxLength={24} onChange={(e) => set("groom", e.target.value)} placeholder="Ege" /></Field>
              <Field label="Tarih *"><input type="date" className={inp} value={p.date} onChange={(e) => set("date", e.target.value)} /></Field>
              <Field label="Saat"><input type="time" className={inp} value={p.time} onChange={(e) => set("time", e.target.value)} /></Field>
            </div>
            <Field label="Mekân *"><input className={inp} value={p.venue} maxLength={60} onChange={(e) => set("venue", e.target.value)} placeholder="Örnek Davet Alanı, Kadıköy / İstanbul" /></Field>
            <Field label="Davet Notu"><textarea className={cn(inp, "h-20 resize-none py-2")} maxLength={140} value={p.message} onChange={(e) => set("message", e.target.value)} placeholder="Bu özel günümüzde sizleri de aramızda görmekten mutluluk duyarız." /></Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Yazı Stili">
                <Seg value={p.font} onChange={(v) => set("font", v)} options={[["script", "El Yazısı"], ["serif", "Klasik"], ["sans", "Modern"]]} />
              </Field>
              <Field label="Mürekkep">
                <Seg value={p.ink} onChange={(v) => set("ink", v)} options={[["gold", "Altın"], ["charcoal", "Antrasit"], ["rose", "Gül"]]} />
              </Field>
            </div>

            <Field label="Adet">
              <div className="grid grid-cols-4 gap-2">
                {QUANTITY_TIERS.map((t) => (
                  <button key={t} onClick={() => setQty(t)} className={cn("rounded-xl border py-2 text-xs transition", qty === t ? "border-primary bg-primary text-primary-foreground" : "bg-paper hover:border-gold")}>
                    <span className="block font-semibold">{t}</span>
                    <span className="opacity-70">{formatTL(unitPrice(product.basePrice, t))}</span>
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Ekstralar">
              <div className="flex flex-wrap gap-2">
                {(Object.keys(EXTRAS) as ExtraKey[]).map((k) => (
                  <button key={k} onClick={() => setExtras((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]))} className={cn("rounded-full border px-4 py-2 text-xs transition", extras.includes(k) ? "border-gold bg-blush" : "bg-paper hover:border-gold")}>
                    {EXTRAS[k].label} +{formatTL(EXTRAS[k].perPiece)}
                  </button>
                ))}
              </div>
            </Field>

            <label className="flex items-start gap-3 rounded-xl bg-blush/60 p-3 text-xs">
              <input type="checkbox" checked={approved} onChange={(e) => setApproved(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--gold)]" />
              Bilgilerin doğruluğunu onaylıyorum. Baskıdan önce grafik tasarım onayımın alınacağını biliyorum.
            </label>

            <div className="flex items-center justify-between gap-4 border-t pt-5">
              <div>
                <p className="text-xs text-muted-foreground">{qty} adet · {formatTL(unitPrice(product.basePrice, qty, extras))}/adet</p>
                <p className="font-serif text-3xl">{formatTL(lineTotal(product.basePrice, qty, extras))}</p>
              </div>
              <Button variant="gold" size="lg" className="h-12 px-7" disabled={!valid} onClick={submit}>Sepete Ekle</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const inp = "h-10 w-full rounded-xl border bg-paper px-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{label}</span>
      {children}
    </label>
  );
}

function Seg<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: [T, string][] }) {
  return (
    <div className="flex rounded-xl border bg-paper p-1">
      {options.map(([v, l]) => (
        <button key={v} type="button" onClick={() => onChange(v)} className={cn("flex-1 rounded-lg py-1.5 text-xs transition", value === v ? "bg-primary text-primary-foreground" : "hover:bg-blush")}>
          {l}
        </button>
      ))}
    </div>
  );
}
