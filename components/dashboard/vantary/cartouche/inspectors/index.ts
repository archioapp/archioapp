/* ═══════════════════════════════════════════════════════════════════════════
   GADGET INSPECTORS — registry barrel
   ───────────────────────────────────────────────────────────────────────────
   Importing this module once (high in the tree) registers every gadget's rich
   Inspector body into INSPECTOR_REGISTRY as an import side-effect. Each file
   calls registerInspector(id, def) at module scope.
   ═══════════════════════════════════════════════════════════════════════════ */

import "./firm-identity-inspector"
import "./equity-beacon-inspector"
import "./discipline-pulse-inspector"
import "./win-rate-heart-inspector"
import "./accuracy-engine-inspector"
import "./best-pair-inspector"
import "./session-clockwork-inspector"
import "./macro-pulse-inspector"
import "./last-5-trades-inspector"
import "./management-pulse-inspector"
import "./risk-envelope-inspector"
import "./daily-plan-inspector"
import "./goals-beacon-inspector"
