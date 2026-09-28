# PAIR FORENSICS — Opus 5.0 Masterplan
**Surface:** `WatchlistMatrix` ("Pairs you trade") in the Your-Space dashboard.
**Goal:** Replace decorative mini-charts with hard, glanceable trader telemetry per pair, and turn each row into a click-to-takeover *forensic dossier* — denser than the AI Dashboard or Account Asset Register pop-up.

---

## 1.  Two-Mode Panel
The `WatchlistMatrix` card has two states inside the *same physical card*:

| Mode | Trigger | Content |
|---|---|---|
| **LIST** (default) | initial / "back" button | Header KPI + 5 rows |
| **FORENSIC** | click any row | Full pair dossier replaces rows |

The card never grows — it morphs in place. AnimatePresence cross-fades the body. Header eyebrow swaps `WATCHLIST` to `PAIR FORENSICS`.

---

## 2.  LIST MODE — Per-Row Re-design
Replace the mini OHLC candle strip with the **Pair Stat Band**:

Five micro-stat cells separated by hairlines:

1. Pip-positive total (`+428p`) under tiny `TP-hits 31` line.
2. Pip-stop total (`−145p`) under tiny `SL-hits 16` line.
3. Net P&L USD (`+$3,148`) under `PF 2.95` (profit factor).
4. Frequency (`12/mo`) under best-session chip (e.g. `LDN-AM`).
5. Last-traded (`2h ago`) under heat chip (`HOT` / `COLD` / `NORMAL`).

Below the cells: a **win/loss-pip proportion bar** (1px tall) showing how much of the pair's pip volume came from wins vs stops.

Click anywhere on the row → ENTER FORENSIC MODE for that pair.
Hover keeps the existing preview popover (and its Pin-to-rail button).

---

## 3.  FORENSIC MODE — The Dossier (13 blocks)
3.1  Forensic Header (back arrow, pair, bias, live price, all-time P&L).
3.2  Hero Quartet — Total trades, WR, Profit factor, Expectancy.
3.3  Pip Waterfall — TP / partial / BE / SL / slippage segmented bar.
3.4  Account Distribution — per-account trade count, WR, P&L bars.
3.5  Day × Session Edge Heatmap (pair-specific 5×4 grid).
3.6  Time-of-Day Distribution — 24h frequency bars + WR line.
3.7  Setup Mix Donut + Legend — strategies used on this pair.
3.8  R-Multiple Histogram — −3R..+5R bucket counts + expectancy rule.
3.9  Hold-Time Profile — winners vs losers avg + P25/P75.
3.10 Direction Split — long vs short side-by-side.
3.11 Recent Trades Feed — last 8 trades, click expands journal note.
3.12 AI Verdict — what's working / watch / next action with confidence %.
3.13 Footer Action Rail — pause pair / set alert / open journal / export.

---

## 4.  Visual & Motion Rules
- **Palette:** VANTARY tokens only. Greens / reds reserved for win/loss totals + status dots.
- **Hairlines:** 1px `VANTARY.rule` between every block.
- **Density:** all cells must read in <3s. No decorative blobs.
- **Motion:** body cross-fade 240ms ease `[0.16, 1, 0.3, 1]`. Inner blocks stagger 40ms.
