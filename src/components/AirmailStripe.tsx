import Box from '@mui/material/Box';
import { tokens } from '../theme/tokens';

type AirmailStripeProps = { height?: number };

const STRIPES = `repeating-linear-gradient(-45deg,
  ${tokens.blue} 0 14px, ${tokens.paper} 14px 20px,
  ${tokens.red} 20px 34px, ${tokens.paper} 34px 40px,
  ${tokens.yellow} 40px 54px, ${tokens.paper} 54px 60px,
  ${tokens.green} 60px 74px, ${tokens.paper} 74px 80px)`;

/** Four-color airmail-envelope border used between page bands. */
export default function AirmailStripe({ height = 14 }: AirmailStripeProps) {
  return <Box aria-hidden="true" data-testid="airmail-stripe" sx={{ height, backgroundImage: STRIPES }} />;
}
