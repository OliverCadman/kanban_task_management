import React, { useState } from "react";
import { ReactComponent as EllipsisIcon } from "../../../assets/svgs/icon-vertical-ellipsis.svg";
import SubTask from "../SubTask/SubTask";
import Status from "../Status/Status";
import Tooltip from "../Tooltip/Tooltip";
import {
  findParentColumnData,
  findNestedObject,
  modifyObject,
  modifyNestedObject,
} from "../../../utils/helpers";
import { UseBoardContext } from "../../../context/BoardContext";
import { UseModalContext } from "../../../context/ModalContext";

const TaskDetail = () => {
  const { boardData, setBoardData } = UseBoardContext();
  const [modalData, setModalData] = UseModalContext();
  const [showTooltip, setShowTooltip] = useState(false);

  const {
    modalContent: { title, description, subtasks, status, id, columnName },
  } = modalData;

  const parentColumnData = findParentColumnData(
    boardData.activeBoard,
    columnName
  );

  const [taskInfo, setTaskInfo] = useState({
    parentColumnId: parentColumnData.columnID,
    status: status || parentColumnData.columnStatus,
    id: id,
    title: title,
    description: description,
    subtasks: subtasks,
    options: boardData.activeBoard.columns.reduce((arr, column) => {
      if (!arr.includes(column.name)) {
        arr.push(column.name);
      }
      return arr;
    }, []),
    statusActive: false,
  });

  const changeTaskStatus = (e) => {
    const columnName = e.target.value;
    const newParentColumnID = findParentColumnData(
      boardData.activeBoard,
      columnName
    );

    setBoardData((prevData) => {
      const columnToRemoveTaskFrom = findNestedObject(
        prevData,
        taskInfo.parentColumnId
      );

      const columnToInjectTaskInto = findNestedObject(
        prevData,
        newParentColumnID.columnID
      );

      const taskToChange = findNestedObject(boardData.activeBoard, taskInfo.id);

      let finalBoard = modifyNestedObject(
        prevData,
        taskInfo.parentColumnId,
        undefined,
        {
          tasks: columnToRemoveTaskFrom.tasks.filter((task) => {
            return task.id !== taskInfo.id;
          }),
        }
      );

      finalBoard = modifyNestedObject(
        finalBoard,
        newParentColumnID.columnID,
        undefined,
        {
          tasks: [
            modifyObject(taskToChange, undefined, { status: columnName }),
            ...columnToInjectTaskInto.tasks,
          ],
        }
      );

      return finalBoard;
    });

    setTaskInfo((prevTaskInfo) => ({
      ...prevTaskInfo,
      parentColumnId: newParentColumnID,
      status: columnName,
    }));

    setModalData({
      isModalDisplayed: false,
      modalToRender: "",
      modalContent: {},
    });
  };

  const handleEditTooltipClicked = () => {
    setModalData({
      isModalDisplayed: true,
      modalToRender: "edit-task",
      modalContent: {
        title,
        description,
        subtasks,
        status,
        id,
      },
    });
  };

  const handleCheckboxChange = (taskID) => {
    const subtaskToModify = findNestedObject(boardData, taskID);

    setTaskInfo((prevData) => {
      const updatedObject = modifyNestedObject(prevData, taskID, undefined, {
        isCompleted: !subtaskToModify.isCompleted,
      });

      return updatedObject;
    });

    setBoardData((prevData) => {
      const updatedObject = modifyNestedObject(
        prevData.boardCollection,
        taskID,
        undefined,
        {
          isCompleted: !subtaskToModify.isCompleted,
        }
      );

      const updatedActiveBoard = modifyNestedObject(
        prevData.activeBoard,
        taskID,
        undefined,
        { isCompleted: !subtaskToModify.isCompleted }
      );

      return {
        ...prevData,
        activeBoard: updatedActiveBoard,
        boardCollection: updatedObject,
      };
    });
  };

  const handleDelete = () => {
    setModalData({
      modalToRender: "delete-task",
      isModalDisplayed: true,
      modalContent: {
        id: taskInfo.id,
        parentColumnId: taskInfo.parentColumnId,
        itemTitle: title,
      },
    });
  };

  return (
    <aside
      className="modal pr-7 pl-7 pb-5 pt-5"
      onClick={(e) => {
        if (
          e.target !== e.currentTarget &&
          !e.target.classList.contains("tooltip-btn") &&
          showTooltip
        ) {
          setShowTooltip(false);
        }
      }}
    >
      <div className="modal-header view-task">
        <h5 className="pr-2">{taskInfo.title}</h5>
        <button
          type="button"
          className="tooltip-btn"
          onClick={() => setShowTooltip(!showTooltip)}
        >
          <span>
            <EllipsisIcon />
          </span>
        </button>
        {showTooltip ? (
          <Tooltip
            val={"task"}
            handleEditTooltipClicked={handleEditTooltipClicked}
            handleDelete={handleDelete}
          />
        ) : (
          ""
        )}
      </div>
      <div className="modal-content">
        <p>{taskInfo.description ? taskInfo.description : "No Description"}</p>
      </div>
      <div className="subtask-list">
        <h5>
          Subtasks (
          {taskInfo.subtasks.filter((task) => task.isCompleted).length} of{" "}
          {subtasks.length} )
        </h5>
        {taskInfo.subtasks &&
          taskInfo.subtasks.map((subtask) => {
            const { id, title, isCompleted } = subtask;
            return (
              <SubTask
                key={id}
                id={id}
                taskDescription={title}
                isCompleted={isCompleted}
                handleCheckboxChange={handleCheckboxChange}
              />
            );
          })}
      </div>
      <div>
        <Status
          options={taskInfo.options}
          activeStatus={taskInfo.status}
          changeTaskStatus={changeTaskStatus}
        />
      </div>
    </aside>
  );
};

export default TaskDetail;
