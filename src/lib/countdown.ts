export type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

export type CountdownState =
  | { status: 'unscheduled' }
  | { status: 'started' }
  | { status: 'counting'; timeLeft: TimeLeft };

const DAY = 86_400;
const HOUR = 3_600;
const MINUTE = 60;

/**
 * Pure countdown math. `target` must be ISO 8601 with an explicit offset
 * (`Z` or `±HH:MM`); `now` is epoch milliseconds.
 */
export function getCountdownState(target: string | null, now: number): CountdownState {
  if (target === null) return { status: 'unscheduled' };
  const targetMs = Date.parse(target);
  if (Number.isNaN(targetMs)) return { status: 'unscheduled' };

  let remaining = Math.floor((targetMs - now) / 1000);
  if (remaining <= 0) return { status: 'started' };

  const days = Math.floor(remaining / DAY);
  remaining -= days * DAY;
  const hours = Math.floor(remaining / HOUR);
  remaining -= hours * HOUR;
  const minutes = Math.floor(remaining / MINUTE);
  const seconds = remaining - minutes * MINUTE;
  return { status: 'counting', timeLeft: { days, hours, minutes, seconds } };
}
