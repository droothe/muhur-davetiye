import { motion } from "framer-motion";
import { ShieldCheck, Truck, PenTool, Sparkles, ArrowRight } from "lucide-react";
import hero from "@/assets/hero-invitation.jpg";
import { Button } from "@/components/ui/button";
import { scrollToCatalog, useUI } from "@/lib/ui-store";

const BADGES = [
  { icon: ShieldCheck, label: "Kapıda Ödeme & Güvenli Alışveriş" },
  { icon: Truck, label: "Türkiye'nin Her Yerine Kargo" },
  { icon: PenTool, label: "Baskı Öncesi Grafik Onayı" },
  { icon: Sparkles, label: "Kaliteli & Şık Kâğıt Seçenekleri" },
];

export function Hero() {
  const setRequestOpen = useUI((s) => s.setRequestOpen);
  return (
    <section className="relative overflow-hidden bg-gradient-blush">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-[1.05fr_1fr] md:px-8 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow mb-6">Ankara Davetiye · 2026 Koleksiyonu</p>
          <h1 className="text-5xl leading-[1.02] md:text-7xl">
            Hayatınızın En Özel Daveti İçin{" "}
            <em className="text-gradient-gold font-serif italic">Unutulmaz</em> Tasarımlar
          </h1>
          <p className="mt-6 max-w-md text-base text-muted-foreground">
            Mühürlü, pleksi, kraft ve yaldızlı serilerimizle; isimlerinizi canlı önizleyin, baskı öncesi
            grafik onayınızı verin, kapıda ödeyin.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button variant="luxe" size="lg" className="h-12 px-8" onClick={scrollToCatalog}>
              Koleksiyonu Keşfet <ArrowRight />
            </Button>
            <Button variant="soft" size="lg" className="h-12 px-8" onClick={() => setRequestOpen(true)}>
              Özel Tasarım Talebi
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="overflow-hidden rounded-t-[999px] rounded-b-3xl border-[10px] border-paper shadow-soft">
            <img src={hero} alt="Fildişi kemer davetiye ve pudra zarf" width={1536} height={1152} className="aspect-[4/5] w-full object-cover" />
          </div>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-5 -left-4 rounded-2xl bg-paper px-5 py-4 shadow-soft md:-left-10"
          >
            <p className="font-script text-3xl text-gold">46,6 B</p>
            <p className="text-xs text-muted-foreground">mutlu çift bizi takip ediyor</p>
          </motion.div>
        </motion.div>
      </div>

      <div className="border-t border-blush-deep/60 bg-paper/60">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4 md:px-8">
          {BADGES.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3 text-sm">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blush text-gold">
                <Icon className="h-4 w-4" />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
