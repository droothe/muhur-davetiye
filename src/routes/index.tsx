import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shop/SiteHeader";
import { Hero } from "@/components/shop/Hero";
import { Catalog } from "@/components/shop/Catalog";
import { Customizer } from "@/components/shop/Customizer";
import { QuickView } from "@/components/shop/QuickView";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { Checkout } from "@/components/shop/Checkout";
import { CustomRequest } from "@/components/shop/CustomRequest";
import { SiteFooter } from "@/components/shop/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Koala Davetiye | Düğün, Nişan & Pleksi Davetiye – Ankara" },
      { name: "description", content: "Mühürlü, pleksi, kraft ve yaldızlı davetiyeler. Canlı önizleme, grafik onayı ve kapıda ödeme." },
      { property: "og:title", content: "Koala Davetiye – Unutulmaz Davetiye Tasarımları" },
      { property: "og:description", content: "İsimlerinizi canlı önizleyin, kapıda ödeyin. Türkiye'nin her yerine kargo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <Hero />
        <Catalog />
      </main>
      <SiteFooter />
      <Customizer />
      <QuickView />
      <CartDrawer />
      <Checkout />
      <CustomRequest />
    </div>
  );
}
