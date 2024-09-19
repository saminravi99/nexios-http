export function serializeParams(params: Record<string, any> = {}): string {
  return new URLSearchParams(params).toString();
}

export function getFullURL(baseURL: string | undefined, url: string): string {
  if (baseURL && !url.startsWith("http")) {
    return `${baseURL}${url}`;
  }
  return url;
}
