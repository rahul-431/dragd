import { useState } from "react";
import { HiMiniXMark, HiOutlineTrash } from "react-icons/hi2";
import { MdOutlineModeEdit } from "react-icons/md";
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
              if (e.key === "Enter") {
                setTaskEditMode(false);
              }
            }}
          />
        )}
      </p>
      {!taskEditMode && (
        <div className="flex items-center gap-2">
          <button
            className="bg-bgMain p-2 rounded-md hover:text-rose-500 text-lg"
            onClick={() => setTaskEditMode(!taskEditMode)}
          >
            {taskEditMode ? <HiMiniXMark /> : <MdOutlineModeEdit />}
          </button>
          <button
            className="bg-bgMain p-2 rounded-md text-md hover:text-rose-500"
            onClick={() => deleteTask(task.id)}
          >
            <HiOutlineTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
