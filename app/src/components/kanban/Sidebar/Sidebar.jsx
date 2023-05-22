import { useEffect } from "react";

import { UseAppStateContext } from "../../../context/AppStateContext";

import Nav from "../Nav/Nav";

const Sidebar = () => {
  const [appState, setAppState, sideBarRef] = UseAppStateContext();

  return (
    <>
      <aside
        className={`sidebar ${appState.sideBarOpen ? "show" : ""} `}
        ref={sideBarRef}
      >
        <Nav />
      </aside>
    </>
  );
};

export default Sidebar;
