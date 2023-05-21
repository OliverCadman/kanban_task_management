import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import TasksBoard from "../components/TasksBoard/TasksBoard";
import ShowSidebarButton from "../components/ShowSidebarButton/ShowSidebarButton";
import ModalOverlay from "../components/ModalOverlay/ModalOverlay";
import { UseModalContext } from "../context/ModalContext";
import { UseAppStateContext } from "../context/AppStateContext";
import { AnimatePresence } from "framer-motion";

const Kanban = () => {
  const [modalData] = UseModalContext();
  const [appState] = UseAppStateContext();
  return (
    <>
      <Header />
      {!appState.isMobileDevice ? <Sidebar /> : ""}

      <TasksBoard />
      {!appState.sideBarOpen ? <ShowSidebarButton /> : ""}
      {modalData.isModalDisplayed ? (
        <AnimatePresence>
          <ModalOverlay modalData={modalData} />
        </AnimatePresence>
      ) : (
        ""
      )}
    </>
  );
};

export default Kanban;
