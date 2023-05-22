import React from "react";
import TaskDetail from "../TaskDetail/TaskDetail";
import EditTask from "../EditTask/EditTask";
import AddTask from "../AddTask/AddTask";
import { motion } from "framer-motion";
import { UseModalContext } from "../../../context/ModalContext";
import { UseBoardContext } from "../../../context/BoardContext";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import AddBoard from "../AddBoard/AddBoard";
import EditBoard from "../EditBoard/EditBoard";

const ModalOverlay = ({ modalData }) => {
  const [_, setModalData] = UseModalContext();
  const { boardData, setBoardData } = UseBoardContext();

  const closeModal = (e) => {
    if (e.target === e.currentTarget) {
      setModalData((prevData) => {
        return {
          ...prevData,
          isModalDisplayed: false,
          modalToRender: "",
        };
      });
    }
  };

  return (
    <motion.div
      key={"overlay-animate"}
      className="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={closeModal}
      exit={{ opacity: 0 }}
    >
      {modalData.modalToRender === "task-detail" ? (
        <TaskDetail modalData={modalData} />
      ) : modalData.modalToRender === "edit-task" ? (
        <EditTask modalData={modalData} />
      ) : modalData.modalToRender === "new-task" ? (
        <AddTask />
      ) : modalData.modalToRender === "delete-task" ? (
        <ConfirmDeleteModal />
      ) : modalData.modalToRender === "create-board" ? (
        <AddBoard />
      ) : modalData.modalToRender === "edit-board" ? (
        <EditBoard />
      ) : modalData.modalToRender === "delete-board" ? (
        <ConfirmDeleteModal />
      ) : (
        ""
      )}
    </motion.div>
  );
};

export default ModalOverlay;
