import { Box, Icon, IconButton, styled } from "@mui/material";
import { topBarHeight } from "app/utils/constant";
import React, { Fragment, useState } from "react";

const SearchContainer = styled(Box)(({ theme }) => ({
  top: 0,
  left: 0,
  zIndex: 9,
  width: "100%",
  display: "flex",
  position: "absolute",
  alignItems: "center",
  height: topBarHeight,
  color: theme.palette.text.primary,
  background: theme.palette.primary.main,
  "&::placeholder": { color: theme.palette.text.primary },
}));

const SearchInput = styled("input")(({ theme }) => ({
  width: "100%",
  border: "none",
  outline: "none",
  fontSize: "1rem",
  paddingLeft: "20px",
  height: "calc(100% - 5px)",
  color: theme.palette.text.primary,
  background: theme.palette.primary.main,
  "&::placeholder": { color: theme.palette.text.primary },
}));

const MatxSearchBox = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  return (
    <Fragment>
      {!open && (
        <IconButton onClick={toggle}>
          <Icon sx={{ color: "text.primary" }}>search</Icon>
        </IconButton>
      )}

      {open && (
        <SearchContainer>
          <SearchInput type="text" placeholder="Search here..." autoFocus />
          <IconButton onClick={toggle} sx={{ mx: 2, verticalAlign: "middle" }}>
            <Icon sx={{ color: "text.primary" }}>close</Icon>
          </IconButton>
        </SearchContainer>
      )}
    </Fragment>
  );
};

export default MatxSearchBox;
