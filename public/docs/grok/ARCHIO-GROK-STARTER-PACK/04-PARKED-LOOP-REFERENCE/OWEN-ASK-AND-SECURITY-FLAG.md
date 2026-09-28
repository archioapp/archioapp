# The Owen ask and the SECURITY-FLAG (Architect brief)

*Both items are listed in `docs/source-of-truth/09-bot-context-packs.md` §3 as part of the Architect's context pack. The text below is quoted from the common documents; nothing is added.*

## 1. The Owen / TradeLocker ask — design as if the answer is no

From `09b-glossary.md` (People/partners):

> Owen (TradeLocker; ask = read-only order history incl. pending/bracket orders, no execution; never say "sixth-tab killer")

From `01-decision-ledger.md` DL-004 (PROPOSED):

> TradeLocker is a read-only data partner in v2; no execution before v3 evidence. … Assumptions: read-only fills are obtainable via Brand API / BrandSocket or per-user export.

From `03-intent-capture-position.md` §2.2:

> Read-only pending-order data is the ask to Owen. Cohort 1 is designed as if that ask is refused.

From `02-revision-…-kan-correction.md` §3 point 1:

> read-only order history (not just fills) *is* the intent data for bracket traders. It is not yet secured; it is the one thing to ask Owen for.

Design consequence for every spec: CSV import is the outcome lane in v0; broker read-only is v2; broker write never appears.

## 2. SECURITY-FLAG — `copilot_events` open insert policy

From `08-architect-repo-facts.md`:

> `public.copilot_events` (`scripts/copilot-tables.sql`) — `id uuid, type text, ts bigint, session_id text, user_id uuid, context jsonb, data jsonb`. Written from `app/api/copilot/chat`. **SECURITY-FLAG:** RLS insert policy is `with check (true)` — anyone can insert. Must be closed before real trader data.

Design consequence: any spec that reuses the `copilot_events` pattern for Decision Records lists closing this policy as a prerequisite, not a follow-up.
