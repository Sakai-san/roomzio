import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useRouterState } from "@tanstack/react-router";

export const Loader = () => {
  const state = useRouterState();

  return state.status === "pending" ? (
    <LinearProgress
      color="inherit"
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
