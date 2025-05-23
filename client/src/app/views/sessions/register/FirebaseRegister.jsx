import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Box, Button, Card, Checkbox, Grid, styled, TextField, useTheme } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import * as Yup from "yup";
import { MatxDivider } from "app/components";
import { Paragraph } from "app/components/Typography";
import { FlexAlignCenter, FlexBox } from "app/components/FlexBox";
import { useAuth } from "app/hooks/useAuth";

// styled components
const ContentBox = styled(FlexAlignCenter)(({ theme }) => ({
  height: "100%",
  padding: "32px",
  backgroundColor: theme.palette.background.default,
}));

const IMG = styled("img")({ width: "100%" });

const GoogleButton = styled(Button)(({ theme }) => ({
  color: "rgba(0, 0, 0, 0.87)",
  backgroundColor: "#e0e0e0",
  boxShadow: theme.shadows[3],
  "&:hover": { backgroundColor: "#d5d5d5" },
}));

const RegisterRoot = styled(FlexAlignCenter)({
  background: "#1A2038",
  minHeight: "100vh !important",
  "& .card": { maxWidth: 650, margin: 16, borderRadius: 12 },
});

// inital login credentials
const initialValues = {
  email: "",
  password: "",
  remember: true,
};

// form field validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be 6 character length")
    .required("Password is required!"),
  email: Yup.string().email("Invalid Email address").required("Email is required!"),
});

const FirebaseRegister = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const { createUserWithEmail, signInWithGoogle } = useAuth();

  const handleGoogleRegister = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (e) {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      setLoading(true);
      await createUserWithEmail(values.email, values.password);
      navigate("/");
      enqueueSnackbar("Register Successfully!", { variant: "success" });
    } catch (e) {
      setLoading(false);
      enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  return (
    <RegisterRoot>
      <Card className="card">
        <Grid container>
          <Grid item lg={5} md={5} sm={5} xs={12}>
            <ContentBox>
              <IMG src="/assets/images/illustrations/posting_photo.svg" alt="" />
            </ContentBox>
          </Grid>

          <Grid item lg={7} md={7} sm={7} xs={12}>
            <Box px={4} pt={4}>
              <GoogleButton
                fullWidth
                variant="contained"
                onClick={handleGoogleRegister}
                startIcon={<img src="/assets/images/logos/google.svg" alt="google" />}
              >
                Sign In With Google
              </GoogleButton>
            </Box>

            <MatxDivider sx={{ mt: 3, px: 4 }} text="Or" />

            <Box p={4} height="100%">
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      label="Password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 1.5 }}
                    />

                    <FlexBox gap={1} alignItems="center">
                      <Checkbox
                        size="small"
                        name="remember"
                        onChange={handleChange}
                        checked={values.remember}
                        sx={{ padding: 0 }}
                      />

                      <Paragraph fontSize={13}>
                        I have read and agree to the terms of service.
                      </Paragraph>
                    </FlexBox>

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ my: 2 }}
                    >
                      Regiser
                    </LoadingButton>

                    <Paragraph>
                      Already have an account?
                      <NavLink
                        to="/session/signin"
                        style={{ color: theme.palette.primary.main, marginLeft: 5 }}
                      >
                        Login
                      </NavLink>
                    </Paragraph>
                  </form>
                )}
              </Formik>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </RegisterRoot>
  );
};

export default FirebaseRegister;
