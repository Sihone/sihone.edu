import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Grid, styled } from "@mui/material";
import { FlexAlignCenter } from "app/components/FlexBox";
import { Paragraph } from "app/components/Typography";
import { useAuth } from "app/hooks/useAuth";

// styled components
const Auth0Root = styled(FlexAlignCenter)({
  minHeight: "100vh !important",
});

const StyledCard = styled(Card)({
  maxWidth: 800,
  margin: "1rem",
  borderRadius: 12,
  "& .cardHolder": { background: "#1A2038" },
});

const Auth0Login = () => {
  const [message, setMessage] = useState("");
  const { loginWithPopup } = useAuth();

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginWithPopup();
      navigate("/");
    } catch (e) {
      setMessage(e.message);
    }
  };

  return (
    <Auth0Root>
      <StyledCard>
        <Grid container>
          <Grid item sm={12} xs={12}>
            <FlexAlignCenter p={4} bgcolor="background.default">
              <img src="/assets/images/illustrations/dreamer.svg" width="400" alt="Login" />
            </FlexAlignCenter>

            <FlexAlignCenter p={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleLogin}
                className="socialButton"
                endIcon={<img src="/assets/images/logos/auth0.svg" alt="AuthO" />}
              >
                Sign In With
              </Button>
            </FlexAlignCenter>
            {message && <Paragraph sx={{ color: "error.main" }}>{message}</Paragraph>}
          </Grid>
        </Grid>
      </StyledCard>
    </Auth0Root>
  );
};

export default Auth0Login;
