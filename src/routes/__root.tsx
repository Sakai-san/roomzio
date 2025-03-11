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
      <Box sx={{ height: "100vh" }}>
        <Stack
          sx={{
            position: "sticky",
            left: 0,
            top: 0,
          }}
        >
          <Stack>
            <Loader />
            <BreadcrumbNav />
          </Stack>
        </Stack>

        <Container sx={{ height: "auto", overflow: "auto" }}>
          <Outlet />
        </Container>

        <TanStackRouterDevtools />
      </Box>
    );
  },
});
