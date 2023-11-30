import { Grid, MenuItem, TextField } from "@mui/material";
import { t } from "i18next";

const CompDetailsForm = ({ values, handleChange }) => {
  return (
    <div>Tuition details here</div>
  );
};

const payPeriod = [
  { value: "Weekly", label: t("employees.weekly") },
  { value: "Biweekly", label: t("employees.biweekly") },
  { value: "Monthly", label: t("employees.monthly") },
];

export default CompDetailsForm;
