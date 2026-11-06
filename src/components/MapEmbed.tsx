import { styled } from '@mui/material/styles';
import { googleMapsEmbedUrl } from '../lib/maps';
import { tokens } from '../theme/tokens';

const Frame = styled('iframe')({
  display: 'block',
  width: '100%',
  height: 360,
  border: `2px solid ${tokens.ink}`,
  borderRadius: 16,
  backgroundColor: tokens.white,
  '@media (min-width: 900px)': { height: 480 },
});

type MapEmbedProps = { query: string; title: string; zoom?: number };

/** Embedded Google map for a place query; no API key needed. */
export default function MapEmbed({ query, title, zoom = 16 }: MapEmbedProps) {
  return (
    <Frame
      src={googleMapsEmbedUrl(query, zoom)}
      title={title}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
