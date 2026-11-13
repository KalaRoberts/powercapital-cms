/** Minimal inline formatting for CMS text: escapes HTML, then turns **text**
 *  into <strong>text</strong>. Editors type **bold** in plain text fields. */
export function inline(text?: string | null): string {
  if (!text) return "";
  const esc = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  return esc.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

/** TinaCloud rewrites repo image paths to its media CDN; map them back to
 *  the copy committed in public/assets/img. */
export function localImg(src?: string | null): string | undefined {
  if (!src) return undefined;
  const m = src.match(/^https:\/\/assets\.tina\.io\/.*\/__file\/(.+)$/);
  return m ? `/assets/img/${m[1]}` : src;
}
