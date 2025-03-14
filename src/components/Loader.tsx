import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useRouterState } from "@tanstack/react-router";

export const Loader = () => {
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });

  return isLoading ? (
    <LinearProgress
      color="info"
      sx={{
        "&": {
          height: 10,
        },
      }}
    />
  ) : (
    <Box sx={{ height: 10 }} />
  );
};
