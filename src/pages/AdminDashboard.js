import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const roles = ["Admin", "Manager", "Member"];

export default function AdminDashboard() {
  const [taskStats, setTaskStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "Member" });
  const [alert, setAlert] = useState({ open: false, severity: "info", message: "" });

  // Fetch task stats and users on mount
  useEffect(() => {
    fetchTaskStats();
    fetchUsers();
  }, []);

  const fetchTaskStats = async () => {
    try {
      // Replace with your API endpoint
      const res = await axios.get("http://localhost:5000/api/tasks/stats");
      setTaskStats(res.data);
    } catch {
      setTaskStats({
        total: 100,
        overdue: 5,
        completed: 70,
        byCategory: { Bug: 30, Feature: 50, Improvement: 20 },
      }); // fallback dummy
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      // Replace with your API endpoint
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch {
      setUsers([
        { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Manager" },
      ]); // fallback dummy
    }
    setLoadingUsers(false);
  };

  const handleInviteOpen = () => {
    setInviteForm({ email: "", role: "Member" });
    setInviteOpen(true);
  };

  const handleInviteClose = () => {
    setInviteOpen(false);
  };

  const handleInviteChange = (e) => {
    setInviteForm({ ...inviteForm, [e.target.name]: e.target.value });
  };

  const handleInviteSubmit = async () => {
    try {
      // Replace with your invite API
      await axios.post("http://localhost:5000/api/users/invite", inviteForm);
      setAlert({ open: true, severity: "success", message: "Invitation sent!" });
      fetchUsers();
      setInviteOpen(false);
    } catch (err) {
      setAlert({
        open: true,
        severity: "error",
        message: err.response?.data?.message || "Failed to send invite",
      });
    }
  };

  const handleRemoveUser = async (id) => {
    if (!window.confirm("Are you sure to remove this user?")) return;
    try {
      // Replace with your remove API
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setAlert({ open: true, severity: "success", message: "User removed!" });
      fetchUsers();
    } catch (err) {
      setAlert({
        open: true,
        severity: "error",
        message: err.response?.data?.message || "Failed to remove user",
      });
    }
  };

  const handleChangeRole = async (id, newRole) => {
    try {
      // Replace with your update role API
      await axios.patch(`http://localhost:5000/api/users/${id}/role`, { role: newRole });
      setAlert({ open: true, severity: "success", message: "Role updated!" });
      fetchUsers();
    } catch (err) {
      setAlert({
        open: true,
        severity: "error",
        message: err.response?.data?.message || "Failed to update role",
      });
    }
  };

  return (
    <Container sx={{ my: 4 }}>
      <Typography variant="h4" mb={3}>
        Admin Dashboard
      </Typography>

      {/* Task Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2 }}>Total Tasks: {taskStats?.total ?? <CircularProgress size={20} />}</Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, bgcolor: "error.main", color: "white" }}>
            Overdue Tasks: {taskStats?.overdue ?? <CircularProgress size={20} />}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, bgcolor: "success.main", color: "white" }}>
            Completed Tasks: {taskStats?.completed ?? <CircularProgress size={20} />}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2 }}>
            Tasks by Category:
            <ul>
              {taskStats?.byCategory
                ? Object.entries(taskStats.byCategory).map(([cat, val]) => (
                    <li key={cat}>
                      {cat}: {val}
                    </li>
                  ))
                : "Loading..."}
            </ul>
          </Paper>
        </Grid>
      </Grid>

      {/* Member Management */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" mb={2}>
          Member Management
        </Typography>
        <Button variant="contained" onClick={handleInviteOpen} sx={{ mb: 2 }}>
          Invite User
        </Button>

        {loadingUsers ? (
          <CircularProgress />
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Select
                      value={u.role}
                      onChange={(e) => handleChangeRole(u.id, e.target.value)}
                      size="small"
                    >
                      {roles.map((r) => (
                        <MenuItem key={r} value={r}>
                          {r}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell align="right">
                    <Button color="error" onClick={() => handleRemoveUser(u.id)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Invite User Modal */}
      <Dialog open={inviteOpen} onClose={handleInviteClose}>
        <DialogTitle>Invite User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            name="email"
            type="email"
            fullWidth
            variant="standard"
            value={inviteForm.email}
            onChange={handleInviteChange}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              label="Role"
              name="role"
              value={inviteForm.role}
              onChange={handleInviteChange}
            >
              {roles.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInviteClose}>Cancel</Button>
          <Button onClick={handleInviteSubmit} variant="contained">
            Send Invite
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
