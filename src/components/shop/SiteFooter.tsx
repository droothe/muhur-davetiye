import { Instagram, Phone, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-10 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-serif text-3xl tracking-[0.25em]">KOALA</p>
          <p className="text-[10px] tracking-[0.55em] text-gold">DAVETİYE</p>
          <p className="mt-4 max-w-xs text-sm opacity-70">Kaliteli, şık, güvenli. Online davetiye alışveriş mağazanız.</p>
        </div>
        <div className="space-y-2 text-sm opacity-80">
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> Ankara, Türkiye</p>
          <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> WhatsApp sipariş hattı</p>
          <a href="https://instagram.com/koaladavetiye" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-gold">
            <Instagram className="h-4 w-4 text-gold" /> @koaladavetiye
          </a>
        </div>
        <p className="self-end text-xs opacity-50 md:text-right">© {new Date().getFullYear()} Koala Davetiye</p>
      </div>
    </footer>
  );
}
