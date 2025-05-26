import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import Header from "../component/Header";
import Footer from "../component/Footer";

const statuses = ["Todo", "In Progress", "Completed", "Expired"];
const statusColors = {
  "Todo": "default",
  "In Progress": "info",
  "Completed": "success",
  "Expired": "warning",
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

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/tasks/assigned");
      setTasks(res.data);
    } catch {
      setTasks([
        { id: 1, title: "Fix login bug", status: "Todo" },
        { id: 2, title: "Write docs", status: "In Progress" },
        { id: 3, title: "Deploy to staging", status: "Completed" },
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

  const ongoingTasks = tasks.filter((t) => ["Todo", "In Progress"].includes(t.status));
  const completedTasks = tasks.filter((t) => ["Completed", "Expired"].includes(t.status));

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
                      <Grid item xs={12} sm={6} md={4} key={task.id}>
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
                      <Grid item xs={12} sm={6} md={4} key={task.id}>
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
