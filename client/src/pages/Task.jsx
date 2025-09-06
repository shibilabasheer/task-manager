import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Table, Alert, Badge } from "react-bootstrap";
import api from "../services/api";
import AppNavbar from "../components/Navbar.jsx";

export default function Task() {
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", status: "Pending", due_date: "" });
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState("");
  //alert(localStorage.getItem("token"));

  const loadProfile = async () => {
    const { data } = await api.get("/auth/profile");
    setProfile(data);
  };

  const loadTasks = async () => {
    const { data } = await api.get("/tasks");
    setTasks(data);
  };

  useEffect(() => {
    loadProfile();
    loadTasks();
  }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", status: "Pending", due_date: "" });
    setEditingId(null);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/tasks/${editingId}`, form);
        setMsg("Task updated");
      } else {
        await api.post("/tasks", form);
        setMsg("Task created");
      }
      resetForm();
      loadTasks();
      setTimeout(() => setMsg(""), 1500);
    } catch (e) {
      alert(e.response?.data?.message || "Save failed");
    }
  };

  const editRow = (t) => {
    setEditingId(t._id);
    setForm({
      title: t.title || "",
      description: t.description || "",
      status: t.status || "Pending",
      due_date: t.due_date || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      setMsg("Task deleted");
      loadTasks();
      setTimeout(() => setMsg(""), 1500);
    } catch (e) {
      alert(e.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <AppNavbar profile={profile} />
      <Container className="py-3">
        {msg && <Alert variant="success">{msg}</Alert>}

        {/* Form */}
        <Form onSubmit={save} className="p-3 border rounded bg-light mb-4">
          <Row>
            <Col md={3}>
              <Form.Control placeholder="Title" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </Col>
            <Col md={3}>
              <Form.Control placeholder="Description" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </Col>
            <Col md={3}>
              <Form.Select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Control placeholder="Due Date" type="date" value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })} required />
            </Col>
            <Col md={2}>
              <Button className="mt-3" type="submit">{editingId ? "Update" : "Create"}</Button>
              {editingId && <Button variant="secondary" className="ms-2 mt-3" onClick={resetForm}>Cancel</Button>}
            </Col>
          </Row>
        </Form>

        {/* Table */}
        <Table bordered responsive hover>
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>status</th>
              <th>Due Date</th>
              <th style={{ width: 140 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr><td colSpan="6" className="text-center text-muted">No tasks</td></tr>
            ) : tasks.map(t => (
              <tr key={t._id}>
                <td>{t.title}</td>
                <td>{t.description || <span className="text-muted">—</span>}</td>
                <td>{t.status || <span className="text-muted">—</span>}</td>
                <td>{t.due_date || <span className="text-muted">—</span>}</td>
                <td className="d-flex gap-2">
                  <Button size="sm" variant="primary" onClick={() => editRow(t)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => remove(t._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}
