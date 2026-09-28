/**
 * Vantary Glass — shared "billion-dollar" design language.
 *
 * Single source of truth for the glassy / layered-shadow / hairline-rule
 * design used by the Forecast Room. Re-exported here so any surface on
 * the AI dashboard (Flight Deck, JarvisWelcomeBand, Equity panels,
 * Briefing Matrix, etc.) can import the SAME tokens + primitives.
 *
 * Usage:
 *   import { VT, rgba, GlassCard, Eyebrow, Caption, Hairline }
 *     from "@/components/vantary-glass"
 *
 * NOTE: this module re-exports `VT`, `rgba`, `amber()` directly from the
 * forecast room's token file (the canonical source). The PRIMITIVES
 * (GlassCard / Eyebrow / Caption / Hairline / StatNumber) live in
 * `./primitives.tsx`. The forecast hub will eventually be migrated to
 * import primitives from here as well — for now both copies match by
 * design contract.
 */

export {
  VT,
  rgba,
  amber,
  slate,
  VT_TYPE,
} from "@/components/forecast-hub/forecast-vantary-tokens"

export {
  GlassCard,
  Eyebrow,
  Caption,
  Hairline,
  StatNumber,
  seedFrom,
} from "./primitives"

export { useThemeAccent } from "./use-theme-accent"
export type { ThemeAccent, ThemeAccents } from "./use-theme-accent"
