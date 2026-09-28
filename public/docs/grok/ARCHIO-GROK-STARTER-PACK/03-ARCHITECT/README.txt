ARCHITECT — pack v3 (20 Sep 2026, D1)

IF THE BOT ALREADY EXISTS (built 17 / 19 Sep):
  REMOVE  current-state-audit-2026-08-16.md            (superseded by 13 — 20 Sep)
  REMOVE  00-founder-synthesis-EXCERPT-s6-object-schemas.md
  REMOVE  OWEN-ASK-AND-SECURITY-FLAG.md               (quoted the WRONG 08 line about copilot_events;
                                                       its Owen ask + security consequence are carried,
                                                       corrected, in D1-TECHNICAL-CONTEXT sections 3, 7, 10)
  REMOVE  02-revision-2026-09-17-kan-correction.md
  REMOVE  03-intent-capture-position.md
  REMOVE  10-kan-chain-evidence-ladder.md
  REPLACE 01-decision-ledger.md               with ../00-COMMON/01-decision-ledger.md
  REPLACE 08-architect-repo-facts.md          with ../00-COMMON/08-architect-repo-facts.md
                                              (copilot_events line corrected — dormant pattern)
  REPLACE 09b-glossary.md                     with ../00-COMMON/09b-glossary.md
  REPLACE README-source-of-truth-index.md     with ../00-COMMON/README-source-of-truth-index.md
  KEEP    11-founder-direction-2026-09-19.md  (unchanged) and 09a-governance-rules.md (unchanged rules;
                                              the new copy adds one line about ledger labels — optional replace)
  UPLOAD  ../00-COMMON/00-CURRENT-STATE-2026-09-20.md
  UPLOAD  ../00-COMMON/15-structural-map-v1.md
  UPLOAD  D1-TECHNICAL-CONTEXT-architect-2026-09-20.md   (the dated v0 verification extract of 13)
  REPLACE the bot's instructions with SYSTEM-PROMPT-architect.md — ONE PERSONA LINE IS CORRECTED:
          the 17 Sep "reuse the copilot_events event-log pattern" is superseded by the ✎ paragraph
          (copilot_events = dormant / dead pattern; writer exists, only call site commented out,
          /api/copilot/chat writes nothing, nothing reads it). The 19 Sep structural task is marked
          completed; the D1 next task is written but NOT sent.
  Then paste one message: "Correction: copilot_events is a dormant / dead pattern, not a pipeline —
  see your new instructions and D1-TECHNICAL-CONTEXT section 3. The 19 Sep structural task is
  complete (15 filed). D1 is open as inspection only. Read 00-CURRENT-STATE first. Do not start
  until a founder sends your D1 task."

IF BUILDING FROM SCRATCH:
 1. Paste ../00-COMMON/09a-governance-rules.md as the first message.
 2. Paste SYSTEM-PROMPT-architect.md as the bot's instructions.
 3. Upload all 8 files from ../00-COMMON.
 4. Upload D1-TECHNICAL-CONTEXT-architect-2026-09-20.md from this folder.
 5. Do NOT send the ★ NEXT TASK paragraph. A founder sends it when D1 Block 2 opens.

The bot's next job (when sent): ground the D1 decisions (DL-023 / 024 / 026 / 027 / 029) against
the repo facts and state their TECHNICAL IMPLICATIONS ONLY — no schemas, no policies, no
middleware rules, no build plan, no T1. It ends with ≤ 5 NEEDS-V0-VERIFICATION bullets that Luke
pastes to v0. It grounds; Luke + Kan decide.
Where 08 (17 Sep) and D1-TECHNICAL-CONTEXT (20 Sep) disagree, the dated extract wins.
Per docs/source-of-truth/09-bot-context-packs.md section 3.1 and 4.3.
