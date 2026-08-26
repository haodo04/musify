import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import PlayerContextProvider from "./context/PlayerContext.jsx";
import AuthContextProvider from "./context/AuthContext.jsx";
import FavoriteContextProvider from "./context/FavoriteContext.jsx";
import FollowContextProvider from "./context/FollowContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <PlayerContextProvider>
          <FavoriteContextProvider>
            <FollowContextProvider>
              <App />
            </FollowContextProvider>
          </FavoriteContextProvider>
        </PlayerContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);