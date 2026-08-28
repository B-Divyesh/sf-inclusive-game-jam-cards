import './styles.css';
import { blankRecipe, categories, choiceFor, isComplete, surpriseRecipe, type Recipe } from './cards';
import { TinyGame } from './game';
import { buildGameHtml, downloadText, recipeLines } from './exporter';

let recipe: Recipe = blankRecipe();
let step = -1;

const app = document.querySelector<HTMLDivElement>('#app')!;

function shell(content: string): string {
  return `<div class="offline-note" data-offline hidden role="status"><span aria-hidden="true">○</span> You’re offline—and everything here still works.</div>
    <header class="site-header"><a class="brand" href="/" aria-label="Inclusive Game Jam Cards home"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><span>Game Jam<br><strong>Cards</strong></span></a><nav aria-label="Main navigation"><a href="#how-it-works">How it works</a><a href="#grown-ups">Grown-up corner</a></nav></header>
    <main id="main">${content}</main>
    <footer><div><span class="brand-mark mini" aria-hidden="true"><i></i><i></i><i></i></span><p><strong>Inclusive Game Jam Cards</strong><br>Make one small, welcoming game together.</p></div><p><a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a><br><small>Original AI-generated hero art is disclosed in the project design notes. No accounts. No tracking.</small></p></footer>`;
}

function hero(): void {
  app.innerHTML = shell(`<section class="hero">
      <div class="hero-copy"><p class="kicker"><span aria-hidden="true">✦</span> A one-sitting game jam for two</p><h1>Pick five cards.<br><em>Make a tiny game.</em></h1><p class="lede">Turn “what if?” into a keyboard-playable browser game—together. No code, no account, and no blank screen to fear.</p><div class="hero-actions"><button class="button primary" data-start type="button">Start the card jam <span aria-hidden="true">→</span></button><button class="button secondary" data-surprise type="button"><span aria-hidden="true">✺</span> Deal me a surprise</button></div><p class="time-note"><span aria-hidden="true">◷</span> About 20 minutes to first play</p></div>
      <picture class="hero-art"><source media="(max-width: 650px)" srcset="/art/shape-workshop-hero-640.webp"><img src="/art/shape-workshop-hero-960.webp" width="960" height="640" fetchpriority="high" alt="Cut-paper game pieces forming a tiny maze with a player, goal, arrow, and welcoming arch."></picture>
    </section>
    <section class="how" id="how-it-works" aria-labelledby="how-title"><div><p class="eyebrow">The whole recipe</p><h2 id="how-title">A conversation first.<br>A game right after.</h2></div><ol class="steps-preview">${categories.map((category, index) => `<li><span class="shape shape-${category.id}" aria-hidden="true">${category.symbol}</span><span><small>0${index + 1}</small><strong>${category.short}</strong></span></li>`).join('')}</ol></section>
    <section class="promise"><div class="promise-mark" aria-hidden="true">∩</div><div><p class="eyebrow">Built-in welcome mat</p><h2>Accessibility isn’t a bonus card.</h2><p>Every game starts with keyboard controls, on-screen buttons, strong contrast, no timer, clear words, and reduced-motion support. Your fifth card adds another comfort.</p></div></section>
    <section class="grown" id="grown-ups"><details><summary>Grown-up corner <span>What happens to our work?</span></summary><div><p>Your choices stay in this browser tab. We don’t collect names, progress, or game ideas. The finished game downloads as one HTML file you can open, remix, or share yourself.</p><p>The printable sheet helps you run a quick paper playtest before changing the game.</p></div></details></section>`);
  bindGlobal();
  app.querySelector('[data-start]')?.addEventListener('click', () => { step = 0; renderWorkshop(); });
  app.querySelector('[data-surprise]')?.addEventListener('click', () => { recipe = surpriseRecipe(); step = categories.length; renderFinish(); });
}

function progress(): string {
  return `<nav class="progress" aria-label="Game recipe progress"><ol>${categories.map((category, index) => {
    const selected = Boolean(recipe[category.id]);
    const current = index === step;
    return `<li class="${selected ? 'done' : ''} ${current ? 'current' : ''}"><button type="button" data-go-step="${index}" ${index > step && !selected ? 'disabled' : ''} ${current ? 'aria-current="step"' : ''}><span class="progress-shape" aria-hidden="true">${selected ? '✓' : category.symbol}</span><span>${category.short}</span></button></li>`;
  }).join('')}</ol></nav>`;
}

