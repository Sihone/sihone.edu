import {
  Box,
  Card,
  Divider,
  Grid,
  MenuItem,
  styled,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import * as Yup from "yup";
import { Breadcrumb } from "app/components";
import { H4 } from "app/components/Typography";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import CompDetailsForm from "./CompDetailsForm";
import ContactDetailsForm from "./ContactDetailsForm";
import { useAuth } from "app/hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import useData from "app/hooks/useData";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import PasswordChangeForm from "./PasswordChangeForm";
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
  const [tabIndex, setTabIndex] = useState(0);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);

  const { id } = useParams();
  
  const { user } = useAuth();
  const {data: _employee, updateData, saveData, error} = useData("employees", user.company_id, id);
  const {data: roles} = useData("roles", user.company_id);
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  
  useEffect(() => {
    if (id) {
      setEmployeeId(id);
      setEmployee(_employee);
    } else {
      setEmployeeId(null);
      setEmployee(null);
    }
  }, [employeeId, _employee, id]);

  const handleSubmit = async (values) => {
    console.log(values);
    setLoading(true);
    if (loading) return;
    if (employeeId) {
      updateData({...values, id: employeeId, company_id: user.company_id})
      .then(() => enqueueSnackbar(t("employees.update success"), { variant: "success" }))
      .catch((err) => enqueueSnackbar(err.message || err.detail || err, { variant: "error" }));
    } else {
      saveData({...values, company_id: user.company_id})
      .then((newEmployee) => {
        if (newEmployee) {
          enqueueSnackbar(t("employees.create success"), { variant: "success" });
          navigate("/employees/" + newEmployee.id);
          setEmployee(newEmployee);
        }
      })
      .catch((err) => enqueueSnackbar(err.message || err.detail || err, { variant: "error" }));
    }
    setLoading(false);
  };
  const handleTabChange = (e, value) => {
    setTabIndex(value);
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error.message || error.detail || error, { variant: "error" });
    }
  }, [error]);

  const handleChangePassword = async (values) => {
    console.log(values);
    setLoading(true);
    fetch(`/api/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({...values, id: employeeId})
    }).then((res) => {
      if (res) {
        enqueueSnackbar(t("employees.password sucesss"), { variant: "success" });
      } else {
        enqueueSnackbar(t("employees.password error"), { variant: "error" });
      }
    }).catch((err) => enqueueSnackbar(err.message || err.detail || err, { variant: "error" }))
    .finally(() => setLoading(false));
  };

  const initialValues = {
    employee_id: employee?.employee_id || "X".repeat(7),
    first_name: employee?.first_name || "",
    last_name: employee?.last_name || "",
    salutation: employee?.salutation || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    role: employee?.role || "",
    base_salary: employee?.base_salary || "0",
    hourly_rate: employee?.hourly_rate || "0",
    pay_period: employee?.pay_period || "Monthly",
    start_date: employee?.start_date || new Date().toISOString(),
    work_level: employee?.work_level || 1, 
    emmergency_contact_name: employee?.emmergency_contact_name || "",
    emmergency_contact_phone: employee?.emmergency_contact_phone || "",
    emmergency_contact_relation: employee?.emmergency_contact_relation || "",
    password: "",
    confirm_password: "",
  };
  
  const initialValuesPassword = {
    password: "",
    confirm_password: "",
  };

  const validationSchema = () => Yup.object().shape({
    first_name: Yup.string().required(t("main.required")),
    last_name: Yup.string().required(t("main.required")),
    email: Yup.string().email(t("employees.invalid email")).required(t("main.required")),
    phone: Yup.string().required(t("main.required")),
    role: Yup.string().required(t("main.required")),
    base_salary: Yup.number().required(t("main.required")),
    hourly_rate: Yup.number().required(t("main.required")),
    pay_period: Yup.string().required(t("main.required")),
    salutation: Yup.string().nullable().required(t("main.required")),
    password: !employeeId && Yup.string().required(t("main.required")),
    confirm_password: !employeeId && Yup.string().required(t("main.required")).oneOf([Yup.ref('password'), null], t("employees.password match")),
  });

  const validationSchemaPassword = () => Yup.object().shape({
    password: Yup.string().nullable(),
    confirm_password: Yup.string().required(t("main.required")).oneOf([Yup.ref('password'), null], t("employees.password match")),
  });

  const title = employeeId ? (employee ? employee.first_name + " " + employee.last_name : t("employees.edit") ) : t("employees.new");

  let tabList = [t("employees.compensation"), t("employees.emmergency")];

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb routeSegments={[{name: t("employees.title"), path: "/employees"}, { name: title }]} />
      </div>

      <Card elevation={3}>
        <H4 p={2}>{employeeId ? t("employees.edit") : t("employees.new")}</H4>

        <Divider sx={{ mb: 1 }} />

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize={true}
          validationSchema={validationSchema}
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
                  Employee ID
                </Grid>

                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    size="small"
                    name="employee_id"
                    variant="outlined"
                    label={t("employees.id")}
                    value={values.employee_id}
                    onChange={handleChange}
                    sx={{ minWidth: 208 }}
                    disabled
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  Full Name
                </Grid>

                <Grid item md={10} sm={8} xs={12}>
                  <Box m={-1} display="flex" flexWrap="wrap">
                    <StyledTextField
                      select
                      size="small"
                      name="salutation"
                      label={t("employees.salutation")}
                      variant="outlined"
                      sx={{ minWidth: 208 }}
                      value={values.salutation || ""}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: !!values.salutation }}
                      helperText={touched.salutation && errors.salutation}
                      error={Boolean(errors.salutation && touched.salutation)}
                    >
                      {salutationList.map((item, ind) => (
                        <MenuItem value={item} key={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </StyledTextField>
                    <StyledTextField
                      size="small"
                      name="first_name"
                      label={t("main.first name")}
                      variant="outlined"
                      value={values.first_name}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: !!values.first_name }}
                      sx={{ minWidth: 208 }}
                      helperText={touched.first_name && errors.first_name}
                      error={Boolean(errors.first_name && touched.first_name)}
                    />
                    <StyledTextField
                      size="small"
                      name="last_name"
                      label={t("main.last name")}
                      variant="outlined"
                      value={values.last_name}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: !!values.last_name }}
                      sx={{ minWidth: 208 }}
                      helperText={touched.last_name && errors.last_name}
                      error={Boolean(errors.last_name && touched.last_name)}
                    />
                  </Box>
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  Employee Role
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <Box m={-1} display="flex" flexWrap="wrap">
                    <StyledTextField
                      select
                      size="small"
                      name="role"
                      label={t("main.role")}
                      variant="outlined"
                      sx={{ minWidth: 208 }}
                      value={values.role || ""}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: !!values.role }}
                      helperText={touched.role && errors.role}
                      error={Boolean(errors.role && touched.role)}
                    >
                      {roles?.map((item, ind) => {
                        if (item.super == 1) return null;
                        return (
                          <MenuItem value={item.id} key={item.name}>
                            {item.name}{item.description ? " - " + item.description : ""}
                          </MenuItem>
                        )
                      })}
                    </StyledTextField>
                  </Box>
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  Employee Phone
                </Grid>

                <Grid item md={10} sm={8} xs={12}>
                  <Box m={-1} display="flex" flexWrap="wrap">
                    <StyledTextField
                      size="small"
                      name="phone"
                      label={t("main.phone")}
                      variant="outlined"
                      value={values.phone}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: !!values.phone }}
                      sx={{ minWidth: 208 }}
                      helperText={touched.phone && errors.phone}
                      error={Boolean(errors.phone && touched.phone)}
                    />
                  </Box>
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  Employee Email
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    name="email"
                    size="small"
                    type="email"
                    variant="outlined"
                    value={values.email}
                    label={t("main.email")}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: !!values.email }}
                    sx={{ minWidth: 208 }}
                    helperText={touched.email && errors.email}
                    error={Boolean(errors.email && touched.email)}
                  />
                </Grid>

                {
                  !employeeId && (
                    <>
                      <Grid item md={2} sm={4} xs={12}>
                        Password
                      </Grid>
                      <Grid item md={10} sm={8} xs={12}>
                        <TextField
                          name="password"
                          size="small"
                          type="password"
                          variant="outlined"
                          value={values.password}
                          label={t("main.password")}
                          onChange={handleChange}
                          InputLabelProps={{ shrink: !!values.password }}
                          sx={{ minWidth: 208 }}
                          helperText={touched.password && errors.password}
                          error={Boolean(errors.password && touched.password)}
                        />
                        <TextField
                          name="confirm_password"
                          size="small"
                          type="password"
                          variant="outlined"
                          value={values.confirm_password}
                          label={t("employees.confirm password")}
                          onChange={handleChange}
                          InputLabelProps={{ shrink: !!values.confirm_password }}
                          sx={{ minWidth: 208 }}
                          helperText={touched.confirm_password && errors.confirm_password}
                          error={Boolean(errors.confirm_password && touched.confirm_password)}
                          style={{ marginLeft: "16px" }}
                        />
                      </Grid>
                    </>
                  )
                }
              </Grid>

              <Tabs
                value={tabIndex}
                textColor="primary"
                indicatorColor="primary"
                onChange={handleTabChange}
                sx={{ mt: 2, mb: 3 }}
                style={{ marginTop: "30px" }}
              >
                {tabList.map((item, ind) => (
                  <Tab key={ind} value={ind} label={item} sx={{ textTransform: "capitalize" }} />
                ))}
              </Tabs>
              {tabIndex === 1 && <ContactDetailsForm t={t} values={values} handleChange={handleChange} />}
              {tabIndex === 0 && <CompDetailsForm t={t} values={values} handleChange={handleChange} />}

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

      {
        employeeId && (
          <Card elevation={3} style={{marginTop: "30px"}}>
            <H4 p={2}>{t("employees.change password")}</H4>

            <Divider sx={{ mb: 1 }} />

            <Formik
              initialValues={initialValuesPassword}
              onSubmit={handleChangePassword}
              enableReinitialize={true}
              validationSchema={validationSchemaPassword}
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
                dirty,
                resetForm,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <PasswordChangeForm t={t} values={values} handleChange={handleChange} errors={errors} touched={touched} />
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
        )
      }
      
    </Container>
  );
};

const salutationList = ["Mr.", "Mrs.", "Ms.", "Miss.", "Dr."];

export default CustomerForm;
