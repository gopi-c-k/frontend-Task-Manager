// src/pages/OrgCreate.js
import React, { useState, useEffect } from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    Avatar,
    Alert,
    Link,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function OrgCreate() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        organization: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        setError("");
        setSuccess("");
        try {
            const res = await axios.post(
                "http://localhost:5000/auth/register-organization",
                form,
                { withCredentials: true }
            );
            setSuccess("Organization created! Redirecting to Sign In…");
            console.log(res.data);
        } catch (err) {
            const msg =
                err.response?.data?.message || "Organization creation failed.";
            setError(msg);
        }
    };

    // Redirect 3s after success
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => navigate("/"), 3000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

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
            <Container maxWidth="sm">
                <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        mb={2}
                    >
                        <Avatar sx={{ bgcolor: "#1976d2", mb: 1 }}>
                            <BusinessIcon />
                        </Avatar>
                        <Typography variant="h5">Create Organization</Typography>
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
                        label="Your Name"
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
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="password"
                        type="password"
                        label="Password"
                        value={form.password}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="organization"
                        label="Organization Name"
                        value={form.organization}
                        onChange={handleChange}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{ mt: 3 }}
                        onClick={handleSubmit}
                    >
                        Create Organization
                    </Button>

                    {/* Back to Sign In */}
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
