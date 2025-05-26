import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
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
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Header from "../component/Header";
import Footer from "../component/Footer";

const statuses = ["Todo", "In Progress", "Completed", "Expired"];
const statusColors = {
  Todo: "default",
  "In Progress": "info",
  Completed: "success",
  Expired: "warning",
};

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

  // New state for "View More" dialog
  const [viewMoreOpen, setViewMoreOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/task/get");
      setTasks(res.data);
    } catch {
      // setTasks([
      //   { id: 1, title: "Fix login bug", status: "Todo" },
      //   { id: 2, title: "Write docs", status: "In Progress" },
      //   { id: 3, title: "Deploy to staging", status: "Completed" },
      // ]);
    }
    setLoading(false);
  };

  const handleEditOpen = (task) => {
    setTaskForm({ _id: task._id || task.id, status: task.status, comment: "" });
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
      await axiosInstance.patch(`/task/tasks/${taskForm._id}`, {
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

  // Handle View More dialog
  const handleViewMoreOpen = (task) => {
    setSelectedTask(task);
    setViewMoreOpen(true);
  };
  const handleViewMoreClose = () => {
    setSelectedTask(null);
    setViewMoreOpen(false);
  };

  const ongoingTasks = tasks.filter((t) => ["Todo", "In Progress"].includes(t.status));
  const completedTasks = tasks.filter((t) => ["Completed", "Expired"].includes(t.status));

  // Helper to format dates nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <Header />

      <Container sx={{ my: 4 }}>
        <Typography variant="h4" mb={3}>
          Dashboard
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {/* Ongoing Tasks */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Ongoing Tasks</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {ongoingTasks.length > 0 ? (
                    ongoingTasks.map((task) => (
                      <Grid item xs={12} sm={6} md={4} key={task._id || task.id}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6">{task.title}</Typography>
                            <Chip
                              label={task.status}
                              color={statusColors[task.status]}
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          </CardContent>
                          <CardActions>
                            <Button size="small" onClick={() => handleEditOpen(task)}>
                              Update
                            </Button>
                            <Button size="small" onClick={() => handleViewMoreOpen(task)}>
                              View More
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Typography>No ongoing tasks assigned.</Typography>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Completed Tasks */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Completed / Expired Tasks</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {completedTasks.length > 0 ? (
                    completedTasks.map((task) => (
                      <Grid item xs={12} sm={6} md={4} key={task._id || task.id}>
                        <Card sx={{ backgroundColor: "#f5f5f5" }}>
                          <CardContent>
                            <Typography variant="h6">{task.title}</Typography>
                            <Chip
                              label={task.status}
                              color={statusColors[task.status]}
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          </CardContent>
                          <CardActions>
                            <Button size="small" onClick={() => handleViewMoreOpen(task)}>
                              View More
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Typography>No completed or expired tasks.</Typography>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </>
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

        {/* View More Dialog */}
        <Dialog open={viewMoreOpen} onClose={handleViewMoreClose} maxWidth="sm" fullWidth>
          <DialogTitle>Task Details</DialogTitle>
          <DialogContent dividers>
            {selectedTask ? (
              <Stack spacing={1}>
                <Typography><strong>Title:</strong> {selectedTask.title}</Typography>
                <Typography>
                  <strong>Status:</strong>{" "}
                  <Chip
                    label={selectedTask.status}
                    color={statusColors[selectedTask.status]}
                    size="small"
                  />
                </Typography>
                <Typography>
                  <strong>Category:</strong> {selectedTask.category || "N/A"}
                </Typography>
                <Typography>
                  <strong>Priority:</strong> {selectedTask.priority || "N/A"}
                </Typography>
                <Typography>
                  <strong>Description:</strong> {selectedTask.description || "N/A"}
                </Typography>
                <Typography>
                  <strong>Created At:</strong> {formatDate(selectedTask.createdAt)}
                </Typography>
                <Typography>
                  <strong>Due Date:</strong> {formatDate(selectedTask.dueDate)}
                </Typography>
                <Typography>
                  <strong>Comments:</strong> {selectedTask.comments || "N/A"}
                </Typography>
              </Stack>
            ) : (
              <Typography>No task selected</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleViewMoreClose}>Close</Button>
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

      <Footer />
    </>
  );
}
