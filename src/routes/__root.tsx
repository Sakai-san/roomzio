import Container from "@mui/material/Container/Container";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { BreadcrumbNav } from "../components/BreadcrumNav";
import { Loader } from "../components/Loader";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <Stack
          sx={{
            padding: "10px",
            textAlign: "center",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backfaceVisibility: "hidden",
            backdropFilter: "blur(20px)",
          }}
        >
          <Loader />
          <BreadcrumbNav />
        </Stack>

        <Container>
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              marginBottom: 5,
            }}
          >
            <Outlet />
          </Box>
        </Container>

        <TanStackRouterDevtools />
      </>
    );
  },
});
