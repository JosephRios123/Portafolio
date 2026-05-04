import { useState } from "react";
import { Loader2, Upload, X, FileText, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateCertificateFile } from "@/lib/validation";

type Props = {
  url: string | null | undefined;
  mime: string | null | undefined;
  onChange: (next: { url: string | null; mime: string | null }) => void;
};

export default function CertificateUpload({ url, mime, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const isPdf = mime === "application/pdf";
  const isImage = mime?.startsWith("image/");

  const upload = async (file: File) => {
    const err = validateCertificateFile(file);
    if (err) {
      toast.error(err);
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `certs/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("certificates").upload(path, file, {
      contentType: file.type,
    });
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("certificates").getPublicUrl(path);
    onChange({ url: data.publicUrl, mime: file.type });
    setUploading(false);
    toast.success("Certificado subido");
  };

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
      {url && (
        <div className="rounded-lg overflow-hidden border border-border bg-background/40">
          {isImage ? (
            <img src={url} alt="Certificado" className="w-full max-h-64 object-contain bg-black/40" />
          ) : (
            <div className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
                <FileText size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">Certificado PDF</p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent inline-flex items-center gap-1 hover:underline"
                >
                  Abrir <ExternalLink size={11} />
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/60 hover:bg-muted text-sm font-semibold cursor-pointer transition-colors">
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {url ? "Reemplazar" : "Subir certificado"}
          <input
            type="file"
            accept="application/pdf,image/jpeg,image/png"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
        </label>
        {url && (
          <button
            type="button"
            onClick={() => onChange({ url: null, mime: null })}
            className="inline-flex items-center gap-1 text-xs text-destructive hover:underline"
          >
            <X size={12} /> Quitar
          </button>
        )}
        <p className="text-xs text-muted-foreground basis-full">PDF, JPG o PNG · máx. 2MB</p>
      </div>
    </div>
  );
}
