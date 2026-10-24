# Rush Bite: Kedai Burger Matematik — PRD

## Original problem statement
User uploaded `fast_food_restaurant_game_master_prompt.md` (master build prompt for "Rush Bite: Fast-Food Math Rush") and said "follow instruction". Approved plan: browser 2D fast-food game, all text in Bahasa Melayu, pupils practise combined money operations (RM & sen): bill total from unit price × qty (+ discounts), baki (change) built from RM100/50/20/10/5/1 notes and 50/20/10 sen coins, consequences for mistakes (shortage, refund + complaint penalty, reputation, at-risk warning, bankruptcy after 2 shifts ≤ RM0), concurrent kitchen stations, scoring, end-of-shift summary, campaign saved in browser.

## Architecture
- Frontend-only React game (no backend use). State: `useReducer` with pure engine (`src/game/engine.js`), 100 ms delta-time loop, pause freezes all timers.
- Data/config: `src/game/config.js` (prices in integer sen, denominations, opening float, days 1–5 + scalable, customer types ×11, timings).
- `money.js` (integer-sen helpers, formatRM, parseRM, makeChange), `orders.js` (seedable generator, tenders always solvable), `scoring.js`, `summary.js`, `storage.js` (localStorage save/settings), `sound.js` (WebAudio generated SFX).
- UI: `src/screens/*` (MainMenu, ShiftScreen, SummaryScreen, SettingsScreen, InfoScreens) and `src/components/game/*` (StatusBar, CustomerQueue, TicketRail, StationTabs, Counter, Register, Grill, Fryer, Assembly, Drinks, Packing, Overlays, Art).
- Dev/test params: `?speed=N` (≤10) speeds the clock, `?seed=N` deterministic orders.

## Implemented (Phase 1 MVP) — 2026-06
- Main menu, new game confirm, continue, How to Play (+ replay tutorial), Settings (maths mode, timer difficulty, volume, text size, reduced motion, high contrast), Credits
- 9-step hands-on tutorial (skippable)
- Counter queue with patience, ticket rail, station tabs (keys 1–7), cash register with 9 denominations, stock counts, Undo/Clear/Recount/Give Change, exact-payment confirm, hints
- Grill, fryer, assembly, drinks, packing (incomplete warning) running concurrently
- Scoring (55/25/20), stars, tips, refunds, reputation, at-risk warning, insolvency/bankruptcy + restart
- End-of-shift summary (money ledger adds up, maths vs food results, worked example), day progression with unlocks (Days 1–5 content, scalable beyond)

## Backlog
- P1 (Phase 2): between-shift upgrade shop (10+ upgrades), décor (12+), recipe book, 20-day campaign tuning, 12+ achievements, daily goals, colour-blind palette, keyboard shortcut list
- P2 (Phase 3): drive-through (Day 5+), combos, milkshakes, desserts, rush-hour/family events, food critic day, more sound/animation polish
