import { Box, Grid, MenuItem, TextField } from "@mui/material";

const HardwareDetailsForm = ({ t, values, handleChange, employee, laptops=[], errors, touched, students=[], employees=[] }) => {
  return (
    <Grid container spacing={3} alignItems="center">
      {employee && (
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

export default HardwareDetailsForm;
