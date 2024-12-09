import { useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import Column from "./Column";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arraySwap, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
const Board = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

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
    setColumns([
      ...columns,
      {
        id: uuid(),
        title: `Column ${columns.length + 1}`,
      },
    ]);
  };

  //Delete existing column
  const handleDeleteColumn = (id: string) => {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  };

  //run when start the drag
  const handleOnDragStart = (e: DragStartEvent) => {
    //checking the type of drag "Column"
    if (e.active.data.current?.type === "Column") {
      setActiveColumn(e.active.data.current.column);
      return;
    }
  };

  //called when placed to other position or dragged complete
  const handleOnDragEnd = (e: DragEndEvent) => {
    //active means that column which is being dragged
    //and over means that column where it will be dropped
    const { active, over } = e;
    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;

    //check active column and over column is same otherwise swap them
    if (activeColumnId === overColumnId) return;
    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );
      return arraySwap(columns, activeColumnIndex, overColumnIndex);
    });
  };

  //updating column title
  const handleUpdateTitle = (id: string, value: string) => {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title: value };
    });
    setColumns(newColumns);
  };
  const handleUpdateTask = (id: string, value: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content: value };
    });
    setTasks(newTasks);
  };

  //creating new task
  const handleCreateTask = (id: string) => {
    setTasks([
      ...tasks,
      {
        id: uuid(),
        content: `Task ${tasks.length + 1}`,
        columnId: id,
      },
    ]);
  };

  //Deleting task
  const handleDeleteTask = (id: string) => {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
  };
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleOnDragStart}
      onDragEnd={handleOnDragEnd}
    >
      <div className="m-auto min-h-screen flex w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
        <div className="m-auto flex gap-5">
          <div className="text-white flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <Column
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
          <button
            onClick={addColumn}
            className="w-[200px] h-[40px] cursor-pointer rounded-lg bg-bgMain border border-bgColumn px-4 py-2 ring-rose-500 hover:ring-2 text-white"
          >
            Add Column
          </button>
          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <Column
                  column={activeColumn}
                  deleteColumn={handleDeleteColumn}
                  updateTitle={handleUpdateTitle}
                  createTask={handleCreateTask}
                  deleteTask={handleDeleteTask}
                  updateTask={handleUpdateTask}
                />
              )}
            </DragOverlay>,
            document.body
          )}
        </div>
      </div>
    </DndContext>
  );
};
export default Board;
