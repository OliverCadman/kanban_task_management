import React, { useState, useEffect } from "react";
import Column from "../Column/Column";
import { UseAppStateContext } from "../../../context/AppStateContext";
import { UseModalContext } from "../../../context/ModalContext";
import { UseBoardContext } from "../../../context/BoardContext";
import TaskCard from "../TaskCard/TaskCard";
import {
  findNestedObject,
  modifyNestedObject,
  modifyObject,
} from "../../../utils/helpers";
import { arrayMove } from "@dnd-kit/sortable";

import {
  DndContext,
  DragOverlay,
  closestCorners,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";

const TasksBoard = () => {
  const [appState] = UseAppStateContext();
  const { boardData, setBoardData } = UseBoardContext();
  const [_, setModalData] = UseModalContext();
  const [sideBarOpen, setSidebarOpen] = useState();

  const columnColors = [
    "#49C4E5",
    "#8471F2",
    " #67E2AE",
    "#E2679B",
    "#DFF271",
    "#E56A49",
  ];

  const [draggedTask, setDraggedTask] = useState({
    isDragActive: false,
  });

  useEffect(() => {
    if (appState.sideBarOpen) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  }, [appState.sideBarOpen]);

  const handleDragStart = (e) => {
    const taskToDrag = findNestedObject(boardData, e.active.id);
    const { id, description, status, subtasks, title } = taskToDrag;
    console.log(taskToDrag);
    setDraggedTask({
      isDragActive: true,
      id,
      description,
      status,
      subtasks,
      title,
    });
  };

  const handleDragOver = (e) => {
    const { active, over } = e;
    const [activeContainerId, overContainerId] = [
      active?.data?.current?.sortable?.containerId,
      over?.data?.current?.sortable?.containerId,
    ];

    if (activeContainerId === overContainerId) return;

    setBoardData((prevBoardData) => {
      const taskToChange = findNestedObject(prevBoardData, active.id);

      const columnToRemoveTaskFrom = findNestedObject(
        prevBoardData,
        activeContainerId
      );
      const columnToInjectTaskInto = findNestedObject(
        prevBoardData,
        over.data.current.id || overContainerId
      );
      console.log(columnToInjectTaskInto);

      let finalBoard = modifyNestedObject(
        prevBoardData,
        activeContainerId,
        undefined,
        {
          tasks: columnToRemoveTaskFrom.tasks.filter((task) => {
            return task.id !== active.id;
          }),
        }
      );

      finalBoard = modifyNestedObject(
        finalBoard,
        overContainerId || over.data.current.id,
        undefined,
        {
          tasks: [
            ...columnToInjectTaskInto.tasks,
            modifyObject(taskToChange, undefined, {
              status: over?.data?.current?.status,
            }),
          ],
        }
      );

      return finalBoard;
    });
  };

  const handleDragEnd = (e) => {
    const { active, over } = e;

    const [activeContainerId, overContainerId] = [
      active?.data?.current?.sortable?.containerId,
      over?.data?.current?.sortable?.containerId,
    ];

    const columnToModify = findNestedObject(
      boardData.activeBoard,
      overContainerId
    );

    if (activeContainerId && overContainerId) {
      setBoardData((prevBoardData) =>
        modifyNestedObject(prevBoardData, overContainerId, undefined, {
          tasks: arrayMove(
            columnToModify.tasks,
            active.data.current.index,
            over.data.current.index
          ),
        })
      );
    }
  };

  const dragSensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 3,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 2,
      },
    })
  );

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
      sensors={dragSensors}
    >
      <main
        className={`tasksboard__main ${
          appState.sideBarOpen ? "translate-sidebar" : ""
        } ${
          sideBarOpen &&
          (boardData?.activeBoard?.columns?.length === 0 ||
            boardData?.activeBoard?.name === "No Boards")
            ? "sidebar-width"
            : ""
        }`}
      >
        {boardData.activeBoard.name !== "No Boards" ? (
          <>
            {boardData.activeBoard.columns.length > 0 ? (
              <>
                {boardData.activeBoard.columns.map((column, i) => {
                  const { id, name, tasks } = column;
                  const columnColor = columnColors[i % columnColors.length];
                  return (
                    <Column
                      key={id}
                      id={id}
                      name={name}
                      tasks={tasks}
                      columnColor={columnColor}
                    />
                  );
                })}
                <div className="big-button">
                  <button
                    className="add-column-btn"
                    onClick={() => {
                      setModalData({
                        isModalDisplayed: true,
                        modalToRender: "edit-board",
                        modalContent: {
                          id: boardData.activeBoard.id,
                          name: boardData.activeBoard.name,
                          columns: boardData.activeBoard.columns,
                        },
                      });
                    }}
                  >
                    &#43; New Column
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="alert-container">
                  <h3>The board is empty. Create a column to get started.</h3>
                  <button
                    className="alert-board-btn pl-5 pr-5 pt-2 pb-2 mt-2"
                    onClick={() =>
                      setModalData({
                        isModalDisplayed: true,
                        modalToRender: "edit-board",
                        modalContent: {
                          id: boardData.activeBoard.id,
                          name: boardData.activeBoard.name,
                          columns: boardData.activeBoard.columns,
                        },
                      })
                    }
                  >
                    &#43; Add New Column
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="alert-container">
            <h3>You have no boards. Create a board to get started.</h3>
            <button
              className="alert-board-btn pl-5 pr-5 pt-2 pb-2 mt-2"
              onClick={() =>
                setModalData({
                  modalToRender: "create-board",
                  isModalDisplayed: true,
                  modalContent: {},
                })
              }
            >
              &#43; Create New Board
            </button>
          </div>
        )}
      </main>
      <DragOverlay>
        {draggedTask.isDragActive ? (
          <TaskCard
            dragStyle={{ opacity: 0.5, listStyle: "none" }}
            id={draggedTask.id}
            title={draggedTask.title}
            description={draggedTask.description}
            status={draggedTask.status}
            subtasks={draggedTask.subtasks}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TasksBoard;
