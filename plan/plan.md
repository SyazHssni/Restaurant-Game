# Rush Bite: Fast-Food Math Rush (Kedai Burger Matematik)

A cheerful 2D fast-food game in the browser. Pupils run a small burger shop: they take orders, work out the bill and the baki in their heads, give change from a Malaysian-ringgit cash register, then cook, assemble, pack and serve the food.
Getting the maths right builds trust and profit. If wrong change keeps happening, the shop can go bankrupt.

## Who it's for
- School pupils practising combined money operations (operasi gabungan melibatkan wang) in RM and sen.
- Teachers and parents who want maths practice that feels like a game rather than a worksheet.
- Played mainly on laptops or PCs, with mouse and keyboard.

## Core features and experience
- **All game text in Bahasa Melayu**: menus, tutorial, customer lines, tips, error messages and summaries.
- **Cash Register (the main skill)**: the receipt lists each item's unit price and quantity, plus the amount the customer pays. The pupil types the bill total on a number pad. The pad only records the answer and never calculates it. Next the pupil works out the baki and builds it from RM100, RM50, RM20, RM10, RM5 and RM1 notes and 50 sen, 20 sen and 10 sen coins. Each one shows how many are left in the drawer. Buttons: Undo Last, Clear, Recount and Give Change. Customers who pay the exact amount get a clearly labelled RM0.00 confirm step.
- **Wrong answers have real consequences**:
  - A wrong bill total costs patience and lowers the maths score. It does not change any money.
  - Giving too much change is logged as a cash shortage.
  - Giving too little change means refunding the difference and paying a complaint penalty.
  - The customer gets angry and the shop's reputation drops.
  - Repeated mistakes bring a visible "business at risk" warning, and eventually bankruptcy. One mistake never wipes the save.
- **Maths levels**:
  - Challenge is the default: answers stay hidden, orders are bigger, customers may pay with several notes, and some orders have small discounts.
  - Guided and Mental Maths can be chosen in Settings.
  - Hints are always available but reduce the bonus for that order.
- **Kitchen stations that keep running at the same time**:
  - Grill: patties need to be flipped and taken off on time, or they burn.
  - Fryer: fries and chicken bites.
  - Assembly: the burger is built layer by layer and checked against the ticket.
  - Drinks: choose size, flavour and ice, then fill the cup.
  - Packing and handoff: a checklist confirms the order before it is served.
- **Customers**: a counter queue with patience bars. Customers leave if they wait too long. At least 10 original customer types.
- **Order tickets**: an always-visible rail showing order number, items, special requests, status and warnings. Food can only be prepared after payment.
- **Scoring**: each order is scored on accuracy, speed and cooking quality, and earns stars and tips. Money results are reported separately from food results.
- **End-of-shift summary**: sales, ingredient costs, tips, refunds, cash shortages and net earnings, all of which add up correctly. Also shows bill-total accuracy, change accuracy, the correct-change streak, hints used and one worked example calculation.
- **Progress**: day-by-day campaign with menu unlocks, saved in the browser. A settings menu covers volume, reduced motion, text size, high contrast and timer difficulty.

## User flow
1. Main menu: Permainan Baru (New Game), Teruskan (Continue), Cara Bermain (How to Play), Tetapan (Settings), Kredit (Credits).
2. First game: a short hands-on tutorial covering the first customer, the register (bill, baki, change), grill, assembly, fries, drink, packing and serving. It can be skipped, and replayed from How to Play.
3. Shift (about 4 minutes): customers arrive, the pupil takes an order, handles payment at the register, then cooks, assembles, packs and serves while other orders keep cooking. After time runs out there is a 30-second grace period to finish orders already taken.
4. End-of-shift summary, then on to the next day (the upgrade shop arrives in Phase 2).
5. Progress saves automatically. Continue picks up from the last completed day.

## UI/UX feel
- Original cartoon look: warm cream background with tomato red, mustard yellow and lettuce green, plus charcoal text. Rounded shapes, soft shadows and big readable buttons.
- Wide desktop layout: status bar on top, customer queue and ticket rail always visible, numbered station tabs (keys 1–7), and a cash register that stands out on screen.
- Food, notes and coins are drawn as simple illustrations. Every status uses words or icons as well as colour.
- Small animations for flips, filling drinks, the cash drawer opening and stars being awarded. Most can be turned off with reduced motion.

## Implementation phases
**Phase 1 — MVP (built now)**
- Main menu, tutorial, counter queue, tickets and the full Cash Register with all nine denominations and its consequences.
- Grill, fryer, assembly, drinks and packing, all running at the same time.
- Patience and customers leaving, exact recipe checks, scoring, and a money ledger that adds up.
- Pause, the end-of-shift summary with maths and food results shown separately, and bankruptcy rules.
- The first few campaign days, saving in the browser, and basic settings.
- Launch menu: Classic Stack, Cheese Stack, fries, cola, lemon-lime soda and water, with more items unlocking over the first days.

**Phase 2 — Progression**
- Between-shift shop with 10+ working upgrades and 12+ décor items, plus a recipe book.
- A 20-day campaign, 12+ achievements, daily goals, and the full accessibility settings (colour-blind palette, keyboard shortcut list).

**Phase 3 — Expansion**
- Drive-through lane (from Day 5), combo meals, milkshakes, desserts and more sandwiches.
- Rush-hour and family-order events, a food critic day, and extra sound and animation polish.

## Assumptions
- The game is played inside this web app in the browser. No accounts, no server and no internet needed to play. Progress saves on each device's browser only, so teachers cannot see pupils' progress centrally.
- All text is in Bahasa Melayu only, with no English toggle. Recipe names from the brief (Classic Stack, etc.) are kept as in-game brand names.
- New games start in Challenge mode. The tutorial still gives step-by-step help so first-time pupils are not stuck, and Challenge rules apply from the first real shift.
- All prices are in 10-sen steps (there is no 5-sen coin). The prices from the brief are used as given, and every generated bill and change amount can always be paid with the drawer's notes and coins.
- Starting funds are RM300, reputation starts at 50/100, and the opening till float is as listed in the brief. Bankruptcy happens only after funds stay at or below RM0 for two completed shifts.
- Sound effects are simple, original and generated in-game. There is no music track.
- Laptops and PCs come first. Tablets and phones still work but get a simpler one-station-at-a-time layout.
- The upgrade shop, décor and achievements come in Phase 2. Until then, no button for them appears in the MVP.
