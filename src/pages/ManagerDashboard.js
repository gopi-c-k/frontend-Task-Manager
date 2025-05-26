import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
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
  Box,
  CssBaseline,
  Chip,
  Stack,
} from "@mui/material";

import Header from "../component/Header";
import Footer from "../component/Footer";

const categories = ["Bug", "Feature", "Improvement"];
const priorities = ["Low", "Medium", "High"];
const statuses = ["Todo", "In Progress", "Completed", "Expired"];

// Status colors mapping
const statusColors = {
  Todo: "default",
  "In Progress": "info",
  Completed: "success",
  Expired: "error",
};

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
    assignedToId: "",
  });
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState({ open: false, severity: "info", message: "" });

  // For "View More" dialog
  const [viewTaskOpen, setViewTaskOpen] = useState(false);
  const [viewTask, setViewTask] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const res = await axiosInstance.get("/task/tasks");
      setTasks(res.data);
    } catch {
      setTasks([
        {
          _id: "1",
          title: "Fix login bug",
          category: "Bug",
          priority: "High",
          dueDate: "2025-06-10",
          status: "Todo",
          assignedTo: { name: "John Doe" },
          description: "Fix issue with login redirect",
          createdAt: "2025-05-01T12:00:00Z",
          comments: "Urgent fix required",
        },
      ]);
    }
    setLoadingTasks(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/user/fetchmembers");
      setUsers(res.data);
    } catch {
      // fallback or handle error
    }
  };

  const handleOpenTaskDialog = (task = null) => {
    if (task) {
      setTaskForm({
        ...task,
        assignedToId: task.assignedTo?._id || "",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      });
    } else {
      setTaskForm({
        title: "",
        description: "",
        category: "Feature",
        priority: "Medium",
        dueDate: "",
        status: "Todo",
        assignedToId: "",
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
      if (taskForm._id) {
        await axiosInstance.put(`/task/tasks/${taskForm._id}`, taskForm);
        setAlert({ open: true, severity: "success", message: "Task updated" });
      } else {
        await axiosInstance.post("/task/create", taskForm);
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

  // Open "View More" dialog
  const handleViewMore = (task) => {
    setViewTask(task);
    setViewTaskOpen(true);
  };

  const handleCloseViewTask = () => {
    setViewTaskOpen(false);
    setViewTask(null);
  };

  return (
    <>
      <CssBaseline />
      <Header userName="Manager" />

      <Container sx={{ my: 4, minHeight: "80vh" }}>
        <Typography variant="h4" mb={3} align="center">
          Dashboard
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="contained" onClick={() => handleOpenTaskDialog()}>
            Create Task
          </Button>
        </Box>

        {loadingTasks ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper elevation={3}>
            <Table size="small" sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell>{t.title}</TableCell>
                    <TableCell>{t.category}</TableCell>
                    <TableCell>{t.priority}</TableCell>
                    <TableCell>{new Date(t.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip label={t.status} color={statusColors[t.status]} />
                    </TableCell>
                    <TableCell>{t.assignedTo?.name || "-"}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button size="small" onClick={() => handleOpenTaskDialog(t)}>
                          Edit
                        </Button>
                        <Button size="small" onClick={() => handleViewMore(t)}>
                          View More
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        {/* Task Create/Edit Dialog */}
        <Dialog open={taskDialogOpen} onClose={handleCloseTaskDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{taskForm._id ? "Edit Task" : "Create Task"}</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              name="title"
              fullWidth
              margin="normal"
              value={taskForm.title}
              onChange={handleTaskChange}
              required
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

            {/* Status selector is disabled on creation for now */}
            {/* <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select name="status" value={taskForm.status} onChange={handleTaskChange}>
                {statuses.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}

            <FormControl fullWidth margin="normal">
              <InputLabel>Assign To</InputLabel>
              <Select name="assignedToId" value={taskForm.assignedToId} onChange={handleTaskChange}>
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {users.map((u) => (
                  <MenuItem key={u._id} value={u._id}>
                    {u.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseTaskDialog}>Cancel</Button>
            <Button variant="contained" onClick={handleTaskSubmit}>
              {taskForm._id ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View More Task Dialog */}
        <Dialog open={viewTaskOpen} onClose={handleCloseViewTask} maxWidth="sm" fullWidth>
          <DialogTitle>Task Details</DialogTitle>
          <DialogContent dividers>
            {viewTask && (
              <>
                <Typography variant="h6" gutterBottom>
                  {viewTask.title}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Category:</strong> {viewTask.category}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Priority:</strong> {viewTask.priority}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Status:</strong>{" "}
                  <Chip label={viewTask.status} color={statusColors[viewTask.status]} size="small" />
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Due Date:</strong> {new Date(viewTask.dueDate).toLocaleDateString()}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Assigned To:</strong> {viewTask.assignedTo?.name || "-"}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Created At:</strong>{" "}
                  {new Date(viewTask.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Description:</strong> <br />
                  {viewTask.description || "-"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Comments:</strong> <br />
                  {viewTask.comments || "-"}
                </Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseViewTask}>Close</Button>
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
      </Container>

      <Footer />
    </>
  );
}
