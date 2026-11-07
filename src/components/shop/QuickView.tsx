import { Heart } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { QUANTITY_TIERS, formatTL, unitPrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function QuickView() {
  const { quickViewId, setQuickViewId, setCustomizeId } = useUI();
  const { favorites, toggleFavorite } = useStore();
  const p = useStore((s) => s.products.find((x) => x.id === quickViewId));
  if (!p) return null;
  const fav = favorites.includes(p.id);
  return (
    <Dialog open={!!quickViewId} onOpenChange={(o) => !o && setQuickViewId(null)}>
      <DialogContent className="max-w-3xl overflow-hidden p-0 sm:rounded-3xl">
        <div className="grid md:grid-cols-2">
          <img src={p.image} alt={p.title} className="aspect-[4/5] h-full w-full object-cover" />
          <div className="space-y-5 p-7">
            <p className="eyebrow">{p.category}</p>
            <DialogTitle className="font-serif text-3xl font-medium">{p.title}</DialogTitle>
            <DialogDescription>{p.description}</DialogDescription>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs text-muted-foreground">Kâğıt</dt><dd>{p.paper}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Ölçü</dt><dd>{p.size}</dd></div>
              <div className="col-span-2"><dt className="text-xs text-muted-foreground">Zarf</dt><dd>{p.envelope}</dd></div>
            </dl>
            <table className="w-full text-sm">
              <tbody>
                {QUANTITY_TIERS.map((t) => (
                  <tr key={t} className="border-b last:border-0">
                    <td className="py-1.5">{t} Adet</td>
                    <td className="text-right text-muted-foreground">{formatTL(unitPrice(p.basePrice, t))}/adet</td>
                    <td className="text-right font-medium">{formatTL(unitPrice(p.basePrice, t) * t)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-2">
              <Button variant="luxe" className="h-11 flex-1" onClick={() => setCustomizeId(p.id)}>Kişiselleştir</Button>
              <Button variant="soft" size="icon" className="h-11 w-11" aria-label="Favori" onClick={() => toggleFavorite(p.id)}>
                <Heart className={cn(fav && "fill-destructive text-destructive")} />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
