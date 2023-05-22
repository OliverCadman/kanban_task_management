import React from "react";

const Tooltip = ({ val, handleEditTooltipClicked, handleDelete }) => {
  return (
    <div className="tooltip-container">
      <button
        type="button"
        className="tooltip-btn"
        onClick={handleEditTooltipClicked}
      >
        Edit {val}
      </button>
      <button type="button" className="tooltip-btn" onClick={handleDelete}>
        Delete {val}
      </button>
    </div>
  );
};

export default Tooltip;
