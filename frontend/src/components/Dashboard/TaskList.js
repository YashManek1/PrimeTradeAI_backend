const TaskList = ({ tasks, onDelete, onEdit }) => (
  <div>
    {tasks.length === 0 ? (
      <div>No tasks yet</div>
    ) : (
      tasks.map((task) => (
        <div key={task._id}>
          <strong>{task.title}</strong> - {task.description} [{task.status}]
          <button onClick={() => onEdit(task)}>Edit</button>
          <button onClick={() => onDelete(task._id)}>Delete</button>
        </div>
      ))
    )}
  </div>
);
export default TaskList;
