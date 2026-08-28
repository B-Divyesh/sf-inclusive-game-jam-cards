# Handoff — Inclusive Game Jam Cards

## What shipped

- A five-step, conversation-led card workshop for goal, controls, obstacle, feedback, and accessibility choices.
- Fifteen distinct mechanic cards with clear selection, backtracking, progress, empty selection guidance, and a one-click surprise recipe.
- A real 7×7 playable browser game. Recipe choices alter targets, input keys, obstacle behavior, feedback, and presentation. Every build has keyboard input, labeled touch controls, live status, restart, strong contrast, and no timer.
- A deliberate interaction between “Keep it calm” and “Wandering block”: the moving obstacle becomes static walls, and the interface explains the change.
- A self-contained downloadable HTML game with no external assets or runtime dependencies.
- A print-specific paper playtest sheet containing the selected recipe, a route sketch grid, and observation prompts.
- Offline shell caching and a visible offline status. No accounts, analytics, remote fonts/scripts, or persisted recipe data.
- Responsive layouts for 390 px phones and desktop, plus reduced-motion behavior.
- Privacy and terms pages, MIT license, deployment config, full README, and original-image provenance.

## Visual system and assets

The product-specific “Shape Workshop” generative-geometry system is documented in `.factory/design.md`. The original cut-paper hero was generated with the factory image deployment on 2026-08-28, manually reviewed for artifacts/branding/text, and delivered as 21 KB and 43 KB responsive WebP files. Source PNG and exact prompt sidecar are in `assets/src/`.

## Run and verify

```sh
npm install
npm test
npm run test:e2e
npm run build
npm run preview
```

The deployment command is exactly `npm run build`. Output lands in `dist/`, with `dist/index.html` at its root.

Verification on 2026-08-28:

- `npm test`: 5/5 unit tests passed.
- `npm run test:e2e`: 6/6 Playwright tests passed across desktop Chromium and a 390×844 Chromium profile, including first-visit offline reloads.
- Axe scan: zero serious or critical violations on both the landing page and completed game.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100.
- Lighthouse timings: FCP 0.9 s, LCP 1.4 s, total blocking time 40 ms, CLS 0.
- Production assets: JavaScript 24.44 KB (9.05 KB gzip), CSS 16.46 KB (4.46 KB gzip), hero WebP 21/43 KB.
- `npm audit --audit-level=high`: zero vulnerabilities.
- Lighthouse console audit: no browser console errors.

## Known gaps and next steps

- The success measure requires observation with ten real adult-child pairs; no user study was possible in this build environment. Run those sessions next and note where pairs hesitate, especially in the difference between “goal” and “feedback.”
- Browser print dialogs may add their own header/footer unless the user disables that option; the worksheet itself is laid out for one page.
- The game is intentionally one screen and one level. Add mechanics only after session evidence shows that pairs finish within 90 minutes and want another round.
