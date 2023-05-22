import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UseModalContext } from "../../../context/ModalContext";
import {
  findParentColumnData,
  modifyNestedObject,
  modifyObject,
  findNestedObject,
} from "../../../utils/helpers";
import { ReactComponent as CrossIcon } from "../../../assets/svgs/icon-cross.svg";
import { nanoid } from "nanoid";
import { UseBoardContext } from "../../../context/BoardContext";
import Status from "../Status/Status";

const EditTask = () => {
  const [modalData, setModalData] = UseModalContext();
  const { boardData, setBoardData } = UseBoardContext();
  const {
    id,
    title,
    description,
    status: status,
    subtasks: taskSubtasks,
  } = modalData.modalContent;

  const [taskInfo, setTaskInfo] = useState({
    id,
    defaultParentColumnID: status
      ? findParentColumnData(boardData.activeBoard, status).columnID
      : boardData.activeBoard.columns[0].id,
    parentColumnID: status
      ? findParentColumnData(boardData.activeBoard, status).columnID
      : boardData.activeBoard.columns[0].id,
    defaultStatus: status || boardData.activeBoard.columns[0].name,
    activeStatus: status || boardData.activeBoard.columns[0].name,
    statusOptions: boardData.activeBoard.columns.reduce((arr, column) => {
      if (!arr.includes(column.name)) {
        arr.push(column.name);
      }
      return arr;
    }, []),
    subtasks: [
      ...taskSubtasks.map((subtask) => {
        return {
          ...subtask,
          isValid: true,
        };
      }),
    ],
    description: description || "",
    title,
  });

  const [taskTitleValid, setTaskTitleValid] = useState(true);

  const checkFormValidity = () => {
    const validSubtasks = [];

    taskInfo.subtasks.forEach((subtask) => {
      if (!subtask.title) {
        setTaskInfo((prevTaskInfo) => ({
          ...prevTaskInfo,
          subtasks: prevTaskInfo.subtasks.map((nestedSubtask) => {
            if (subtask.id === nestedSubtask.id) {
              nestedSubtask.isValid = false;
            }
            return nestedSubtask;
          }),
        }));
      } else {
        validSubtasks.push(subtask);
      }
    });

    if (taskInfo.title === "") {
      setTaskTitleValid(false);
    }

    if (
      validSubtasks.length !== taskInfo.subtasks.length ||
      taskInfo.title === ""
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handleFormChange = (e) => {
    const inputID = e.target.id;
    setTaskInfo((prevTaskInfo) => {
      let newTitle, newDescription;
      if (inputID.includes("title")) {
        newTitle = e.target.value;

        if (newTitle) {
          setTaskTitleValid(true);
        }

        return {
          ...prevTaskInfo,
          title: newTitle,
        };
      } else if (inputID.includes("description")) {
        newDescription = e.target.value;
        return {
          ...prevTaskInfo,
          description: newDescription,
        };
      } else if (inputID.includes("subtask")) {
        const subTaskID = inputID.split("subtasks-")[1];

        const arrCopy = [...prevTaskInfo.subtasks];

        const subTaskToChange = arrCopy.find(
          (subtask) => subtask.id === subTaskID
        );

        subTaskToChange.title = e.target.value;

        if (subTaskToChange.title) {
          subTaskToChange.isValid = true;
        } else {
          subTaskToChange.isValid = false;
        }

        // Find the subtask to be updated in subtask array.
        // Use arr.splice to inject to replace old subtask with new
        for (let i = 0; i < arrCopy.length; i++) {
          let obj = arrCopy[i];

          if (arrCopy.indexOf(obj.id) !== -1) {
            arrCopy.splice(i, 1, subTaskToChange);
            i--;
          }
        }

        return {
          ...prevTaskInfo,
          subtasks: arrCopy,
        };
      }
    });
  };

  const removeSubTask = (id) => {
    setTaskInfo((prevTaskInfo) => ({
      ...prevTaskInfo,
      subtasks: prevTaskInfo.subtasks.filter((subtask) => subtask.id !== id),
    }));
  };

  const addNewSubTask = () => {
    setTaskInfo((prevTaskInfo) => {
      const newSubtask = {
        id: nanoid(),
        title: "",
        isCompleted: false,
        isValid: true,
      };

      prevTaskInfo.subtasks.push(newSubtask);

      return {
        ...prevTaskInfo,
      };
    });
  };

  const changeTaskStatus = (e) => {
    e.preventDefault();
    setTaskInfo((prevTaskInfo) => {
      const newTaskColumn = findParentColumnData(
        boardData.activeBoard,
        e.target.value
      );

      return {
        ...prevTaskInfo,
        activeStatus: e.target.value,
        parentColumnID: newTaskColumn.columnID,
      };
    });
  };

  const handleSave = () => {
    const formValid = checkFormValidity();

    if (!formValid) return;

    const formData = {
      id: taskInfo.id,
      title: taskInfo.title,
      description: taskInfo.description,
      subtasks: taskInfo.subtasks,
      status: taskInfo.activeStatus,
    };

    const currentParentColumn = findNestedObject(
      boardData,
      taskInfo.defaultParentColumnID
    );

    const taskIndex = currentParentColumn.tasks.indexOf(
      currentParentColumn.tasks.find((task) => task.id === taskInfo.id)
    );

    setBoardData((prevData) => {
      const newParentColumn = findNestedObject(
        prevData,
        taskInfo.parentColumnID
      );

      let finalBoard = modifyNestedObject(
        prevData,
        taskInfo.parentColumnID,
        undefined,
        {
          tasks: [
            modifyObject(formData, undefined, {
              subtasks: taskInfo.subtasks.map((subtask) => {
                return modifyObject(subtask, undefined);
              }),
            }),
            ...newParentColumn.tasks.filter((task) => task.id !== taskInfo.id),
          ],
        }
      );

      if (taskInfo.activeStatus !== taskInfo.defaultStatus) {
        const prevParentColumnID = findParentColumnData(
          boardData.activeBoard,
          taskInfo.defaultStatus
        ).columnID;

        const prevParentColumn = findNestedObject(prevData, prevParentColumnID);
        finalBoard = modifyNestedObject(
          finalBoard,
          prevParentColumnID,
          undefined,
          {
            tasks: prevParentColumn.tasks.filter(
              (task) => task.id !== formData.id
            ),
          }
        );
      }

      return finalBoard;
    });

    setModalData({
      modalToRender: "",
      isModalDisplayed: false,
      modalContent: {},
    });
  };

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal pr-7 pl-7 pt-5 pb-5"
      >
        <div className="modal-header">
          <h5>Edit Task</h5>
        </div>
        <form className="modal-form">
          <div className="form-group mt-1 mb-1">
            <label
              htmlFor="title"
              className={`title-label ${!taskTitleValid ? "error" : ""}`}
            >
              Title
              <input
                type="text"
                id="title"
                className="p-1 mt-1"
                value={taskInfo.title || ""}
                onChange={handleFormChange}
              />
            </label>
          </div>
          <div className="form-group mt-1 mb-1">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="p-1 mt-1"
              cols="30"
              rows="5"
              value={taskInfo.description || ""}
              onChange={handleFormChange}
              placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
            ></textarea>
          </div>
          <div className="form-group mt-1 mb-1">
            <label htmlFor="subtasks">Subtasks</label>
            {taskInfo.subtasks.map((subtask) => {
              const { id, title, isValid } = subtask;
              return (
                <div className="subtask-column-input__container mt-1" key={id}>
                  <label
                    className={`subtask-column-label ${
                      !isValid ? "error" : ""
                    }`}
                  >
                    <input
                      type="text"
                      id={`subtasks-${id}`}
                      className="p-1"
                      value={title}
                      onChange={handleFormChange}
                    />
                  </label>

                  <button type="button" onClick={() => removeSubTask(id)}>
                    <CrossIcon className="ml-1" />
                  </button>
                </div>
              );
            })}
            <div className="modal-btn--secondary mt-1">
              <button
                className="pt-1 pb-1"
                type="button"
                onClick={addNewSubTask}
              >
                &#43; Add New Subtask
              </button>
            </div>
          </div>
          <div className="form-group mt-1 mb-1">
            <Status
              options={taskInfo.statusOptions}
              activeStatus={taskInfo.activeStatus}
              changeTaskStatus={changeTaskStatus}
            />
          </div>
          <div className="mt-1 mb-1 modal-btn--primary">
            <button
              className="save-changes pt-1 pb-1"
              type="button"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.aside>
    </AnimatePresence>
  );
};

export default EditTask;
