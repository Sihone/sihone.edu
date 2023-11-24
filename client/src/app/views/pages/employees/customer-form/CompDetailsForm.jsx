import { Grid, MenuItem, TextField } from "@mui/material";
import { t } from "i18next";

const CompDetailsForm = ({ values, handleChange }) => {
  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item md={2} sm={4} xs={12}>
        {t("employees.base salary")}
      </Grid>

      <Grid item md={10} sm={8} xs={12}>
        <TextField
          size="small"
          name="base_salary"
          label={t("employees.base salary")}
          variant="outlined"
          sx={{ minWidth: 208 }}
          value={values.base_salary || ""}
          onChange={handleChange}
          InputLabelProps={{ shrink: !!values.base_salary }}
        />
        <TextField
          size="small"
          label={t("main.currency")}
          variant="outlined"
          sx={{ maxWidth: 80 }}
          value={"XAF"}
          InputLabelProps={{ shrink: true }}
          style={{ marginLeft: "16px" }}
          disabled
        />
      </Grid>

      <Grid item md={2} sm={4} xs={12}>
        {t("employees.hourly rate")}
      </Grid>

      <Grid item md={10} sm={8} xs={12}>
        <TextField
          size="small"
          label={t("employees.hourly rate")}
          name="hourly_rate"
          variant="outlined"
          sx={{ minWidth: 208 }}
          onChange={handleChange}
          value={values.hourly_rate || ""}
          InputLabelProps={{ shrin: !!values.hourly_rate }}
        />
      </Grid>

      <Grid item md={2} sm={4} xs={12}>
        {t("employees.pay period")}
      </Grid>

      <Grid item md={10} sm={8} xs={12}>
      <TextField
        select
        size="small"
        name="pay_period"
        label={t("employees.pay period")}
        variant="outlined"
        sx={{ minWidth: 208 }}
        value={values.pay_period || ""}
        onChange={handleChange}
        InputLabelProps={{ shrink: !!values.pay_period }}
      >
        {payPeriod.map((item, ind) => (
          <MenuItem value={item.value} key={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </TextField>
      </Grid>
    </Grid>
  );
};

const payPeriod = [
  { value: "Weekly", label: t("employees.weekly") },
  { value: "Biweekly", label: t("employees.biweekly") },
  { value: "Monthly", label: t("employees.monthly") },
];

export default CompDetailsForm;
