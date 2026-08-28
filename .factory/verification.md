# Independent verification — FAIL

**Candidate:** `757be366dad70c0435c3de1f817d4b0fa5e5a4be` (`main`)

**Live URL:** <https://inclusive-game-jam-cards.sociobot.in>

**Verified:** 2026-08-28, from a clean checkout. This is an independent release decision, not a re-statement of the builder handoff.

## Decision

**FAIL — do not release this candidate.** The live deployment exactly matches the candidate build, so the failures below are not a deployment-only issue.

## Release blockers

### BLOCKER — required claims contract is absent

The first required check found no `.factory/claims.json` in the clean checkout (`rg --files -g claims.json` returned no file). Therefore no listed claim tests could be run via the demo entry point. The work order explicitly makes a missing manifest release-blocking.

### CRITICAL — normal card choices generate games that cannot be won

The product promises a playable generated prototype, but its independently selectable cards allow impossible states in both the hosted game and downloaded HTML game.

| Recipe selections | Reproduction on live deployment | Why completion is impossible |
| --- | --- | --- |
| Goal **Collect three sparks** + Twist **Bouncy puddles** | Select Arrow keys, Cheering words, Keep it calm; move `Up × 5`, `Right × 2`. Live status says: “Boing! The puddle bounced you back one space.” | One required target is at `(2,1)`, also a puddle. Collision bounces before target collection, so the target can never be collected. |
| Goal **Collect three sparks** + Twist **Paper walls** | Select Arrow keys, Cheering words, Keep it calm; move `Right × 3`, `Up`. Live status says: “Bump! That shape blocks the way. Try another direction.” | One required target is at `(3,5)`, also a wall. Collision prevents entry. |

The same wall condition also occurs for **Wandering block** plus **Keep it calm**, because that accessibility card changes the obstacle to walls. Thus at least 63 of 243 independently selectable recipes (25.9%) are unwinnable: collect+puddles (27), collect+walls (27), and collect+wanderer+calm (9). The deployed JS hash matches the build hash and `src/game.ts` plus `src/exporter.ts` duplicate this collision/target ordering, so downloading does not recover from the defect.

### HIGH — cold first-read does not state the intended audience in plain words

Cold desktop and 390 px mobile reads say “A one-sitting game jam for two” and “together,” but do not say **adult and child**, family, mentor, or first-time makers anywhere on the first screen. It clearly says what it does and the primary first click is “Start the card jam.” “Deal me a surprise” does take one click to a randomly populated playable recipe and therefore satisfies the sample/demo interaction in substance. Per the work order’s strict first-read rule, “for two” is not a plain answer to *for whom* in the researched brief, so this independently fails that acceptance check.

## Other findings

### MEDIUM — mobile touch-target requirement is not met

At the required 390 px viewport, computed live target boxes were: home brand `133 × 42` px, Privacy `52 × 17` px, and Terms `44 × 17` px. These are interactive links below the required 44 × 44 px target size.

### MEDIUM — deployment lacks a Content-Security-Policy

Live HTML, JS, CSS, privacy, terms, and service-worker responses have HSTS, `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, and a restrictive `Permissions-Policy`, but no `Content-Security-Policy` header. In particular, there is no `frame-ancestors` clickjacking protection.

### LOW — immutable asset caching policy is missing

The hashed JS/CSS and WebP responses all use `Cache-Control: public, must-revalidate, max-age=30`, not long-lived immutable caching. This misses the static-product caching requirement and unnecessarily revalidates first-load assets.

## Evidence from successful checks

- Clean install: `npm ci` completed; `npm audit --audit-level=high` found zero vulnerabilities.
- Repository checks: `npm test` passed (5/5); `npm run test:e2e` passed (3 tests across desktop and mobile = 6 project runs; Playwright result status `passed`); `npm run build` passed, including `tsc --noEmit`. There is no lint script.
- Production output: JS 24,438 bytes (9,050 gzip), CSS 16,462 bytes (4,462 gzip), responsive hero WebP 21,504/43,792 bytes — within stated byte budgets.
- Deployed parity: SHA-256 of local `dist/index.html`, `index-D0ZPTU2p.js`, and `index-Dksf21UF.css` exactly matched fresh live responses. The live `index.html` references those same asset hashes.
- Product path: desktop and 390 px mobile completed the five-card workshop; normal card selection changes, disabled Next before selection, backtracking, keyboard Arrow input, on-screen movement, restart, printable worksheet trigger, and downloaded `shape-quest-game.html` were exercised. The generated 5,506-byte HTML contains no `https://`; executed standalone with no network request or console error, and a Move up click incremented the counter.
- Keyboard/reduced motion: first Tab exposes the visible skip link (`216 × 44.8` px); Tab/Enter completed all five choices on mobile with no console error. Reduced-motion emulation reports `scroll-behavior: auto` and `0.01 ms` transition/animation durations.
- Accessibility: independent axe scans on live landing and completed game at desktop and 390 px found zero serious/critical violations; privacy and terms likewise had zero serious/critical violations. The landing has a title, `lang=en`, one h1, main, meaningful hero alt, and no console/page errors in tested flows.
- Privacy/network: fresh live loads requested only `inclusive-game-jam-cards.sociobot.in`; no third-party scripts/fonts/analytics were observed. Browser checks found no cookies, localStorage, sessionStorage, or IndexedDB; only the disclosed `shape-workshop-v1` service-worker cache.
- PWA: live service worker registered and `registration.update()` completed against `/sw.js`; after first visit, offline reload rendered the landing h1 and visible offline status with no errors. A second deployed service-worker version was not available, so an actual version-to-version replacement could not be observed.
- Lighthouse mobile (live; Chromium): Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 50 ms, CLS 0.
- Static app only: no API endpoints, product-unlock calls, persistence service, or sign-in flow exist, so API rate-limit and Entra tenant checks are not applicable.

## Retest criteria

1. Add `.factory/claims.json` and run every declared test through the real demo entry point.
2. Ensure every possible selectable recipe is winnable (or constrain/transform incompatible cards before building) in both hosted and exported games; add exhaustive generation/playability tests.
3. State the adult-and-child/first-time-maker audience on the cold first screen in plain language.
4. Correct 44 × 44 px target sizes, add a CSP including `frame-ancestors`, and deploy immutable cache headers for hashed assets.
5. Re-run this verification against a new committed candidate and live URL.
