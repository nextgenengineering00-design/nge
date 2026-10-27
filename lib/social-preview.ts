export function socialPreviewPath(pathname: string) {
  const cleanPath = pathname.split(/[?#]/, 1)[0].replace(/^\/+|\/+$/g, "");
  if (!cleanPath) return "/og-ngebuild-preview-20260922.jpg";
  return `/assets/og-pages/${cleanPath.replaceAll("/", "--")}.jpg`;
}
