import Kanban from "./pages/Kanban";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UseAppStateContext } from "./context/AppStateContext";
import { useEffect } from "react";
import { useWindowWidth } from "./hooks/UseWindowWidth";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.scss";

function App() {
  const [appState, setAppState] = UseAppStateContext();
  const windowWidth = useWindowWidth();

  useEffect(() => {
    if (appState.theme === "dark") {
      document.body.style.backgroundColor = "#20212c";
    } else {
      document.body.style.backgroundColor = "#f4f7fd";
    }
  }, [appState.theme]);

  useEffect(() => {
    if (windowWidth <= 768) {
      setAppState({
        ...appState,
        isMobileDevice: true,
      });
    } else {
      setAppState({
        ...appState,
        isMobileDevice: false,
      });
    }
  }, [windowWidth]);

  return (
    <div className={appState.theme === "dark" ? "theme-dark" : "theme-light"}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="kanban" element={<Kanban />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
