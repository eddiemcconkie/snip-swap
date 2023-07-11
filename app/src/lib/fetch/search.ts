export function parseSearchParameters<const T extends readonly string[]>(url: URL, paramNames: T) {
  return Object.fromEntries(paramNames.map((param) => [param, url.searchParams.get(param)])) as {
    [K in T[number]]: string | null;
  };
}
