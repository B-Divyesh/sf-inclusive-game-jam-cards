# Visual thesis — The Shape Workshop

## Direction and rationale

**Generative geometry** becomes a shared tabletop workshop: every choice is a shape, and the chosen shapes visibly assemble into a tiny game. This suits an adult and child making together because it makes abstract design decisions concrete without making the interface babyish. The product feels like cut paper, screen-printing ink, and graph paper rather than an editor dashboard.

The interface is deliberately single-mode light. A warm paper canvas is essential to the physical-card metaphor; dark ink panels provide contrast and depth without needing a second theme. The generated game itself inherits the same high-contrast palette.

## Palette

- `paper #FFF8E7` — warm background; less clinical than white
- `paper-deep #F2E6C8` — section fields and card backs
- `ink #16213E` — primary text and outlines (13.6:1 on paper)
- `ink-soft #48506A` — secondary copy (7.1:1 on paper)
- `coral #C63B30` — primary game piece and decisive actions; white text clears 4.5:1
- `lemon #F4C84A` — goal/celebration surfaces; always paired with ink
- `mint #58BFA3` — accessibility and successful state; paired with ink
- `sky #60A5D8` — feedback and focus accents
- `white #FFFFFF` — raised surfaces
- `danger #A52A2A` — errors with an icon and explanatory copy

All text combinations meet WCAG AA. Selected states use fill, outline, a check mark, and text—not color alone.

## Type

- Headings: `Arial Rounded MT Bold`, `Trebuchet MS`, system sans-serif. Rounded terminals echo counters and tokens while remaining self-hosted/system-native.
- Body and utility: `Atkinson Hyperlegible Next` when locally available, falling back to `Atkinson Hyperlegible`, `Verdana`, system sans-serif. The fallback stack is intentionally optimized for distinguishable letterforms. No remote fonts.
- Scale: 16, 18, 21, 28, 40, 56 px; body line height 1.55; readable measure capped at 68 characters.

## Spacing and shape language

- 4 px base with 8, 12, 16, 24, 32, 48, 64 px steps.
- Thick 2–3 px ink outlines; 12–20 px corner radii.
- Every category has a geometric mark: goal/circle, control/arrow, obstacle/diamond, feedback/burst, access/arch.
- Shadows are hard offset “paper layers,” never blurred glass.
- Cards are used only for independent mechanic choices. Narrative guidance is unboxed and grouped by space.

## Interaction grammar

- The five-step journey stays visible as a row of shapes. The current one grows and receives an ink outline.
- Selecting a mechanic depresses the card by its shadow depth and adds a plain-language confirmation.
- The preview is not ornamental: it is the actual generated game. “Play” mode gives it keyboard focus; “Change cards” returns to the workshop.
- Primary actions are coral with a small directional arrow. Secondary actions are paper/ink. Touch targets are at least 44 px.
- A compact “Grown-up corner” disclosure keeps implementation notes available without interrupting the child-facing flow.

## Motion policy

- Choice changes: 180 ms transform and opacity, physically moving down into the card stack.
- Step changes: 240 ms cross-fade with a short horizontal translation from the selected card’s direction.
- Game pieces move only in response to input; celebration particles run once, never loop.
- With `prefers-reduced-motion: reduce`, all transitions become instant, particles are replaced by a static success ring, and smooth scrolling is disabled.

## Responsive intent

- Desktop: introduction and original illustration share a two-column stage; card choices use three columns; the finished game and its recipe sit side by side.
- At 390 px: illustration becomes a shallow scene, choices stack as full-width rows, the step labels shorten, and game controls become a thumb-friendly two-column pad. No action bar is fixed, so content never collides with device safe areas.

## Asset plan and provenance

### Hero illustration

A single original raster illustration shows five paper-mechanic shapes converging into a miniature browser-game board. It explains the product promise before any reading. The UI’s category glyphs and game sprites are hand-authored CSS/SVG geometry so they stay crisp and editable.

Prompt sheet:

> Use case: stylized-concept. Asset type: wide landing-page hero illustration. Primary request: an overhead tabletop construction scene where five bold paper geometry pieces—a coral circle player, lemon star goal, ink-blue arrow control, mint arch accessibility gate, and sky-blue feedback burst—converge into one tiny playable maze board. Scene/backdrop: warm recycled cream graph paper with subtle fibers and sparse registration marks. Style/medium: sophisticated cut-paper collage with screen-printed ink, clean geometric edges, tactile shadows, editorial children’s museum quality. Composition/framing: wide 3:2 composition, main assembled board centered, generous calm margins, readable at small size. Lighting/mood: gentle top-left studio light, curious and collaborative. Color palette: warm cream, deep navy ink, tomato coral, sunflower yellow, sea-glass mint, clear sky blue. Materials/textures: layered matte paper, slight ink misregistration, no plastic gloss. Constraints: abstract pieces only, no people, no hands, no interface screenshot. Avoid: text, letters, numbers, watermark, logo, gradients, branded characters, photorealistic objects, clutter, neon, purple.

- Generator: factory image deployment through `/opt/fleet/lib/gen-image.sh`
- Planned source: `assets/src/shape-workshop-hero.png`
- Planned delivery: responsive WebP in `public/art/`
- License: original generated asset produced for this MIT-licensed project.

## Accessibility notes

The illustration is supplementary and receives concise alt text. Instructions are never embedded in images. Focus is a 3 px sky outline with a 3 px paper gap. The generated game has an instruction region, live status, labeled buttons, redundant on-screen controls, and no time pressure.
