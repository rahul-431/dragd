import { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import Column from "./Column";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { IoMdAddCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";
import TaskCard from "./TaskCard";
const Board = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  useEffect(() => {
    const storedColumns = localStorage.getItem("columns");
    const storedTasks = localStorage.getItem("tasks");
    const oldColumns = storedColumns
      ? (JSON.parse(storedColumns) as Column[])
      : [];
    const oldTasks = storedTasks ? (JSON.parse(storedTasks) as Task[]) : [];
    setTasks(oldTasks);
    setColumns(oldColumns);
  }, []);
  const columnsId = useMemo(() => {
    return columns.map((col) => col.id);
  }, [columns]);
  //after sorting columns the delete function did not worked
  //to solve this issue we can use useSesors hook;
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // if column is moved 5px then the drag sensor will activate
        distance: 5, //in pixel
      },
    })
  );

  //adding new column
  const addColumn = () => {
    setColumns((prev) => {
      const newColumns = [
        ...prev,
        {
          id: uuid(),
          title: `Column ${prev.length + 1}`,
        },
      ];
      localStorage.setItem("columns", JSON.stringify(newColumns));
      return newColumns;
    });
    toast.success("Column Added");
  };

  //Delete existing column
  const handleDeleteColumn = (id: string) => {
    const filteredColumns = columns.filter((col) => col.id !== id);
    const newTasks = tasks.filter((task) => task.columnId !== id);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    localStorage.setItem("columns", JSON.stringify(filteredColumns));
    setColumns(filteredColumns);
    setTasks(newTasks);
    toast.success("Column Deleted");
  };

  //run when start the drag
  const handleOnDragStart = (e: DragStartEvent) => {
    //checking the type of drag "Column"
    if (e.active.data.current?.type === "Column") {
      setActiveColumn(e.active.data.current.column);
      return;
    }
    if (e.active.data.current?.type === "Task") {
      setActiveTask(e.active.data.current.task);
      return;
    }
  };

  //called when placed to other position or dragged complete
  const handleOnDragEnd = (e: DragEndEvent) => {
    // setActiveColumn(null);
    // setActiveTask(null);

    //active means that column which is being dragged
    //and over means that column where it will be dropped
    const { active, over } = e;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;
    if (active.data.current?.type === "Task") {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        const swapedTasks = arrayMove(tasks, activeIndex, overIndex);
        localStorage.setItem("tasks", JSON.stringify(swapedTasks));
        return swapedTasks;
      });
    }
    if (active.data.current?.type === "Column") {
      setColumns((columns) => {
        const activeColumnIndex = columns.findIndex(
          (col) => col.id === activeId
        );
        const overColumnIndex = columns.findIndex((col) => col.id === overId);
        const sortedColumns = arrayMove(
          columns,
          activeColumnIndex,
          overColumnIndex
        );
        localStorage.setItem("columns", JSON.stringify(sortedColumns));
        return sortedColumns;
      });
    }
  };

  //updating column title
  const handleUpdateTitle = (id: string, value: string) => {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title: value };
    });
    localStorage.setItem("columns", JSON.stringify(newColumns));
    setColumns(newColumns);
  };
  const handleUpdateTask = (id: string, value: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content: value };
    });
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    setTasks(newTasks);
  };

  //creating new task
  const handleCreateTask = (id: string) => {
    setTasks((prev) => {
      const newTasks = [
        ...prev,
        {
          id: uuid(),
          content: `Task ${prev.length + 1}`,
          columnId: id,
        },
      ];
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      return newTasks;
    });
    toast.success("Added new task");
  };

  //Deleting task
  const handleDeleteTask = (id: string) => {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(filteredTasks));

    setTasks(filteredTasks);
    toast.success("Task deleted");
  };

  //drag and drop the task to different columsn
  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    //check active column and over column is same otherwise swap them
    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!activeTask) return;
    //dropping task over other columns
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        const swapedTasks = arrayMove(tasks, activeIndex, overIndex);

        localStorage.setItem("tasks", JSON.stringify(swapedTasks));
        return swapedTasks;
      });
    }

    //dropping task to same column
    const isOverColumn = over.data.current?.type === "Column";
    if (isOverColumn && isActiveTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        tasks[activeIndex].columnId = overId.toString();
        const swapedTasks = arrayMove(tasks, activeIndex, activeIndex);

        localStorage.setItem("tasks", JSON.stringify(swapedTasks));
        return swapedTasks;
      });
    }
  };
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleOnDragStart}
      onDragEnd={handleOnDragEnd}
      onDragOver={handleDragOver}
    >
      <div className=" min-h-screen flex flex-col w-full items-center overflow-x-auto md:overflow-y-hidden overflow-y-auto ">
        <button
          onClick={addColumn}
          className="cursor-pointer rounded-lg bg-bgMain border border-bgColumn px-4 py-2 ring-rose-500 hover:ring-2 text-white  m-5 flex gap-2 items-center text-center"
        >
          <span className="text-xl">
            <IoMdAddCircleOutline />
          </span>
          <span>Add Column</span>
        </button>
        <div className="flex gap-5 py-5 md:p-0">
          <div className="flex gap-5">
            <div className="text-white flex md:flex-row flex-col gap-6">
              <SortableContext items={columnsId}>
                {columns.map((col) => (
                  <Column
                    key={col.id}
                    column={col}
                    deleteColumn={handleDeleteColumn}
                    updateTitle={handleUpdateTitle}
                    createTask={handleCreateTask}
                    tasks={tasks.filter((task) => task.columnId === col.id)}
                    deleteTask={handleDeleteTask}
                    updateTask={handleUpdateTask}
                  />
                ))}
              </SortableContext>
            </div>

            {createPortal(
              <DragOverlay>
                {activeColumn && (
                  <Column
                    column={activeColumn}
                    deleteColumn={handleDeleteColumn}
                    updateTitle={handleUpdateTitle}
                    createTask={handleCreateTask}
                    deleteTask={handleDeleteTask}
                    tasks={tasks}
                    updateTask={handleUpdateTask}
                  />
                )}
                {activeTask && (
                  <TaskCard
                    task={activeTask}
                    deleteTask={handleDeleteTask}
                    updateTask={handleUpdateTask}
                  />
                )}
              </DragOverlay>,
              document.body
            )}
          </div>
        </div>
      </div>
    </DndContext>
  );
};
export default Board;
