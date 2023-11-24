// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import { useState, useEffect, Fragment } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";

const API_URL = "https://restcountries.com/v3.1/all?fields=name";

function sleep(delay = 0) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export default function AsyncAutocomplete() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    (async () => {
      const response = await fetch(API_URL);
      const countries = await response.json();
      const first_20 = countries.slice(0, 20);

      const updatedList = first_20.reduce(
        (prev, curr) => [...prev, { name: curr.name.common }],
        []
      );

      await sleep(3000); // For demo purposes.
      setOptions(updatedList);
      setLoading(false);
    })();
  }, []);

  return (
    <Autocomplete
      open={open}
      options={options}
      // loading={loading}
      id="asynchronous-demo"
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      getOptionLabel={(option) => option.name}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          variant="outlined"
          label="Asynchronous"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
    />
  );
}
