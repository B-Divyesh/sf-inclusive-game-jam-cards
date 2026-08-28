# Independent verification — FAIL

**Candidate:** `757be366dad70c0435c3de1f817d4b0fa5e5a4be` (`main`)

**Live URL:** <https://inclusive-game-jam-cards.sociobot.in/>

**Verified:** 2026-08-28 UTC from a clean checkout. Product source was not changed.

## Decision

**FAIL — do not release.** The live deployment is byte-for-byte the candidate build, so these are not deployment-only failures.

## First required checks

### Claims and demo

`.factory/claims.json` does not exist in the clean checkout (`rg --files -g claims.json` found no file). Consequently no declared claim tests could be run through the product demo. The work order explicitly makes this a release blocker.

### Cold first read

The live cold screen says “Pick five cards. Make a tiny game.” and “Turn ‘what if?’ into a keyboard-playable browser game—together.” Its primary action is “Start the card jam.” The “Deal me a surprise” button is a working one-click demo: it populates five cards and opens a game.

What it does and the first click are clear. It does **not** say the researched audience — an adult and child / first-time makers — in plain words; it says only “a one-sitting game jam for two.” The work order says failure to clearly answer *for whom* fails the candidate.

## Findings

| Severity | Finding | Fresh evidence |
|---|---|---|
| Blocker | Claims contract absent | `.factory/claims.json` is missing, so required claim tests could not be run. |
| Critical | Generated games can be unwinnable | Select **Collect three sparks / Arrow keys / Bouncy puddles / Cheering words / Keep it calm**, then move `Up × 5`, `Right × 2`. Live status: “Boing! The puddle bounced you back one space.” Required target `(2,1)` is a puddle and collision occurs before collection. Select **Collect three sparks / Arrow keys / Paper walls / Cheering words / Keep it calm**, then `Right × 3`, `Up`. Live status: “Bump! That shape blocks the way.” Required target `(3,5)` is a wall. The same wall state occurs for **Wandering block + Keep it calm**. At least 63/243 card combinations are impossible (collect+puddles: 27; collect+walls: 27; collect+wanderer+calm: 9). `src/game.ts` and generated `src/exporter.ts` perform the same obstacle-before-target handling, so download does not recover. |
| Blocker | First-read audience requirement fails | The live first screen never identifies an adult and child, family, mentor, or first-time makers. “For two” is not the required plain-language audience. |
| High | Finished SPA screen has no `<h1>` | After the one-click demo, Playwright found zero `h1` elements. Axe reported moderate `page-has-heading-one`; this violates the stated semantic baseline even though no serious/critical axe finding occurred. |
| High | Safe service-worker update is not established | Exact live `sw.js` uses fixed `const CACHE = 'shape-workshop-v1'` and cache-first `caches.match(url.pathname)`. Offline reload works, but an application-only deployment that does not change worker source can remain served from the old cached shell. A version-to-version deployment was unavailable, so a safe replacement path could not be demonstrated. |
| Medium | Mobile links miss the 44×44px touch-target baseline | At 390px: home brand `133×42`, Privacy `52×17`, Terms `44×17`. |
| Medium | Response hardening is incomplete | Responses have HSTS, no-referrer, nosniff, and restrictive Permissions-Policy but lack CSP and frame control (`X-Frame-Options`/`frame-ancestors`). Lighthouse informational audits say “No CSP found in enforcement mode” and “No frame control policy found.” |
| Low | Immutable hashed-asset caching absent | JS, CSS, and WebP return `cache-control: public, must-revalidate, max-age=30`, not long-lived immutable caching. |

## Passing evidence

### Clean repository checks

```text
npm ci                         PASS — 60 packages installed, 0 vulnerabilities
npm test                       PASS — 5/5 Vitest tests
npx playwright test            PASS — 6 project runs; result status passed
npm run build                  PASS — tsc --noEmit and Vite build
npm audit --audit-level=high   PASS — 0 vulnerabilities
```

There is no lint script. Build output: JS `24,438 B` (`9.05 kB` gzip), CSS `16,462 B` (`4.46 kB` gzip), hero WebP `21,504/43,792 B`; these meet stated byte budgets.

### Deployment identity

Fresh SHA-256 comparisons matched local candidate output to production for `index.html`, `assets/index-D0ZPTU2p.js`, `assets/index-Dksf21UF.css`, `art/shape-workshop-hero-640.webp`, `sw.js`, `privacy/index.html`, and `terms/index.html`.

### Browser/product QA

- Desktop and 390×844 production sessions had no console/page errors and no mobile horizontal overflow. Main buttons were 51px high; game controls were 46×46px.
- A valid keyboard-only route (`reach / arrows / puddles / words / patterns`) was selected using Space and won in 12 Arrow-key moves: “You reached the star! You won in 12 moves.” Invalid `x` input did not change moves; lower-edge input announced recovery guidance.
- Empty-state recovery works: Next begins disabled with “Pick one card to continue”; a selection sets `aria-pressed=true`, announces the selection, and enables Next.
- `shape-quest-game.html` downloads, contains no external HTTP(S) URL, and runs as a standalone local game with title and `<h1>`; print media displays the paper playtest sheet and hides the workshop.
- The first Tab exposes the skip link with visible `rgb(39, 126, 174) solid 3px` outline and 4px offset. Reduced-motion emulation changes animation duration to `0.00001s`.
- Service worker registered at `/sw.js`; after one online visit, an offline reload showed “You’re offline—and everything here still works.” Current cache: `shape-workshop-v1`.
- Cold network capture requested only the product origin (document, local JS/CSS, local hero). No third-party fonts/scripts, telemetry, analytics, account, API, storage, or sign-in flow exists. Rate-limit and Entra checks are therefore not applicable.

### Accessibility

- Axe live landing page: zero serious/critical findings on desktop and 390px.
- Axe live completed game: zero serious/critical findings; moderate `page-has-heading-one` and `landmark-complementary-is-top-level`.
- Axe standalone exported game: zero findings.

### Lighthouse

Lighthouse 13.4.1 mobile run generated Performance **98**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP **1.7 s**, LCP **2.2 s**, TBT **0 ms**, CLS **0**, interactive **1.7 s**. Chromium crashed during full-page screenshot/BFCache collection, so the command exited non-zero; the report is useful measurement evidence, not a clean Lighthouse execution.

## Retest criteria

1. Add `.factory/claims.json` and run every listed claim via the live demo entry point.
2. Make every selectable recipe winnable in both hosted and exported games; add exhaustive generation/playability tests.
3. State the adult-and-child/first-time-maker audience on the cold screen; ensure every SPA state has one meaningful `<h1>` and valid landmark structure.
4. Fix all 44×44px targets, version and test service-worker update behavior, set immutable hashed-asset caching, and add CSP/frame protections.
5. Build/deploy a new candidate and request fresh independent verification.
