import React, { useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true; // Enable sending cookies

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const res = await axios.post("http://localhost:5000/auth/refresh-token");
        if (res.status === 200) {
          navigate("/dashboard");
        } else {
          navigate("/signin");
        }
      } catch (err) {
        navigate("/signin");
      }
    };

    tryRefresh();
  }, [navigate]);

  return (
    <CircularProgress sx={{ mt: 10, mx: "auto", display: "block" }} />
  );
}
