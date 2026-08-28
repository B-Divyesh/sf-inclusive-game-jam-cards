# Handoff — Independent verification result: FAIL

**Candidate:** `757be366dad70c0435c3de1f817d4b0fa5e5a4be`

**Live deployment checked:** <https://inclusive-game-jam-cards.sociobot.in/>
**Verified:** 2026-08-28 UTC

Do **not** release this candidate. Fresh SHA-256 checks confirm the production HTML, JavaScript, CSS, service worker, hero asset, and legal pages exactly match a clean build from the candidate; this is not a deployment-only failure.

## Blocking defects

- `.factory/claims.json` is missing, which the verification work order expressly makes release-blocking.
- The normal **Collect three sparks + Bouncy puddles** game is unwinnable: its required target is at `(2,1)`, which is also a puddle; collision bounces the player before collection.
- The normal **Collect three sparks + Paper walls** game is unwinnable: its required target is at `(3,5)`, which is also a wall. **Wandering block + Keep it calm** maps to the same walls. At least 63/243 selectable recipes are unwinnable in both the hosted and exported games.
- The cold screen says “game jam for two,” but not the researched adult-and-child/first-time-maker audience in plain language, failing the strict first-read acceptance rule.

## Other defects

- The completed SPA has no `<h1>` and axe reports the moderate `page-has-heading-one` violation.
- The cache-first service worker uses the fixed `shape-workshop-v1` cache name; offline reload works, but a safe version-to-version app update path is not established.
- At 390px, the brand, Privacy, and Terms links are below 44×44px targets (133×42, 52×17, and 44×17).
- Hashed assets have `Cache-Control: public, must-revalidate, max-age=30`, not immutable long-lived caching; deployment responses also lack CSP/frame protection.

## What was verified

`npm ci`, `npm test` (5/5), the available Playwright suite (6 project runs, status passed), `npm run build`, and `npm audit --audit-level=high` passed. Desktop and 390px product QA exercised selection/recovery, keyboard gameplay, touch controls, download/open of the standalone game, print media, visible focus, reduced motion, offline reload, privacy/network behavior, headers, and axe scans. No console/page errors or serious/critical axe findings were observed. The printable sheet works and the generated HTML is self-contained; those successes do not remedy the invalid recipe combinations.

See `.factory/verification.md` for exact reproduction, evidence, quality measurements, limitations, and retest criteria.

## Reproduce

```sh
npm ci
npm test
npx playwright test
npm run build
npm audit --audit-level=high
```

## Next steps

1. Add the mandatory claims manifest and execute every claim through the real demo entry point.
2. Make generation constraints exhaustive: every selectable recipe must be winnable in hosted and exported games.
3. State the adult-and-child audience on the cold screen, restore one `<h1>` in every SPA state, and fix touch target sizes.
4. Version/test service-worker updates; set immutable cache headers and CSP/frame protections.
5. Build/deploy a new candidate and request fresh independent verification.
