import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ReactComponent as CrossIcon } from "../../../assets/svgs/icon-cross.svg";
import { modifyNestedObject, modifyObject } from "../../../utils/helpers";
import { UseBoardContext } from "../../../context/BoardContext";
import { UseModalContext } from "../../../context/ModalContext";
import { nanoid } from "nanoid";
import { useEffect } from "react";

const AddBoard = () => {
  const { boardData, setBoardData } = UseBoardContext();
  const [_, setModalData] = UseModalContext();
  const [boardInfo, setBoardInfo] = useState({
    id: nanoid(),
    name: "",
    columns: [
      {
        id: nanoid(),
        name: "Todo",
        tasks: [],
        isValid: true,
      },
      {
        id: nanoid(),
        name: "Doing",
        tasks: [],
        isValid: true,
      },
    ],
  });

  const [isNameValid, setIsNameValid] = useState(true);

  const addColumn = () => {
    setBoardInfo((prevBoardInfo) => {
      const newColumn = {
        id: nanoid(),
        name: "",
        tasks: [],
        isValid: true,
      };

      const boardColumnCopy = [...prevBoardInfo.columns];
      boardColumnCopy.push(newColumn);

      prevBoardInfo.columns = boardColumnCopy;
      return {
        ...prevBoardInfo,
      };
    });
  };

  const removeColumn = (id) => {
    setBoardInfo((prevBoardInfo) => ({
      ...prevBoardInfo,
      columns: prevBoardInfo.columns.filter((column) => column.id !== id),
    }));
  };

  const isFormValid = () => {
    const validColumns = [];

    boardInfo.columns.forEach((column) => {
      if (!column.name) {
        setBoardInfo((prevBoardInfo) => ({
          ...prevBoardInfo,
          columns: prevBoardInfo.columns.map((nestedColumn) => {
            if (nestedColumn.id === column.id) {
              nestedColumn.isValid = false;
            }
            return nestedColumn;
          }),
        }));
      } else {
        validColumns.push(column);
      }
    });

    if (!boardInfo.name) {
      setIsNameValid(false);
    }

    if (validColumns.length !== boardInfo.columns.length || !boardInfo.name) {
      return;
    } else {
      return true;
    }
  };

  const handleSave = () => {
    const formValid = isFormValid();

    if (!formValid) return;

    setBoardData((prevBoardData) => ({
      ...prevBoardData,
      boardCollection: [
        ...prevBoardData.boardCollection,
        modifyObject(boardInfo, ["isValid"], {
          columns: boardInfo.columns.map((column) => {
            return modifyObject(column, ["isValid"], {
              tasks: [],
            });
          }),
        }),
      ],
      get activeBoard() {
        return this.boardCollection[prevBoardData.boardCollection.length];
      },
    }));

    setModalData({
      isModalDisplayed: false,
      modalToRender: "",
      modalContent: {},
    });
  };

  const handleFormChange = (e) => {
    const inputID = e.target.id;
    setBoardInfo((prevBoardInfo) => {
      let newBoardName;
      if (inputID === "title") {
        newBoardName = e.target.value;

        if (newBoardName) {
          setIsNameValid(true);
        }
        return {
          ...prevBoardInfo,
          name: newBoardName,
        };
      } else {
        const columnID = inputID.split("columns-")[1];
        const arrCopy = [...prevBoardInfo.columns];

        const columnToChange = arrCopy.find((column) => column.id === columnID);
        columnToChange.name = e.target.value;

        if (columnToChange.name) {
          columnToChange.isValid = true;
        } else {
          columnToChange.isValid = false;
        }

        for (let i = 0; i < arrCopy.length; i++) {
          const obj = arrCopy[i];

          if (arrCopy.indexOf(obj.id) !== -1) {
            arrCopy.splice(i, 1, columnToChange);
            i--;
          }
        }

        return {
          ...prevBoardInfo,
          columns: arrCopy,
        };
      }
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
          <h5>Add New Board</h5>
          <form className="modal-form">
            <div className="form-group mt-1 mb-1">
              <label
                htmlFor="title"
                className={`title-label ${!isNameValid ? "error" : ""}`}
              >
                Board Name
                <input
                  type="text"
                  id="title"
                  className="p-1 mt-1"
                  value={boardInfo.name || ""}
                  onChange={handleFormChange}
                  placeholder="e.g. Web Design"
                />
              </label>
            </div>
            <div className="form-group mt-1 mb-1">
              <label htmlFor="subtasks">Board Columns</label>
              {boardInfo.columns.map((column) => {
                const { id, name, isValid } = column;
                return (
                  <div
                    className="subtask-column-input__container mt-1"
                    key={id}
                  >
                    <label
                      className={`subtask-column-label ${
                        !isValid ? "error" : ""
                      }`}
                    >
                      <input
                        type="text"
                        id={`columns-${id}`}
                        className="p-1"
                        value={name}
                        onChange={handleFormChange}
                      />
                    </label>

                    <button type="button" onClick={() => removeColumn(id)}>
                      <CrossIcon className="ml-1" />
                    </button>
                  </div>
                );
              })}
              <div className="modal-btn--secondary mt-1">
                <button className="pt-1 pb-1" type="button" onClick={addColumn}>
                  &#43; Add New Column
                </button>
              </div>
            </div>
            <div className="mt-1 mb-1 modal-btn--fw">
              <button
                className="save-changes pt-1 pb-1"
                type="button"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default AddBoard;
