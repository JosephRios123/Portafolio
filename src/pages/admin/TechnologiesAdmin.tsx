import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, X, ArrowUp, ArrowDown, Eye, EyeOff, Cpu } from "lucide-react";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { TECH_CATEGORIES, TECH_ICON_NAMES, CATEGORY_COLORS, getTechIcon, type TechCategory } from "@/lib/techIcons";
import { technologySchema, coreConfigSchema, flattenZodErrors, type ZodResultErrors } from "@/lib/validation";

type Tech = {
  id: string;
  name: string;
  category: TechCategory;
  icon_name: string;
  color: string | null;
  description: string;
  display_order: number;
  is_active: boolean;
};

type Editing = Omit<Tech, "id"> & { id?: string };

const empty: Editing = {
  name: "", category: "Backend", icon_name: "Cpu", color: null,
  description: "", display_order: 0, is_active: true,
};

export default function TechnologiesAdmin() {
  const [items, setItems] = useState<Tech[]>([]);
  const [core, setCore] = useState<{ id: string; label: string; status_text: string; icon_name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<ZodResultErrors>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [savingCore, setSavingCore] = useState(false);

  const load = async () => {
    setLoading(true);
    const [techRes, coreRes] = await Promise.all([
      supabase.from("profile_technologies").select("*").order("display_order").order("name"),
      supabase.from("profile_core").select("*").limit(1),
    ]);
    if (techRes.error) toast.error(techRes.error.message);
    else setItems((techRes.data ?? []) as Tech[]);
    if (coreRes.data?.[0]) setCore(coreRes.data[0] as any);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const candidate = {
      name: editing.name.trim(),
      category: editing.category,
      icon_name: editing.icon_name,
      color: editing.color?.trim() || null,
      description: editing.description.trim(),
      display_order: editing.display_order,
      is_active: editing.is_active,
    };
    const result = technologySchema.safeParse(candidate);
    if (!result.success) {
      setErrors(flattenZodErrors(result));
      toast.error("Revisa los campos");
      return;
    }
    setErrors({});
    setSaving(true);
    const { error } = editing.id
      ? await supabase.from("profile_technologies").update(candidate).eq("id", editing.id)
      : await supabase.from("profile_technologies").insert(candidate);
    if (error) toast.error(error.message);
    else { toast.success("Guardado"); setEditing(null); load(); }
    setSaving(false);
  };

  const move = async (tech: Tech, dir: -1 | 1) => {
    const sorted = [...items];
    const i = sorted.findIndex((t) => t.id === tech.id);
    const j = i + dir;
    if (j < 0 || j >= sorted.length) return;
    const a = sorted[i], b = sorted[j];
    setItems(sorted.map((t, idx) => (idx === i ? b : idx === j ? a : t)));
    await Promise.all([
      supabase.from("profile_technologies").update({ display_order: b.display_order }).eq("id", a.id),
      supabase.from("profile_technologies").update({ display_order: a.display_order }).eq("id", b.id),
    ]);
    load();
  };

  const toggleActive = async (tech: Tech) => {
    const { error } = await supabase.from("profile_technologies").update({ is_active: !tech.is_active }).eq("id", tech.id);
    if (error) toast.error(error.message);
    else load();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("profile_technologies").delete().eq("id", deleteId);
    if (error) toast.error(error.message);
    else { toast.success("Eliminado"); load(); }
    setDeleteId(null);
  };

  const saveCore = async () => {
    if (!core) return;
    const result = coreConfigSchema.safeParse({
      label: core.label.trim(),
      status_text: core.status_text.trim(),
      icon_name: core.icon_name,
    });
    if (!result.success) { toast.error("Revisa el núcleo"); return; }
    setSavingCore(true);
    const { error } = await supabase.from("profile_core").update(result.data).eq("id", core.id);
    if (error) toast.error(error.message);
    else toast.success("Núcleo actualizado");
    setSavingCore(false);
  };

  const activeCount = items.filter((t) => t.is_active).length;
  const rings = activeCount <= 6 ? 1 : activeCount <= 12 ? 2 : activeCount <= 20 ? 3 : Math.min(5, Math.ceil(activeCount / 8));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-3xl font-black">Tecnologías</h1>
          <p className="text-muted-foreground mt-1">
            {activeCount} activa(s) · {rings} anillo(s) orbital(es)
          </p>
        </div>
        <button onClick={() => { setEditing({ ...empty, display_order: items.length + 1 }); setErrors({}); }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-background" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(187 92% 42%))" }}>
          <Plus size={16} /> Nueva
        </button>
      </div>

      {core && (
        <div className="glass-card rounded-2xl p-4 sm:p-5 mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <Cpu size={14} /> Núcleo del sistema
          </h2>
          <div className="grid gap-3 sm:grid-cols-4">
            <input value={core.label} onChange={(e) => setCore({ ...core, label: e.target.value })} className="input-base" placeholder="Etiqueta" />
            <input value={core.status_text} onChange={(e) => setCore({ ...core, status_text: e.target.value })} className="input-base" placeholder="Estado" />
            <select value={core.icon_name} onChange={(e) => setCore({ ...core, icon_name: e.target.value })} className="input-base">
              {TECH_ICON_NAMES.map((n) => <option key={n}>{n}</option>)}
            </select>
            <button onClick={saveCore} disabled={savingCore} className="py-2.5 rounded-xl border border-border font-semibold disabled:opacity-60">
              {savingCore ? <Loader2 className="inline animate-spin" size={16} /> : "Guardar núcleo"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-accent" /></div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-muted-foreground">Sin tecnologías.</div>
      ) : (
        <div className="grid gap-3">
          {items.map((t, idx) => {
            const Icon = getTechIcon(t.icon_name);
            const color = t.color || CATEGORY_COLORS[t.category];
            return (
              <div key={t.id} className="glass-card rounded-2xl p-4 flex items-start gap-4" style={{ opacity: t.is_active ? 1 : 0.55 }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}40`, color }}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-foreground">{t.name}</h3>
                    <span className="px-2 py-0.5 text-[11px] rounded-full font-bold" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>{t.category}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{t.description}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => move(t, -1)} disabled={idx === 0} className="touch-target inline-flex items-center justify-center rounded-lg hover:bg-muted/50 disabled:opacity-30" aria-label="Subir"><ArrowUp size={15} /></button>
                  <button onClick={() => move(t, 1)} disabled={idx === items.length - 1} className="touch-target inline-flex items-center justify-center rounded-lg hover:bg-muted/50 disabled:opacity-30" aria-label="Bajar"><ArrowDown size={15} /></button>
                  <button onClick={() => toggleActive(t)} className="touch-target inline-flex items-center justify-center rounded-lg hover:bg-muted/50" aria-label={t.is_active ? "Ocultar" : "Mostrar"}>
                    {t.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button onClick={() => { setEditing(t); setErrors({}); }} className="touch-target inline-flex items-center justify-center rounded-lg hover:bg-muted/50 text-accent" aria-label="Editar"><Pencil size={15} /></button>
                  <button onClick={() => setDeleteId(t.id)} className="touch-target inline-flex items-center justify-center rounded-lg hover:bg-destructive/10 text-destructive" aria-label="Eliminar"><Trash2 size={15} /></button>
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
              <h2 className="text-xl font-black">{editing.id ? "Editar" : "Nueva"} tecnología</h2>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-muted/50"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <Field label="Nombre" error={errors.name}>
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input-base" />
              </Field>
              <Field label="Categoría">
                <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as TechCategory })} className="input-base">
                  {TECH_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Icono" error={errors.icon_name}>
                <div className="grid max-h-52 grid-cols-6 gap-2 overflow-y-auto rounded-xl border border-border p-2 sm:grid-cols-8">
                  {TECH_ICON_NAMES.map((n) => {
                    const I = getTechIcon(n);
                    const sel = editing.icon_name === n;
                    return (
                      <button key={n} type="button" title={n} onClick={() => setEditing({ ...editing, icon_name: n })}
                        className={`flex aspect-square items-center justify-center rounded-lg border transition-colors ${sel ? "border-accent bg-accent/15 text-accent" : "border-border text-muted-foreground hover:bg-muted/50"}`}>
                        <I size={16} />
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field label="Descripción" error={errors.description}>
                <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className="input-base resize-none" />
              </Field>
              <Field label="Color (opcional, HSL o HEX)" error={errors.color}>
                <input value={editing.color ?? ""} onChange={(e) => setEditing({ ...editing, color: e.target.value || null })} placeholder="#22d3ee" className="input-base" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Orden">
                  <input type="number" value={editing.display_order} onChange={(e) => setEditing({ ...editing, display_order: +e.target.value })} className="input-base" />
                </Field>
                <Field label="Visible">
                  <select value={editing.is_active ? "si" : "no"} onChange={(e) => setEditing({ ...editing, is_active: e.target.value === "si" })} className="input-base">
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                  </select>
                </Field>
              </div>
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

      <ConfirmDelete open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} onConfirm={confirmDelete} title="¿Eliminar tecnología?" />
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
