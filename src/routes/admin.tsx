import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  ClipboardList,
  Info,
  LayoutDashboard,
  Package,
  Pencil,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CATEGORIES,
  IMAGE_LIBRARY,
  PAPER_TYPES,
  type Badge,
  type Category,
  type PaperType,
  type Product,
} from "@/lib/catalog";
import { formatTL } from "@/lib/pricing";
import { useStore, type Order, type OrderStatus } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Yönetim Paneli | Mühür Dijital Davetiye" },
      { name: "description", content: "Mühür Dijital Davetiye demo sipariş ve ürün yönetim paneli." },
    ],
  }),
  component: AdminPage,
});

type AdminTab = "Genel Bakış" | "Siparişler" | "Ürünler";
type ProductForm = Omit<Product, "id">;

const ORDER_STATUSES: OrderStatus[] = [
  "Grafik Onayı Bekliyor",
  "Baskıda",
  "Kargoda",
  "Teslim Edildi",
];
const inputClass =
  "h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";
const emptyProduct: ProductForm = {
  title: "",
  category: CATEGORIES[0],
  paper: PAPER_TYPES[0],
  basePrice: 0,
  envelope: "",
  size: "",
  description: "",
  badge: null,
  image: IMAGE_LIBRARY[0].src,
  stock: true,
};

