import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, X, Upload, ExternalLink } from "lucide-react";
import { useProjects } from "@/hooks/usePublicData";
import { projectSchema, validateImageFile, flattenZodErrors, type ZodResultErrors } from "@/lib/validation";
import ConfirmDelete from "@/components/admin/ConfirmDelete";

type Editing = {
  id?: string;
  name: string;
  tags: string[];
  description: string;
  link: string;
  image_url: string;
  country: string;
  display_order: number;
};

const empty: Editing = { name: "", tags: [], description: "", link: "", image_url: "", country: "", display_order: 0 };

export default function ProjectsAdmin() {
  const { data: items, loading } = useProjects();
  const [version, setVersion] = useState(0);
  const reload = () => setVersion((v) => v + 1);

  const { data: items2, loading: loading2 } = useProjects();
  const list = version > 0 ? items2 : items;
  const isLoading = version > 0 ? loading2 : loading;

  const [editing, setEditing] = useState<Editing | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<ZodResultErrors>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const save = async () => {
    if (!editing) return;
    const candidate = {
      name: editing.name.trim(),
      description: editing.description.trim(),
      tags: editing.tags,
      link: editing.link.trim(),
      image_url: editing.image_url.trim(),
      country: editing.country.trim(),
      display_order: editing.display_order,
    };
    const result = projectSchema.safeParse(candidate);
    if (!result.success) {
      setErrors(flattenZodErrors(result));
      toast.error("Revisa los campos marcados");
      return;
    }
    setErrors({});
    setSaving(true);
    const payload = {
      name: candidate.name,
      description: candidate.description,
      tags: candidate.tags,
      link: candidate.link || null,
      image_url: candidate.image_url || null,
      country: candidate.country || null,
      display_order: candidate.display_order,
    };
    const { error } = editing.id
      ? await supabase.from("projects").update(payload).eq("id", editing.id)
      : await supabase.from("projects").insert(payload);
    if (error) toast.error(error.message);
    else {
      toast.success("Guardado");
      setEditing(null);
      reload();
    }
    setSaving(false);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("projects").delete().eq("id", deleteId);
    if (error) toast.error(error.message);
    else {
      toast.success("Eliminado");
      reload();
    }
    setDeleteId(null);
  };

  const addTag = () => {
    if (!editing || !tagInput.trim()) return;
    if (editing.tags.length >= 10) {
      toast.error("Máx. 10 tags");
      return;
    }
    setEditing({ ...editing, tags: [...editing.tags, tagInput.trim().slice(0, 24)] });
    setTagInput("");
  };

  const uploadImage = async (file: File) => {
    if (!editing) return;
    const err = validateImageFile(file);
    if (err) {
      toast.error(err);
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("project-previews").upload(path, file, { contentType: file.type });
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("project-previews").getPublicUrl(path);
    setEditing({ ...editing, image_url: data.publicUrl });
    setUploading(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">Proyectos</h1>
          <p className="text-muted-foreground mt-1">{list.length} proyecto(s)</p>
        </div>
        <button
          onClick={() => {
            setEditing(empty);
            setErrors({});
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-background"
          style={{ background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(187 92% 42%))" }}
        >
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-accent" />
        </div>
      ) : list.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-muted-foreground">
          Sin proyectos. Crea el primero.
        </div>
      ) : (
        <div className="grid gap-4">
          {list.map((p) => (
            <div key={p.id} className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4">
              {p.image_url && (
                <img
                  src={p.image_url}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  className="w-20 h-20 rounded-xl object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-foreground">{p.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-accent/10 text-accent border border-accent/30">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="touch-target inline-flex items-center justify-center rounded-lg hover:bg-muted/50 text-muted-foreground"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
                <button
                  onClick={() => {
                    setEditing({
                      id: p.id,
                      name: p.name,
                      tags: p.tags,
                      description: p.description,
                      link: p.link ?? "",
                      image_url: p.image_url ?? "",
                      country: p.country ?? "",
                      display_order: p.display_order,
                    });
                    setErrors({});
                  }}
                  className="touch-target inline-flex items-center justify-center rounded-lg hover:bg-muted/50 text-accent"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => setDeleteId(p.id)}
                  className="touch-target inline-flex items-center justify-center rounded-lg hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 size={16} />
                </button>
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
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-muted/50">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <Field label="Título" error={errors.name}>
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input-base" />
              </Field>
              <Field label={`Descripción breve (${editing.description.length}/200)`} error={errors.description}>
                <textarea value={editing.description} maxLength={200} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className="input-base resize-none" />
              </Field>
              <Field label="Tecnologías utilizadas (tags)" error={errors.tags}>
                <div className="flex gap-2 mb-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="React, Node.js, PostgreSQL..."
                    className="input-base flex-1"
                  />
                  <button type="button" onClick={addTag} className="px-4 py-2 rounded-xl bg-accent/15 text-accent font-semibold">
                    Añadir
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {editing.tags.map((t, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-accent/10 text-accent border border-accent/30">
                      {t}
                      <button onClick={() => setEditing({ ...editing, tags: editing.tags.filter((_, j) => j !== i) })}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </Field>
              <Field label="Link del proyecto (URL válida)" error={errors.link}>
                <input value={editing.link} onChange={(e) => setEditing({ ...editing, link: e.target.value })} placeholder="https://..." className="input-base" />
              </Field>
              <Field label="Imagen representativa (opcional · JPG/PNG/WEBP <2MB)">
                {editing.image_url && <img src={editing.image_url} alt="" className="w-full max-h-48 object-cover rounded-xl mb-2" loading="lazy" />}
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 text-sm cursor-pointer hover:bg-muted">
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {editing.image_url ? "Cambiar" : "Subir"} imagen
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
                  />
                </label>
                {editing.image_url && (
                  <button onClick={() => setEditing({ ...editing, image_url: "" })} className="ml-2 text-xs text-destructive">
                    Quitar
                  </button>
                )}
              </Field>
              <Field label="País (opcional)">
                <input value={editing.country} onChange={(e) => setEditing({ ...editing, country: e.target.value })} className="input-base" />
              </Field>
              <Field label="Orden">
                <input type="number" value={editing.display_order} onChange={(e) => setEditing({ ...editing, display_order: +e.target.value })} className="input-base" />
              </Field>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setEditing(null)} className="flex-1 py-3 rounded-xl border border-border font-semibold">
                Cancelar
              </button>
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
        title="¿Eliminar proyecto?"
        description="Esta acción es permanente."
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
