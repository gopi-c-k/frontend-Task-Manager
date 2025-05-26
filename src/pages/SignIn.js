// src/pages/SignIn.js
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailIcon from "@mui/icons-material/Email";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Axios instance with credentials
  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError("");
    try {
      const res = await axiosInstance.post("/auth/signin", form);
      alert("Login Successful");
      console.log(res.data);
      // navigate("/dashboard"); // optional navigation after login
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        px: 2,
      }}
    >
      {/* Top Left Platform Name */}
      <Box sx={{ position: "absolute", top: 20, left: 20 }}>
        <Typography variant="h6" color="white" fontWeight="bold">
          Gopi Multi-Tenant Task Management Platform
        </Typography>
      </Box>

      {/* Sign In Card */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="xs">
          <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
              <Avatar sx={{ bgcolor: "#1976d2", mb: 1 }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography variant="h5">Sign In</Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              margin="normal"
              name="email"
              label="Email"
              value={form.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              onClick={handleSubmit}
            >
              Sign In
            </Button>

            {/* Sign Up and Org Creation Links */}
            <Box mt={3} textAlign="center">
              {/* <Typography variant="body2">
                Don’t have an account?{" "}
                <Link
                  href="#"
                  onClick={() => navigate("/signup")}
                  underline="hover"
                >
                  Sign Up
                </Link>
              </Typography> */}
              <Typography variant="body2" mt={1}>
                Want to create an organization?{" "}
                <Link
                  href="#"
                  onClick={() => navigate("/org-create")}
                  underline="hover"
                >
                  Create Org
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
