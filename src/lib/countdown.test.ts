import { describe, expect, it } from 'vitest';
import { getCountdownState } from './countdown';

const NOW = Date.parse('2027-01-01T00:00:00Z');

describe('getCountdownState', () => {
  it('is unscheduled without a target', () => {
    expect(getCountdownState(null, NOW)).toEqual({ status: 'unscheduled' });
  });

  it('is unscheduled for an unparsable target', () => {
    expect(getCountdownState('sometime in November', NOW)).toEqual({ status: 'unscheduled' });
  });

  it('is started when the target is now or in the past', () => {
    expect(getCountdownState('2027-01-01T00:00:00Z', NOW)).toEqual({ status: 'started' });
    expect(getCountdownState('2026-12-31T23:59:59Z', NOW)).toEqual({ status: 'started' });
  });

  it('breaks the remaining time into days, hours, minutes and seconds', () => {
    expect(getCountdownState('2027-01-02T02:03:04Z', NOW)).toEqual({
      status: 'counting',
      timeLeft: { days: 1, hours: 2, minutes: 3, seconds: 4 },
    });
  });

  it('floors partial seconds', () => {
    expect(getCountdownState(new Date(NOW + 59_900).toISOString(), NOW)).toEqual({
      status: 'counting',
      timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 59 },
    });
  });

  it('honors the timezone offset in the target', () => {
    // 09:00 in Monterrey (UTC-6) is 15:00 UTC.
    expect(getCountdownState('2027-11-12T09:00:00-06:00', Date.parse('2027-11-12T14:00:00Z'))).toEqual({
      status: 'counting',
      timeLeft: { days: 0, hours: 1, minutes: 0, seconds: 0 },
    });
  });

  it('counts more than 99 days', () => {
    const state = getCountdownState('2027-05-01T00:00:00Z', NOW);
    expect(state).toEqual({ status: 'counting', timeLeft: { days: 120, hours: 0, minutes: 0, seconds: 0 } });
  });
});
