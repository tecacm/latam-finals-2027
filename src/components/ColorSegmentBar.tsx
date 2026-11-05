import Box from '@mui/material/Box';
import { icpcColors } from '../theme/tokens';

type ColorSegmentBarProps = { height?: number; colors?: readonly string[] };

/** Flat bar split into equal color segments (sits under the header). */
export default function ColorSegmentBar({ height = 4, colors = icpcColors }: ColorSegmentBarProps) {
  return (
    <Box aria-hidden="true" data-testid="color-segment-bar" sx={{ display: 'flex', height }}>
      {colors.map((color, index) => (
        <Box key={`${color}-${index}`} sx={{ flex: 1, backgroundColor: color }} />
      ))}
    </Box>
  );
}
