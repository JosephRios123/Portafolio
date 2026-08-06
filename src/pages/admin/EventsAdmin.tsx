import { useEffect, useState } from "react";
import { CalendarDays, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import IconPicker from "@/components/admin/IconPicker";
import CertificateUpload from "@/components/admin/CertificateUpload";
import { eventSchema, flattenZodErrors, type ZodResultErrors } from "@/lib/validation";
import type { PublicProfessionalEvent } from "@/hooks/usePublicData";

type Editing = Omit<PublicProfessionalEvent, "id"> & { id?: string };
const empty: Editing = { title: "", organization: "", event_type: "Conferencia", participation_role: "Asistente", event_date: "", location: "", description: "", link: "", icon_emoji: null, icon_image_url: null, certificate_url: null, certificate_mime: null, display_order: 0 };

export default function EventsAdmin() {
  const [items, setItems] = useState<PublicProfessionalEvent[]>([]);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<ZodResultErrors>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("professional_events").select("*").order("display_order");
    if (error) toast.error(error.message); else setItems((data ?? []) as PublicProfessionalEvent[]);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const save = async () => {
    if (!editing) return;
    const result = eventSchema.safeParse(editing);
    if (!result.success) { setErrors(flattenZodErrors(result)); toast.error("Revisa los campos"); return; }
    setSaving(true);
    const { id, ...values } = editing;
    const payload = { ...values, location: editing.location || null, link: editing.link || null };
    const { error } = id
      ? await supabase.from("professional_events").update(payload).eq("id", id)
      : await supabase.from("professional_events").insert(payload);
    if (error) toast.error(error.message); else { toast.success("Evento guardado"); setEditing(null); await load(); }
    setSaving(false);
  };

  const remove = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("professional_events").delete().eq("id", deleteId);
    if (error) toast.error(error.message); else { toast.success("Evento eliminado"); await load(); }
    setDeleteId(null);
  };

  const update = <K extends keyof Editing>(key: K, value: Editing[K]) => editing && setEditing({ ...editing, [key]: value });

  return <div>
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><h1 className="text-3xl font-black">Conferencias & Workshops</h1><p className="mt-1 text-muted-foreground">{items.length} registro(s)</p></div>
      <Button onClick={() => { setEditing(empty); setErrors({}); }}><Plus /> Nuevo evento</Button>
    </div>
    {loading ? <Loader2 className="mx-auto animate-spin text-accent" /> : items.length === 0 ? <div className="glass-card p-12 text-center text-muted-foreground">Sin eventos.</div> : <div className="grid gap-4">
      {items.map((event) => <div key={event.id} className="glass-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted">{event.icon_emoji || "🎙️"}</span><div className="min-w-0"><h3 className="font-black">{event.title}</h3><p className="text-sm text-muted-foreground">{event.organization} · {event.event_date}</p></div></div>
        <div className="flex gap-2"><Button size="icon" variant="ghost" aria-label={`Editar ${event.title}`} onClick={() => { setEditing(event); setErrors({}); }}><Pencil /></Button><Button size="icon" variant="ghost" aria-label={`Eliminar ${event.title}`} className="text-destructive" onClick={() => setDeleteId(event.id)}><Trash2 /></Button></div>
      </div>)}
    </div>}

    {editing && <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-3 backdrop-blur-sm sm:items-center" onClick={() => setEditing(null)}>
      <div className="max-h-[94dvh] w-full max-w-2xl overflow-y-auto rounded-md border border-border bg-card p-5 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-black">{editing.id ? "Editar" : "Nuevo"} evento</h2><Button size="icon" variant="ghost" aria-label="Cerrar" onClick={() => setEditing(null)}><X /></Button></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Título" error={errors.title}><input className="input-base" value={editing.title} onChange={(e) => update("title", e.target.value)} /></Field>
          <Field label="Organización" error={errors.organization}><input className="input-base" value={editing.organization} onChange={(e) => update("organization", e.target.value)} /></Field>
          <Field label="Tipo"><select className="input-base" value={editing.event_type} onChange={(e) => update("event_type", e.target.value)}>{["Conferencia","Workshop","Meetup","Webinar","Otro"].map(v => <option key={v}>{v}</option>)}</select></Field>
          <Field label="Participación"><select className="input-base" value={editing.participation_role} onChange={(e) => update("participation_role", e.target.value)}>{["Ponente","Asistente","Organizador","Mentor","Otro"].map(v => <option key={v}>{v}</option>)}</select></Field>
          <Field label="Fecha" error={errors.event_date}><input className="input-base" value={editing.event_date} onChange={(e) => update("event_date", e.target.value)} placeholder="Mayo 2026" /></Field>
          <Field label="Ubicación"><input className="input-base" value={editing.location ?? ""} onChange={(e) => update("location", e.target.value)} /></Field>
          <div className="sm:col-span-2"><Field label="Descripción" error={errors.description}><textarea className="input-base min-h-28" value={editing.description} onChange={(e) => update("description", e.target.value)} /></Field></div>
          <div className="sm:col-span-2"><Field label="Enlace" error={errors.link}><input className="input-base" value={editing.link ?? ""} onChange={(e) => update("link", e.target.value)} placeholder="https://" /></Field></div>
          <Field label="Icono"><IconPicker emoji={editing.icon_emoji} imageUrl={editing.icon_image_url} onChange={({ emoji, imageUrl }) => setEditing({ ...editing, icon_emoji: emoji, icon_image_url: imageUrl })} /></Field>
          <Field label="Certificado"><CertificateUpload url={editing.certificate_url} mime={editing.certificate_mime} onChange={({ url, mime }) => setEditing({ ...editing, certificate_url: url, certificate_mime: mime })} /></Field>
          <Field label="Orden"><input type="number" className="input-base" value={editing.display_order} onChange={(e) => update("display_order", Number(e.target.value))} /></Field>
        </div>
        <div className="mt-8 flex justify-end gap-3"><Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button><Button onClick={() => void save()} disabled={saving}>{saving ? <Loader2 className="animate-spin" /> : <CalendarDays />} Guardar</Button></div>
      </div>
    </div>}
    <ConfirmDelete open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)} onConfirm={() => void remove()} title="¿Eliminar evento?" />
  </div>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block text-xs font-bold uppercase text-muted-foreground">{label}<span className="mt-2 block normal-case">{children}</span>{error && <span className="mt-1 block text-destructive">{error}</span>}</label>;
}