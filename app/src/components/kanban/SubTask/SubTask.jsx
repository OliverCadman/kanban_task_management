import React from "react";
import { ReactComponent as CheckIcon } from "../../../assets/svgs/icon-check.svg";

const SubTask = ({
  isCompleted,
  taskDescription,
  id,
  handleCheckboxChange,
}) => {
  return (
    <div className="mb-1 mt-1 pt-3 pb-3 pl-1 pr-1 checkbox-container">
      <input
        className="checkbox-input"
        type="checkbox"
        checked={isCompleted}
        onChange={() => handleCheckboxChange(id)}
        id={`checkbox-input-${id}`}
      />
      <label htmlFor={`checkbox-input-${id}`} className="checkbox">
        <span>
          <CheckIcon className="checkbox-icon" />
        </span>
        <span className={`ml-1 ${isCompleted ? "completed-linethrough" : ""}`}>
          {taskDescription}
        </span>
      </label>
    </div>
  );
};

export default SubTask;
