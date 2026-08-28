import type { Recipe } from './cards';

type Point = { x: number; y: number };

const SIZE = 7;
const start: Point = { x: 0, y: 6 };
const wallCells = ['1,1', '1,2', '2,2', '4,1', '4,2', '4,3', '2,5', '3,5'];
const puddleCells = ['2,1', '4,2', '3,4'];
const targets: Record<string, Point[]> = {
  reach: [{ x: 6, y: 0 }],
  collect: [{ x: 2, y: 1 }, { x: 5, y: 3 }, { x: 3, y: 5 }],
  rescue: [{ x: 5, y: 1 }, { x: 2, y: 3 }],
};

export class TinyGame {
  private position = { ...start };
  private previous = { ...start };
  private collected = new Set<string>();
  private trail = new Set<string>();
  private moves = 0;
  private won = false;
  private movingBlock = { x: 3, y: 3 };

  constructor(private root: HTMLElement, private recipe: Recipe) {
    this.root.innerHTML = this.shell();
    this.root.querySelector('[data-board]')?.addEventListener('keydown', (event) => this.onKey(event as KeyboardEvent));
    this.root.querySelectorAll<HTMLButtonElement>('[data-move]').forEach((button) => {
      button.addEventListener('click', () => this.move(button.dataset.move ?? ''));
    });
    this.root.querySelector<HTMLButtonElement>('[data-reset]')?.addEventListener('click', () => this.reset());
    this.render('Game ready. Start in the bottom-left corner.');
  }

  focus(): void { this.root.querySelector<HTMLElement>('[data-board]')?.focus(); }

  private shell(): string {
    const keyHelp = this.recipe.control === 'arrows' ? 'arrow keys' : this.recipe.control === 'wasd' ? 'W, A, S, and D keys' : 'arrow keys or W, A, S, and D';
    return `<div class="game-top"><div><p class="eyebrow">Your playable prototype</p><h2>Shape Quest</h2><p class="game-instructions" id="game-help">Use the ${keyHelp}. Reach the targets. There is no timer.</p></div><button class="text-button" data-reset type="button">Restart game</button></div>
      <div class="game-stage ${this.recipe.access === 'large' ? 'is-large' : ''} ${this.recipe.access === 'patterns' ? 'has-patterns' : ''} ${this.recipe.access === 'calm' ? 'is-calm' : ''}">
        <div class="game-board" data-board tabindex="0" role="application" aria-describedby="game-help game-status" aria-label="7 by 7 Shape Quest board"></div>
        <div class="game-side"><p class="game-status" id="game-status" aria-live="polite"></p><div class="move-pad" aria-label="On-screen movement controls"><span></span><button type="button" data-move="up" aria-label="Move up">↑</button><span></span><button type="button" data-move="left" aria-label="Move left">←</button><button type="button" data-move="down" aria-label="Move down">↓</button><button type="button" data-move="right" aria-label="Move right">→</button></div><p class="moves" aria-live="polite">Moves: <strong data-moves>0</strong></p></div>
      </div>`;
  }

  private onKey(event: KeyboardEvent): void {
    const arrow: Record<string, string> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
    const wasd: Record<string, string> = { w: 'up', s: 'down', a: 'left', d: 'right' };
    const allowed = this.recipe.control === 'arrows' ? arrow : this.recipe.control === 'wasd' ? wasd : { ...arrow, ...wasd };
    const direction = allowed[event.key] ?? allowed[event.key.toLowerCase()];
    if (direction) { event.preventDefault(); this.move(direction); }
  }

