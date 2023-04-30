import { useState, createContext, useContext, useMemo } from "react";
import boards from "../data";

const BoardContext = createContext();

export const BoardContextProvider = ({ children }) => {
  const [boardData, setBoardData] = useState({
    boardCollection: boards,
    activeBoard: boards[0],
  });

  const changeBoard = (id) => {
    setBoardData((prevData) => {
      return {
        ...prevData,
        activeBoard: prevData.boardCollection.find((board) => board.id === id),
      };
    });
  };

  const values = {
    boardData,
    setBoardData,
    changeBoard,
  };

  console.log(boardData);

  // const memoedValues = useMemo(
  //   () => ({
  //     boardData,
  //     setBoardData,
  //     activeBoard,
  //     setActiveBoard,
  //     changeBoard,
  //   }),
  //   [activeBoard, boardData, setBoardData]
  // );

  return (
    <BoardContext.Provider value={values}>{children}</BoardContext.Provider>
  );
};

export const UseBoardContext = () => useContext(BoardContext);
