import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUI } from "@/lib/ui-store";

const inp = "h-10 w-full rounded-xl border bg-paper px-3 text-sm outline-none focus:border-gold";

export function CustomRequest() {
  const { requestOpen, setRequestOpen } = useUI();
  const [f, setF] = useState({ name: "", phone: "", idea: "" });
  const valid = f.name.trim() && f.phone.trim().length >= 10 && f.idea.trim().length > 5;
  return (
    <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
      <DialogContent className="bg-background sm:rounded-3xl">
        <DialogTitle className="font-serif text-3xl font-medium">Özel Tasarım Talebi</DialogTitle>
        <DialogDescription>Hayalinizdeki davetiyeyi anlatın; tasarım ekibimiz sizinle iletişime geçsin.</DialogDescription>
        <div className="space-y-3">
          <input className={inp} placeholder="Ad Soyad" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input className={inp} placeholder="Telefon" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          <textarea className={`${inp} h-28 resize-none py-2`} placeholder="Renk, kâğıt, tema, adet…" value={f.idea} onChange={(e) => setF({ ...f, idea: e.target.value })} />
          <Button variant="luxe" className="h-11 w-full" disabled={!valid} onClick={() => { toast.success("Talebiniz alındı", { description: "En kısa sürede sizi arayacağız." }); setF({ name: "", phone: "", idea: "" }); setRequestOpen(false); }}>
            Talebi Gönder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
