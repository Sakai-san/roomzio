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
            paddingTop: "16px",
            paddingBottom: "16px",
            backfaceVisibility: "hidden",
            backgroundColor: "rgba(18, 18, 18, 0.6)",
            backdropFilter: "blur(50px)",
            transform: "translateZ(0px)",
            position: "sticky",
            left: 0,
            top: 0,
            zIndex: "1125",
            width: "100%",
          }}
        >
          <Stack>
            <Loader />
            <BreadcrumbNav />
          </Stack>
        </Stack>

        <Container>
          <Box
            sx={{
              flex: 1,
              padding: "20px",
              overflowY: "auto",
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
