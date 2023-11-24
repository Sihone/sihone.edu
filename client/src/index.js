import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StyledEngineProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import App from "./app/App";

// third party css
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

// other
import './i18n';

// main root element
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StyledEngineProvider injectFirst>
    <BrowserRouter>
      <SnackbarProvider anchorOrigin={{ horizontal: "right", vertical: "top" }}>
        <App />
      </SnackbarProvider>
    </BrowserRouter>
  </StyledEngineProvider>
);
