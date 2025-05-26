import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
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
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  CssBaseline,
  Stack,
  Tooltip,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import IosShareIcon from '@mui/icons-material/IosShare';
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import TaskIcon from "@mui/icons-material/Task";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CategoryIcon from "@mui/icons-material/Category";
import axios from "axios";
import Header from "../component/Header";
import Footer from "../component/Footer";

const drawerWidth = 240;

const roles = ["Admin", "Manager", "Member"];

export default function AdminDashboard() {
  // ... state and handlers remain the same ...
  const [taskStats, setTaskStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [invites, setInvites] = useState([]);
  const [loadingInvitess, setLoadingInvites] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "Member" });
  const [alert, setAlert] = useState({ open: false, severity: "info", message: "" });
  const [selectedMenu, setSelectedMenu] = useState("dashboard");

  // Fetch task stats and users on mount
  useEffect(() => {
    fetchTaskStats();
    fetchUsers();
    fetchInvite();
  }, []);

  const fetchTaskStats = async () => {
    try {
      // Replace with your API endpoint
      const res = await axiosInstance.get("/task/stats");
      console.log(res.data);
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
      const res = await axiosInstance.get("/user/fetch");
      setUsers(res.data);
    } catch {
      // fallback dummy
    }
    setLoadingUsers(false);
  };
  const fetchInvite = async () => {
    setLoadingInvites(true);
    try {
      // Replace with your API endpoint
      const res = await axiosInstance.get("/user/invite");
      setInvites(res.data);
    } catch {
      // fallback dummy
    }
    setLoadingInvites(false);
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
      await axiosInstance.post("/user/invite", inviteForm);
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

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };
  // Email validation simple regex
  const isEmailValid = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  return (
    <>
      <CssBaseline />
      <Header userName="Gopi" />
      <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          {/* Sidebar */}
          <Box
            sx={{
              width: drawerWidth,
              bgcolor: "primary.light",
              p: 2,
              borderRight: "1px solid #ddd",
              "& .Mui-selected": {
                bgcolor: "primary.main",
                color: "white",
                "&:hover": { bgcolor: "primary.dark" },
              },
              "& .MuiListItemButton-root:hover": {
                bgcolor: "primary.light",
              },
            }}
          >
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedMenu === "dashboard"}
                  onClick={() => handleMenuClick("dashboard")}
                >
                  <ListItemIcon sx={{ color: selectedMenu === "dashboard" ? "white" : "inherit" }}>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard Overview" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedMenu === "members"}
                  onClick={() => handleMenuClick("members")}
                >
                  <ListItemIcon sx={{ color: selectedMenu === "members" ? "white" : "inherit" }}>
                    <GroupIcon />
                  </ListItemIcon>
                  <ListItemText primary="Member Management" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedMenu === "invites"}
                  onClick={() => handleMenuClick("invites")}
                >
                  <ListItemIcon sx={{ color: selectedMenu === "invites" ? "white" : "inherit" }}>
                    <IosShareIcon />
                  </ListItemIcon>
                  <ListItemText primary="Invite Management" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedMenu === "settings"}
                  onClick={() => handleMenuClick("settings")}
                >
                  <ListItemIcon sx={{ color: selectedMenu === "settings" ? "white" : "inherit" }}>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Organization Settings" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 4,
              overflowY: "auto",
              bgcolor: "background.default",
            }}
          >
            {selectedMenu === "dashboard" && (
              <>
                <Typography variant="h5" mb={4} fontWeight="bold">
                  Dashboard
                </Typography>

                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        boxShadow: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <TaskIcon color="primary" sx={{ fontSize: 40 }} />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Total Tasks
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                          {taskStats?.totalTasks ?? <CircularProgress size={20} />}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        boxShadow: 3,
                        bgcolor: "error.main",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <WarningIcon sx={{ fontSize: 40 }} />
                      <Box>
                        <Typography variant="body2" color="inherit">
                          Overdue Tasks
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                          {taskStats?.overdueTasks ?? <CircularProgress size={20} color="inherit" />}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        boxShadow: 3,
                        bgcolor: "success.main",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 40 }} />
                      <Box>
                        <Typography variant="body2" color="inherit">
                          Completed Tasks
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                          {taskStats?.completedTasks ?? <CircularProgress size={20} color="inherit" />}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        boxShadow: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <CategoryIcon color="primary" sx={{ fontSize: 40 }} />
                      <Box>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Tasks by Category
                        </Typography>
                        {taskStats?.tasksByCategory ? (
                          <ul style={{ margin: 0, paddingLeft: 20 }}>
                            {Object.entries(taskStats.tasksByCategory).map(([cat, val]) => (
                              <li key={cat}>
                                <Typography variant="body2">
                                  {cat}: {val}
                                </Typography>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <Typography variant="body2">Loading...</Typography>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </>
            )}

            {selectedMenu === "members" && (
              <Paper sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" mb={3}>
                  <Typography variant="h6" fontWeight="bold">
                    Member Management
                  </Typography>
                  {/* <Button variant="contained" onClick={handleInviteOpen}>
                    Invite User
                  </Button> */}
                </Stack>

                {loadingUsers ? (
                  <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Table size="small" sx={{ borderCollapse: "separate", borderSpacing: "0 8px" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((u, i) => (
                        <TableRow
                          key={u.id}
                          sx={{
                            bgcolor: i % 2 === 0 ? "grey.100" : "white",
                            borderRadius: 2,
                            "& td": { borderBottom: "none" },
                          }}
                        >
                          <TableCell>{u.name}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>
                            <Select
                              value={u.role}
                              onChange={(e) => handleChangeRole(u.id, e.target.value)}
                              size="small"
                              disabled={loadingUsers}
                              sx={{ minWidth: 110 }}
                            >
                              {roles.map((r) => (
                                <MenuItem key={r} value={r}>
                                  {r}
                                </MenuItem>
                              ))}
                            </Select>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Remove user">
                              <Button
                                color="error"
                                onClick={() => handleRemoveUser(u.id)}
                                size="small"
                              >
                                Remove
                              </Button>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Paper>

            )}
            {selectedMenu === "invites" && (
              <Paper sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" mb={3}>
                  <Typography variant="h6" fontWeight="bold">
                    Invite Management
                  </Typography>
                  <Button variant="contained" onClick={handleInviteOpen}>
                    Invite User
                  </Button>
                </Stack>

                {loadingInvitess ? (
                  <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Table size="small" sx={{ borderCollapse: "separate", borderSpacing: "0 8px" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invites.map((u, i) => (
                        <TableRow
                          key={u.id}
                          sx={{
                            bgcolor: i % 2 === 0 ? "grey.100" : "white",
                            borderRadius: 2,
                            "& td": { borderBottom: "none" },
                          }}
                        >
                          <TableCell>{u.status}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>
                            <Select
                              value={u.role}
                              onChange={(e) => handleChangeRole(u.id, e.target.value)}
                              size="small"
                              disabled={loadingUsers}
                              sx={{ minWidth: 110 }}
                            >
                              {roles.map((r) => (
                                <MenuItem key={r} value={r}>
                                  {r}
                                </MenuItem>
                              ))}
                            </Select>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Remove user">
                              <Button
                                color="error"
                                onClick={() => handleRemoveUser(u.id)}
                                size="small"
                              >
                                Remove
                              </Button>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Paper>

            )}

            {selectedMenu === "settings" && (
              <Typography variant="h5" sx={{ mt: 2, fontWeight: "medium", color: "text.secondary" }}>
                Organization Settings (Coming soon)
              </Typography>
            )}

            {/* Invite User Modal */}
            <Dialog open={inviteOpen} onClose={handleInviteClose} fullWidth maxWidth="xs">
              <DialogTitle>Invite User</DialogTitle>
              <DialogContent>
                <Stack spacing={3} mt={1}>
                  <TextField
                    autoFocus
                    label="Email"
                    name="email"
                    type="email"
                    fullWidth
                    variant="standard"
                    value={inviteForm.email}
                    onChange={handleInviteChange}
                    error={inviteForm.email !== "" && !isEmailValid(inviteForm.email)}
                    helperText={
                      inviteForm.email !== "" && !isEmailValid(inviteForm.email)
                        ? "Please enter a valid email"
                        : ""
                    }
                  />
                  <FormControl fullWidth>
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
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleInviteClose}>Cancel</Button>
                <Button
                  onClick={handleInviteSubmit}
                  variant="contained"
                  disabled={!isEmailValid(inviteForm.email)}
                >
                  Send Invite
                </Button>
              </DialogActions>
            </Dialog>

            <Snackbar
              open={alert.open}
              autoHideDuration={4000}
              onClose={() => setAlert({ ...alert, open: false })}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert
                onClose={() => setAlert({ ...alert, open: false })}
                severity={alert.severity}
                sx={{ width: "100%" }}
              >
                {alert.message}
              </Alert>
            </Snackbar>
          </Box>
        </Box>

        {/* Footer */}
        <Footer
          sx={{
            bgcolor: "grey.900",
            color: "grey.300",
            py: 1,
            textAlign: "center",
          }}
        />
      </Box>
    </>
  );
}
