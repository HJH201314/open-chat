export function recordToMap<K extends string, V>(record: Record<K, V>): Map<K, V> {
  const map = new Map<K, V>();
  Object.entries(record).forEach(([key, value]) => {
    map.set(key as K, value as V);
  });
  return map;
}