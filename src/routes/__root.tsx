import Container from "@mui/material/Container/Container";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { BreadcrumbNav } from "../components/BreadcrumNav";
import { Loader } from "../components/Loader";

export const Route = createRootRoute({
  component: () => {
    return (
      <Container>
        <Loader />
        <BreadcrumbNav />
        <hr />
        <Outlet />
        <TanStackRouterDevtools />
      </Container>
    );
  },
});
