import React from "react";
import { ReactComponent as BoardIcon } from "../../../assets/svgs/icon-board.svg";
import { UseBoardContext } from "../../../context/BoardContext";

// A child of Sidebar
const BoardButton = ({ name, id, handleClick }) => {
  const { boardData } = UseBoardContext();
  return (
    <li
      className={`pt-1 pb-1 mt-1 mb-1 ${
        boardData.activeBoard.id === id ? "active" : ""
      }`}
    >
      <button className="center-vertical" onClick={() => handleClick(id)}>
        <BoardIcon />
        <span className="ml-2">{name}</span>
      </button>
    </li>
  );
};

export default BoardButton;
