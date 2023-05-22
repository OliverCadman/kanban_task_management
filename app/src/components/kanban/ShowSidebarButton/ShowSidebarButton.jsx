import React from "react";
import { UseAppStateContext } from "../../../context/AppStateContext";
import { AnimatePresence, motion } from "framer-motion";
import { ReactComponent as ShowSidebarButtonIcon } from "../../../assets/svgs/icon-show-sidebar.svg";

const ShowSidebarButton = () => {
  const [, setAppState] = UseAppStateContext();

  const hideSidebarBtnVariants = {
    hidden: {
      opacity: 0,
      transform: "translateX(-200%)",
    },
    visible: {
      transform: "translateX(0)",
      opacity: 1,
      transition: {
        type: "spring",
        delay: 0.3,
      },
    },
  };

  const handleShowSidebar = () => {
    setAppState((prevState) => ({
      ...prevState,
      sideBarOpen: true,
    }));
  };
  return (
    <AnimatePresence>
      <motion.button
        className="show-sidebar-btn"
        onClick={handleShowSidebar}
        aria-label="Hide Sidebar"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{
          duration: 0.3,
          ease: [0, 0.71, 0.2, 1.01],
          type: "spring",
        }}
      >
        <ShowSidebarButtonIcon />
      </motion.button>
    </AnimatePresence>
  );
};

export default ShowSidebarButton;
