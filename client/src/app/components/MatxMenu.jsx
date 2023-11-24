import { Box, Menu, styled } from "@mui/material";
import { Fragment, useState } from "react";

const MenuButton = styled(Box)(({ theme }) => ({
  display: "inline-block",
  color: theme.palette.text.primary,
  "& div:hover": { backgroundColor: theme.palette.action.hover },
}));

const MatxMenu = ({ horizontalPosition = "left", children, menuButton }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => setAnchorEl(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);

  return (
    <Fragment>
      <MenuButton onClick={handleClick}>{menuButton}</MenuButton>

      <Menu
        elevation={8}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: horizontalPosition }}
        transformOrigin={{ vertical: "top", horizontal: horizontalPosition }}
      >
        {children.map((child, index) => (
          <Box onClick={handleClose} key={index}>
            {child}
          </Box>
        ))}
      </Menu>
    </Fragment>
  );
};

export default MatxMenu;
