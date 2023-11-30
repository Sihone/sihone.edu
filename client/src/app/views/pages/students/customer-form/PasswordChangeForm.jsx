import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

const PasswordChangeForm = ({ values, handleChange, errors, touched, t }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item md={2} sm={4} xs={12}>
        {t("employees.new password")}
      </Grid>

      <Grid item md={10} sm={8} xs={12}>
        <TextField
          type={showPassword ? "text" : "password"}
          size="small"
          name="password"
          label={t("main.password")}
          variant="outlined"
          sx={{ minWidth: 208 }}
          value={values.password || ""}
          onChange={handleChange}
          InputLabelProps={{ shrink: !!values.password }}
          helperText={touched.password && errors.password}
          error={Boolean(errors.password && touched.password)}
          InputProps={{ // <-- This is where the toggle button is added.
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Grid>

      <Grid item md={2} sm={4} xs={12}>
        {t("employees.confirm password")}
      </Grid>

      <Grid item md={10} sm={8} xs={12}>
        <TextField
          type={showPassword ? "text" : "password"}
          size="small"
          label={t("employees.confirm password")}
          name="confirm_password"
          variant="outlined"
          sx={{ minWidth: 220 }}
          onChange={handleChange}
          value={values.confirm_password || ""}
          InputLabelProps={{ shrin: !!values.confirm_password }}
          helperText={touched.confirm_password && errors.confirm_password}
          error={Boolean(errors.confirm_password && touched.confirm_password)}
        />
      </Grid>
    </Grid>
  );
};

export default PasswordChangeForm;
