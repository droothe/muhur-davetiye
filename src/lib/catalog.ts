import blush from "@/assets/inv-blush.jpg";
import plexi from "@/assets/inv-plexi.jpg";
import minimal from "@/assets/inv-minimal.jpg";
import kraft from "@/assets/inv-kraft.jpg";
import luxury from "@/assets/inv-luxury.jpg";
import sage from "@/assets/inv-sage.jpg";
import sunnet from "@/assets/inv-sunnet.jpg";
import hero from "@/assets/hero-invitation.jpg";

export const CATEGORIES = [
  "Düğün Davetiyeleri",
  "Nişan & Söz Davetiyeleri",
  "Şeffaf / Pleksi Davetiyeler",
  "Minimalist Serisi",
  "Lüks & Mühürlü Davetiyeler",
  "Sünnet Davetiyeleri",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const PAPER_TYPES = ["Mühürlü", "Kraft", "Şeffaf Pleksi", "Yaldızlı", "Şeritli"] as const;
export type PaperType = (typeof PAPER_TYPES)[number];

export type Badge = "Çok Satan" | "Yeni" | null;

export type Product = {
  id: string;
  title: string;
  category: Category;
  paper: PaperType;
  basePrice: number; // TL per piece at 100 adet
  envelope: string;
  size: string;
  description: string;
  badge: Badge;
  image: string;
  stock: boolean;
};

export const IMAGE_LIBRARY: { label: string; src: string }[] = [
  { label: "Pudra Zarf", src: blush },
  { label: "Pleksi & Bordo", src: plexi },
  { label: "Kabartma Beyaz", src: minimal },
  { label: "Kraft Rustik", src: kraft },
  { label: "Lacivert Lüks", src: luxury },
  { label: "Adaçayı Yeşili", src: sage },
  { label: "Prens Taç", src: sunnet },
  { label: "Kemer Fildişi", src: hero },
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: "hera-pudra",
    title: "Hera Pudra Cepli Davetiye",
    category: "Düğün Davetiyeleri",
    paper: "Yaldızlı",
    basePrice: 24,
    envelope: "Pudra cep zarf, rose gold yaldız monogram",
    size: "13 × 18 cm",
    description: "Kır çiçeği çelengi baskılı fildişi kart ve rose gold yaldızlı pudra cep zarf.",
    badge: "Çok Satan",
    image: blush,
    stock: true,
  },
  {
    id: "melike-pleksi",
    title: "Melike Şeffaf Pleksi",
    category: "Şeffaf / Pleksi Davetiyeler",
    paper: "Şeffaf Pleksi",
    basePrice: 48,
    envelope: "Bordo kadife dokulu zarf, altın varak harfler",
    size: "12 × 17 cm",
    description: "3 mm şeffaf pleksi üzerine altın UV baskı, bordo zarfla göz alıcı bir kontrast.",
    badge: "Yeni",
    image: plexi,
    stock: true,
  },
  {
    id: "duru-kabartma",
    title: "Duru Kabartma İnci",
    category: "Minimalist Serisi",
    paper: "Şeritli",
    basePrice: 29,
    envelope: "Kabartma çiçek desenli zarf, inci kapama",
    size: "14 × 19 cm",
    description: "Gofre çiçek kabartmalı beyaz zarf ve inci detaylı sade, zamansız tasarım.",
    badge: "Çok Satan",
    image: minimal,
    stock: true,
  },
  {
    id: "frig-kraft",
    title: "Frig Kraft Lavanta",
    category: "Nişan & Söz Davetiyeleri",
    paper: "Kraft",
    basePrice: 18,
    envelope: "Kraft kart, jüt ip ve saten kurdele bağlama",
    size: "13 × 19 cm",
    description: "Doğal kraft kâğıt, jüt ip ve kuru lavanta dokunuşuyla rustik bir söz daveti.",
    badge: null,
    image: kraft,
    stock: true,
  },
  {
    id: "lacivert-muhur",
    title: "Kraliyet Lacivert Mühürlü",
    category: "Lüks & Mühürlü Davetiyeler",
    paper: "Mühürlü",
    basePrice: 62,
    envelope: "Lacivert zarf, kadife bant ve altın balmumu mühür",
    size: "15 × 21 cm",
    description: "Altın yaldız çerçeve, kadife kuşak ve el yapımı balmumu mühürle en lüks seri.",
    badge: "Yeni",
    image: luxury,
    stock: true,
  },
  {
    id: "adacayi-kemer",
    title: "Adaçayı Kemer Zarflı",
    category: "Düğün Davetiyeleri",
    paper: "Şeritli",
    basePrice: 27,
    envelope: "Kemer kesim adaçayı zarf, şifon kurdele",
    size: "13 × 19 cm",
    description: "Kemer kesimli adaçayı yeşili zarf ve şifon fiyonkla romantik doğal görünüm.",
    badge: null,
    image: sage,
    stock: true,
  },
  {
    id: "prens-sunnet",
    title: "Küçük Prens Sünnet",
    category: "Sünnet Davetiyeleri",
    paper: "Şeritli",
    basePrice: 16,
    envelope: "Açık mavi çizgili kart, saten kurdele",
    size: "12 × 18 cm",
    description: "Altın taç illüstrasyonu ve mavi saten kurdeleyle neşeli bir sünnet daveti.",
    badge: null,
    image: sunnet,
    stock: true,
  },
  {
    id: "kemer-fildisi",
    title: "Gizem Kemer Fildişi",
    category: "Lüks & Mühürlü Davetiyeler",
    paper: "Mühürlü",
    basePrice: 44,
    envelope: "Pudra zarf, altın balmumu mühür, şifon kurdele",
    size: "14 × 20 cm",
    description: "Kemer kesim gofre çiçek çerçeveli fildişi kart, altın mühür ve şifon kurdele.",
    badge: "Çok Satan",
    image: hero,
    stock: true,
  },
];
