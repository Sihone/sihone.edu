import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const CycleDialog = ({ open, onClose, save, update, laptop, t }) => {
  const [make_model, setMakeModel] = useState('');
  const [serial_number, setSerialNumber] = useState('');

  useEffect(() => {
    if (open && laptop) {
        setMakeModel(laptop.make_model);
        setSerialNumber(laptop.serial_number);
    }
  }, [laptop]);

  useEffect(() => {
    if (!open) {
        resetForm();
    }
  }, [open]);

  const handleSave = () => {
    if (laptop) {
      update({
        id: laptop.id,
        make_model,
        serial_number
      });
    } else {
        save({
            make_model,
            serial_number
        });
    }
    resetForm();
    onClose();
  }

  const disableSubmitButton = () => {
    return !make_model || !serial_number;
  }

  const resetForm = () => {
    setMakeModel('');
    setSerialNumber('');
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} minWidth="md">
      <DialogTitle>{t("hardware.laptop.dialog title")}</DialogTitle>
      <DialogContent style={{display: "flex", flexDirection: "column", gap: "16px"}}>
        <TextField
          autoFocus
          margin="dense"
          id="make_model"
          label={t("hardware.laptop.make model")}
          type="text"
          sx={{ minWidth: 388 }}
          value={make_model}
          onChange={(e) => setMakeModel(e.target.value.toUpperCase())}
        />
        <TextField
          margin="dense"
          id="serial_number"
          label={t("hardware.laptop.serial")}
          type="text"
          sx={{ minWidth: 388 }}
          value={serial_number}
          onChange={(e) => setSerialNumber(e.target.value.toUpperCase())}
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

export default CycleDialog;
