import { Box, Grid, MenuItem, Select, Switch, TextField } from "@mui/material";
import { t } from "i18next";

const CompDetailsForm = ({ values, setFieldValue, student, laptops=[], handleChange, errors, touched, students=[], employees=[] }) => {
  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item md={2} sm={4} xs={12}>
        {t("students.laptop incentive")}
      </Grid>
      <Grid item md={10} sm={8} xs={12}>
        <TextField
          size="small"
          name="laptop_incentive"
          label={t("students.laptop incentive")}
          variant="outlined"
          sx={{ minWidth: 208 }}
          value={student?.laptop_incentive}
          disabled
        />
      </Grid>
      <Grid item md={2} sm={4} xs={12}>
        {t("students.laptop")}
      </Grid>
      <Grid item md={10} sm={8} xs={12}>
        <Switch
          name="needs_laptop"
          checked={values.needs_laptop}
          onChange={value => setFieldValue("needs_laptop", value.target.checked)}
          color="primary"
        />
      </Grid>
      {student && (
        <>
          <Grid item md={2} sm={4} xs={12}>
            {t("students.laptops")}
          </Grid>
          <Grid item md={10} sm={8} xs={12}>
            {laptops.length > 0 ? 
              <Grid item md={10} sm={8} xs={12}>
                <Box m={-1} display="flex" flexWrap="wrap">
                  <TextField
                    select
                    size="small"
                    name="laptop_id"
                    label={t("students.laptop.select")}
                    variant="outlined"
                    sx={{ minWidth: 208 }}
                    value={values.laptop_id || null}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: !!values.laptop_id }}
                    helperText={touched.laptop_id && errors.laptop_id}
                    error={Boolean(errors.laptop_id && touched.laptop_id)}
                    disabled={!values.needs_laptop}
                  >
                    <MenuItem value={null}>
                      <em>{t("main.none")}</em>
                    </MenuItem>
                    {laptops?.map((item) => {
                      const studentWithThisLaptop = students.find(student => student.laptop_id === item.id);
                      const employeeWithThisLaptop = employees.find(employee => employee.laptop_id === item.id);
                      return (
                        <MenuItem value={item.id} key={item.id} disabled={studentWithThisLaptop || employeeWithThisLaptop}>
                          {item.make_model + " - " + item.serial_number}
                        </MenuItem>
                      )
                    })}
                  </TextField>
                </Box>
              </Grid>
            : t("students.no laptops")}
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default CompDetailsForm;
