import { Box, CircularProgress, styled } from "@mui/material";
import { FlexAlignCenter } from "./FlexBox";

const StyledLoading = styled(FlexAlignCenter)(() => ({
  width: "100%",
  height: "100%",

  "& img": { width: "auto", height: "25px" },
  "& .circleProgress": {
    left: -7,
    right: 0,
    position: "absolute",
    top: "calc(50% - 25px)",
  },
}));

const Loading = () => {
  return (
    <StyledLoading>
      <Box position="relative">
        <img src="/assets/images/logo-circle.svg" alt="" />
        <CircularProgress className="circleProgress" />
      </Box>
    </StyledLoading>
  );
};

export default Loading;
