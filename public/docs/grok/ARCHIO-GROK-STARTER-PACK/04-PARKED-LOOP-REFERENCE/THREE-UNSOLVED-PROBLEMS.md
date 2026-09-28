# The three unsolved problems (Red Team brief)

*Listed verbatim in `docs/source-of-truth/09-bot-context-packs.md` §3 as part of the Red Team's context pack. Pointers below go to where each problem is already discussed in the common documents — no new analysis here.*

## (a) Weeks 1–4 value before the model has data

For the first month the product can offer only commodity value (R:R, risk %, rules matched — every broker ticket and gate app already shows these). Compounding insight needs 40+ records per trader.

- Where it is discussed: `03-intent-capture-position.md` §2.4 · `10-kan-chain-evidence-ladder.md` §2 Gap B and §3 row 3→4 · `02-revision-…-kan-correction.md` §3 point 2 ("the first review has to buy the second capture").
- Candidate bridges already on record (unproven): a human-written review, the Coverage Split, the room. Attack each.

## (b) The voluntary capture floor

The minimum human contribution is not zero: setup, thesis and invalidation never come from a broker. The claimed floor is one tap + optional one line. Nobody has observed a trader doing even that voluntarily, repeatedly.

- Where it is discussed: `03` §2.1, §2.3, §3 (ranked mechanisms) · `02` §3 · ledger DL-001, DL-012, DL-013 · `10` §3 row 0→1.
- Kill criterion on record: H1 in `02` §5.

## (c) Who the first traders are

No test population is currently reachable. Kan does not trade and has no students; whether Luke trades is unstated. Candidate populations are ranked in `02` §4, none proven.

- Where it is discussed: `02` §4 and §8 · ledger DL-009 (recruitment precedes product), DL-010 (nobody on the team is currently the user) · `03` §2.6.
