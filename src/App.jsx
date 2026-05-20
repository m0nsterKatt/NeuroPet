import { useEffect } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { useEnergy } from "./context/energyContext";

import Home from "./pages/Home";
import Login from "./pages/Login";

import Activity from "./pages/Activity";
import ActivityCategory from "./pages/ActivityCategory";

import Help from "./pages/Help";
import Settings from "./pages/Settings";
import History from "./pages/History";

function App() {
  const { settings } = useEnergy();

  useEffect(() => {
    document.body.classList.toggle(
      "dark-mode",
      settings?.darkMode
    );
  }, [settings?.darkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/activity"
          element={<Activity />}
        />

        <Route
          path="/activityCategory"
          element={<ActivityCategory />}
        />

        <Route
          path="/help"
          element={<Help />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/history"
          element={<History />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;