import { useState } from "react";
import { Loader2, Upload, X, ImageIcon, Smile } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateImageFile } from "@/lib/validation";

const EMOJI_LIBRARY = [
  "🎓", "🏫", "📚", "🎯", "🏆", "💡", "🚀", "⚡", "🔥", "💎",
  "🧠", "🛠️", "⚙️", "🔧", "🧰", "🖥️", "💻", "📱", "🌐", "☁️",
  "🤖", "🎨", "📊", "📈", "🗄️", "🔐", "🔑", "📡", "🛰️", "🧪",
  "☕", "🐍", "🦀", "🐹", "🐘", "🦫", "📦", "🧱", "🏗️", "🌟",
  "✨", "🎉", "🎬", "🎵", "🌍", "🇨🇴", "🇺🇸", "🇪🇸", "🇲🇽", "🇦🇷",
  "💼", "📝", "✏️", "📐", "📏", "🔬", "🔭", "📖", "📕", "📗",
  "🤝", "👥", "💬", "📣", "🎙️", "🏅", "🥇", "👨‍💻", "👩‍💻", "🧑‍🎓",
];

type Props = {
  emoji: string | null | undefined;
  imageUrl: string | null | undefined;
  onChange: (next: { emoji: string | null; imageUrl: string | null }) => void;
  bucket?: string;
};

export default function IconPicker({ emoji, imageUrl, onChange, bucket = "certificates" }: Props) {
  const [tab, setTab] = useState<"emoji" | "image">(imageUrl ? "image" : "emoji");
  const [uploading, setUploading] = useState(false);
  const [customEmoji, setCustomEmoji] = useState("");

  const pickEmoji = (e: string) => onChange({ emoji: e, imageUrl: null });
  const clear = () => onChange({ emoji: null, imageUrl: null });

  const upload = async (file: File) => {
    const err = validateImageFile(file);
    if (err) {
      toast.error(err);
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `icons/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    onChange({ emoji: null, imageUrl: data.publicUrl });
    setUploading(false);
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-muted/20">
      {/* Preview + tabs */}
      <div className="flex items-center gap-3 p-3 border-b border-border bg-background/40">
        <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-2xl overflow-hidden shrink-0">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          ) : emoji ? (
            <span>{emoji}</span>
          ) : (
            <ImageIcon size={18} className="text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 flex gap-1 p-1 rounded-lg bg-muted/40">
          <button
            type="button"
            onClick={() => setTab("emoji")}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
              tab === "emoji" ? "bg-accent/15 text-accent" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Smile size={14} /> Emoji
          </button>
          <button
            type="button"
            onClick={() => setTab("image")}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
              tab === "image" ? "bg-accent/15 text-accent" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ImageIcon size={14} /> Imagen
          </button>
        </div>
        {(emoji || imageUrl) && (
          <button
            type="button"
            onClick={clear}
            className="touch-target inline-flex items-center justify-center rounded-lg text-destructive hover:bg-destructive/10"
            title="Quitar"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {tab === "emoji" ? (
        <div className="p-3">
          <div className="grid grid-cols-10 gap-1 max-h-40 overflow-y-auto pr-1">
            {EMOJI_LIBRARY.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => pickEmoji(e)}
                className={`aspect-square rounded-md text-lg hover:bg-accent/10 transition-colors ${
                  emoji === e ? "bg-accent/20 ring-1 ring-accent" : ""
                }`}
              >
                {e}
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={customEmoji}
              onChange={(e) => setCustomEmoji(e.target.value)}
              placeholder="Pegar emoji personalizado..."
              maxLength={4}
              className="input-base flex-1 text-base"
            />
            <button
              type="button"
              onClick={() => {
                if (customEmoji.trim()) {
                  pickEmoji(customEmoji.trim());
                  setCustomEmoji("");
                }
              }}
              className="px-4 py-2 rounded-xl bg-accent/15 text-accent font-semibold text-sm"
            >
              Usar
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 flex items-center gap-3">
          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/60 hover:bg-muted text-sm font-semibold cursor-pointer transition-colors">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {imageUrl ? "Cambiar" : "Subir"} imagen
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
            />
          </label>
          <p className="text-xs text-muted-foreground">JPG, PNG, WEBP · máx. 2MB</p>
        </div>
      )}
    </div>
  );
}
