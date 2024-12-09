import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import TaskCard from "./TaskCard";
interface Props {
  column: Column;
  deleteColumn: (id: string) => void;
  updateTitle: (id: string, value: string) => void;
  updateTask: (id: string, value: string) => void;
  createTask: (id: string) => void;
  tasks?: Task[];
  deleteTask: (id: string) => void;
}
const Column = ({
  column,
  deleteColumn,
  updateTitle,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}: Props) => {
  const { id, title } = column;
  const [titleEditMode, setTitleEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "Column",
      column,
    },
    disabled: titleEditMode,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-bgMain w-[350px] h-[500px] max-h-[500px] rounded-lg flex flex-col border-2 opacity-60 border-rose-500"
      />
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-bgMain w-[350px] h-[500px] max-h-[500px] rounded-lg flex flex-col"
    >
      <div
        onDoubleClick={() => setTitleEditMode(true)}
        {...attributes}
        {...listeners}
        className="bg-bgColumn p-2 flex justify-between items-center rounded-lg"
      >
        <p className="flex gap-2 items-center">
          <span className="bg-bgMain px-4 p-2 rounded-lg">
            {tasks?.length || 0}
          </span>
          <div>
            {!titleEditMode ? (
              <span>{title}</span>
            ) : (
              <input
                className="bg-transparent"
                autoFocus
                onBlur={() => setTitleEditMode(false)}
                value={title}
                onChange={(e) => updateTitle(id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  setTitleEditMode(false);
                }}
              />
            )}
          </div>
        </p>
        <button
          className="bg-bgMain p-2 rounded-md"
          onClick={() => deleteColumn(id)}
        >
          Del
        </button>
      </div>
      <div className="flex flex-col  gap-4 flex-grow p-4 ">
        {tasks &&
          tasks.map((task) => (
            <TaskCard
              task={task}
              updateTask={updateTask}
              deleteTask={deleteTask}
            />
          ))}
      </div>
      <div className="">
        <button
          onClick={() => createTask(id)}
          className="rounded-md flex gap-2 items-center p-4 bg-bgColumn w-full"
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

export default Column;
