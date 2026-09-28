/**
 * Generate a UUID that works in both browser and Node.js environments
 * Falls back to crypto.randomUUID() if available, otherwise uses Math.random()
 */
export function generateUUID(): string {
  // Check if we're in a browser environment with crypto.randomUUID support
  if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID()
  }

  // Check if we're in Node.js environment with crypto.randomUUID support
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback to Math.random() based UUID generation
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
