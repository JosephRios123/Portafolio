import { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";

type Props = {
  url: string | null;
  mime: string | null;
  title?: string;
  onClose: () => void;
};

export default function CertificateModal({ url, mime, title, onClose }: Props) {
  useEffect(() => {
    if (!url) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [url, onClose]);

  if (!url) return null;
  const isPdf = mime === "application/pdf";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-card border border-border rounded-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-4 p-4 border-b border-border shrink-0">
          <div className="min-w-0">
            <p className="text-xs font-mono uppercase tracking-widest text-accent/80">Certificado</p>
            <h3 className="font-black text-foreground truncate">{title || "Certificado"}</h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target inline-flex items-center gap-1.5 px-3 rounded-lg text-sm font-semibold bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
            >
              Abrir <ExternalLink size={14} />
            </a>
            <button
              onClick={onClose}
              className="touch-target inline-flex items-center justify-center rounded-lg hover:bg-muted/50"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-black/40">
          {isPdf ? (
            <object data={url} type="application/pdf" className="w-full h-[80vh]">
              <div className="p-8 text-center text-muted-foreground">
                Tu navegador no puede mostrar el PDF.{" "}
                <a className="text-accent underline" href={url} target="_blank" rel="noopener noreferrer">
                  Abrir en pestaña nueva
                </a>
              </div>
            </object>
          ) : (
            <img src={url} alt={title || "Certificado"} className="w-full h-auto object-contain" />
          )}
        </div>
      </div>
    </div>
  );
}