function renderWorkshop(): void {
  const category = categories[step];
  const selectedId = recipe[category.id];
  app.innerHTML = shell(`<section class="workshop">${progress()}<div class="step-heading"><p class="step-number">Card ${step + 1} of ${categories.length}</p><h2 tabindex="-1">${category.title}</h2><p>${category.prompt}</p></div>
    <div class="choice-grid" role="group" aria-label="${category.title}">${category.choices.map((choice) => `<button class="choice-card ${selectedId === choice.id ? 'selected' : ''}" type="button" data-choice="${choice.id}" aria-pressed="${selectedId === choice.id}"><span class="card-check" aria-hidden="true">${selectedId === choice.id ? '✓' : ''}</span><span class="card-symbol shape-${category.id}" aria-hidden="true">${choice.symbol}</span><strong>${choice.title}</strong><span>${choice.description}</span><small>${choice.tryIt}</small></button>`).join('')}</div>
    <p class="selection-note" data-selection aria-live="polite">${selectedId ? `${choiceFor(category.id, selectedId).title} is in your recipe.` : 'Pick one card to continue.'}</p>
    <div class="workshop-actions"><button class="button secondary" type="button" data-back>${step === 0 ? 'Back to start' : '← Previous card'}</button><button class="button primary" type="button" data-next ${selectedId ? '' : 'disabled'}>${step === categories.length - 1 ? 'Build our game →' : 'Next card →'}</button></div></section>`);
  bindGlobal();
  bindProgress();
  app.querySelector<HTMLElement>('.step-heading h2')?.focus();
  app.querySelectorAll<HTMLButtonElement>('[data-choice]').forEach((button) => button.addEventListener('click', () => {
    recipe[category.id] = button.dataset.choice ?? '';
    app.querySelectorAll<HTMLButtonElement>('[data-choice]').forEach((card) => { const picked = card === button; card.classList.toggle('selected', picked); card.setAttribute('aria-pressed', String(picked)); card.querySelector('.card-check')!.textContent = picked ? '✓' : ''; });
    const next = app.querySelector<HTMLButtonElement>('[data-next]'); if (next) next.disabled = false;
    const note = app.querySelector<HTMLElement>('[data-selection]'); if (note) note.textContent = `${choiceFor(category.id, recipe[category.id]).title} is in your recipe.`;
  }));
  app.querySelector('[data-back]')?.addEventListener('click', () => { if (step === 0) hero(); else { step -= 1; renderWorkshop(); } });
  app.querySelector('[data-next]')?.addEventListener('click', () => { if (!recipe[category.id]) return; step += 1; if (step >= categories.length) renderFinish(); else renderWorkshop(); });
}

function renderFinish(): void {
  if (!isComplete(recipe)) { step = 0; renderWorkshop(); return; }
  const lines = recipeLines(recipe);
  const calmSwap = recipe.access === 'calm' && recipe.obstacle === 'wanderer';
  app.innerHTML = shell(`<section class="finish">${progress()}<div class="finish-heading"><div><p class="kicker"><span aria-hidden="true">✦</span> Your first build is ready</p><h2 tabindex="-1">Play it. Notice it.<br>Change one thing.</h2><p>This is a real prototype, not a picture. Try the controls, then hand them to your co-maker.</p></div><button class="button secondary" type="button" data-edit>← Change cards</button></div>
    ${calmSwap ? '<p class="combo-note"><strong>Your cards teamed up:</strong> “Keep it calm” turns the wandering block into still paper walls.</p>' : ''}
    <div class="build-layout"><section class="game-wrap" aria-label="Playable game" data-game></section><aside class="recipe"><p class="eyebrow">Our five-card recipe</p><ol>${lines.map((line, index) => `<li><span>0${index + 1}</span><div><small>${line.label}</small><strong>${line.value}</strong></div></li>`).join('')}</ol><button class="button ink" type="button" data-play>Focus game and play</button></aside></div>
    <section class="take-it"><div><p class="eyebrow">Take it with you</p><h2>One file. Your game.</h2><p>Download the standalone HTML to play offline or open it in a code editor. No library or account required.</p></div><div class="take-actions"><button class="button primary" type="button" data-download>Download game.html <span aria-hidden="true">↓</span></button><button class="button secondary" type="button" data-print>Print playtest sheet <span aria-hidden="true">▧</span></button></div></section>
    <section class="playtest-sheet" aria-labelledby="sheet-title"><header><p>Inclusive Game Jam Cards</p><h2 id="sheet-title">Tiny game playtest</h2><p>Game: ____________________ &nbsp; Tester: ____________________</p></header><div class="sheet-recipe"><h3>Our recipe</h3>${lines.map((line) => `<p><strong>${line.label}:</strong> ${line.value}</p>`).join('')}</div><div class="sheet-grid"><div><h3>Before playing</h3><p>Draw the route you expect:</p><div class="draw-box" aria-hidden="true"></div></div><div><h3>After playing</h3><p>Circle one: 😊 Easy &nbsp; 😐 Tricky &nbsp; 😵 Stuck</p><p>I knew what to do because…</p><span class="write-line"></span><span class="write-line"></span><p>One thing I would change…</p><span class="write-line"></span><span class="write-line"></span></div></div><p class="sheet-footer">Swap one card, then test again. Small changes teach us big things.</p></section>
    <p class="download-note" data-download-note aria-live="polite"></p></section>`);
  bindGlobal(); bindProgress();
  const game = new TinyGame(app.querySelector<HTMLElement>('[data-game]')!, recipe);
  app.querySelector<HTMLElement>('.finish-heading h2')?.focus();
  app.querySelector('[data-edit]')?.addEventListener('click', () => { step = 0; renderWorkshop(); });
  app.querySelector('[data-play]')?.addEventListener('click', () => game.focus());
  app.querySelector('[data-download]')?.addEventListener('click', () => { downloadText('shape-quest-game.html', buildGameHtml(recipe)); const note = app.querySelector<HTMLElement>('[data-download-note]'); if (note) note.textContent = 'Your standalone game file was downloaded.'; });
  app.querySelector('[data-print]')?.addEventListener('click', () => window.print());
}

function bindProgress(): void {
  app.querySelectorAll<HTMLButtonElement>('[data-go-step]').forEach((button) => button.addEventListener('click', () => { if (button.disabled) return; step = Number(button.dataset.goStep); renderWorkshop(); }));
}

function bindGlobal(): void {
  const updateNetwork = (): void => { const note = app.querySelector<HTMLElement>('[data-offline]'); if (note) note.hidden = navigator.onLine; };
  updateNetwork(); window.ononline = updateNetwork; window.onoffline = updateNetwork;
}

hero();

if ('serviceWorker' in navigator && import.meta.env.PROD) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
