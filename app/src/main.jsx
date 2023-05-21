import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppStateProvider } from "./context/AppStateContext";
import { BoardContextProvider } from "./context/BoardContext";
import { ModalContextProvider } from "./context/ModalContext";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AppStateProvider>
      <ModalContextProvider>
        <BoardContextProvider>
          <App />
        </BoardContextProvider>
      </ModalContextProvider>
    </AppStateProvider>
  </QueryClientProvider>
);
