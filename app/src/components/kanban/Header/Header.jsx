import React, { useState } from "react";
import { ReactComponent as Logo } from "../../../assets/svgs/logo-dark.svg";
import { ReactComponent as MobileLogo } from "../../../assets/svgs/logo-mobile.svg";
import { ReactComponent as EllipsisIcon } from "../../../assets/svgs/icon-vertical-ellipsis.svg";
import { ReactComponent as PlusIcon } from "../../../assets/svgs/icon-plus.svg";
import { ReactComponent as IconChevronDown } from "../../../assets/svgs/icon-chevron-down.svg";
import { ReactComponent as IconChevronUp } from "../../../assets/svgs/icon-chevron-up.svg";
import { UseAppStateContext } from "../../../context/AppStateContext";
import { UseModalContext } from "../../../context/ModalContext";
import { UseBoardContext } from "../../../context/BoardContext";
import Tooltip from "../Tooltip/Tooltip";
import MobileNav from "../MobileNav/MobileNav";
import { nanoid } from "nanoid";

const Header = () => {
  const [appState, setAppState] = UseAppStateContext();
  const [_, setModalData] = UseModalContext();
  const { boardData } = UseBoardContext();
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleNewTaskModal = () => {
    if (appState.showMobileNav) {
      setAppState((prevAppState) => ({
        ...prevAppState,
        showMobileNav: false,
      }));
    }

    setModalData({
      isModalDisplayed: true,
      modalToRender: "new-task",
      modalContent: {
        id: nanoid(),
      },
    });
  };

  const handleEditTooltipClicked = () => {
    setModalData({
      isModalDisplayed: true,
      modalToRender: "edit-board",
      modalContent: {
        id: boardData.activeBoard.id,
        name: boardData.activeBoard.name,
        columns: boardData.activeBoard.columns,
      },
    });

    setShowTooltip(false);

    if (appState.showMobileNav) {
      setAppState((prevAppState) => ({
        ...prevAppState,
        showMobileNav: false,
      }));
    }
  };

  const handleDelete = () => {
    setModalData({
      modalToRender: "delete-board",
      isModalDisplayed: true,
      modalContent: {
        id: boardData.activeBoard.id,
        itemTitle: boardData.activeBoard.name,
      },
    });

    if (appState.showMobileNav) {
      setAppState((prevAppState) => ({
        ...prevAppState,
        showMobileNav: false,
      }));
    }

    setShowTooltip(false);
  };

  return (
    <header className="header">
      <div
        className={`logo-container pl-5 center-vertical ${
          appState.sideBarOpen ? "sidebar-open" : ""
        }`}
      >
        <h1>
          {appState.isMobileDevice ? (
            <MobileLogo className="logo" />
          ) : (
            <Logo className="logo" />
          )}
        </h1>
      </div>
      <div className="header__content pl-5 pr-5">
        <div className="heading">
          {appState.isMobileDevice ? (
            <>
              <h2>
                <button
                  type="button"
                  onClick={() => {
                    setAppState((prevAppState) => ({
                      ...prevAppState,
                      showMobileNav: !prevAppState.showMobileNav,
                    }));
                  }}
                >
                  {boardData.activeBoard.name}
                  <span className="ml-1">
                    <IconChevronDown />
                  </span>
                </button>
              </h2>
              {appState.showMobileNav ? <MobileNav /> : ""}
            </>
          ) : (
            <h2>{boardData.activeBoard.name}</h2>
          )}
        </div>
        <div className="header__content--btns">
          <button
            className="add-task-btn"
            type="button"
            onClick={handleNewTaskModal}
            aria-label={appState.isMobileDevice ? "Add New Task" : null}
          >
            <span>
              <PlusIcon />
            </span>
            {!appState.isMobileDevice ? "Add New Task" : ""}
          </button>
          <button
            type="button"
            className="tooltip-btn"
            onClick={() => setShowTooltip(!showTooltip)}
          >
            <EllipsisIcon className="ml-2" />
          </button>
          {showTooltip ? (
            <Tooltip
              val="board"
              handleEditTooltipClicked={handleEditTooltipClicked}
              handleDelete={handleDelete}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
