import Box from "@mui/material/Box";
import Balloon from "./Balloon";

type BalloonClusterProps = { colors: readonly string[] };

const SPOTS = [
  { left: "4%", top: "6%" },
  { left: "12%", top: "30%" },
  { right: "5%", top: "4%" },
  { right: "13%", top: "28%" },
] as const;

/** Decorative balloons around a hero; the parent must be position: relative. */
export default function BalloonCluster({ colors }: BalloonClusterProps) {
  return (
    <Box
      aria-hidden="true"
      sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {colors.map((color, index) => {
        const { top, ...side } = SPOTS[index % SPOTS.length];
        return (
          <Box
            key={`${color}-${index}`}
            sx={{
              position: "absolute",
              ...side,
              // On phones only the two outer balloons show, pinned to the top corners above the eyebrow.
              top: { xs: 0, sm: top },
              display: { xs: index % 2 === 1 ? "none" : "block", sm: "block" },
              transform: { xs: "scale(0.65)", md: "none" },
              transformOrigin: "top center",
            }}
          >
            <Balloon
              color={color}
              size={index % 2 === 0 ? 44 : 34}
              delay={index * 0.7}
            />
          </Box>
        );
      })}
    </Box>
  );
}
