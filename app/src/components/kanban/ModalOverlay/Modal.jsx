import React from "react";
import { ReactComponent as EllipsisIcon } from "../../assets/svgs/icon-vertical-ellipsis.svg";
import SubTask from "../SubTask/SubTask";

const Modal = ({ modalData }) => {
  const {
    modalContent: { title, description, subtasks },
  } = modalData;
  console.log(modalData);
  return (
    <aside className="modal pr-7 pl-7 pb-5 pt-5">
      <div className="modal-header view-task">
        <h5 className="pr-2">{title}</h5>
        <EllipsisIcon />
      </div>
      <div className="modal-content">
        <p>{description ? description : "No Description"}</p>
      </div>
      <div className="">
        {subtasks &&
          subtasks.map((subtask) => {
            const { id, title, isCompleted } = subtask;
            return (
              <SubTask
                key={id}
                taskDescription={title}
                isCompleted={isCompleted}
              />
            );
          })}
      </div>
    </aside>
  );
};

export default Modal;
