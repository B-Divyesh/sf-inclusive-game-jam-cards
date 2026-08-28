import { categories, choiceFor, type Recipe } from './cards';

const safeJson = (value: unknown): string => JSON.stringify(value).replace(/</g, '\\u003c');

export function recipeTitle(recipe: Recipe): string {
  const goal = choiceFor('goal', recipe.goal).title;
  const obstacle = choiceFor('obstacle', recipe.obstacle).title;
  return `${goal} + ${obstacle}`;
}

export function buildGameHtml(recipe: Recipe): string {
  const controls = recipe.control === 'arrows' ? 'Arrow keys' : recipe.control === 'wasd' ? 'W, A, S, D' : 'Arrow keys or W, A, S, D';
  const title = recipeTitle(recipe);
  const data = safeJson(recipe);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — Tiny game</title>
<style>
:root{color-scheme:light;--paper:#fff8e7;--ink:#16213e;--coral:#e14b3b;--lemon:#f4c84a;--mint:#58bfa3;--sky:#60a5d8}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:17px/1.5 Verdana,sans-serif}main{width:min(720px,92vw);margin:auto;padding:32px 0;text-align:center}h1{font:700 clamp(2rem,8vw,3.5rem)/1.05 Trebuchet MS,sans-serif;margin:.25em}p{max-width:58ch;margin:12px auto}.board{width:min(560px,92vw);aspect-ratio:1;margin:24px auto;display:grid;grid-template-columns:repeat(7,1fr);border:4px solid var(--ink);background:#fff;box-shadow:8px 8px 0 var(--ink);outline:none}.board:focus-visible,button:focus-visible{outline:4px solid var(--sky);outline-offset:4px}.cell{display:grid;place-items:center;border:1px solid #d6ceb8;font-weight:900;font-size:clamp(1rem,5vw,2rem)}.player{color:var(--coral);font-size:clamp(1.6rem,7vw,3rem)}.target{background:var(--lemon)}.wall{color:var(--ink);background:#dbe2f1}.puddle{background:var(--sky);color:var(--ink)}.block{background:var(--mint)}.trail{background:#ffe1db}.patterns .target{background:repeating-linear-gradient(45deg,var(--lemon),var(--lemon) 7px,#fff 7px,#fff 10px)}.large .cell{font-size:clamp(1.5rem,7vw,3.2rem)}.pad{display:grid;grid-template-columns:repeat(3,52px);gap:8px;justify-content:center}.pad button,.restart{min-width:52px;min-height:52px;border:3px solid var(--ink);border-radius:10px;background:#fff;color:var(--ink);font:bold 20px inherit;box-shadow:3px 3px 0 var(--ink);cursor:pointer}.restart{padding:8px 18px;font-size:16px}.status{font-weight:bold;min-height:3em}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
</style></head><body><main><p>Made with Inclusive Game Jam Cards</p><h1>${title}</h1><p id="help">Use ${controls}. Reach the targets. There is no timer.</p><div id="board" class="board${recipe.access === 'large' ? ' large' : ''}${recipe.access === 'patterns' ? ' patterns' : ''}" tabindex="0" role="application" aria-label="7 by 7 game board" aria-describedby="help status"></div><p id="status" class="status" aria-live="polite"></p><div class="pad" aria-label="Movement buttons"><span></span><button data-m="up" aria-label="Move up">↑</button><span></span><button data-m="left" aria-label="Move left">←</button><button data-m="down" aria-label="Move down">↓</button><button data-m="right" aria-label="Move right">→</button></div><p>Moves: <strong id="moves">0</strong></p><button class="restart" id="restart">Restart game</button></main>
<script>
const recipe=${data},size=7,start={x:0,y:6},walls=['1,1','1,2','2,2','4,1','4,2','4,3','2,5','3,5'],puddles=['2,1','4,2','3,4'],targets={reach:[{x:6,y:0}],collect:[{x:2,y:1},{x:5,y:3},{x:3,y:5}],rescue:[{x:5,y:1},{x:2,y:3}]};let pos,prev,found,trail,moves,won,block;const board=document.querySelector('#board'),status=document.querySelector('#status'),key=p=>p.x+','+p.y,obs=()=>recipe.access==='calm'&&recipe.obstacle==='wanderer'?'walls':recipe.obstacle;
function reset(){pos={...start};prev={...start};found=new Set;trail=new Set;moves=0;won=false;block={x:3,y:3};render('Game ready. Start in the bottom-left corner.');board.focus()}
function render(msg){board.innerHTML='';for(let y=0;y<size;y++)for(let x=0;x<size;x++){const c=document.createElement('span'),k=x+','+y;c.className='cell';c.setAttribute('aria-hidden','true');if(obs()==='walls'&&walls.includes(k)){c.classList.add('wall');c.textContent='▰'}if(obs()==='puddles'&&puddles.includes(k)){c.classList.add('puddle');c.textContent='≈'}if(obs()==='wanderer'&&k===key(block)){c.classList.add('block');c.textContent='◇'}if(recipe.feedback==='trail'&&trail.has(k)){c.classList.add('trail');c.textContent='·'}const t=targets[recipe.goal].find(p=>key(p)===k);if(t&&!found.has(k)){c.classList.add('target');c.textContent=recipe.goal==='reach'?'★':recipe.goal==='collect'?'✦':'☺'}if(k===key(pos)){c.className='cell player';c.textContent='●'}board.append(c)}status.textContent=msg;document.querySelector('#moves').textContent=moves}
function move(dir){if(won)return;const d={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}}[dir];if(!d)return;const n={x:pos.x+d.x,y:pos.y+d.y};prev={...pos};if(n.x<0||n.y<0||n.x>=size||n.y>=size||(obs()==='walls'&&walls.includes(key(n)))||(obs()==='wanderer'&&key(n)===key(block))){render('Bump! Try another direction.');return}trail.add(key(pos));pos=n;moves++;if(obs()==='puddles'&&puddles.includes(key(n))){pos={...prev};render('Boing! The puddle bounced you back.');return}if(obs()==='wanderer')block={x:(moves*2+3)%size,y:3};if(targets[recipe.goal].some(p=>key(p)===key(pos)))found.add(key(pos));if(found.size===targets[recipe.goal].length){won=true;render('You did it! You won in '+moves+' moves.')}else render(recipe.feedback==='words'?'Good move.':'Moved '+dir+'.')}
const arrows={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'},wasd={w:'up',s:'down',a:'left',d:'right'};board.addEventListener('keydown',e=>{const map=recipe.control==='arrows'?arrows:recipe.control==='wasd'?wasd:{...arrows,...wasd},dir=map[e.key]||map[e.key.toLowerCase()];if(dir){e.preventDefault();move(dir)}});document.querySelectorAll('[data-m]').forEach(b=>b.addEventListener('click',()=>move(b.dataset.m)));document.querySelector('#restart').addEventListener('click',reset);reset();
</scr` + `ipt></body></html>`;
}

export function recipeLines(recipe: Recipe): Array<{ label: string; value: string }> {
  return categories.map((category) => ({ label: category.short, value: choiceFor(category.id, recipe[category.id]).title }));
}

export function downloadText(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href; link.download = filename; link.click();
  URL.revokeObjectURL(href);
}
