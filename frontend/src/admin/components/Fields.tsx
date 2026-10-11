"use client";
import { useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, LoaderCircle, Upload, Trash2 } from "lucide-react";
export function TextField({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="adm-field">
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          maxLength={3000}
          required={required}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={type === "url" ? 2000 : 3000}
          required={required}
          dir={
            type === "email" || type === "url" || type === "tel"
              ? "ltr"
              : undefined
          }
        />
      )}
    </label>
  );
}

export function ImageField({
  value,
  onChange,
  label,
  onError,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  onError: (message: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 10_000_000
    ) {
      onError("اختر صورة PNG أو JPEG أو WebP أصغر من 10 ميجابايت.");
      event.target.value = "";
      return;
    }
    setBusy(true);
    try {
      const bitmap = await createImageBitmap(file);
      const ratio = Math.min(1, 900 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
      canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("تعذر معالجة الصورة.");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      let image = canvas.toDataURL("image/webp", 0.78);
      if (image.length > 180000) image = canvas.toDataURL("image/webp", 0.5);
      if (image.length > 180000)
        throw new Error("الصورة كبيرة بعد الضغط. استخدم صورة أبسط أو أصغر.");
      onChange(image);
    } catch {
      onError("تعذر رفع الصورة. استخدم صورة أصغر بصيغة PNG أو JPEG أو WebP.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }
  return (
    <div className="adm-image-field">
      <span className="adm-label">{label}</span>
      <div className="adm-image-row">
        {value ? (
          <img src={value} alt={label} />
        ) : (
          <div className="adm-image-placeholder">
            <ImagePlus size={25} />
          </div>
        )}
        <div>
          <button
            type="button"
            className="adm-button"
            disabled={busy}
            onClick={() => input.current?.click()}
          >
            {busy ? (
              <LoaderCircle className="adm-spin" size={16} />
            ) : (
              <Upload size={16} />
            )}
            رفع صورة
          </button>
          {value ? (
            <button
              type="button"
              className="adm-icon"
              title="إزالة الصورة"
              aria-label="إزالة الصورة"
              onClick={() => onChange("")}
            >
              <Trash2 size={17} />
            </button>
          ) : null}
          <input
            ref={input}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            hidden
            onChange={upload}
          />
        </div>
      </div>
    </div>
  );
}
