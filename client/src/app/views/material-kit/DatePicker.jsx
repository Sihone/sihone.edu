import { Grid, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useState } from "react";

export default function MaterialUIDatePickers() {
  const [selectedDate, setSelectedDate] = useState(new Date("2014-08-18T21:11:54"));
  const handleDateChange = (date) => setSelectedDate(date);

  return (
    <Grid container sx={{ width: "60%" }} justify="space-around">
      <DatePicker
        value={selectedDate}
        onChange={handleDateChange}
        renderInput={(props) => (
          <TextField {...props} variant="standard" id="mui-pickers-date" label="Date picker" />
        )}
      />
      <TimePicker
        value={selectedDate}
        onChange={handleDateChange}
        renderInput={(props) => (
          <TextField {...props} variant="standard" id="mui-pickers-date" label="Time picker" />
        )}
      />
    </Grid>
  );
}
