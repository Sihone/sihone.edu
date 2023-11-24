import { Box, Icon, IconButton, styled, useTheme } from "@mui/material";
import React from "react";
import RectangleAvatar from "./RectangleAvatar";
import { Small } from "./Typography";

const ItemContainer = styled("div")(() => ({
  display: "flex",
  cursor: "pointer",
  paddingLeft: "8px",
  borderRadius: "8px",
  paddingRight: "8px",
  alignItems: "center",
  transition: "all 300ms ease",
  "&:hover": {
    paddingLeft: "8px",
    overflow: "hidden",
    background: "rgba(0,0,0, .08)",
    "& .action-icon, & .rectangle-box": { opacity: 1 },
  },
  "& .action-icon, & .rectangle-box": { opacity: 0.76 },
}));

const Title = styled("h6")(() => ({
  margin: 0,
  fontSize: "13px",
  fontWeight: "normal",
  color: "rgba(var(--body), 0.87)",
}));

const MatxListItem1 = (props) => {
  const { title, subtitle, iconText, iconColor, bulletIcon, actionIcon } = props;

  const theme = useTheme();
  const secondary = theme.palette.text.secondary;

  return (
    <ItemContainer>
      <RectangleAvatar color={iconColor} icon={bulletIcon} iconText={iconText}></RectangleAvatar>

      <Box ml={2} flexGrow={1}>
        <Title>{title}</Title>
        <Small sx={{ color: secondary }}>{subtitle}</Small>
      </Box>

      {actionIcon && (
        <IconButton className="action-icon">
          <Icon color={iconColor}>{actionIcon}</Icon>
        </IconButton>
      )}
    </ItemContainer>
  );
};

export default MatxListItem1;
