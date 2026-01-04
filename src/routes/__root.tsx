import Container from "@mui/material/Container";
import {
  createRootRoute,
  Outlet,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { BreadcrumbNav } from "../components/BreadcrumNav";
import { Loader } from "../components/Loader";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useAuth } from "../providers/auth";
import { useEffect } from "react";
import Typography from "@mui/material/Typography";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user && location.pathname !== "/login") {
      navigate({ to: "/login" });
    }
  }, [user, loading, location.pathname, navigate]);

  // Show loader while checking auth
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loader />
      </Box>
    );
  }

  // Show login page if not authenticated
  if (!user && location.pathname !== "/login") {
    return null;
  }

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
          backgroundColor: "rgba(242, 254, 218, 0.6)",
        }}
      >
        <Loader />
        <BreadcrumbNav />
        {user && (
          <Box sx={{ position: "absolute", right: 10, top: 10 }}>
            <Typography component="span" sx={{ marginRight: 2 }}>
              Hello, {user.user_metadata.first_name || user.email}
            </Typography>
            <Button onClick={() => signOut()} variant="outlined" size="small">
              Logout
            </Button>
          </Box>
        )}
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
}
