import Container from "@mui/material/Container/Container";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { BreadcrumbNav } from "../components/BreadcrumNav";

export const Route = createRootRoute({
  component: () => {
    return (
      <Container>
        <BreadcrumbNav />
        <hr />
        <Outlet />
        <TanStackRouterDevtools />
      </Container>
    );
  },
});
