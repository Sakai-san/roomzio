import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../providers/auth";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (tab === 0) {
      // Login
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        navigate({ to: "/" });
      }
    } else {
      // Sign up
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Check your email for confirmation link!");
        setEmail("");
        setPassword("");
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Authentication
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        sx={{ mb: 2 }}
      >
        <Tab label="Login" />
        <Tab label="Sign Up" />
      </Tabs>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="success.main">{success}</Typography>}
          <Button type="submit" variant="contained" fullWidth>
            {tab === 0 ? "Login" : "Sign Up"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
