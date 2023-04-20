import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Container } from "@material-ui/core";
import HideAppBar from "./components/MenuAppBar/HideAppBar";

ReactDOM.render(
  <>
    <HideAppBar/>
    <Container maxWidth="xl">
      <App />
    </Container>
  </>,
  document.getElementById("root")
);
serviceWorker.unregister();
