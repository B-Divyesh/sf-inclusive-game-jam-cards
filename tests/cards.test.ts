import { describe, expect, it } from 'vitest';
import { blankRecipe, categories, choiceFor, isComplete, surpriseRecipe } from '../src/cards';
import { buildGameHtml, recipeTitle } from '../src/exporter';

describe('card recipe', () => {
  it('starts incomplete and requires all five categories', () => {
    const recipe = blankRecipe();
    expect(isComplete(recipe)).toBe(false);
    categories.forEach((category) => { recipe[category.id] = category.choices[0].id; });
    expect(isComplete(recipe)).toBe(true);
  });

  it('deals one valid choice per category', () => {
    const recipe = surpriseRecipe(() => 0.99);
    categories.forEach((category) => expect(recipe[category.id]).toBe(category.choices.at(-1)?.id));
  });

  it('rejects an unknown choice', () => expect(() => choiceFor('goal', 'missing')).toThrow('Unknown choice'));
});

describe('standalone export', () => {
  const recipe = { goal: 'reach', control: 'either', obstacle: 'walls', feedback: 'words', access: 'patterns' } as const;

  it('names a game from the chosen mechanics', () => expect(recipeTitle(recipe)).toBe('Reach the star + Paper walls'));

  it('builds a complete offline HTML game', () => {
    const html = buildGameHtml(recipe);
    expect(html).toMatch(/^<!doctype html>/);
    expect(html).toContain('<html lang="en">');
    expect(html).toContain('role="application"');
    expect(html).toContain('Arrow keys or W, A, S, D');
    expect(html).not.toContain('https://');
  });
});
