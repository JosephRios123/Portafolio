import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import IconPicker from "@/components/admin/IconPicker";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { mindsetSchema, flattenZodErrors, type ZodResultErrors } from "@/lib/validation";

type Cat = "Técnica" | "Humana" | "Estratégica";
type Principle = {
  id: string;
  phrase: string;
  description: string;
  category: Cat;
  display_order: number;
  icon_emoji: string | null;
  icon_image_url: string | null;
};

type Editing = Omit<Principle, "id"> & { id?: string };

const empty: Editing = {
  phrase: "", description: "", category: "Técnica", display_order: 0,
  icon_emoji: null, icon_image_url: null,
};

const catColors: Record<Cat, string> = {
  "Técnica": "hsl(217 91% 60%)",
  "Humana": "hsl(187 92% 42%)",
  "Estratégica": "hsl(280 80% 60%)",
};

export default function MindsetAdmin() {
  const [items, setItems] = useState<Principle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<ZodResultErrors>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("mindset_principles").select("*").order("display_order");
    if (error) toast.error(error.message);
    else setItems((data ?? []) as Principle[]);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing) return;
    const candidate = {
      phrase: editing.phrase.trim(),
      description: editing.description.trim(),
      category: editing.category,
      display_order: editing.display_order,
    };
    const result = mindsetSchema.safeParse(candidate);
    if (!result.success) {
      setErrors(flattenZodErrors(result));
      toast.error("Revisa los campos");
      return;
    }
    setErrors({});
    setSaving(true);
    const payload = {
      ...candidate,
      icon_emoji: editing.icon_emoji,
      icon_image_url: editing.icon_image_url,
    };
    const { error } = editing.id
      ? await supabase.from("mindset_principles").update(payload).eq("id", editing.id)
      : await supabase.from("mindset_principles").insert(payload);
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
    const { error } = await supabase.from("mindset_principles").delete().eq("id", deleteId);
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
          <h1 className="text-3xl font-black">Mentalidad</h1>
          <p className="text-muted-foreground mt-1">{items.length} principio(s)</p>
        </div>
        <button onClick={() => { setEditing(empty); setErrors({}); }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-background" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(187 92% 42%))" }}>
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-accent" /></div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-muted-foreground">Sin principios.</div>
      ) : (
        <div className="grid gap-4">
          {items.map((p) => (
            <div key={p.id} className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-muted/40 border border-border flex items-center justify-center text-xl shrink-0 overflow-hidden">
                {p.icon_image_url ? (
                  <img src={p.icon_image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  p.icon_emoji || "💡"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2 py-0.5 text-xs rounded-full mb-2 font-bold" style={{ background: `${catColors[p.category]}15`, color: catColors[p.category], border: `1px solid ${catColors[p.category]}30` }}>{p.category}</span>
                <h3 className="font-black text-foreground">{p.phrase}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{p.description}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => { setEditing(p); setErrors({}); }} className="touch-target inline-flex items-center justify-center rounded-lg hover:bg-muted/50 text-accent"><Pencil size={16} /></button>
                <button onClick={() => setDeleteId(p.id)} className="touch-target inline-flex items-center justify-center rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setEditing(null)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black">{editing.id ? "Editar" : "Nuevo"} principio</h2>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-muted/50"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <Field label="Frase" error={errors.phrase}>
                <input value={editing.phrase} onChange={(e) => setEditing({ ...editing, phrase: e.target.value })} className="input-base" />
              </Field>
              <Field label="Descripción" error={errors.description}>
                <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={4} className="input-base resize-none" />
              </Field>
              <Field label="Categoría">
                <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as Cat })} className="input-base">
                  <option>Técnica</option>
                  <option>Humana</option>
                  <option>Estratégica</option>
                </select>
              </Field>
              <Field label="Icono">
                <IconPicker
                  emoji={editing.icon_emoji}
                  imageUrl={editing.icon_image_url}
                  onChange={({ emoji, imageUrl }) => setEditing({ ...editing, icon_emoji: emoji, icon_image_url: imageUrl })}
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
        title="¿Eliminar principio?"
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
