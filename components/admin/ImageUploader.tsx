"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";

/**
 * Televerse une image dans le bucket Supabase Storage "media" et renvoie
 * l'URL publique via onUploaded. Reserve aux admins (RLS storage).
 */
export function ImageUploader({
  folder = "products",
  onUploaded,
}: {
  folder?: string;
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    const supabase = createClient();
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() || "jpg";
        const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
        const path = `${folder}/${Date.now()}-${base}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("media")
          .upload(path, file, { cacheControl: "3600", upsert: false });
        if (upErr) {
          setError("Téléversement impossible. Vérifiez que vous êtes admin.");
          break;
        }
        const { data } = supabase.storage.from("media").getPublicUrl(path);
        onUploaded(data.publicUrl);
      }
    } catch {
      setError("Une erreur est survenue pendant le téléversement.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="btn h-10 border border-navy-200 bg-white px-4 text-sm text-navy-800 hover:bg-navy-50"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Téléversement...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" /> Téléverser une image
          </>
        )}
      </button>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </p>
      )}
    </div>
  );
}