function AdminPage() {
  const { products, orders, setOrderStatus, upsertProduct, deleteProduct } = useStore();
  const [tab, setTab] = useState<AdminTab>("Genel Bakış");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tüm siparişler");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("tr-TR");
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "Tüm siparişler" || order.status === statusFilter;
      const matchesSearch =
        !query ||
        [order.id, order.customer.name, order.customer.phone, order.customer.city]
          .join(" ")
          .toLocaleLowerCase("tr-TR")
          .includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const pendingOrders = orders.filter((order) => order.status !== "Teslim Edildi").length;
  const revenue = orders.reduce((total, order) => total + order.total, 0);
  const recentOrders = orders.slice(0, 4);

  function startCreateProduct() {
    setProductForm({ ...emptyProduct });
    setEditingProduct(null);
    setIsCreating(true);
  }

  function startEditProduct(product: Product) {
    setProductForm(product);
    setEditingProduct(product);
    setIsCreating(false);
  }

  function closeProductDialog(open: boolean) {
    if (!open) {
      setEditingProduct(null);
      setIsCreating(false);
    }
  }

  function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const product: Product = {
      ...productForm,
      id: editingProduct?.id ?? `muhur-${crypto.randomUUID()}`,
      basePrice: Number(productForm.basePrice),
    };
    upsertProduct(product);
    closeProductDialog(false);
  }

  function removeProduct(product: Product) {
    if (window.confirm(`"${product.title}" ürününü katalogdan kaldırmak istiyor musunuz?`)) {
      deleteProduct(product.id);
    }
  }

  function updateField<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setProductForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              aria-label="Mağazaya dön"
              className="grid h-10 w-10 place-items-center rounded-full border border-blush-deep bg-paper transition hover:border-gold hover:bg-blush"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="leading-none">
              <span className="block font-serif text-xl tracking-[0.12em]">MÜHÜR</span>
              <span className="mt-1 block text-[9px] tracking-[0.38em] text-gold">YÖNETİM</span>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-blush hover:text-foreground"
          >
            Mağazayı görüntüle <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-7 md:grid-cols-[210px_1fr] md:px-8 md:py-10">
        <aside className="space-y-6">
          <div>
            <p className="eyebrow">YÖNETİM</p>
            <h1 className="mt-2 font-serif text-3xl">Kontrol merkezi</h1>
          </div>
          <nav aria-label="Yönetim bölümleri" className="flex gap-2 overflow-x-auto md:flex-col">
            {([
              ["Genel Bakış", LayoutDashboard],
              ["Siparişler", ClipboardList],
              ["Ürünler", Package],
            ] as const).map(([label, Icon]) => (
              <button
                key={label}
                onClick={() => setTab(label)}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition",
                  tab === label
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-blush hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
                {label === "Siparişler" && pendingOrders > 0 && (
                  <span
                    className={cn(
                      "ml-auto rounded-full px-2 py-0.5 text-[10px]",
                      tab === label ? "bg-white/15 text-white" : "bg-blush text-foreground",
                    )}
                  >
                    {pendingOrders}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="hidden rounded-2xl border border-blush-deep/70 bg-paper p-4 text-xs leading-relaxed text-muted-foreground md:block">
            <p className="font-medium text-foreground">Küçük bir hatırlatma</p>
            <p className="mt-2">
              Değişiklikler bu tarayıcıda saklanır. Gerçek siparişler ve ortak yönetim için sunucu
              bağlantısı gerekir.
            </p>
          </div>
        </aside>

        <section className="min-w-0 space-y-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">
                {tab === "Genel Bakış" ? "DEMO MAĞAZA ÖZETİ" : "MÜHÜR DİJİTAL DAVETİYE"}
              </p>
              <h2 className="mt-1 font-serif text-3xl">{tab}</h2>
            </div>
            {tab === "Ürünler" && (
              <Button variant="gold" className="h-10" onClick={startCreateProduct}>
                <Plus /> Yeni ürün ekle
              </Button>
            )}
          </div>

          {tab === "Genel Bakış" && (
            <Overview
              orders={orders}
              productsCount={products.length}
              pendingOrders={pendingOrders}
              revenue={revenue}
              recentOrders={recentOrders}
              onViewOrders={() => setTab("Siparişler")}
              onStatusChange={setOrderStatus}
            />
          )}

          {tab === "Siparişler" && (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
                <label className="relative block">
                  <Search
                    className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Sipariş no, müşteri veya telefon ara"
                    aria-label="Siparişlerde ara"
                    className={cn(inputClass, "pl-11")}
                  />
                </label>
                <select
                  aria-label="Sipariş durumuna göre filtrele"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className={inputClass}
                >
                  <option>Tüm siparişler</option>
                  {ORDER_STATUSES.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>
              {filteredOrders.length ? (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onStatusChange={setOrderStatus}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<ShoppingBag className="h-6 w-6" />}
                  title={orders.length ? "Eşleşen sipariş bulunamadı" : "Henüz sipariş yok"}
                  description={
                    orders.length
                      ? "Arama kelimesini veya seçili durum filtresini değiştirebilirsiniz."
                      : "Mağazadan verilen siparişler bu listede görünecek."
                  }
                />
              )}
            </div>
          )}

          {tab === "Ürünler" && (
            <div className="space-y-4">
              {products.length ? (
                <>
                  <div className="hidden overflow-hidden rounded-2xl border bg-paper md:block">
                    <div className="grid grid-cols-[minmax(0,1.8fr)_1fr_120px_100px_100px] gap-4 border-b bg-muted/50 px-5 py-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                      <span>Ürün</span>
                      <span>Kategori</span>
                      <span>Fiyat / adet</span>
                      <span>Stok</span>
                      <span className="text-right">Düzenle</span>
                    </div>
                    {products.map((product) => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        onEdit={startEditProduct}
                        onDelete={removeProduct}
                      />
                    ))}
                  </div>
                  <div className="grid gap-3 md:hidden">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onEdit={startEditProduct}
                        onDelete={removeProduct}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <EmptyState
                  icon={<Package className="h-6 w-6" />}
                  title="Katalog henüz boş"
                  description="Mağazanıza ilk davetiye modelini ekleyin."
                  action={
                    <Button variant="gold" onClick={startCreateProduct}>
                      <Plus /> İlk ürünü ekle
                    </Button>
                  }
                />
              )}
            </div>
          )}
        </section>
      </div>

      <Dialog
        open={isCreating || Boolean(editingProduct)}
        onOpenChange={closeProductDialog}
      >
        <DialogContent
          className="max-h-[92vh] max-w-2xl overflow-y-auto rounded-3xl bg-background"
        >
          <div className="space-y-1">
            <DialogTitle className="font-serif text-3xl">
              {editingProduct ? "Ürünü düzenle" : "Yeni ürün"}
            </DialogTitle>
            <DialogDescription>
              Ürün bilgileri mağaza kataloğuna ve bu tarayıcıya kaydedilir.
            </DialogDescription>
          </div>
          <form onSubmit={saveProduct} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Ürün adı">
                <input
                  required
                  maxLength={100}
                  value={productForm.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Örn. Hera Pudra Cepli Davetiye"
                  className={inputClass}
                />
              </Field>
              <Field label="Adet başına fiyat (₺)">
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={productForm.basePrice || ""}
                  onChange={(event) => updateField("basePrice", Number(event.target.value))}
                  className={inputClass}
                />
              </Field>
              <Field label="Kategori">
                <select
                  value={productForm.category}
                  onChange={(event) => updateField("category", event.target.value as Category)}
                  className={inputClass}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </Field>
              <Field label="Kağıt / seri">
                <select
                  value={productForm.paper}
                  onChange={(event) => updateField("paper", event.target.value as PaperType)}
                  className={inputClass}
                >
                  {PAPER_TYPES.map((paper) => (
                    <option key={paper}>{paper}</option>
                  ))}
                </select>
              </Field>
              <Field label="Zarf ve detay">
                <input
                  required
                  value={productForm.envelope}
                  onChange={(event) => updateField("envelope", event.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Boyut">
                <input
                  required
                  value={productForm.size}
                  onChange={(event) => updateField("size", event.target.value)}
                  placeholder="13 × 18 cm"
                  className={inputClass}
                />
              </Field>
              <Field label="Etiket">
                <select
                  value={productForm.badge ?? ""}
                  onChange={(event) =>
                    updateField("badge", (event.target.value || null) as Badge)
                  }
                  className={inputClass}
                >
                  <option value="">Etiket yok</option>
                  <option value="Çok Satan">Çok Satan</option>
                  <option value="Yeni">Yeni</option>
                </select>
              </Field>
              <Field label="Stok durumu">
                <select
                  value={productForm.stock ? "available" : "unavailable"}
                  onChange={(event) => updateField("stock", event.target.value === "available")}
                  className={inputClass}
                >
                  <option value="available">Stokta</option>
                  <option value="unavailable">Tükendi</option>
                </select>
              </Field>
            </div>
            <Field label="Ürün açıklaması">
              <textarea
                required
                rows={3}
                maxLength={500}
                value={productForm.description}
                onChange={(event) => updateField("description", event.target.value)}
                className={cn(inputClass, "h-auto resize-y py-2")}
              />
            </Field>
            <fieldset>
              <legend className="mb-2 text-sm font-medium">Ürün görseli</legend>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                {IMAGE_LIBRARY.map((image) => (
                  <button
                    key={image.label}
                    type="button"
                    onClick={() => updateField("image", image.src)}
                    aria-label={`Görsel seç: ${image.label}`}
                    aria-pressed={productForm.image === image.src}
                    className={cn(
                      "overflow-hidden rounded-xl border-2 transition",
                      productForm.image === image.src
                        ? "border-gold ring-2 ring-gold/20"
                        : "border-transparent hover:border-blush-deep",
                    )}
                  >
                    <img
                      src={image.src}
                      alt={image.label}
                      className="aspect-square w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button type="button" variant="soft" onClick={() => closeProductDialog(false)}>
                Vazgeç
              </Button>
              <Button type="submit" variant="gold">
                {editingProduct ? "Değişiklikleri kaydet" : "Ürünü ekle"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <footer className="border-t py-5 text-center text-xs text-muted-foreground">
        Mühür Dijital Davetiye · Demo yönetim alanı
      </footer>
    </main>
  );
}

function Overview({
  orders,
  productsCount,
  pendingOrders,
  revenue,
  recentOrders,
  onViewOrders,
  onStatusChange,
}: {
  orders: Order[];
  productsCount: number;
  pendingOrders: number;
  revenue: number;
  recentOrders: Order[];
  onViewOrders: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}) {
  const metrics = [
    { label: "Toplam sipariş", value: orders.length.toString(), icon: ClipboardList },
    { label: "Takip gereken", value: pendingOrders.toString(), icon: ShoppingBag },
    { label: "Katalog ürünü", value: productsCount.toString(), icon: Package },
    { label: "Toplam ciro", value: formatTL(revenue), icon: TrendingUp },
  ];

  return (
    <div className="space-y-7">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border bg-paper p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{label}</span>
              <span
                className="grid h-9 w-9 place-items-center rounded-full bg-blush text-foreground"
              >
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-4 font-serif text-2xl">{value}</p>
          </div>
        ))}
      </div>
      <section className="overflow-hidden rounded-2xl border bg-paper">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h3 className="font-serif text-xl">Son siparişler</h3>
            <p className="mt-1 text-xs text-muted-foreground">En son oluşturulan siparişler</p>
          </div>
          <Button variant="soft" size="sm" onClick={onViewOrders}>
            Tümünü gör
          </Button>
        </div>
        {recentOrders.length ? (
          <div className="divide-y">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{order.customer.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    #{order.id} · {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <p className="text-sm font-medium">{formatTL(order.total)}</p>
                  <StatusSelect order={order} onStatusChange={onStatusChange} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            Henüz sipariş bulunmuyor.
          </p>
        )}
      </section>
      <div className="flex items-start gap-3 rounded-2xl border border-gold/20 bg-blush/50 p-4 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
        <p>
          <span className="font-medium text-foreground">Veri kapsamı:</span> Siparişler ve katalog
          bu tarayıcının yerel depolamasında tutulur; bu özet yalnızca bu cihazdaki kayıtları içerir.
        </p>
      </div>
    </div>
  );
}

function OrderCard({
  order,
  onStatusChange,
}: {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => void;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border bg-paper">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/30 px-4 py-4 sm:px-5">
        <div>
          <p className="font-medium">#{order.id}</p>
          <p className="mt-1 text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>
        <StatusSelect order={order} onStatusChange={onStatusChange} />
      </div>
      <div className="grid gap-5 p-4 sm:grid-cols-[1fr_1fr_auto] sm:p-5">
        <div>
          <p className="text-sm font-semibold">{order.customer.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {order.customer.phone}
            {order.customer.email ? ` · ${order.customer.email}` : ""}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {order.customer.address}
            {order.customer.city ? `, ${order.customer.city}` : ""}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Ödeme: {order.payment}</p>
        </div>
        <div className="space-y-2">
          <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Ürünler · {order.items.length}
          </p>
          {order.items.map((item) => (
            <div key={item.key} className="space-y-1">
              <div className="flex gap-2 text-xs">
                <span className="min-w-0 flex-1 truncate">{item.title}</span>
                <span className="shrink-0 text-muted-foreground">{item.qty} adet</span>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                {item.personalization.bride} & {item.personalization.groom}
                {item.personalization.date ? ` · ${item.personalization.date}` : ""}
                {item.personalization.time ? ` · ${item.personalization.time}` : ""}
              </p>
              {item.personalization.venue && (
                <p className="text-[11px] text-muted-foreground">{item.personalization.venue}</p>
              )}
            </div>
          ))}
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs text-muted-foreground">Sipariş toplamı</p>
          <p className="mt-1 font-serif text-xl">{formatTL(order.total)}</p>
        </div>
      </div>
    </article>
  );
}

function StatusSelect({
  order,
  onStatusChange,
}: {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => void;
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="sr-only">Sipariş durumu</span>
      <select
        value={order.status}
        onChange={(event) => onStatusChange(order.id, event.target.value as OrderStatus)}
        aria-label={`${order.id} sipariş durumu`}
        className="h-9 max-w-[190px] rounded-full border border-blush-deep bg-background px-3 text-xs outline-none transition focus:border-gold"
      >
        {ORDER_STATUSES.map((status) => (
          <option key={status}>{status}</option>
        ))}
      </select>
    </label>
  );
}

function ProductRow({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1.8fr)_1fr_120px_100px_100px] items-center gap-4 border-b px-5 py-3 last:border-0">
      <div className="flex min-w-0 items-center gap-3">
        <img src={product.image} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{product.title}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {product.paper} · {product.size}
          </p>
        </div>
      </div>
      <p className="truncate text-xs text-muted-foreground">{product.category}</p>
      <p className="text-sm">{formatTL(product.basePrice)}</p>
      <span
        className={cn("text-xs", product.stock ? "text-emerald-700" : "text-muted-foreground")}
      >
        {product.stock ? "Stokta" : "Tükendi"}
      </span>
      <ProductActions product={product} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

function ProductCard({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) {
  return (
    <article className="flex gap-3 rounded-2xl border bg-paper p-3">
      <img src={product.image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{product.title}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{product.category}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div>
            <span className="text-sm">{formatTL(product.basePrice)}</span>
            <span className="ml-2 text-xs text-muted-foreground">
              {product.stock ? "Stokta" : "Tükendi"}
            </span>
          </div>
          <ProductActions product={product} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
    </article>
  );
}

function ProductActions({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={() => onEdit(product)}
        aria-label={`${product.title} ürününü düzenle`}
        className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-blush hover:text-foreground"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        onClick={() => onDelete(product)}
        aria-label={`${product.title} ürününü sil`}
        className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed bg-paper px-6 py-12 text-center">
      <span
        className="grid h-12 w-12 place-items-center rounded-full bg-blush text-muted-foreground"
      >
        {icon}
      </span>
      <h3 className="mt-4 font-serif text-2xl">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
