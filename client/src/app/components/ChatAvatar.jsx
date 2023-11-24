import { Avatar, Box, styled } from "@mui/material";
import React from "react";

const StyledAvatar = styled(Avatar)(() => ({
  height: "40px",
  width: "40px",
}));

const StatusCircle = styled("div")(({ theme, status }) => ({
  width: "14px",
  bottom: "0px",
  right: "-3px",
  height: "14px",
  borderRadius: "7px",
  position: "absolute",
  border: "2px solid white",
  color: status !== "online" && "white !important",
  background: status === "online" ? theme.palette.primary.main : theme.palette.error.main,
}));

const ChatAvatar = ({ src, status }) => {
  return (
    <Box position="relative">
      <StyledAvatar src={src} />
      <StatusCircle status={status} />
    </Box>
  );
};

export default ChatAvatar;
