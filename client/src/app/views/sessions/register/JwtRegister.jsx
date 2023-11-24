import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Card, Checkbox, Collapse, Grid, Select, styled, TextField, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { Paragraph } from "app/components/Typography";
import useAuth from "app/hooks/useAuth";
import { FlexAlignCenter } from "app/components/FlexBox";
import { useTranslation } from 'react-i18next';
import { Add, Minimize } from "@mui/icons-material";

import "./styles.css";
import { useSnackbar } from "notistack";

// styled components
const FlexBox = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const ContentBox = styled(FlexAlignCenter)({
  height: "100%",
  padding: "32px",
  background: "rgba(0, 0, 0, 0.01)",
});

const JWTRegister = styled(FlexAlignCenter)({
  background: "#1A2038",
  minHeight: "100vh !important",
  "& .card": {
    maxWidth: 800,
    minHeight: 400,
    margin: "1rem",
    display: "flex",
    borderRadius: 12,
    alignItems: "center",
  },
});

// inital login credentials
const initialValues = {
  company_name: "",
  company_email: "",
  company_phone: "",
  company_address: "",
  company_website: "",
  company_logo: "",
  company_currency: "FCFA",
  smtp_server: "",
  smtp_port: "",
  smtp_username: "",
  smtp_password: "",
  smtp_security: "SSL",

  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  remember: false,
};

