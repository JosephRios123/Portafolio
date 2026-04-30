import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, X, Upload, ExternalLink } from "lucide-react";

type Project = {
  id: string;
  name: string;
  tags: string[];
  description: string;
  link: string | null;
  image_url: string | null;
  display_order: number;
};

const empty: Omit<Project, "id"> = { name: "", tags: [], description: "", link: "", image_url: "", display_order: 0 };

export default function ProjectsAdmin() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(Omit<Project, "id"> & { id?: string }) | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("projects").select("*").order("display_order").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems((data ?? []) as Project[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim() || !editing.description.trim()) { toast.error("Nombre y descripción son obligatorios"); return; }
    if (editing.description.length > 200) { toast.error("Descripción máx 200 caracteres"); return; }
    setSaving(true);
    const payload = { ...editing, link: editing.link || null, image_url: editing.image_url || null };
    const { error } = editing.id
      ? await supabase.from("projects").update(payload).eq("id", editing.id)
      : await supabase.from("projects").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success("Guardado"); setEditing(null); load(); }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este proyecto?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Eliminado"); load(); }
  };

  const addTag = () => {
    if (!editing || !tagInput.trim()) return;
    setEditing({ ...editing, tags: [...editing.tags, tagInput.trim()] });
    setTagInput("");
  };

  const uploadImage = async (file: File) => {
    if (!editing) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("project-previews").upload(path, file);
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from("project-previews").getPublicUrl(path);
    setEditing({ ...editing, image_url: data.publicUrl });
    setUploading(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">Proyectos</h1>
          <p className="text-muted-foreground mt-1">{items.length} proyecto(s)</p>
        </div>
        <button onClick={() => setEditing(empty)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-background"
          style={{ background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(187 92% 42%))" }}>
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-accent" /></div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-muted-foreground">Sin proyectos. Crea el primero.</div>
      ) : (
        <div className="grid gap-4">
          {items.map((p) => (
            <div key={p.id} className="glass-card rounded-2xl p-5 flex items-start gap-4">
              {p.image_url && <img src={p.image_url} alt={p.name} className="w-20 h-20 rounded-xl object-cover" />}
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-foreground">{p.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-accent/10 text-accent border border-accent/30">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="touch-target inline-flex items-center justify-center rounded-lg hover:bg-muted/50 text-muted-foreground"><ExternalLink size={16} /></a>}
                <button onClick={() => setEditing(p)} className="touch-target inline-flex items-center justify-center rounded-lg hover:bg-muted/50 text-accent"><Pencil size={16} /></button>
                <button onClick={() => remove(p.id)} className="touch-target inline-flex items-center justify-center rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setEditing(null)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black">{editing.id ? "Editar" : "Nuevo"} proyecto</h2>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-muted/50"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <Field label="Nombre">
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input-base" />
              </Field>
              <Field label={`Descripción (${editing.description.length}/200)`}>
                <textarea value={editing.description} maxLength={200} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className="input-base resize-none" />
              </Field>
              <Field label="Tags">
                <div className="flex gap-2 mb-2">
                  <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Añadir tag..." className="input-base flex-1" />
                  <button type="button" onClick={addTag} className="px-4 py-2 rounded-xl bg-accent/15 text-accent font-semibold">Añadir</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {editing.tags.map((t, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-accent/10 text-accent border border-accent/30">
                      {t}
                      <button onClick={() => setEditing({ ...editing, tags: editing.tags.filter((_, j) => j !== i) })}><X size={12} /></button>
                    </span>
                  ))}
                </div>
              </Field>
              <Field label="Link (demo o repo)">
                <input value={editing.link ?? ""} onChange={(e) => setEditing({ ...editing, link: e.target.value })} placeholder="https://..." className="input-base" />
              </Field>
              <Field label="Imagen (opcional)">
                {editing.image_url && <img src={editing.image_url} alt="" className="w-full max-h-48 object-cover rounded-xl mb-2" />}
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 text-sm cursor-pointer hover:bg-muted">
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {editing.image_url ? "Cambiar" : "Subir"} imagen
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
                </label>
                {editing.image_url && (
                  <button onClick={() => setEditing({ ...editing, image_url: "" })} className="ml-2 text-xs text-destructive">Quitar</button>
                )}
              </Field>
              <Field label="Orden">
                <input type="number" value={editing.display_order} onChange={(e) => setEditing({ ...editing, display_order: +e.target.value })} className="input-base" />
              </Field>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setEditing(null)} className="flex-1 py-3 rounded-xl border border-border font-semibold">Cancelar</button>
              <button onClick={save} disabled={saving} className="flex-1 py-3 rounded-xl text-background font-bold disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(187 92% 42%))" }}>
                {saving ? <Loader2 className="inline animate-spin" size={16} /> : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{label}</label>
      {children}
    </div>
  );
}
