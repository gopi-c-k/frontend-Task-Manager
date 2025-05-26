import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
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

const statuses = ["Todo", "In Progress", "Completed", "Expired"];

export default function MemberDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    id: null,
    status: "Todo",
    comment: "",
  });
  const [alert, setAlert] = useState({ open: false, severity: "info", message: "" });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      // Replace with your API endpoint, filtered by logged-in user
      const res = await axios.get("http://localhost:5000/api/tasks/assigned");
      setTasks(res.data);
    } catch {
      setTasks([
        {
          id: 1,
          title: "Fix login bug",
          status: "Todo",
        },
        {
          id: 2,
          title: "Write docs",
          status: "In Progress",
        },
      ]);
    }
    setLoading(false);
  };

  const handleEditOpen = (task) => {
    setTaskForm({ id: task.id, status: task.status, comment: "" });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      // Replace with your API endpoint for updating task status/comments
      await axios.patch(`http://localhost:5000/api/tasks/${taskForm.id}`, {
        status: taskForm.status,
        comment: taskForm.comment,
      });
      setAlert({ open: true, severity: "success", message: "Task updated" });
      fetchTasks();
      setEditOpen(false);
    } catch (err) {
      setAlert({
        open: true,
        severity: "error",
        message: err.response?.data?.message || "Failed to update task",
      });
    }
  };

  return (
    <Container sx={{ my: 4 }}>
      <Typography variant="h4" mb={3}>
        Member Dashboard
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Paper>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Task Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>{t.status}</TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => handleEditOpen(t)}>
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Edit Task Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Update Task Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select name="status" value={taskForm.status} onChange={handleChange}>
              {statuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Comment"
            name="comment"
            multiline
            rows={3}
            fullWidth
            margin="normal"
            value={taskForm.comment}
            onChange={handleChange}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save
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
