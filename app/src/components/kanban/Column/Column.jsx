import React from "react";
import TaskCard from "../TaskCard/TaskCard";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

const Column = ({ id, name, tasks, columnColor }) => {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      id,
      status: name,
    },
  });
  return (
    <SortableContext
      id={id}
      items={tasks}
      strategy={verticalListSortingStrategy}
    >
      <section className="column" ref={setNodeRef}>
        <div>
          <h3>
            <span
              className="column-color-circle"
              style={{ backgroundColor: columnColor }}
            ></span>
            {name}
          </h3>
        </div>
        <div>
          <ul>
            {tasks.map((task, index) => {
              const { id, title, description, subtasks, status } = task;
              return (
                <TaskCard
                  key={id}
                  columnName={name}
                  title={title}
                  description={description}
                  subtasks={subtasks}
                  status={status}
                  id={id}
                  index={index}
                />
              );
            })}
          </ul>
        </div>
      </section>
    </SortableContext>
  );
};

export default Column;
