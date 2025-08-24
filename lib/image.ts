export async function downscaleImage(
  file: File,
  config?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    mimeType?: string;
  }
): Promise<Blob> {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.8,
    mimeType,
  } = config || {};

  const imageBitmap = await createImageBitmap(file);
  const ratio = Math.min(
    maxWidth / imageBitmap.width,
    maxHeight / imageBitmap.height,
    1
  );
  const width = Math.round(imageBitmap.width * ratio);
  const height = Math.round(imageBitmap.height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");
  ctx.drawImage(imageBitmap, 0, 0, width, height);

  const type = mimeType || file.type || "image/jpeg";
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Canvas toBlob failed"));
      },
      type,
      quality
    );
  });
  return blob;
}

export async function fileFromBlob(
  blob: Blob,
  filename: string
): Promise<File> {
  // Safari needs File constructor guarded; but we're targeting modern browsers for Next.js clients
  return new File([blob], filename, { type: blob.type });
}
