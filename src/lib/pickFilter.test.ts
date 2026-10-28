import { describe, expect, it } from 'vitest';

import { filterPickables } from './pickFilter';

const item = (title: string, ...directors: string[]) => ({ movie: { title, director: directors.map((name) => ({ name })) } });
const list = [item('Project Hail Mary', 'Phil Lord', 'Christopher Miller'), item('Se7en', 'David Fincher'), item('Amélie', 'Jean-Pierre Jeunet')];

describe('filterPickables', () => {
  it('keeps everything for an empty or blank query', () => {
    expect(filterPickables(list, '')).toEqual(list);
    expect(filterPickables(list, '   ')).toEqual(list);
  });
  it('matches the title, ignoring case', () => {
    expect(filterPickables(list, 'hail').map((p) => p.movie.title)).toEqual(['Project Hail Mary']);
  });
  it('matches a director too', () => {
    expect(filterPickables(list, 'fincher').map((p) => p.movie.title)).toEqual(['Se7en']);
  });
  it('ignores accents', () => {
    expect(filterPickables(list, 'amelie').map((p) => p.movie.title)).toEqual(['Amélie']);
  });
  it('needs every word to match, in any order', () => {
    expect(filterPickables(list, 'lord project')).toHaveLength(1);
    expect(filterPickables(list, 'lord fincher')).toHaveLength(0);
  });
});
