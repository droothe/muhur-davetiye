import { Link } from "@tanstack/react-router";
import { Heart, Search, ShoppingBag, LayoutDashboard, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { scrollToCatalog, useUI } from "@/lib/ui-store";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { search, setSearch, cart, favorites, setCartOpen } = useStore();
  const { category, setCategory, favoritesOnly, setFavoritesOnly } = useUI();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <div className="bg-primary py-1.5 text-center text-[11px] tracking-[0.2em] text-primary-foreground uppercase">
        Kapıda ödeme fırsatı · 2.500 TL üzeri ücretsiz kargo
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 md:px-8">
        <Link to="/" className="shrink-0 leading-none">
          <span className="block font-serif text-2xl tracking-[0.25em] md:text-[1.7rem]">KOALA</span>
          <span className="block text-[9px] tracking-[0.55em] text-gold">DAVETİYE</span>
        </Link>

        <div className="relative mx-auto hidden w-full max-w-md md:block">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (e.target.value) scrollToCatalog();
            }}
            placeholder="Davetiye ara… (örn. pleksi, mühürlü)"
            aria-label="Davetiye ara"
            className="h-11 w-full rounded-full border bg-paper pr-10 pl-11 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Aramayı temizle"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <IconBtn
            label="Favoriler"
            active={favoritesOnly}
            onClick={() => {
              setFavoritesOnly(!favoritesOnly);
              scrollToCatalog();
            }}
            count={favorites.length}
          >
            <Heart className={cn("h-5 w-5", favoritesOnly && "fill-current")} />
          </IconBtn>
          <IconBtn label="Sepet" onClick={() => setCartOpen(true)} count={cart.length}>
            <ShoppingBag className="h-5 w-5" />
          </IconBtn>
          <span
            title="Yakında"
            className="ml-2 hidden cursor-not-allowed items-center gap-2 rounded-full border border-blush-deep px-4 py-2 text-xs font-medium tracking-wide opacity-50 sm:inline-flex"
          >
            <LayoutDashboard className="h-4 w-4" /> Yönetici Paneli
          </span>
        </div>
      </div>

      <div className="px-4 pb-3 md:hidden">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Davetiye ara…"
          aria-label="Davetiye ara"
          className="h-10 w-full rounded-full border bg-paper px-4 text-sm outline-none focus:border-gold"
        />
      </div>

      <nav className="border-t">
        <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 text-[13px] md:justify-center md:px-8">
          {CATEGORIES.map((c) => (
            <li key={c}>
              <button
                onClick={() => {
                  setCategory(category === c ? null : c);
                  scrollToCatalog();
                }}
                className={cn(
                  "relative whitespace-nowrap rounded-full px-4 py-1.5 transition",
                  category === c ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {category === c && (
                  <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-blush" />
                )}
                <span className="relative">{c}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  count,
  active,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  count: number;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn("relative rounded-full p-2.5 transition hover:bg-blush", active && "bg-blush")}
    >
      {children}
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-gold px-1 text-[10px] font-semibold text-gold-foreground"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
