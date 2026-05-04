import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { experienceSchema, flattenZodErrors, type ZodResultErrors } from "@/lib/validation";
import ConfirmDelete from "@/components/admin/ConfirmDelete";

type Bullet = { id?: string; text: string; display_order: number };
type Experience = {
  id: string;
  role: string;
  company: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  color: string;
  display_order: number;
};

type Editing = Omit<Experience, "id"> & { id?: string; bullets: Bullet[] };

const empty: Editing = {
  role: "", company: "", start_date: "", end_date: "", is_current: false,
  color: "hsl(217 91% 60%)", display_order: 0, bullets: [],
};

export default function ExperienceAdmin() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<ZodResultErrors>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("experiences").select("*").order("display_order");
    if (error) toast.error(error.message);
    else setItems((data ?? []) as Experience[]);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const openEdit = async (exp: Experience) => {
    const { data } = await supabase.from("experience_bullets").select("*").eq("experience_id", exp.id).order("display_order");
    setEditing({
      ...exp,
      bullets: (data ?? []).map((b) => ({ id: b.id, text: b.text, display_order: b.display_order })),
    });
    setErrors({});
  };

  const save = async () => {
    if (!editing) return;
    const result = experienceSchema.safeParse({
      role: editing.role,
      company: editing.company,
      start_date: editing.start_date,
      end_date: editing.is_current ? null : editing.end_date || null,
      is_current: editing.is_current,
      color: editing.color,
      display_order: editing.display_order,
    });
    if (!result.success) {
      setErrors(flattenZodErrors(result));
      toast.error("Revisa los campos");
      return;
    }
    setErrors({});
    setSaving(true);
    const payload = result.data;
    const r = editing.id
      ? await supabase.from("experiences").update(payload).eq("id", editing.id).select().single()
      : await supabase.from("experiences").insert(payload).select().single();
    if (r.error) {
      toast.error(r.error.message);
      setSaving(false);
      return;
    }
    const expId = r.data.id;
    await supabase.from("experience_bullets").delete().eq("experience_id", expId);
    if (editing.bullets.length) {
      const rows = editing.bullets
        .filter((b) => b.text.trim())
        .map((b, i) => ({ experience_id: expId, text: b.text.trim(), display_order: i }));
      if (rows.length) await supabase.from("experience_bullets").insert(rows);
    }
    toast.success("Guardado");
    setEditing(null);
    load();
    setSaving(false);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("experiences").delete().eq("id", deleteId);
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
          <h1 className="text-3xl font-black">Experiencia</h1>
          <p className="text-muted-foreground mt-1">{items.length} registro(s)</p>
        </div>
        <button onClick={() => { setEditing(empty); setErrors({}); }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-background" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(187 92% 42%))" }}>
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-accent" /></div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-muted-foreground">Sin experiencias.</div>
      ) : (
        <div className="grid gap-4">
          {items.map((e) => (
            <div key={e.id} className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: e.color }} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-foreground">{e.role}</h3>
                  <p className="text-sm" style={{ color: e.color }}>{e.company}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{e.start_date} — {e.is_current ? "Actualidad" : e.end_date || ""}</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(e)} className="touch-target inline-flex items-center justify-center rounded-lg hover:bg-muted/50 text-accent"><Pencil size={16} /></button>
                <button onClick={() => setDeleteId(e.id)} className="touch-target inline-flex items-center justify-center rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setEditing(null)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(ev) => ev.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black">{editing.id ? "Editar" : "Nueva"} experiencia</h2>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-muted/50"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <Field label="Cargo" error={errors.role}><input value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className="input-base" /></Field>
              <Field label="Empresa" error={errors.company}><input value={editing.company} onChange={(e) => setEditing({ ...editing, company: e.target.value })} className="input-base" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Fecha inicio" error={errors.start_date}><input value={editing.start_date} onChange={(e) => setEditing({ ...editing, start_date: e.target.value })} placeholder="Ene 2023" className="input-base" /></Field>
                <Field label="Fecha fin" error={errors.end_date}>
                  <input value={editing.end_date ?? ""} disabled={editing.is_current} onChange={(e) => setEditing({ ...editing, end_date: e.target.value })} placeholder="Jul 2024" className="input-base disabled:opacity-50" />
                </Field>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.is_current} onChange={(e) => setEditing({ ...editing, is_current: e.target.checked })} />
                Actualmente trabajo aquí
              </label>
              <Field label="Color (HSL)"><input value={editing.color} onChange={(e) => setEditing({ ...editing, color: e.target.value })} className="input-base font-mono text-xs" /></Field>
              <Field label="Logros / Responsabilidades">
                <div className="space-y-2">
                  {editing.bullets.map((b, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={b.text} onChange={(e) => {
                        const bullets = [...editing.bullets];
                        bullets[i] = { ...b, text: e.target.value };
                        setEditing({ ...editing, bullets });
                      }} className="input-base flex-1" />
                      <button onClick={() => setEditing({ ...editing, bullets: editing.bullets.filter((_, j) => j !== i) })} className="p-2 rounded-lg text-destructive hover:bg-destructive/10"><Trash2 size={14} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setEditing({ ...editing, bullets: [...editing.bullets, { text: "", display_order: editing.bullets.length }] })} className="px-4 py-2 rounded-xl bg-accent/15 text-accent font-semibold text-sm">+ Añadir viñeta</button>
                </div>
              </Field>
              <Field label="Orden"><input type="number" value={editing.display_order} onChange={(e) => setEditing({ ...editing, display_order: +e.target.value })} className="input-base" /></Field>
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
        title="¿Eliminar experiencia?"
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
