import type { Personalization } from "@/lib/store";
import { cn } from "@/lib/utils";

const FONT = { script: "font-script", serif: "font-serif italic", sans: "font-sans tracking-[0.2em] uppercase" };
const INK = { gold: "text-gold", charcoal: "text-foreground", rose: "text-blush-deep" };

export function InvitationPreview({ p, paper }: { p: Personalization; paper: string }) {
  const date = p.date
    ? new Date(p.date).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric", weekday: "long" })
    : "Tarih seçiniz";
  const rose = p.ink === "rose";
  return (
    <div
      className={cn(
        "relative mx-auto flex aspect-[5/7] w-full max-w-[340px] flex-col items-center justify-center rounded-t-[999px] rounded-b-xl border px-8 text-center shadow-soft",
        paper === "Kraft" ? "bg-gold/25" : paper === "Şeffaf Pleksi" ? "bg-paper/50 backdrop-blur" : "bg-paper",
      )}
    >
      <div className="pointer-events-none absolute inset-3 rounded-t-[999px] rounded-b-lg border border-gold/40" />
      <p className="eyebrow !text-[9px]">Mutluluğumuza davetlisiniz</p>
      <div className={cn("my-5 leading-tight", FONT[p.font], rose ? "text-destructive/70" : INK[p.ink], p.font === "sans" ? "text-xl" : "text-4xl")}>
        <p className="break-words">{p.bride || "Gelin"}</p>
        <p className="font-serif text-xl italic opacity-70">&amp;</p>
        <p className="break-words">{p.groom || "Damat"}</p>
      </div>
      <div className="h-px w-16 bg-gold/60" />
      <p className="mt-4 text-xs font-medium capitalize">{date}</p>
      <p className="text-xs text-muted-foreground">{p.time || "19:00"}</p>
      <p className="mt-2 text-[11px] text-muted-foreground">{p.venue || "Mekân adı"}</p>
      {p.message && <p className="mt-4 line-clamp-3 font-serif text-sm italic">“{p.message}”</p>}
    </div>
  );
}
