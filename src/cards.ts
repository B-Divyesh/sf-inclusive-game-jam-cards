export type CategoryId = 'goal' | 'control' | 'obstacle' | 'feedback' | 'access';

export type CardChoice = {
  id: string;
  title: string;
  description: string;
  symbol: string;
  tryIt: string;
};

export type Category = {
  id: CategoryId;
  short: string;
  title: string;
  prompt: string;
  symbol: string;
  choices: CardChoice[];
};

export type Recipe = Record<CategoryId, string>;

export const categories: Category[] = [
  {
    id: 'goal', short: 'Goal', title: 'Pick the big idea', symbol: '●',
    prompt: 'What should make the player feel “I did it!”?',
    choices: [
      { id: 'reach', title: 'Reach the star', symbol: '★', description: 'Travel from one corner to the shining goal.', tryIt: 'A clear first game with one destination.' },
      { id: 'collect', title: 'Collect three sparks', symbol: '✦', description: 'Gather every spark hiding on the board.', tryIt: 'A little exploring and three mini-wins.' },
      { id: 'rescue', title: 'Find two friends', symbol: '☺', description: 'Visit both friends so nobody is left behind.', tryIt: 'A friendly goal with a story built in.' },
    ],
  },
  {
    id: 'control', short: 'Controls', title: 'Choose how to move', symbol: '➜',
    prompt: 'Which keys will feel easiest for both makers?',
    choices: [
      { id: 'arrows', title: 'Arrow keys', symbol: '↕', description: 'Move with the four arrow keys.', tryIt: 'Familiar keys with on-screen buttons too.' },
      { id: 'wasd', title: 'W A S D', symbol: 'W', description: 'Move with W, A, S, and D.', tryIt: 'A classic game control for two hands.' },
      { id: 'either', title: 'Either set', symbol: '＋', description: 'Use arrows or W A S D—both work.', tryIt: 'Flexible for different keyboards and players.' },
    ],
  },
  {
    id: 'obstacle', short: 'Twist', title: 'Add one playful twist', symbol: '◆',
    prompt: 'What should make the route interesting, but not frustrating?',
    choices: [
      { id: 'walls', title: 'Paper walls', symbol: '▰', description: 'Find a route around chunky wall pieces.', tryIt: 'Predictable and easy to learn.' },
      { id: 'puddles', title: 'Bouncy puddles', symbol: '≈', description: 'A puddle gently bounces you back one step.', tryIt: 'A surprise with no lost progress.' },
      { id: 'wanderer', title: 'Wandering block', symbol: '◇', description: 'One block changes place after each move.', tryIt: 'A moving puzzle with no timer.' },
    ],
  },
  {
    id: 'feedback', short: 'Feedback', title: 'Show what just happened', symbol: '✺',
    prompt: 'How will the game answer when the player makes progress?',
    choices: [
      { id: 'burst', title: 'Shape burst', symbol: '✺', description: 'A ring of shapes appears for each win.', tryIt: 'Big visual feedback without sound.' },
      { id: 'trail', title: 'Paper trail', symbol: '••', description: 'The path stays marked behind the player.', tryIt: 'See the journey grow move by move.' },
      { id: 'words', title: 'Cheering words', symbol: '!', description: 'Short messages say what changed.', tryIt: 'Plain-language feedback in the status area.' },
    ],
  },
  {
    id: 'access', short: 'Access', title: 'Make room for more players', symbol: '∩',
    prompt: 'Which extra comfort should this version build in?',
    choices: [
      { id: 'calm', title: 'Keep it calm', symbol: '—', description: 'Nothing moves unless the player moves it.', tryIt: 'No surprise motion or animation.' },
      { id: 'large', title: 'Extra-big pieces', symbol: '⬤', description: 'Player, targets, and obstacles are easier to see.', tryIt: 'Bolder pieces and fewer visual details.' },
      { id: 'patterns', title: 'Shapes and patterns', symbol: '▧', description: 'Every piece differs by symbol and pattern, not color alone.', tryIt: 'Works without needing to tell colors apart.' },
    ],
  },
];

export const blankRecipe = (): Recipe => ({ goal: '', control: '', obstacle: '', feedback: '', access: '' });

export function choiceFor(categoryId: CategoryId, choiceId: string): CardChoice {
  const category = categories.find((item) => item.id === categoryId);
  const choice = category?.choices.find((item) => item.id === choiceId);
  if (!choice) throw new Error(`Unknown choice: ${categoryId}/${choiceId}`);
  return choice;
}

export function isComplete(recipe: Recipe): boolean {
  return categories.every(({ id }) => Boolean(recipe[id]));
}

export function surpriseRecipe(random = Math.random): Recipe {
  return Object.fromEntries(categories.map((category) => [category.id, category.choices[Math.floor(random() * category.choices.length)].id])) as Recipe;
}
