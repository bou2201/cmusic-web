export function objectToQueryString(params: Record<string, any>): string {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) =>
        value !== null &&
        value !== undefined &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0),
    ),
  );

  // Optional: handle arrays by serializing them as comma-separated
  const processed = Object.fromEntries(
    Object.entries(cleaned).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.join(',') : value,
    ]),
  );

  return new URLSearchParams(processed).toString();
}
