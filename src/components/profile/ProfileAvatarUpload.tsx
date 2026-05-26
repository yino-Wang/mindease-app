"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { saveAvatarUrl, removeAvatar } from "@/app/profile/actions";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";

const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

type ProfileAvatarUploadProps = {
  userId: string;
  avatarUrl: string | null;
  initials: string;
};

export function ProfileAvatarUpload({
  userId,
  avatarUrl,
  initials,
}: ProfileAvatarUploadProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(avatarUrl);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  async function handleFileChange(file: File | undefined) {
    if (!file) return;
    setError(null);

    if (!ACCEPTED.includes(file.type)) {
      setError("Use a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image must be 2 MB or smaller.");
      return;
    }

    setUploading(true);
    try {
      const ext =
        file.type === "image/png"
          ? "png"
          : file.type === "image/webp"
            ? "webp"
            : "jpg";
      const path = `${userId}/avatar.${ext}`;
      const supabase = createClient();

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) {
        setError(uploadError.message);
        return;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const formData = new FormData();
      formData.set("avatarUrl", data.publicUrl);
      const result = await saveAvatarUrl({}, formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      setPreviewUrl(data.publicUrl);
      router.refresh();
    } catch {
      setError("Upload failed. Check that the avatars bucket exists.");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    setError(null);
    setRemoving(true);
    try {
      const result = await removeAvatar({});
      if (result.error) {
        setError(result.error);
        return;
      }
      setPreviewUrl(null);
      router.refresh();
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
      <ProfileAvatar avatarUrl={previewUrl} initials={initials} size="lg" />
      <div className="flex flex-col gap-3">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          className="hidden"
          onChange={(e) => void handleFileChange(e.target.files?.[0])}
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="rounded-full border border-stone-700/80 bg-stone-900/40 px-6 py-2.5 text-sm tracking-widest text-stone-300 uppercase transition-all duration-700 hover:border-stone-600 hover:text-stone-100 disabled:opacity-40"
          >
            {uploading ? "Uploading…" : "Upload photo"}
          </button>
          {previewUrl && (
            <button
              type="button"
              disabled={removing}
              onClick={() => void handleRemove()}
              className="rounded-full border border-stone-700/80 bg-stone-900/40 px-6 py-2.5 text-sm tracking-widest text-stone-500 uppercase transition-all duration-700 hover:text-stone-300 disabled:opacity-40"
            >
              {removing ? "Removing…" : "Remove photo"}
            </button>
          )}
        </div>
        <p className="text-xs tracking-wide text-stone-600">
          JPEG, PNG, or WebP. Max 2 MB.
        </p>
        {error && (
          <p className="text-sm text-amber-600/90" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
