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
      { title: "Mühür Dijital Davetiye — Düğün, Nişan & Özel Gün" },
      { name: "description", content: "Düğün, nişan ve özel günler için kurgusal dijital davetiye demo vitrini." },
      { property: "og:title", content: "Mühür Dijital Davetiye — Düğün, Nişan & Özel Gün" },
      { property: "og:description", content: "Kurgusal etkinliklerle hazırlanmış dijital davetiye örneklerini keşfedin." },
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
