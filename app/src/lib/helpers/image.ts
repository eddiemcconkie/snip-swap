/**
 * Specify the size for a GitHub avatar
 */
export function resize(image: string, size: number): string {
  const url = new URL(image);
  url.searchParams.append('size', size.toString());
  return url.toString();
}
