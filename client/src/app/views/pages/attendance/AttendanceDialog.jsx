import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Autocomplete } from '@mui/material';

const AttendanceDialog = ({ open, onClose, employees, save, update, attendance, t }) => {
  const [clock_in, setClockInTime] = useState('');
  const [clock_out, setClockOutTime] = useState('');
  const [attendance_date, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    if (open && attendance) {
        const _employee = employees.find((employee) => employee.id === attendance.employee_id);
        setClockInTime(attendance.clock_in);
        setClockOutTime(attendance.clock_out);
        setAttendanceDate(attendance.attendance_date);
        setEmployee({..._employee, label: _employee.first_name + " " + _employee.last_name});
    }
  }, [attendance, employees]);

  const handleSave = () => {
    if (attendance) {
      update({
        id: attendance.id,
        employee_id: attendance.employee_id,
        attendance_date,
        clock_in,
        clock_out
      });
    } else {
        save({
            employee_id: employee.id,
            attendance_date,
            clock_in,
            clock_out
        });
    }
    resetForm();
    onClose();
  }

  const disableSubmitButton = () => {
    return !employee || !attendance_date || !clock_in
  }

  const resetForm = () => {
    setClockInTime('');
    setClockOutTime('');
    setAttendanceDate(null);
    setEmployee(null);
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t("attendance.dialog title")}</DialogTitle>
      <DialogContent style={{display: "flex", flexDirection: "column", gap: "16px"}}>
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            fullWidth
            options={employees.map((employee) => ({...employee, label: employee.first_name + " " + employee.last_name}))}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label={t("attendance.table header.employee")} />}
            onChange={(event, value) => setEmployee(value)}
            value={employee}
            style={{marginTop: "16px"}}
            disabled={!!attendance}
        />
        <TextField
          label={t("attendance.table header.date")}
          value={attendance_date}
          onChange={(event) => setAttendanceDate(event.target.value)}
          fullWidth
          type='date'
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label={t("attendance.table header.clock in")}
          value={clock_in}
          onChange={(event) => setClockInTime(event.target.value)}
          fullWidth
          type='time'
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label={t("attendance.table header.clock out")}
          value={clock_out}
          onChange={(event) => setClockOutTime(event.target.value)}
          fullWidth
          type='time'
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          {t("main.cancel")}
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained" disabled={disableSubmitButton()}>
          {t("main.submit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AttendanceDialog;
