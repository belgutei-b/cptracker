export type DeviceKind = "desktop" | "mobile";

function detectBrowser(ua: string) {
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\//.test(ua)) return "Opera";
  if (/Firefox\/|FxiOS/.test(ua)) return "Firefox";
  if (/Chrome\/|CriOS/.test(ua)) return "Chrome";
  if (/Safari\//.test(ua)) return "Safari";
  return null;
}

function detectOs(ua: string) {
  // iOS user agents also contain "Mac OS X", so check them first
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Android/.test(ua)) return "Android";
  if (/Mac OS X/.test(ua)) return "macOS";
  if (/Windows/.test(ua)) return "Windows";
  if (/Linux/.test(ua)) return "Linux";
  return null;
}

/** "Chrome on macOS" style label for a session's user agent */
export function describeUserAgent(ua?: string | null): {
  label: string;
  kind: DeviceKind;
} {
  if (!ua) return { label: "Unknown device", kind: "desktop" };

  const browser = detectBrowser(ua);
  const os = detectOs(ua);
  const label =
    browser && os ? `${browser} on ${os}` : (browser ?? os ?? "Unknown device");

  return { label, kind: /Mobile|iPhone|Android/.test(ua) ? "mobile" : "desktop" };
}
