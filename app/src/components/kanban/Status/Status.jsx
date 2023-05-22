import React, { useState } from "react";
import { ReactComponent as IconChevronDown } from "../../../assets/svgs/icon-chevron-down.svg";
import { ReactComponent as IconChevronUp } from "../../../assets/svgs/icon-chevron-up.svg";

const Status = ({ options, activeStatus, changeTaskStatus }) => {
  const [listOpen, setListOpen] = useState(false);
  return (
    <>
      <label htmlFor="status" className="status-label">
        Current Status
      </label>
      <div className={`status-dropdown ${listOpen ? "active" : ""}`}>
        <div className="status-dropdown__header">
          <button type="button" onClick={() => setListOpen(!listOpen)}>
            {activeStatus}
          </button>
        </div>
        {listOpen ? (
          <div className="status-dropdown__list">
            {options.map((option, index) => {
              return (
                <button
                  className="option-item"
                  key={index}
                  onClick={(e) => {
                    changeTaskStatus(e);
                    setListOpen(false);
                  }}
                  value={option}
                  type="button"
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : (
          ""
        )}
        {listOpen ? (
          <IconChevronUp className="select-icon" />
        ) : (
          <IconChevronDown className="select-icon" />
        )}
      </div>
    </>
  );
};

export default Status;
