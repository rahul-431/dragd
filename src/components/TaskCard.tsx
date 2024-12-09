import { useState } from "react";
interface Props {
  task: Task;
  updateTask: (id: string, value: string) => void;
  deleteTask: (id: string) => void;
}
const TaskCard = ({ task, updateTask, deleteTask }: Props) => {
  const [taskEditMode, setTaskEditMode] = useState(false);
  return (
    <div
      className={`bg-bgColumn p-2 flex w-full items-center rounded-md ${
        taskEditMode ? "" : "justify-between"
      }`}
      onDoubleClick={() => setTaskEditMode(true)}
    >
      <p className={taskEditMode ? "w-full" : ""}>
        {!taskEditMode ? (
          task.content
        ) : (
          <textarea
            rows={4}
            className="bg-transparent w-full"
            autoFocus
            onBlur={() => setTaskEditMode(false)}
            value={task.content}
            onChange={(e) => updateTask(task.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey) {
                setTaskEditMode(false);
              }
            }}
          />
        )}
      </p>
      {!taskEditMode && (
        <button
          className="bg-bgMain p-2 rounded-md"
          onClick={() => deleteTask(task.id)}
        >
          Del
        </button>
      )}
    </div>
  );
};

export default TaskCard;
