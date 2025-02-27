import Container from "@mui/material/Container/Container";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <Container>
      <div>
        <Link to="/">Home</Link>{" "}
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </Container>
  ),
});