  private move(direction: string): void {
    if (this.won) return;
    const delta: Record<string, Point> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
    if (!delta[direction]) return;
    const next = { x: this.position.x + delta[direction].x, y: this.position.y + delta[direction].y };
    this.previous = { ...this.position };
    const obstacle = this.effectiveObstacle();
    const blocked = obstacle === 'walls' && wallCells.includes(this.key(next));
    const wandering = obstacle === 'wanderer' && this.key(next) === this.key(this.movingBlock);
    if (next.x < 0 || next.y < 0 || next.x >= SIZE || next.y >= SIZE || blocked || wandering) {
      this.render(blocked || wandering ? 'Bump! That shape blocks the way. Try another direction.' : 'That is the edge of the board. Try another direction.');
      return;
    }
    this.trail.add(this.key(this.position));
    this.position = next;
    this.moves += 1;
    if (obstacle === 'puddles' && puddleCells.includes(this.key(next))) {
      this.position = { ...this.previous };
      this.render('Boing! The puddle bounced you back one space.');
      return;
    }
    if (obstacle === 'wanderer') this.movingBlock = { x: (this.moves * 2 + 3) % SIZE, y: 3 };
    const target = targets[this.recipe.goal].find((point) => this.key(point) === this.key(this.position));
    if (target) this.collected.add(this.key(target));
    const total = targets[this.recipe.goal].length;
    if (this.collected.size === total) {
      this.won = true;
      const message = this.recipe.goal === 'reach' ? 'You reached the star!' : this.recipe.goal === 'collect' ? 'You found every spark!' : 'You found both friends!';
      this.render(`${message} You won in ${this.moves} moves.`);
    } else {
      const progress = this.collected.size ? ` Progress: ${this.collected.size} of ${total}.` : '';
      this.render(this.recipe.feedback === 'words' ? `Good move.${progress}` : `Moved ${direction}.${progress}`);
    }
  }

  private effectiveObstacle(): string { return this.recipe.access === 'calm' && this.recipe.obstacle === 'wanderer' ? 'walls' : this.recipe.obstacle; }
  private key(point: Point): string { return `${point.x},${point.y}`; }

  private render(message: string): void {
    const board = this.root.querySelector<HTMLElement>('[data-board]');
    if (!board) return;
    const obstacle = this.effectiveObstacle();
    board.innerHTML = '';
    for (let y = 0; y < SIZE; y += 1) for (let x = 0; x < SIZE; x += 1) {
      const cell = document.createElement('span');
      const key = `${x},${y}`;
      cell.className = 'game-cell';
      cell.setAttribute('aria-hidden', 'true');
      if (obstacle === 'walls' && wallCells.includes(key)) { cell.classList.add('wall'); cell.textContent = '▰'; }
      if (obstacle === 'puddles' && puddleCells.includes(key)) { cell.classList.add('puddle'); cell.textContent = '≈'; }
      if (obstacle === 'wanderer' && key === this.key(this.movingBlock)) { cell.classList.add('wanderer'); cell.textContent = '◇'; }
      if (this.recipe.feedback === 'trail' && this.trail.has(key)) { cell.classList.add('trail'); cell.textContent = '·'; }
      const target = targets[this.recipe.goal].find((point) => this.key(point) === key);
      if (target && !this.collected.has(key)) { cell.classList.add('target'); cell.textContent = this.recipe.goal === 'reach' ? '★' : this.recipe.goal === 'collect' ? '✦' : '☺'; }
      if (key === this.key(this.position)) { cell.className = `game-cell player${this.won && this.recipe.feedback === 'burst' ? ' celebrate' : ''}`; cell.textContent = '●'; }
      board.append(cell);
    }
    const status = this.root.querySelector<HTMLElement>('#game-status');
    if (status) status.textContent = message;
    const moveCount = this.root.querySelector<HTMLElement>('[data-moves]');
    if (moveCount) moveCount.textContent = String(this.moves);
  }

  private reset(): void {
    this.position = { ...start }; this.previous = { ...start }; this.collected.clear(); this.trail.clear(); this.moves = 0; this.won = false; this.movingBlock = { x: 3, y: 3 };
    this.render('Game restarted. Start in the bottom-left corner.');
    this.focus();
  }
}
