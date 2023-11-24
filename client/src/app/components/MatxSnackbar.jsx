import { Icon, IconButton, Snackbar } from "@mui/material";
import React from "react";

const MatxSnackbar = ({
  open,
  message,
  handleClose,
  duration = 6000,
  vertical = "bottom",
  horizontal = "center",
}) => {
  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      autoHideDuration={duration}
      message={<span id="message-id">{message}</span>}
      ContentProps={{ "aria-describedby": "message-id" }}
      anchorOrigin={{ vertical: { vertical }, horizontal: { horizontal } }}
      action={[
        <IconButton key="close" aria-label="close" color="inherit" onClick={handleClose}>
          <Icon>close</Icon>
        </IconButton>,
      ]}
    />
  );
};

export default MatxSnackbar;
