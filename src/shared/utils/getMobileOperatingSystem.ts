export function getMobileOperatingSystem(): "ios" | "android" | "unknown" {
  const userAgent = navigator.userAgent;
  if (
    userAgent.match(/iPad/i) ||
    userAgent.match(/iPhone/i) ||
    userAgent.match(/iPod/i)
  ) {
    return "ios";
  } else if (userAgent.match(/Android/i)) {
    return "android";
  }
  return "unknown";
}
