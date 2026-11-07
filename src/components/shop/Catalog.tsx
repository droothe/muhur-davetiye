import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Eye, SlidersHorizontal, RotateCcw } from "lucide-react";
import { CATEGORIES, PAPER_TYPES, type PaperType, type Product } from "@/lib/catalog";
import { QUANTITY_TIERS, formatTL, unitPrice, type QuantityTier } from "@/lib/pricing";
import { useStore } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_PRICE = 70;

export function Catalog() {
  const { products, search, favorites, setSearch } = useStore();
  const { category, setCategory, favoritesOnly, setFavoritesOnly } = useUI();
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [papers, setPapers] = useState<PaperType[]>([]);
  const [tier, setTier] = useState<QuantityTier>(100);
  const [sort, setSort] = useState<"pop" | "asc" | "desc">("pop");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase("tr");
    let list = products.filter((p) => {
      if (category && p.category !== category) return false;
      if (papers.length && !papers.includes(p.paper)) return false;
      if (unitPrice(p.basePrice, tier) > maxPrice) return false;
      if (favoritesOnly && !favorites.includes(p.id)) return false;
      if (q) {
        const hay = `${p.title} ${p.category} ${p.paper} ${p.envelope}`.toLocaleLowerCase("tr");
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (sort === "asc") list = [...list].sort((a, b) => a.basePrice - b.basePrice);
    if (sort === "desc") list = [...list].sort((a, b) => b.basePrice - a.basePrice);
    return list;
  }, [products, search, category, papers, tier, maxPrice, favoritesOnly, favorites, sort]);

  const reset = () => {
    setCategory(null);
    setPapers([]);
    setMaxPrice(MAX_PRICE);
    setTier(100);
    setFavoritesOnly(false);
    setSearch("");
  };

  return (
    <section id="koleksiyon" className="mx-auto max-w-7xl scroll-mt-40 px-4 py-20 md:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">Koleksiyon</p>
          <h2 className="text-4xl md:text-5xl">{favoritesOnly ? "Favorileriniz" : category ?? "Tüm Davetiyeler"}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="soft" className="lg:hidden" onClick={() => setShowFilters((s) => !s)}>
            <SlidersHorizontal /> Filtreler
          </Button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            aria-label="Sırala"
            className="h-9 rounded-full border bg-paper px-4 text-sm outline-none focus:border-gold"
          >
            <option value="pop">Öne Çıkanlar</option>
            <option value="asc">Fiyat: Artan</option>
            <option value="desc">Fiyat: Azalan</option>
          </select>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className={cn("space-y-8 lg:block", showFilters ? "block" : "hidden")}>
          <FilterGroup title="Kategori">
            {CATEGORIES.map((c) => (
              <Check key={c} checked={category === c} onChange={() => setCategory(category === c ? null : c)} label={c} />
            ))}
          </FilterGroup>
          <FilterGroup title="Adet">
            <div className="grid grid-cols-2 gap-2">
              {QUANTITY_TIERS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={cn(
                    "rounded-full border py-2 text-xs transition",
                    tier === t ? "border-primary bg-primary text-primary-foreground" : "bg-paper hover:border-gold",
                  )}
                >
                  {t} Adet
                </button>
              ))}
            </div>
          </FilterGroup>
          <FilterGroup title={`Adet Fiyatı · en fazla ${formatTL(maxPrice)}`}>
            <Slider value={[maxPrice]} min={10} max={MAX_PRICE} step={1} onValueChange={(v) => setMaxPrice(v[0])} />
          </FilterGroup>
          <FilterGroup title="Kâğıt Türü">
            {PAPER_TYPES.map((p) => (
              <Check
                key={p}
                checked={papers.includes(p)}
                onChange={() => setPapers((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]))}
                label={p}
              />
            ))}
          </FilterGroup>
          <button onClick={reset} className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
            <RotateCcw className="h-3.5 w-3.5" /> Filtreleri sıfırla
          </button>
        </aside>

        <div>
          <p className="mb-5 text-sm text-muted-foreground">{filtered.length} tasarım · fiyatlar {tier} adet için</p>
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed bg-paper p-14 text-center">
              <p className="font-serif text-2xl">Aradığınız kriterde davetiye bulunamadı</p>
              <Button variant="soft" className="mt-5" onClick={reset}>Filtreleri temizle</Button>
            </div>
          ) : (
            <motion.div layout className="grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} tier={tier} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product: p, tier }: { product: Product; tier: QuantityTier }) {
  const { favorites, toggleFavorite } = useStore();
  const { setCustomizeId, setQuickViewId } = useUI();
  const fav = favorites.includes(p.id);
  const unit = unitPrice(p.basePrice, tier);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-2xl bg-blush">
        <img src={p.image} alt={p.title} loading="lazy" width={896} height={1120} className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105" />
        {p.badge && (
          <span className={cn("absolute top-3 left-3 rounded-full px-3 py-1 text-[10px] font-semibold tracking-wider uppercase", p.badge === "Yeni" ? "bg-paper text-foreground" : "bg-gradient-gold text-gold-foreground")}>
            {p.badge}
          </span>
        )}
        <button
          onClick={() => toggleFavorite(p.id)}
          aria-label={fav ? "Favorilerden çıkar" : "Favorilere ekle"}
          className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-paper/90 backdrop-blur transition hover:scale-110"
        >
          <motion.span key={String(fav)} initial={{ scale: 0.6 }} animate={{ scale: 1 }}>
            <Heart className={cn("h-4 w-4", fav ? "fill-destructive text-destructive" : "text-foreground")} />
          </motion.span>
        </button>
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button onClick={() => setQuickViewId(p.id)} className="flex w-full items-center justify-center gap-2 rounded-full bg-paper/95 py-2.5 text-xs font-medium backdrop-blur">
            <Eye className="h-4 w-4" /> Hızlı İncele
          </button>
        </div>
      </div>
      <div className="mt-4 space-y-1">
        <p className="eyebrow !text-[10px]">{p.paper} · {p.size}</p>
        <h3 className="text-2xl">{p.title}</h3>
        <p className="line-clamp-1 text-xs text-muted-foreground">{p.envelope}</p>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-lg font-semibold">{formatTL(unit)}</span>
          <span className="text-xs text-muted-foreground">/ adet · toplam {formatTL(unit * tier)}</span>
        </div>
      </div>
      <Button variant="luxe" className="mt-4 h-11 w-full" onClick={() => setCustomizeId(p.id)} disabled={!p.stock}>
        {p.stock ? "Kişiselleştir & Sepete Ekle" : "Stokta Yok"}
      </Button>
    </motion.article>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] uppercase">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Check({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground hover:text-foreground">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-[var(--gold)]" />
      <span className={cn(checked && "text-foreground")}>{label}</span>
    </label>
  );
}
