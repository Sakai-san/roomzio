import Container from "@mui/material/Container/Container";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { BreadcrumbNav } from "../components/BreadcrumNav";
import { Loader } from "../components/Loader";
import { Stack } from "@mui/material";

export const Route = createRootRoute({
  component: () => {
    return (
      <Container>
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

        <Stack height="80%" sx={{ overflow: "auto" }}>
          <Outlet />
        </Stack>

        <TanStackRouterDevtools />
      </Container>
    );
  },
});
