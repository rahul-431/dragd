import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import { HiMiniXMark, HiOutlineTrash } from "react-icons/hi2";
import { MdOutlineModeEdit } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
interface Props {
  column: Column;
  deleteColumn: (id: string) => void;
  updateTitle: (id: string, value: string) => void;
  updateTask: (id: string, value: string) => void;
  createTask: (id: string) => void;
  tasks: Task[];
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
  const tasksId = useMemo(() => tasks.map((task) => task.id), [tasks]);

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

  //for smooth transition
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
      className="cursor-pointer bg-bgMain w-[350px] h-[500px] max-h-[500px] rounded-lg flex flex-col"
    >
      <div
        onDoubleClick={() => setTitleEditMode(true)}
        {...attributes}
        {...listeners}
        className="bg-bgColumn p-2 flex justify-between items-center rounded-lg"
      >
        <div className="flex gap-2 items-center">
          {!titleEditMode && (
            <div className="bg-bgMain px-4 p-2 rounded-lg ">
              {tasks?.length || 0}
            </div>
          )}
          <div className="px-4">
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
        </div>
        <div className="flex items-center gap-2">
          <button
            className="bg-bgMain p-2 rounded-md hover:text-rose-500 text-lg"
            onClick={() => setTitleEditMode(!titleEditMode)}
          >
            {titleEditMode ? <HiMiniXMark /> : <MdOutlineModeEdit />}
          </button>
          <button
            className="bg-bgMain p-2 rounded-md hover:text-rose-500 text-lg"
            onClick={() => deleteColumn(id)}
          >
            <HiOutlineTrash />
          </button>
        </div>
      </div>
      <div className="flex flex-col  gap-4 flex-grow p-4 ">
        <SortableContext items={tasksId}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              updateTask={updateTask}
              deleteTask={deleteTask}
            />
          ))}
        </SortableContext>
      </div>
      <div>
        <button
          onClick={() => createTask(id)}
          className="rounded-md flex gap-2 items-center p-4 bg-bgColumn w-full"
        >
          <span className="text-xl">
            <IoMdAddCircleOutline />
          </span>
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
};

export default Column;
