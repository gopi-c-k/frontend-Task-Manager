import React from "react";
import { Box } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        mt: "auto",
        backgroundColor: (theme) => theme.palette.grey[200],
        textAlign: "center",
      }}
    >
      © 2025 Gopi Multi-Tenant Task Management Platform. All rights reserved.
    </Box>
  );
}
