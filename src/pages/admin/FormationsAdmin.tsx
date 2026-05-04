import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, X, CheckCircle2, Clock, Award, FileText } from "lucide-react";
import IconPicker from "@/components/admin/IconPicker";
import CertificateUpload from "@/components/admin/CertificateUpload";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { formationSchema, flattenZodErrors, type ZodResultErrors } from "@/lib/validation";

type Status = "Completado" | "En progreso" | "Certificado";
type Formation = {
  id: string;
  course: string;
  institution: string;
  city: string | null;
  country: string | null;
  status: Status;
  obtained_date: string | null;
  display_order: number;
  icon_emoji: string | null;
  icon_image_url: string | null;
  certificate_url: string | null;
  certificate_mime: string | null;
};

type Editing = Omit<Formation, "id"> & { id?: string };

const empty: Editing = {
  course: "", institution: "", city: "", country: "",
  status: "Completado", obtained_date: "", display_order: 0,
  icon_emoji: null, icon_image_url: null, certificate_url: null, certificate_mime: null,
};

const statusIcon = { "Completado": CheckCircle2, "En progreso": Clock, "Certificado": Award };
const statusColor = { "Completado": "hsl(142 70% 45%)", "En progreso": "hsl(45 100% 55%)", "Certificado": "hsl(217 91% 60%)" };

export default function FormationsAdmin() {
  const [items, setItems] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<ZodResultErrors>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("formations").select("*").order("display_order");
    if (error) toast.error(error.message);
    else setItems((data ?? []) as Formation[]);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing) return;
    const candidate = {
      course: editing.course.trim(),
      institution: editing.institution.trim(),
      city: (editing.city ?? "").trim(),
      country: (editing.country ?? "").trim(),
      status: editing.status,
      obtained_date: (editing.obtained_date ?? "").trim(),
      display_order: editing.display_order,
    };
    const result = formationSchema.safeParse(candidate);
    if (!result.success) {
      setErrors(flattenZodErrors(result));
      toast.error("Revisa los campos");
      return;
    }
    setErrors({});
    setSaving(true);
    const payload = {
      course: candidate.course,
      institution: candidate.institution,
      city: candidate.city || null,
      country: candidate.country || null,
      status: candidate.status,
      obtained_date: candidate.obtained_date || null,
      display_order: candidate.display_order,
      icon_emoji: editing.icon_emoji,
      icon_image_url: editing.icon_image_url,
      certificate_url: editing.certificate_url,
      certificate_mime: editing.certificate_mime,
    };
    const { error } = editing.id
      ? await supabase.from("formations").update(payload).eq("id", editing.id)
      : await supabase.from("formations").insert(payload);
    if (error) toast.error(error.message);
    else {
      toast.success("Guardado");
      setEditing(null);
      load();
    }
    setSaving(false);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("formations").delete().eq("id", deleteId);
    if (error) toast.error(error.message);
    else {
      toast.success("Eliminado");
      load();
    }
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-3xl font-black">Formación</h1>
          <p className="text-muted-foreground mt-1">{items.length} registro(s)</p>
        </div>
        <button onClick={() => { setEditing(empty); setErrors({}); }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-background" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(187 92% 42%))" }}>
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-accent" /></div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-muted-foreground">Sin formaciones.</div>
      ) : (
        <div className="grid gap-4">
          {items.map((f) => {
            const Icon = statusIcon[f.status];
            return (
              <div key={f.id} className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-muted/40 border border-border flex items-center justify-center text-xl shrink-0 overflow-hidden">
                    {f.icon_image_url ? (
                      <img src={f.icon_image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      f.icon_emoji || "🎓"
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-foreground">{f.course}</h3>
                    <p className="text-sm text-muted-foreground">
                      {f.institution}
                      {f.city ? ` · ${f.city}` : ""}
                      {f.country ? `, ${f.country}` : ""}
                      {f.obtained_date ? ` · ${f.obtained_date}` : ""}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Icon size={13} style={{ color: statusColor[f.status] }} />
                      <span className="text-xs font-bold" style={{ color: statusColor[f.status] }}>{f.status}</span>
                      {f.certificate_url && <FileText size={12} className="text-accent ml-2" />}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setEditing(f); setErrors({}); }} className="touch-target inline-flex items-center justify-center rounded-lg hover:bg-muted/50 text-accent"><Pencil size={16} /></button>
                  <button onClick={() => setDeleteId(f.id)} className="touch-target inline-flex items-center justify-center rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 size={16} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setEditing(null)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black">{editing.id ? "Editar" : "Nueva"} formación</h2>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-muted/50"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <Field label="Curso / Carrera" error={errors.course}>
                <input value={editing.course} onChange={(e) => setEditing({ ...editing, course: e.target.value })} className="input-base" />
              </Field>
              <Field label="Institución" error={errors.institution}>
                <input value={editing.institution} onChange={(e) => setEditing({ ...editing, institution: e.target.value })} className="input-base" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Ciudad">
                  <input value={editing.city ?? ""} onChange={(e) => setEditing({ ...editing, city: e.target.value })} className="input-base" />
                </Field>
                <Field label="País">
                  <input value={editing.country ?? ""} onChange={(e) => setEditing({ ...editing, country: e.target.value })} placeholder="Colombia" className="input-base" />
                </Field>
              </div>
              <Field label="Estado">
                <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as Status })} className="input-base">
                  <option>Completado</option>
                  <option>En progreso</option>
                  <option>Certificado</option>
                </select>
              </Field>
              <Field label="Fecha de finalización">
                <input value={editing.obtained_date ?? ""} onChange={(e) => setEditing({ ...editing, obtained_date: e.target.value })} placeholder="2024" className="input-base" />
              </Field>
              <Field label="Icono">
                <IconPicker
                  emoji={editing.icon_emoji}
                  imageUrl={editing.icon_image_url}
                  onChange={({ emoji, imageUrl }) => setEditing({ ...editing, icon_emoji: emoji, icon_image_url: imageUrl })}
                />
              </Field>
              <Field label="Certificado (PDF, JPG o PNG · máx. 2MB)">
                <CertificateUpload
                  url={editing.certificate_url}
                  mime={editing.certificate_mime}
                  onChange={({ url, mime }) => setEditing({ ...editing, certificate_url: url, certificate_mime: mime })}
                />
              </Field>
              <Field label="Orden">
                <input type="number" value={editing.display_order} onChange={(e) => setEditing({ ...editing, display_order: +e.target.value })} className="input-base" />
              </Field>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setEditing(null)} className="flex-1 py-3 rounded-xl border border-border font-semibold">Cancelar</button>
              <button onClick={save} disabled={saving} className="flex-1 py-3 rounded-xl text-background font-bold disabled:opacity-60" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(187 92% 42%))" }}>
                {saving ? <Loader2 className="inline animate-spin" size={16} /> : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDelete
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        onConfirm={confirmDelete}
        title="¿Eliminar formación?"
      />
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-destructive font-semibold">{error}</p>}
    </div>
  );
}
