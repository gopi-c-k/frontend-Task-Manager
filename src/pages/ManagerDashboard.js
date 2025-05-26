import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
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
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const categories = ["Bug", "Feature", "Improvement"];
const priorities = ["Low", "Medium", "High"];
const statuses = ["Todo", "In Progress", "Completed", "Expired"];

export default function ManagerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    category: "Feature",
    priority: "Medium",
    dueDate: "",
    status: "Todo",
    assignedTo: "",
  });
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState({ open: false, severity: "info", message: "" });

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      // Replace with your API
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
    } catch {
      setTasks([
        {
          id: 1,
          title: "Fix login bug",
          category: "Bug",
          priority: "High",
          dueDate: "2025-06-10",
          status: "Todo",
          assignedTo: "John Doe",
        },
      ]);
    }
    setLoadingTasks(false);
  };

  const fetchUsers = async () => {
    try {
      // Replace with your API for users to assign tasks to
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch {
      setUsers([{ id: "u1", name: "John Doe" }, { id: "u2", name: "Jane Smith" }]);
    }
  };

  const handleOpenTaskDialog = (task = null) => {
    if (task) {
      setTaskForm({ ...task });
    } else {
      setTaskForm({
        title: "",
        description: "",
        category: "Feature",
        priority: "Medium",
        dueDate: "",
        status: "Todo",
        assignedTo: "",
      });
    }
    setTaskDialogOpen(true);
  };

  const handleCloseTaskDialog = () => {
    setTaskDialogOpen(false);
  };

  const handleTaskChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const handleTaskSubmit = async () => {
    try {
      if (taskForm.id) {
        // Update existing task
        await axios.put(`http://localhost:5000/api/tasks/${taskForm.id}`, taskForm);
        setAlert({ open: true, severity: "success", message: "Task updated" });
      } else {
        // Create new task
        await axios.post("http://localhost:5000/api/tasks", taskForm);
        setAlert({ open: true, severity: "success", message: "Task created" });
      }
      fetchTasks();
      setTaskDialogOpen(false);
    } catch (err) {
      setAlert({
        open: true,
        severity: "error",
        message: err.response?.data?.message || "Failed to save task",
      });
    }
  };

  return (
    <Container sx={{ my: 4 }}>
      <Typography variant="h4" mb={3}>
        Manager Dashboard
      </Typography>

      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpenTaskDialog()}>
        Create Task
      </Button>

      {loadingTasks ? (
        <CircularProgress />
      ) : (
        <Paper>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell>{t.priority}</TableCell>
                  <TableCell>{t.dueDate}</TableCell>
                  <TableCell>{t.status}</TableCell>
                  <TableCell>{t.assignedTo}</TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => handleOpenTaskDialog(t)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Task Dialog */}
      <Dialog open={taskDialogOpen} onClose={handleCloseTaskDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{taskForm.id ? "Edit Task" : "Create Task"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            fullWidth
            margin="normal"
            value={taskForm.title}
            onChange={handleTaskChange}
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={taskForm.description}
            onChange={handleTaskChange}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select name="category" value={taskForm.category} onChange={handleTaskChange}>
              {categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select name="priority" value={taskForm.priority} onChange={handleTaskChange}>
              {priorities.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Due Date"
            name="dueDate"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={taskForm.dueDate}
            onChange={handleTaskChange}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select name="status" value={taskForm.status} onChange={handleTaskChange}>
              {statuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Assign To</InputLabel>
            <Select name="assignedTo" value={taskForm.assignedTo} onChange={handleTaskChange}>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {users.map((u) => (
                <MenuItem key={u.id} value={u.name}>
                  {u.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseTaskDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleTaskSubmit}>
            {taskForm.id ? "Update" : "Create"}
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
