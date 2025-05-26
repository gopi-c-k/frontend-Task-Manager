// src/pages/SignUp.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    Avatar,
    Alert,
    InputAdornment,
    IconButton,
    Link,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";

export default function SignUp() {
    const { token: urlToken } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        token: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const axiosInstance = axios.create({
        baseURL: "http://localhost:5000",
        withCredentials: true,
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        setError("");
        setSuccess("");
        try {
            // Use manual token if entered, else fallback to URL token
            const inviteToken = form.token.trim() || urlToken;

            if (!inviteToken) {
                setError("Invite token is required.");
                return;
            }

            const res = await axiosInstance.post("/auth/signup", {
                name: form.name,
                email: form.email,
                password: form.password,
                token: inviteToken,
            });
            setSuccess("Signup successful! Redirecting to Sign In…");
            console.log(res.data);
            setTimeout(() => navigate("/"), 3000);
        } catch (err) {
            const msg = err.response?.data?.message || "Signup failed.";
            setError(msg);
        }
    };

    return (
        <Box
            sx={{
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
            }}
        >
            {/* Top Left Platform Name */}
            <Box sx={{ position: "absolute", top: 20, left: 20 }}>
                <Typography variant="h6" color="white" fontWeight="bold">
                    Gopi Multi-Tenant Task Management Platform
                </Typography>
            </Box>

            <Container maxWidth="xs">
                <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
                    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                        <Avatar sx={{ bgcolor: "#1976d2", mb: 1 }}>
                            <PersonAddIcon />
                        </Avatar>
                        <Typography variant="h5">Complete Sign Up</Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {success}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        margin="normal"
                        name="name"
                        label="Full Name"
                        value={form.name}
                        onChange={handleChange}
                    />
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
                                        edge="end"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label="toggle password visibility"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* <TextField
            fullWidth
            margin="normal"
            name="token"
            label="Invite Token"
            value={form.token}
            onChange={handleChange}
          /> */}

                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{ mt: 3 }}
                        onClick={handleSubmit}
                    >
                        Sign Up
                    </Button>

                    <Box mt={3} textAlign="center">
                        <Typography variant="body2">
                            Already have an account?{" "}
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => navigate("/signin")}
                            >
                                Sign In
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
