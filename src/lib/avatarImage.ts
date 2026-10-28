// Web avatar upload: centre-crop to a square, downscale to 256px, return a JPEG data URI.
// Same payload Radar writes to profiles.pfp (data URI, 256px, quality .7).

export const AVATAR_SIZE = 256;

export function fileToAvatarDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      try {
        const side = Math.min(img.naturalWidth, img.naturalHeight);
        const canvas = document.createElement('canvas');
        canvas.width = AVATAR_SIZE;
        canvas.height = AVATAR_SIZE;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not process the image.');
        ctx.drawImage(
          img,
          (img.naturalWidth - side) / 2,
          (img.naturalHeight - side) / 2,
          side,
          side,
          0,
          0,
          AVATAR_SIZE,
          AVATAR_SIZE,
        );
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      } catch (e) {
        reject(e instanceof Error ? e : new Error('Could not process the image.'));
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('That file is not an image.'));
    };
    img.src = url;
  });
}

/** Opens the browser file picker and resolves with the processed avatar, or null when cancelled. */
export function pickAvatar(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);
      fileToAvatarDataUri(file).then(resolve, reject);
    };
    input.oncancel = () => resolve(null);
    input.click();
  });
}
