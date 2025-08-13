export const toHHmm = (value?: string) => {
  if (!value) return "";
  // If it's already HH:mm or HH:mm:ss, just take HH:mm
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(value)) return value.slice(0, 5);

  // If it's an ISO-like string, grab the first HH:mm we see
  const m = value.match(/\d{2}:\d{2}/);
  if (m) return m[0];

  // Fallback: try Date parsing (handles odd formats), convert to local HH:mm
  const d = new Date(value);
  if (!isNaN(d.getTime())) {
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }
  return "";
};
