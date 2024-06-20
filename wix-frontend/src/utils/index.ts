
export function buildQueryString(options: Record<string, any>) {
  return Object.entries(options)
    .filter(([,v]) => typeof v === 'object' ? Object.keys(v || {}).length : v)
    .reduce((acc, [k, v]) => `${acc}${k}=${typeof v === 'object' ? encodeURIComponent(JSON.stringify(v)) : v}&`, '?')
    .slice(0, -1)
}
