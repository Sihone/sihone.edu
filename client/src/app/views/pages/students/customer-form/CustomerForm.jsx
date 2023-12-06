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
import TuitionDetails from "./TuitionDetails";
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
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id: studentId } = useParams();
  const { user } = useAuth();
  const {data: _student, updateData, saveData, error} = useData("students", user.company_id, studentId);
  const {data: programs} = useData("academic_programs", user.company_id);
  const {data: academicYears} = useData("academic_years", user.company_id);
  const {data: settings} = useData("settings", user.company_id);
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { t, i18n } = useTranslation();

  const handleSubmit = async (values) => {
    console.log(values);
    setLoading(true);
    if (loading) return;
    if (studentId) {
      updateData({...values, id: studentId, company_id: user.company_id})
      .then(() => enqueueSnackbar(t("students.update success"), { variant: "success" }))
      .catch((err) => enqueueSnackbar(err.message || err.detail || err, { variant: "error" }));
    } else {
      saveData({...values, company_id: user.company_id})
      .then((newStudent) => {
        if (newStudent) {
          enqueueSnackbar(t("students.create success"), { variant: "success" });
          navigate("/students/" + newStudent.id)
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
    if (studentId) {
      setStudent(_student);
    } else {
      setStudent(null);
    }
  }, [studentId, _student]);

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
      body: JSON.stringify({...values, id: studentId})
    }).then((res) => {
      if (res) {
        enqueueSnackbar(t("students.password sucesss"), { variant: "success" });
      } else {
        enqueueSnackbar(t("students.password error"), { variant: "error" });
      }
    }).catch((err) => enqueueSnackbar(err.message || err.detail || err, { variant: "error" }))
    .finally(() => setLoading(false));
  };

  const initialValues = {
    student_id: student?.student_id || "X".repeat(7),
    first_name: student?.first_name || "",
    last_name: student?.last_name || "",
    gender: student?.gender || "",
    dob: student?.dob ? new Date(student?.dob).toISOString().split("T")[0] : "",
    email: student?.email || "",
    phone: student?.phone || "",
    program_id: student?.program_id || "",
    parent_phone: student?.parent_phone || "",
    status: student?.status || "active",
    academic_year_id: student?.academic_year_id || settings?.current_academic_year,
    
    emmergency_contact_name: student?.emmergency_contact_name || "",
    emmergency_contact_phone: student?.emmergency_contact_phone || "",
    emmergency_contact_relation: student?.emmergency_contact_relation || "",
    
    password: "",
    confirm_password: "",
  };

  const validationSchema = () => Yup.object().shape({
    first_name: Yup.string().required(t("main.required")),
    last_name: Yup.string().required(t("main.required")),
    email: Yup.string().email(t("students.invalid email")).required(t("main.required")),
    phone: Yup.string().required(t("main.required")),
    program_id: Yup.string().required(t("main.required")),
    dob: Yup.string().required(t("main.required")),
    academic_year_id: Yup.string().required(t("main.required")),
    parent_phone: Yup.number().required(t("main.required")),
    status: Yup.string().required(t("main.required")),
    gender: Yup.string().nullable().required(t("main.required")),
    password: !studentId && Yup.string(),
    confirm_password: !studentId && Yup.string().oneOf([Yup.ref('password'), null], t("students.password match")),
  });

  const validationSchemaPassword = () => Yup.object().shape({
    password: Yup.string().nullable(),
    confirm_password: Yup.string().required(t("main.required")).oneOf([Yup.ref('password'), null], t("students.password match")),
  });

  const title = studentId ? (student ? student.first_name + " " + student.last_name : t("students.edit") ) : t("students.new");

  let tabList = [t("students.tuition"), t("students.emmergency")];

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb routeSegments={[{name: t("students.title"), path: "/students"}, { name: title }]} />
      </div>

      <Card elevation={3}>
        <H4 p={2}>{studentId ? t("students.edit") : t("students.new")}</H4>

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
                  {t("students.student id")}
                </Grid>

                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    size="small"
                    name="student_id"
                    variant="outlined"
                    label={t("students.student id")}
                    value={values.student_id}
                    onChange={handleChange}
                    sx={{ minWidth: 208 }}
                    disabled
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  {t("students.full name")}
                </Grid>

                <Grid item md={10} sm={8} xs={12}>
                  <Box m={-1} display="flex" flexWrap="wrap">
                    <StyledTextField
                      select
                      size="small"
                      name="gender"
                      label={t("students.gender")}
                      variant="outlined"
                      sx={{ minWidth: 208 }}
                      value={values.gender || ""}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: !!values.gender }}
                      helperText={touched.gender && errors.gender}
                      error={Boolean(errors.gender && touched.gender)}
                    >
                      {[
                        {id: "male", label: t("main.male")},
                        {id: "female", label: t("main.female")}
                      ].map((item, ind) => (
                        <MenuItem value={item.id} key={item.id}>
                          {item.label}
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
                  {t("students.date of birth")}
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    name="dob"
                    size="small"
                    type="date"
                    variant="outlined"
                    value={values.dob}
                    label={t("students.date of birth")}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    sx={{ minWidth: 208 }}
                    helperText={touched.dob && errors.dob}
                    error={Boolean(errors.dob && touched.dob)}
                  />
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  {t("academics.table header.program")}
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <Box m={-1} display="flex" flexWrap="wrap">
                    <StyledTextField
                      select
                      size="small"
                      name="program_id"
                      label={t("academics.select program")}
                      variant="outlined"
                      sx={{ minWidth: 208 }}
                      value={values.program_id || ""}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: !!values.program_id }}
                      helperText={touched.program_id && errors.program_id}
                      error={Boolean(errors.program_id && touched.program_id)}
                    >
                      {programs?.map((item, ind) => {
                        const programName = i18n.language == "en" ? (item.short_name_en + " - " + item.name_en) : (item.short_name_fr + " - " + item.name_fr);
                        return (
                          <MenuItem value={item.id} key={item.name_fr}>
                            {programName}
                          </MenuItem>
                        )
                      })}
                    </StyledTextField>
                  </Box>
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  {t("academics.table header.academic year")}
                </Grid>

                <Grid item md={10} sm={8} xs={12}>
                  <Box m={-1} display="flex" flexWrap="wrap">
                    <StyledTextField
                      select
                      size="small"
                      name="academic_year_id"
                      label={t("academics.table header.academic year")}
                      variant="outlined"
                      sx={{ minWidth: 208 }}
                      value={values.academic_year_id || ""}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: !!values.academic_year_id }}
                      helperText={touched.academic_year_id && errors.academic_year_id}
                      error={Boolean(errors.academic_year_id && touched.academic_year_id)}
                    >
                      {academicYears?.map((item, ind) => {
                        return (
                          <MenuItem value={item.id} key={item.name}>
                            {item.name}
                          </MenuItem>
                        )
                      })}
                    </StyledTextField>
                  </Box>
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  {t("main.phone")}
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
                  {t("students.parent phone")}
                </Grid>

                <Grid item md={10} sm={8} xs={12}>
                  <Box m={-1} display="flex" flexWrap="wrap">
                    <StyledTextField
                      size="small"
                      name="parent_phone"
                      label={t("main.phone")}
                      variant="outlined"
                      value={values.parent_phone}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: !!values.parent_phone }}
                      sx={{ minWidth: 208 }}
                      helperText={touched.parent_phone && errors.parent_phone}
                      error={Boolean(errors.parent_phone && touched.parent_phone)}
                    />
                  </Box>
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  {t("student.email")}
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

                <Grid item md={2} sm={4} xs={12}>
                  {t("main.status")}
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    name="status"
                    size="small"
                    variant="outlined"
                    value={values.status}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: !!values.status }}
                    sx={{ minWidth: 208 }}
                    helperText={touched.status && errors.status}
                    error={Boolean(errors.status && touched.status)}
                    select
                  >
                    {[
                      {id: 'active', label: t("main.active")},
                      {id: 'inactive', label: t("main.inactive")}
                    ].map((item, ind) => (
                      <MenuItem value={item.id} key={item.id}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {
                  false && (
                    <>
                      <Grid item md={2} sm={4} xs={12}>
                        {t("main.password")}
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
              {tabIndex === 0 && <TuitionDetails t={t} values={values} handleChange={handleChange} />}

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
        false && (
          <Card elevation={3} style={{marginTop: "30px"}}>
            <H4 p={2}>{t("students.change password")}</H4>

            <Divider sx={{ mb: 1 }} />

            <Formik
              initialValues={initialValues}
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
                <Form onSubmit={(e) => {handleSubmit(e); !errors.confirm_password && resetForm()}}>
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

export default CustomerForm;
