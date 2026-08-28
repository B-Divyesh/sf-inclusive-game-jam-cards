# Inclusive Game Jam Cards

Inclusive Game Jam Cards helps an adult and child turn five small design choices into a keyboard-accessible browser game in one sitting. Pick a goal, controls, a twist, feedback, and an extra accessibility comfort; then play the result, print a paper playtest sheet, and download a standalone HTML game.

The tool is intentionally local-first and account-free. It does not send card choices, game ideas, or personal information anywhere.

Live: <https://inclusive-game-jam-cards.sociobot.in>

## Who it is for

Families, mentors, libraries, and first-time game makers who want to begin with a conversation and reach a small playable result without learning a heavyweight editor.

## Run locally

Requires a current Node.js LTS release.

```sh
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Test and build

```sh
npm test
npm run test:e2e
npm run build
```

The production build is written to `dist/`, with `dist/index.html` at its root. Preview it with `npm run preview`.

## How it works

- Vanilla TypeScript renders the five-step card workshop and game preview.
- The generated download is one self-contained HTML file with no runtime dependencies or external assets.
- A versioned service worker caches the public shell for offline use.
- No external fonts, scripts, analytics, accounts, or paid services are used.

The visual system and generated-image provenance are documented in [`.factory/design.md`](.factory/design.md). Verification and handoff notes are in [`.factory/handoff.md`](.factory/handoff.md).

## Deployment

Deploy the contents of `dist/` to Azure Static Web Apps. `public/staticwebapp.config.json` provides the navigation fallback and security headers; Vite copies it into the build.

## License

MIT. See [LICENSE](LICENSE).
