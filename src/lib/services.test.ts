import { describe, expect, it } from 'vitest';

import { normalizeAvailability, normalizeServiceName } from '@/lib/services';

describe('channel add-ons', () => {
  it('folds a Paramount+ channel variant into Paramount+, not the store it is sold through', () => {
    expect(normalizeServiceName('Paramount+ Amazon Channel')).toBe('Paramount+');
    expect(normalizeServiceName('Paramount Plus Apple TV Channel')).toBe('Paramount+');
    expect(normalizeAvailability(['Paramount Plus Premium', 'Paramount Plus Essential', 'Paramount+ Amazon Channel'])).toEqual(['Paramount+']);
  });
});
