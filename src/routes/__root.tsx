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
            backgroundColor: "#333",
            color: "#fff",
            padding: "10px",
            textAlign: "center",
            position: "sticky",
            top: 0,
            zIndex: 1000,
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
              padding: "20px",
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
