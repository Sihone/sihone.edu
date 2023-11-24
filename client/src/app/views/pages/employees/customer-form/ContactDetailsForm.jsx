import { Grid, TextField } from "@mui/material";

const ContactDetailsForm = ({ t, values, handleChange }) => {
  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item md={2} sm={4} xs={12}>
        {t("employees.contact name")}
      </Grid>

      <Grid item md={10} sm={8} xs={12}>
        <TextField
          size="small"
          name="emmergency_contact_name"
          label={t("employees.contact name")}
          variant="outlined"
          sx={{ minWidth: 208 }}
          value={values.emmergency_contact_name || ""}
          onChange={handleChange}
          InputLabelProps={{ shrink: !!values.emmergency_contact_name }}
        />
      </Grid>

      <Grid item md={2} sm={4} xs={12}>
        {t("employees.contact phone")}
      </Grid>

      <Grid item md={10} sm={8} xs={12}>
        <TextField
          size="small"
          label={t("employees.contact phone")}
          name="emmergency_contact_phone"
          variant="outlined"
          sx={{ minWidth: 208 }}
          onChange={handleChange}
          value={values.emmergency_contact_phone || ""}
          InputLabelProps={{ shrink: !!values.emmergency_contact_phone }}
        />
      </Grid>

      <Grid item md={2} sm={4} xs={12}>
        {t("employees.contact relation")}
      </Grid>

      <Grid item md={10} sm={8} xs={12}>
        <TextField
          size="small"
          label={t("employees.contact relation")}
          name="emmergency_contact_relation"
          variant="outlined"
          sx={{ minWidth: 208 }}
          onChange={handleChange}
          value={values.emmergency_contact_relation || ""}
          InputLabelProps={{ shrink: !!values.emmergency_contact_relation }}
        />
      </Grid>
    </Grid>
  );
};

export default ContactDetailsForm;
