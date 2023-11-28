import {
  Box,
  Card,
  Divider,
  Grid,
  styled,
  TextField,
} from "@mui/material";
import * as Yup from "yup";
import { Breadcrumb } from "app/components";
import { H4 } from "app/components/Typography";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import useAuth from "app/hooks/useAuth";
import useData from "app/hooks/useData";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { useTranslation } from 'react-i18next';

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const Form = styled("form")(() => ({ padding: "16px" }));

const StyledTextField = styled(TextField)(() => ({ margin: "8px" }));

const CustomerForm = () => {
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const {user} = useAuth();
  const {data, error, updateData} = useData("/settings", user.company_id);

  const handleGeneralSubmit = async (values) => {
    console.log(values);
    setLoading(true);
    updateData({
      ...data,
      company_name: values.company_name,
      company_address: values.company_address1 + ", " + values.company_address2,
      company_phone: values.company_phone,
      company_email: values.company_email,
      company_website: values.company_website,
      company_currency: values.company_currency,
      company_registration: values.company_registration,
    })
    .then(() => {
      enqueueSnackbar(t("main.success"), { variant: "success" });
    })
    .catch((err) => {
      enqueueSnackbar(err.message || err.detail || err, { variant: "error" });
    });
    setLoading(false);
  };

  const handleEmailSubmit = async (values) => {
    console.log(values);
    setLoading(true);
    updateData({
      ...data,
      smtp_server: values.smtp_server,
      smtp_port: values.smtp_port,
      smtp_user: values.smtp_user,
      smtp_password: values.smtp_password,
      smtp_security: values.smtp_security,
    })
    .then(() => {
      enqueueSnackbar(t("main.success"), { variant: "success" });
    })
    .catch((err) => {
      enqueueSnackbar(err.message || err.detail || err, { variant: "error" });
    });
    setLoading(false);
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error.message || error.detail || error, { variant: "error" });
    }
  }, [error]);

  const initialValues1 = {
    company_name: data?.company_name || "",
    company_address: data?.company_address || "",
    company_phone: data?.company_phone || "",
    company_email: data?.company_email || "",
    company_website: data?.company_website || "",
    company_currency: data?.company_currency || "",
    company_address1: data?.company_address && data?.company_address.split(",")[0] || "",
    company_address2: data?.company_address && data?.company_address.split(",")[1] || "",
    company_registration: data?.company_registration || "",
  };

  const initialValues2 = {
    smtp_server: data?.smtp_server || "",
    smtp_port: data?.smtp_port || "",
    smtp_user: data?.smtp_user || "",
    smtp_password: data?.smtp_password || "",
    smtp_security: data?.smtp_security || "",
  };

  const validationSchema1 = () => Yup.object().shape({
    company_name: Yup.string().required(t("main.required")),
    company_address: Yup.string().required(t("main.required")),
    company_phone: Yup.string().required(t("main.required")),
    company_email: Yup.string().required(t("main.required")),
    company_currency: Yup.string().required(t("main.required")),
  });

  const validationSchema2 = () => Yup.object().shape({
    smtp_server: Yup.string().required(t("main.required")),
    smtp_port: Yup.string().required(t("main.required")),
    smtp_user: Yup.string().required(t("main.required")),
    smtp_password: Yup.string().required(t("main.required")),
    smtp_security: Yup.string().required(t("main.required")),
  });

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: t("settings.title") }, {name: t("settings.general title")}]} />
      </div>

      <Card elevation={3}>
        <H4 p={2}>{t("settings.general company")}</H4>

        <Divider sx={{ mb: 1 }} />

        <Formik
          initialValues={initialValues1}
          onSubmit={handleGeneralSubmit}
          enableReinitialize={true}
          validationSchema={validationSchema1}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setSubmitting,
            setFieldValue,
            dirty
          }) => (
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={3} alignItems="center">
                <Grid item md={2} sm={4} xs={12}>
                  {t("settings.company name")}
                </Grid>

                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    size="small"
                    name="company_name"
                    variant="outlined"
                    label={t("settings.company name")}
                    value={values.company_name}
                    onChange={handleChange}
                    sx={{ minWidth: 208 }}
                    InputLabelProps={{ shrink: !!values.company_name }}
                  />
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  {t("settings.company address")}
                </Grid>

                <Grid item md={10} sm={8} xs={12}>
                  <Box m={-1} display="flex" flexWrap="wrap">
                    <StyledTextField
                      size="small"
                      name="company_address1"
                      label={t("main.city")}
                      variant="outlined"
                      value={values.company_address1}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: !!values.company_address1 }}
                      sx={{ minWidth: 208 }}
                    />
                    <StyledTextField
                      size="small"
                      name="company_address2"
                      label={t("main.country")}
                      variant="outlined"
                      value={values.company_address2}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: !!values.company_address2 }}
                      sx={{ minWidth: 208 }}
                    />
                  </Box>
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  {t("settings.company registration")}
                </Grid>

                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    size="small"
                    name="company_registration"
                    variant="outlined"
                    label={t("main.registration")}
                    value={values.company_registration}
                    onChange={handleChange}
                    sx={{ minWidth: 208 }}
                    InputLabelProps={{ shrink: !!values.company_registration }}
                  />
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  {t("settings.company phone")}
                </Grid>

                <Grid item md={10} sm={8} xs={12}>
                  <Box m={-1} display="flex" flexWrap="wrap">
                    <StyledTextField
                      size="small"
                      name="company_phone"
                      label={t("main.phone")}
                      variant="outlined"
                      value={values.company_phone}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: !!values.company_phone }}
                      sx={{ minWidth: 208 }}
                      helperText={touched.company_phone && errors.company_phone}
                      error={Boolean(errors.company_phone && touched.company_phone)}
                    />
                  </Box>
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  {t("settings.company email")}
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    name="company_email"
                    size="small"
                    type="email"
                    variant="outlined"
                    value={values.company_email}
                    label={t("main.email")}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: !!values.company_email }}
                    sx={{ minWidth: 208 }}
                    helperText={touched.company_email && errors.company_email}
                    error={Boolean(errors.company_email && touched.company_email)}
                  />
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  {t("settings.company website")}
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    name="company_website"
                    size="small"
                    variant="outlined"
                    value={values.company_website}
                    label={t("main.website")}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: !!values.company_website }}
                    sx={{ minWidth: 208 }}
                    helperText={touched.company_website && errors.company_website}
                    error={Boolean(errors.company_website && touched.company_website)}
                  />
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  {t("settings.company logo")}
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    name="company_logo"
                    size="small"
                    type="file"
                    variant="outlined"
                    value={values.company_logo}
                    label={t("settings.company logo")}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    sx={{ minWidth: 208 }}
                    helperText={touched.company_logo && errors.company_logo}
                    error={Boolean(errors.company_logo && touched.company_logo)}
                  />
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  {t("settings.company currency")}
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    name="company_currency"
                    size="small"
                    type="text"
                    variant="outlined"
                    value={values.company_currency}
                    label={t("settings.company currency")}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: !!values.company_currency }}
                    sx={{ minWidth: 208 }}
                    helperText={touched.company_currency && errors.company_currency}
                    error={Boolean(errors.company_currency && touched.company_currency)}
                  />
                </Grid>  
              </Grid>

              <Box mt={3}>
                <LoadingButton
                    type="submit"
                    color="primary"
                    loading={loading}
                    variant="contained"
                    sx={{ mb: 2, mt: 3 }}
                    disabled={!dirty}
                  >
                    {t("main.submit")}
                  </LoadingButton>
              </Box>
            </Form>
          )}
        </Formik>
      </Card>

      <Card elevation={3} style={{marginTop: "36px"}}>
        <H4 p={2}>{t("settings.general smtp")}</H4>

        <Divider sx={{ mb: 1 }} />

        <Formik
          initialValues={initialValues2}
          onSubmit={handleEmailSubmit}
          enableReinitialize={true}
          validationSchema={validationSchema2}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setSubmitting,
            setFieldValue,
            dirty
          }) => (
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={3} alignItems="center">
                <Grid item md={2} sm={4} xs={12}>
                  {t("settings.smtp server")}
                </Grid>

                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    size="small"
                    name="smtp_server"
                    variant="outlined"
                    label={t("settings.smtp server")}
                    value={values.smtp_server}
                    onChange={handleChange}
                    sx={{ minWidth: 208 }}
                    InputLabelProps={{ shrink: !!values.smtp_server }}
                  />
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  {t("settings.smtp port")}
                </Grid>

                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    size="small"
                    name="smtp_port"
                    variant="outlined"
                    label={t("settings.smtp port")}
                    value={values.smtp_port}
                    onChange={handleChange}
                    sx={{ minWidth: 208 }}
                    InputLabelProps={{ shrink: !!values.smtp_port }}
                  />
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  {t("settings.smtp user")}
                </Grid>

                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    size="small"
                    name="smtp_user"
                    variant="outlined"
                    label={t("settings.smtp user")}
                    value={values.smtp_user}
                    onChange={handleChange}
                    sx={{ minWidth: 208 }}
                    InputLabelProps={{ shrink: !!values.smtp_user }}
                  />
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  {t("settings.smtp password")}
                </Grid>

                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    size="small"
                    name="smtp_password"
                    variant="outlined"
                    label={t("settings.smtp password")}
                    value={values.smtp_password}
                    onChange={handleChange}
                    sx={{ minWidth: 208 }}
                    InputLabelProps={{ shrink: !!values.smtp_password }}
                  />
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  {t("settings.smtp security")}
                </Grid>

                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    size="small"
                    name="smtp_security"
                    variant="outlined"
                    label={t("settings.smtp security")}
                    value={values.smtp_security}
                    onChange={handleChange}
                    sx={{ minWidth: 208 }}
                    InputLabelProps={{ shrink: !!values.smtp_security }}
                  />
                </Grid>
              </Grid>
              <Box mt={3}>
                <LoadingButton
                    type="submit"
                    color="primary"
                    loading={loading}
                    variant="contained"
                    sx={{ mb: 2, mt: 3 }}
                    disabled={!dirty}
                  >
                    {t("main.submit")}
                  </LoadingButton>
              </Box>
            </Form>
          )}
        </Formik>
      </Card>
      
    </Container>
  );
};

export default CustomerForm;
