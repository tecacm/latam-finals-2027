import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { getCountdownState, type TimeLeft } from '../lib/countdown';
import { countdownColors, fonts, tokens } from '../theme/tokens';

type CountdownProps = {
  /** ISO 8601 with offset, or null while the date is unknown. */
  target: string | null;
  colors?: readonly string[];
  unscheduledLabel?: string;
  startedLabel?: string;
};

const UNITS: { key: keyof TimeLeft; singular: string; plural: string }[] = [
  { key: 'days', singular: 'day', plural: 'days' },
  { key: 'hours', singular: 'hour', plural: 'hours' },
  { key: 'minutes', singular: 'minute', plural: 'minutes' },
  { key: 'seconds', singular: 'second', plural: 'seconds' },
];

export default function Countdown({
  target,
  colors = countdownColors,
  unscheduledLabel = 'Date to be announced',
  startedLabel = 'The championship has started',
}: CountdownProps) {
  const [now, setNow] = useState(() => Date.now());
  const state = getCountdownState(target, now);
  const isCounting = state.status === 'counting';

  useEffect(() => {
    if (!isCounting) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [isCounting]);

  if (state.status !== 'counting') {
    return (
      <Typography
        role="status"
        sx={{ fontWeight: 800, fontSize: { xs: '1.25rem', md: '1.75rem' }, color: tokens.ink, letterSpacing: '0.04em' }}
      >
        {state.status === 'unscheduled' ? unscheduledLabel : startedLabel}
      </Typography>
    );
  }

  return (
    <Box
      role="timer"
      aria-label="Time until the championship starts"
      sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 2, md: 4 } }}
    >
      {UNITS.map((unit, index) => {
        const value = state.timeLeft[unit.key];
        return (
          <Box key={unit.key} sx={{ textAlign: 'center', minWidth: { xs: 56, md: 96 } }}>
            <Typography
              component="span"
              sx={{
                display: 'block',
                fontWeight: 800,
                lineHeight: 1,
                fontSize: { xs: '2.25rem', md: '3.5rem' },
                fontVariantNumeric: 'tabular-nums',
                color: colors[index % colors.length],
              }}
            >
              {String(value).padStart(2, '0')}
            </Typography>
            <Typography
              component="span"
              sx={{
                display: 'block',
                mt: 0.75,
                fontFamily: fonts.mono,
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: tokens.teal,
              }}
            >
              {value === 1 ? unit.singular : unit.plural}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
