import { activityVerb } from '@/lib/activityLabel';

describe('activityVerb', () => {
  it('names each event', () => {
    expect(activityVerb({ type: 'completed', details: {} })).toBe('Finished');
    expect(activityVerb({ type: 'rating_changed', details: { rating: 4.5 } })).toBe('Rated 4.5');
    expect(activityVerb({ type: 'rating_changed', details: {} })).toBe('Rated');
    expect(activityVerb({ type: 'status_changed', details: { newStatus: 'Completed' } })).toBe('Moved to Watched');
    expect(activityVerb({ type: 'updated', details: {} })).toBe('Updated');
  });
});
