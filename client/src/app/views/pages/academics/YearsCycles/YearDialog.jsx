import React, { useEffect, useState } from 'react';
import { Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel } from '@mui/material';
import { use } from 'i18next';
import { useAuth } from 'app/hooks/useAuth';

const YearDialog = ({ open, onClose, save, update, academicYear, currentAcademicYear, t }) => {
  const [name, setName] = useState('');
  const [start_date, setStartDate] = useState(new Date().getFullYear() + "-10-01");
  const [end_date, setEndDate] = useState(new Date().getFullYear() + 1 + "-06-30");
  const [grade_total, setGradeTotal] = useState(20);
  const [active, setActive] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (open && academicYear) {
        setName(academicYear.name);
        setStartDate(academicYear.start_date);
        setEndDate(academicYear.end_date);
        setGradeTotal(academicYear.grade_total);
        setActive(currentAcademicYear == academicYear.id);
    }
  }, [academicYear]);

  useEffect(() => {
    if (!open) {
        resetForm();
    }
  }, [open]);

  const handleSave = async () => {
    if (academicYear) {
      await update({
        id: academicYear.id,
        name,
        start_date,
        end_date,
        grade_total,
        active
      });
      if (active) {
        // refresh page
        window.location.reload();
      }
    } else {
      await save({
            name,
            start_date,
            end_date,
            grade_total,
            active
      });
      if (active) {
        // refresh page
        window.location.reload();
      }
    }
    resetForm();
    onClose();
  }

  const disableSubmitButton = () => {
    return !name || !start_date || !end_date || !grade_total
  }

  const resetForm = () => {
    setName('');
    setStartDate(new Date().getFullYear() + "-10-01");
    setEndDate(new Date().getFullYear() + 1 + "-06-30");
    setGradeTotal(20);
    setActive(true);
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{academicYear ? t("academics.dialog title edit") : t("academics.dialog title")}</DialogTitle>
      <DialogContent style={{display: "flex", flexDirection: "column", gap: "16px"}}>
        <TextField
          autoFocus
          margin="dense"
          label={t("academics.table header.academic year")}
          type="text"
          sx={{ minWidth: 288 }}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <TextField
          label={t("academics.table header.start date")}
          value={start_date}
          onChange={(event) => setStartDate(event.target.value)}
          fullWidth
          type='date'
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label={t("academics.table header.end date")}
          value={end_date}
          onChange={(event) => setEndDate(event.target.value)}
          fullWidth
          type='date'
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label={t("academics.table header.grade total")}
          value={grade_total}
          onChange={(event) => setGradeTotal(event.target.value)}
          fullWidth
          type='number'
          InputLabelProps={{ shrink: true }}
        />
        <FormControlLabel
          label={t("academics.table header.active")}
          control={
            <Checkbox
              checked={active}
              onChange={(event) => setActive(event.target.checked)}
              fullWidth
              type='checkbox'
              disabled={academicYear && currentAcademicYear == academicYear.id}
            />
          }
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

export default YearDialog;
