import { useState } from "react";

const TaskForm = ({ onSubmit, editingTask = null }) => {
  const [form, setForm] = useState(
    editingTask || { title: "", description: "", status: "pending" }
  );
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ title: "", description: "", status: "pending" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <button type="submit">{editingTask ? "Update" : "Create"} Task</button>
    </form>
  );
};
export default TaskForm;
