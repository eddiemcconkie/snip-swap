import { dev } from '$app/environment';

const origin = dev ? 'http://localhost:5173' : 'https://snipswap.app';

export function parseUrl(route: string, params: Record<string, string>) {
  return (
    origin +
    route.replaceAll(
      /\[(.*?)\]/g,
      (substring) => params[substring.slice(1, -1) as keyof typeof params],
    )
  );
}

export function appendSearchParameters(url: string, params: Record<string, string | undefined>) {
  const newUrl = new URL(url);
  for (const [name, value] of Object.entries(params)) {
    if (value !== undefined) {
      newUrl.searchParams.append(name, value);
    }
  }
  return newUrl.toString();
}
