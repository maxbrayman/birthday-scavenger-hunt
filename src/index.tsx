import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import Pokemon from "./routes/pokemon";
import HarryPotter from "./routes/harryPotter";
import Panda from "./routes/panda";
import Avengers from "./routes/avengers";
import Dogs from "./routes/dogs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/7053666",
    element: <Pokemon />,
  },
  {
    path: "/42779",
    element: <HarryPotter />,
  },
  {
    path: "/72632",
    element: <Panda />,
  },
  {
    path: "/6358",
    element: <Avengers />,
  },
  {
    path: "/5333",
    element: <Dogs />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
