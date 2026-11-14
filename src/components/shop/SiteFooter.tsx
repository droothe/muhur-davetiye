import { Instagram, Phone, MapPin, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-10 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-serif text-3xl tracking-[0.12em]">MÜHÜR</p>
          <p className="text-[9px] tracking-[0.25em] text-gold">DİJİTAL DAVETİYE</p>
          <p className="mt-4 max-w-xs text-sm opacity-70">Düğün, nişan ve özel günler için kurgusal davetiye demo vitrini.</p>
        </div>
        <div className="space-y-2 text-sm opacity-80">
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> Kadıköy / İstanbul · Demo adres</p>
          <a href="tel:+905550000000" className="flex items-center gap-2 hover:text-gold">
            <Phone className="h-4 w-4 text-gold" /> +90 555 000 00 00
          </a>
          <a href="mailto:iletisim@muhurdavetiye.example" className="flex items-center gap-2 hover:text-gold">
            <Mail className="h-4 w-4 text-gold" /> iletisim@muhurdavetiye.example
          </a>
          <p className="flex items-center gap-2">
            <Instagram className="h-4 w-4 text-gold" /> Instagram demo hesabı: @muhurdavetiye.demo
          </p>
        </div>
        <p className="self-end text-xs opacity-50 md:text-right">© {new Date().getFullYear()} Mühür Dijital Davetiye</p>
      </div>
    </footer>
  );
}
