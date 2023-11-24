import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Icon,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Span } from "app/components/Typography";
import { useState } from "react";

const SimpleForm = () => {
  const [state, setState] = useState({ date: new Date() });

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log("submitted");
    // console.log(event);
  };

  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleDateChange = (date) => setState({ ...state, date });

  const {
    username,
    firstName,
    creditCard,
    mobile,
    password,
    confirmPassword,
    gender,
    date,
    email,
  } = state;

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={6}>
        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            type="text"
            name="username"
            id="standard-basic"
            value={username || ""}
            onChange={handleChange}
            label="Username (Min length 4, Max length 9)"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="text"
            name="firstName"
            label="First Name"
            onChange={handleChange}
            value={firstName || ""}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="email"
            name="email"
            label="Email"
            value={email || ""}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <DatePicker
            value={date}
            onChange={handleDateChange}
            renderInput={(props) => (
              <TextField fullWidth {...props} label="Date picker" id="mui-pickers-date" />
            )}
          />

          <TextField
            fullWidth
            type="number"
            name="creditCard"
            label="Credit Card"
            onChange={handleChange}
            value={creditCard || ""}
            sx={{ my: 2 }}
          />
        </Grid>

        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            type="text"
            name="mobile"
            value={mobile || ""}
            label="Mobile Nubmer"
            onChange={handleChange}
          />

          <TextField
            fullWidth
            name="password"
            type="password"
            label="Password"
            value={password || ""}
            onChange={handleChange}
            sx={{ my: 2 }}
          />

          <TextField
            fullWidth
            type="password"
            name="confirmPassword"
            onChange={handleChange}
            label="Confirm Password"
            value={confirmPassword || ""}
          />

          <RadioGroup row name="gender" sx={{ mb: 2 }} value={gender || ""} onChange={handleChange}>
            <FormControlLabel
              value="Male"
              label="Male"
              labelPlacement="end"
              control={<Radio color="secondary" />}
            />

            <FormControlLabel
              value="Female"
              label="Female"
              labelPlacement="end"
              control={<Radio color="secondary" />}
            />

            <FormControlLabel
              value="Others"
              label="Others"
              labelPlacement="end"
              control={<Radio color="secondary" />}
            />
          </RadioGroup>

          <FormControlLabel
            control={<Checkbox />}
            label="I have read and agree to the terms of service."
          />
        </Grid>
      </Grid>

      <Button color="primary" variant="contained" type="submit">
        <Icon>send</Icon>
        <Span sx={{ pl: 1, textTransform: "capitalize" }}>Submit</Span>
      </Button>
    </form>
  );
};

export default SimpleForm;