const JwtRegister = () => {
  const theme = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const {enqueueSnackbar} = useSnackbar();

  const { t, i18n } = useTranslation();

  // form field validation schema
  const validationSchema = () => Yup.object().shape({
    company_name: Yup.string().required(t('register.company name required')),
    company_email: Yup.string().email(t('register.company email invalid')).required(t('register.company email required')),
    company_phone: Yup.string().required(t('register.company phone required')),
    company_address: Yup.string().required(t('register.company address required')),
    company_website: Yup.string(),
    company_currency: Yup.string().required(t('register.company currency required')),

    first_name: Yup.string().required(t('register.first name required')),
    last_name: Yup.string().required(t('register.last name required')),
    phone: Yup.string().required(t('register.phone required')),
    password: Yup.string()
      .min(6, t("register.password min"))
      .required(t('register.password required')),
    confirm_password: Yup.string().oneOf([Yup.ref("password"), null], t('register.password not match')).required(t('register.confirm password required')),
    email: Yup.string().email(t('register.email invalid')).required(t('register.email required')),
  });

  const handleFormSubmit = async (values) => {
    setLoading(true);

    try {
      await register(values)
      .then((res) => {
        console.log(res);
        enqueueSnackbar(t('register.register success'), {variant: "success"});
      });
      navigate("/");
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      enqueueSnackbar(e.message, {variant: "error"});
    }
  };

  return (
    <JWTRegister>
      <Card className="card">
        <Grid container>
          <Grid item sm={8} xs={12}>
            <ContentBox>
              <img
                width="50%"
                alt="Register"
                src="/assets/images/illustrations/posting_photo.svg"
              />
            </ContentBox>
          </Grid>
          <Grid item sm={4} xs={12} style={{textAlign: 'right'}}>
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

          <Grid item sm={12} xs={12}>
            <Box p={4} height="100%">
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                  <form onSubmit={handleSubmit} style={{display: "flex", flexWrap: "wrap", columnGap: "20px"}}>
                    <h2 style={{width: "100%"}}>{t('register.school information')}</h2>
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="company_name"
                      label={t('register.school name')}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.company_name}
                      onChange={handleChange}
                      helperText={touched.company_name && errors.company_name}
                      error={Boolean(errors.company_name && touched.company_name)}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="company_email"
                      label={t('register.school email')}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.company_email}
                      onChange={handleChange}
                      helperText={touched.company_email && errors.company_email}
                      error={Boolean(errors.company_email && touched.company_email)}
                      sx={{ mb: 3 }}
                      style={{width: "calc(50% - 10px)"}}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      type="tel"
                      name="company_phone"
                      label={t('register.school phone')}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.company_phone}
                      onChange={handleChange}
                      helperText={touched.company_phone && errors.company_phone}
                      error={Boolean(errors.company_phone && touched.company_phone)}
                      sx={{ mb: 3 }}
                      style={{width: "calc(50% - 10px)"}}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="company_address"
                      label={t('register.school address')}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.company_address}
                      onChange={handleChange}
                      helperText={touched.company_address && errors.company_address}
                      error={Boolean(errors.company_address && touched.company_address)}
                      sx={{ mb: 3 }}
                      style={{width: "calc(50% - 10px)"}}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="company_website"
                      label={t('register.school website')}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.company_website}
                      onChange={handleChange}
                      helperText={touched.company_website && errors.company_website}
                      error={Boolean(errors.company_website && touched.company_website)}
                      sx={{ mb: 3 }}
                      style={{width: "calc(50% - 10px)"}}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      type="file"
                      name="company_logo"
                      label={t('register.school logo')}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.company_logo}
                      onChange={handleChange}
                      helperText={touched.company_logo && errors.company_logo}
                      error={Boolean(errors.company_logo && touched.company_logo)}
                      sx={{ mb: 3 }}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ inputProps: { accept: "image/*" } }}
                      style={{width: "calc(50% - 10px)"}}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="company_currency"
                      label={t('register.school currency')}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.company_currency}
                      onChange={handleChange}
                      helperText={touched.company_currency && errors.company_currency}
                      error={Boolean(errors.company_currency && touched.company_currency)}
                      sx={{ mb: 3 }}
                      style={{width: "calc(50% - 10px)"}}
                    />
                    <h2 style={{width: "100%"}}>Administrator Information</h2>
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="first_name"
                      label={t('register.first name')}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.first_name}
                      onChange={handleChange}
                      helperText={touched.first_name && errors.first_name}
                      error={Boolean(errors.first_name && touched.first_name)}
                      sx={{ mb: 3 }}
                      style={{width: "calc(50% - 10px)"}}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="last_name"
                      label={t('register.last name')}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.last_name}
                      onChange={handleChange}
                      helperText={touched.last_name && errors.last_name}
                      error={Boolean(errors.last_name && touched.last_name)}
                      sx={{ mb: 3 }}
                      style={{width: "calc(50% - 10px)"}}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      type="tel"
                      name="phone"
                      label={t('register.phone')}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.phone}
                      onChange={handleChange}
                      helperText={touched.phone && errors.phone}
                      error={Boolean(errors.phone && touched.phone)}
                      sx={{ mb: 3 }}
                      style={{width: "calc(50% - 10px)"}}
                    />

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
                      style={{width: "calc(50% - 10px)"}}
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
                      sx={{ mb: 2 }}
                      style={{width: "calc(50% - 10px)"}}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      type="password"
                      name="confirm_password"
                      label={t('register.confirm password')}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.confirm_password}
                      onChange={handleChange}
                      helperText={touched.confirm_password && errors.confirm_password}
                      error={Boolean(errors.confirm_password && touched.confirm_password)}
                      sx={{ mb: 3 }}
                      style={{width: "calc(50% - 10px)"}}
                    />

                    <Button
                      variant="outlined"
                      onClick={() => setAdvanced(!advanced)}
                      style={{width: "100%", justifyContent: "space-between", marginBottom: "10px", marginTop: "10px"}}
                      endIcon={advanced ? <Minimize /> : <Add />}
                    >
                      <h2 style={{margin: 0}}>{t('register.advanced settings')}</h2>
                    </Button>
                    <Collapse in={advanced} className="advancedSettings" style={{width: "100%"}} >
                      <TextField
                        fullWidth
                        size="small"
                        type="text"
                        name="smtp_server"
                        label={t('register.smtp server')}
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.smtp_server}
                        onChange={handleChange}
                        helperText={touched.smtp_server && errors.smtp_server}
                        error={Boolean(errors.smtp_server && touched.smtp_server)}
                        sx={{ mb: 3 }}
                        style={{width: "calc(50% - 10px)"}}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        type="text"
                        name="smtp_port"
                        label={t('register.smtp port')}
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.smtp_port}
                        onChange={handleChange}
                        helperText={touched.smtp_port && errors.smtp_port}
                        error={Boolean(errors.smtp_port && touched.smtp_port)}
                        sx={{ mb: 3 }}
                        style={{width: "calc(50% - 10px)"}}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        type="text"
                        name="smtp_username"
                        label={t('register.smtp username')}
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.smtp_username}
                        onChange={handleChange}
                        helperText={touched.smtp_username && errors.smtp_username}
                        error={Boolean(errors.smtp_username && touched.smtp_username)}
                        sx={{ mb: 3 }}
                        style={{width: "calc(50% - 10px)"}}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        type="text"
                        name="smtp_password"
                        label={t('register.smtp password')}
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.smtp_password}
                        onChange={handleChange}
                        helperText={touched.smtp_password && errors.smtp_password}
                        error={Boolean(errors.smtp_password && touched.smtp_password)}
                        sx={{ mb: 3 }}
                        style={{width: "calc(50% - 10px)"}}
                      />
                    </Collapse>

                    <FlexBox gap={1} alignItems="center" style={{width: "calc(50% - 10px)"}}>
                      <Checkbox
                        size="small"
                        name="remember"
                        onChange={(e) => { handleChange(e); setFieldValue('remember', e.target.checked) }}
                        checked={!!values.remember}
                        sx={{ padding: 0 }}
                      />

                      <Paragraph fontSize={13}>
                        <span dangerouslySetInnerHTML={{__html: t('register.terms')}}></span>
                      </Paragraph>
                    </FlexBox>

                    <div>
                      <LoadingButton
                        type="submit"
                        color="primary"
                        loading={loading}
                        variant="contained"
                        sx={{ mb: 2, mt: 3 }}
                        disabled={!values.remember}
                        onClick={() => handleSubmit(values)}
                      >
                        {t('register.register')}
                      </LoadingButton>

                      <Paragraph>
                        {t('register.already have an account')}
                        <NavLink
                          to="/session/signin"
                          style={{ color: theme.palette.primary.main, marginLeft: 5 }}
                        >
                          {t('register.login')}
                        </NavLink>
                      </Paragraph>
                    </div>
                    
                  </form>
                )}
              </Formik>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </JWTRegister>
  );
};

export default JwtRegister;
