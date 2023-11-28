import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Box, Card, Checkbox, Grid, Select, styled, TextField, useTheme } from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";
import { LoadingButton } from "@mui/lab";
import { FlexAlignCenter } from "app/components/FlexBox";
import { Paragraph } from "app/components/Typography";
import { useAuth } from "app/hooks/useAuth";
import { useSnackbar } from "notistack";
import { useTranslation } from 'react-i18next';

// styled components
const FlexBox = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const ContentBox = styled(Box)({
  height: "100%",
  padding: "32px",
  position: "relative",
  background: "rgba(0, 0, 0, 0.01)",
});

const JWTRoot = styled(FlexAlignCenter)({
  background: "#1A2038",
  minHeight: "100% !important",
  "& .card": {
    display: "flex",
    alignItems: "center",
    maxWidth: 800,
    minHeight: 400,
    borderRadius: 12,
    margin: "1rem",
  },
});

// inital login credentials
const initialValues = {
  email: "",
  password: "",
  remember: true,
};

const JwtLogin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const {enqueueSnackbar} = useSnackbar();
  const { t, i18n } = useTranslation();

  // form field validation schema
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, t('register.password min'))
      .required(t('register.password required')),
    email: Yup.string().email(t('register.email invalid')).required(t('register.email required')),
  });

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      navigate("/");
      enqueueSnackbar(t('register.login success'), { variant: "success" });
    } catch (e) {
      setLoading(false);
      enqueueSnackbar(e.response.data.message, { variant: "error" });
    }
  };

  return (
    <JWTRoot>
      <Card className="card">
        <Grid container>
          <Grid item sm={12} xs={12} style={{textAlign: 'right'}}>
            <Select
              size="small"
              native
              variant="outlined"
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              sx={{ mb: 3 }}
              style={{margin: "32px"}}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </Select>
          </Grid>
          <Grid item sm={6} xs={12}>
            <FlexAlignCenter p={4} height="100%">
              <img src="/assets/images/illustrations/dreamer.svg" width="100%" alt="" />
            </FlexAlignCenter>
          </Grid>

          <Grid item sm={6} xs={12}>
            <ContentBox>
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
                      label={t('register.email')}
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
                      label={t('register.password')}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 1.5 }}
                    />

                    <FlexBox justifyContent="space-between">
                      <FlexBox gap={1}>
                        <Checkbox
                          size="small"
                          name="remember"
                          onChange={handleChange}
                          checked={values.remember}
                          sx={{ padding: 0 }}
                        />

                        <Paragraph>{t('register.remember')}</Paragraph>
                      </FlexBox>

                      <NavLink
                        to="/session/forgot-password"
                        style={{ color: theme.palette.primary.main }}
                      >
                        {t('register.forgot')}
                      </NavLink>
                    </FlexBox>

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ my: 2 }}
                    >
                      {t('register.login')}
                    </LoadingButton>

                    <Paragraph>
                      {t('register.not already have an account')}{" "}
                      <NavLink
                        to="/session/signup"
                        style={{ color: theme.palette.primary.main, marginLeft: 5 }}
                      >
                        {t('register.register')}
                      </NavLink>
                    </Paragraph>
                  </form>
                )}
              </Formik>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </JWTRoot>
  );
};

export default JwtLogin;
