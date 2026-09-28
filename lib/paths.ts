/**
 * Utility function to strip route-group segments from URLs
 * Removes any /(group)/ segments from a URL string
 * Example: /(main)/intelligence -> /intelligence
 */
export function stripRouteGroup(path: string): string {
  // removes any /(<group>)/ segment from a URL string
  return path.replace(/\/$$[^/]+$$\//g, "/")
}
