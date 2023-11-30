import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel, MenuItem, Autocomplete } from '@mui/material';

const CycleDialog = ({ open, onClose, save, update, program, t, employees, cycles }) => {
  const [name_en, setNameEn] = useState('');
  const [name_fr, setNameFr] = useState('');
  const [cycle, setCycle] = useState(null);
  const [price, setPrice] = useState(null);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    if (open && program) {
        const _cycle = cycles.find((item) => item.id == program.cycle_id);
        const _employee = employees.find((item) => item.id == program.employee_id);
        setNameEn(program.name_en);
        setNameFr(program.name_fr);
        setCycle(_cycle);
        setPrice(program.price);
        setEmployee(_employee);
    }
  }, [program]);

  useEffect(() => {
    if (!open) {
        resetForm();
    }
  }, [open]);

  const handleSave = () => {
    if (program) {
      update({
        id: program.id,
        name_en,
        name_fr,
        cycle_id: cycle.id,
        price,
        employee_id: employee.id
      });
    } else {
        save({
            name_en,
            name_fr,
            cycle_id: cycle.id,
            price,
            employee_id: employee.id
        });
    }
    resetForm();
    onClose();
  }

  const disableSubmitButton = () => {
    return !name_en || !name_fr || !cycle || !price || !employee;
  }

  const resetForm = () => {
    setNameEn('');
    setNameFr('');
    setCycle(null);
    setPrice(null);
    setEmployee(null);
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  const handleCycleChange = (e) => {
    const cycle = cycles.find((item) => item.id == e.target.value);
    setCycle(cycle);
  }

  const handlEmployeeChange = (e) => {
    const employee = employees.find((item) => item.id == e.target.value);
    setEmployee(employee);
  }

  return (
    <Dialog open={open} onClose={handleClose} minWidth="md">
      <DialogTitle>{program ? t("academics.dialog program title edit") : t("academics.dialog program title")}</DialogTitle>
      <DialogContent style={{display: "flex", flexDirection: "column", gap: "16px"}}>
        <TextField
          autoFocus
          margin="dense"
          id="name_en"
          label={t("academics.table header.name en")}
          type="text"
          sx={{ minWidth: 388 }}
          value={name_en}
          onChange={(e) => setNameEn(e.target.value)}
        />
        <TextField
          margin="dense"
          id="name_fr"
          label={t("academics.table header.name fr")}
          type="text"
          fullWidth
          value={name_fr}
          onChange={(e) => setNameFr(e.target.value)}
        />
        <TextField
          select
          size="small"
          name="role"
          label={t("academics.table header.cycle")}
          variant="outlined"
          fullWidth
          value={cycle ? cycle.id : null}
          onChange={handleCycleChange}
          InputLabelProps={{
            shrink: !!cycle,
          }}
        >
          <MenuItem value={null}>{t("academics.select cycle")}</MenuItem>
          {cycles?.map((item) => {
            if (item.super == 1) return null;
            return (
              <MenuItem value={item.id} key={item.id}>
                {item.long_name_en}({item.short_name_en})
              </MenuItem>
            )
          })}
        </TextField>
        <TextField
          margin="dense"
          id="price"
          label={t("academics.table header.price")}
          type="text"
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          select
          size="small"
          name="role"
          label={t("academics.table header.head")}
          variant="outlined"
          fullWidth
          value={employee ? employee.id : null}
          onChange={handlEmployeeChange}
          InputLabelProps={{
            shrink: !!cycle,
          }}
        >
          <MenuItem value={null}>{t("academics.select employee")}</MenuItem>
          {employees?.map((item) => {
            if (item.super == 1) return null;
            return (
              <MenuItem value={item.id} key={item.id}>
                {item.first_name} {item.last_name}
              </MenuItem>
            )
          })}
        </TextField>
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

export default CycleDialog;
