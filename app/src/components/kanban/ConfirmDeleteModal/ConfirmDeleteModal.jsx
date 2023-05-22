import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UseBoardContext } from "../../../context/BoardContext";
import { UseModalContext } from "../../../context/ModalContext";
import { findNestedObject, modifyNestedObject } from "../../../utils/helpers";

const ConfirmDeleteModal = () => {
  const { boardData, setBoardData } = UseBoardContext();
  const [modalData, setModalData] = UseModalContext();

  const {
    modalToRender,
    modalContent: { id, itemTitle, parentColumnId },
  } = modalData;

  const handleDelete = () => {
    if (modalToRender === "delete-task") {
      setBoardData((prevBoardData) => {
        const columnToRemoveTaskFrom = findNestedObject(
          prevBoardData,
          parentColumnId
        );

        return modifyNestedObject(prevBoardData, parentColumnId, undefined, {
          tasks: columnToRemoveTaskFrom.tasks.filter((task) => task.id !== id),
        });
      });
    } else {
      console.log(id);
      setBoardData((prevBoardData) => ({
        ...prevBoardData,
        boardCollection: prevBoardData.boardCollection.filter(
          (board) => board.id !== id
        ),
        get activeBoard() {
          return this.boardCollection[0] || { name: "No Boards" };
        },
      }));
    }

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
        className="delete-modal p-10"
      >
        <div className="confirm-delete--content">
          <h5>
            Delete this {modalToRender === "delete-task" ? "task" : "board"}?
          </h5>
          <p className="mt-2">
            {modalToRender === "delete-task"
              ? `Are you sure you want to delete the '${itemTitle}' task and it's 
                    subtasks? This action cannot be reversed.`
              : `Are you sure you want to delete the '${itemTitle}' board? 
              This action will remove all columns and tasks and cannot be reversed.`}
          </p>
        </div>
        <div className="action-btn-container mt-2">
          <button
            className="confirm-delete-btn mr-1 pt-1 pb-1"
            type="button"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            className="cancel-delete-btn ml-1 pt-1 pb-1"
            type="button"
            onClick={() => {
              setModalData({
                modalToRender: "",
                isModalDisplayed: false,
                modalContent: {},
              });
            }}
          >
            Cancel
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;
