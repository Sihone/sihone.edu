import { useNavigate } from "react-router-dom";
import { Box, Button, styled } from "@mui/material";
import { FlexAlignCenter } from "app/components/FlexBox";

// styled components
const FlexBox = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const JustifyBox = styled(FlexBox)({
  maxWidth: 320,
  flexDirection: "column",
  justifyContent: "center",
});

const IMG = styled("img")({
  width: "100%",
  marginBottom: "32px",
});

const NotAuthorizedRoot = styled(FlexAlignCenter)({
  width: "100%",
  height: "100vh !important",
});

const NotAuthorized = () => {
  const navigate = useNavigate();

  return (
    <NotAuthorizedRoot>
      <JustifyBox>
        <IMG src="/assets/images/illustrations/401.svg" alt="" />

        <Button
          color="primary"
          variant="contained"
          sx={{ textTransform: "capitalize" }}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </JustifyBox>
    </NotAuthorizedRoot>
  );
};

export default NotAuthorized;
