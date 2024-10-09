import React, { useEffect, useState } from 'react';
import { Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel } from '@mui/material';
import { use } from 'i18next';

const CycleDialog = ({ open, onClose, save, update, cycle, t }) => {
  const [long_name_en, setLongNameEn] = useState('');
  const [short_name_en, setShortNameEn] = useState('');
  const [long_name_fr, setLongNameFr] = useState('');
  const [short_name_fr, setShortNameFr] = useState('');
  const [number_of_years, setNumberOfYears] = useState(0);
  const [reg_fee, setRegFee] = useState(0);

  useEffect(() => {
    if (open && cycle) {
        setLongNameEn(cycle.long_name_en);
        setShortNameEn(cycle.short_name_en);
        setLongNameFr(cycle.long_name_fr);
        setShortNameFr(cycle.short_name_fr);
        setNumberOfYears(cycle.number_of_years);
        setRegFee(cycle.reg_fee);
    }
  }, [cycle]);

  useEffect(() => {
    if (!open) {
        resetForm();
    }
  }, [open]);

  const handleSave = () => {
    if (cycle) {
      update({
        id: cycle.id,
        long_name_en,
        short_name_en,
        long_name_fr,
        short_name_fr,
        number_of_years,
        reg_fee
      });
    } else {
        save({
            long_name_en,
            short_name_en,
            long_name_fr,
            short_name_fr,
            number_of_years,
            reg_fee
        });
    }
    resetForm();
    onClose();
  }

  const disableSubmitButton = () => {
    return !long_name_en || !short_name_en || !long_name_fr || !short_name_fr || !number_of_years
  }

  const resetForm = () => {
    setLongNameEn('');
    setShortNameEn('');
    setLongNameFr('');
    setShortNameFr('');
    setNumberOfYears(0);
    setRegFee(0);
  }


  const handleClose = () => {
    resetForm();
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} minWidth="md">
      <DialogTitle>{cycle ? t("academics.dialog cycle title edit") : t("academics.dialog cycle title")}</DialogTitle>
      <DialogContent style={{display: "flex", flexDirection: "column", gap: "16px"}}>
        <TextField
          autoFocus
          margin="dense"
          id="long_name_en"
          label={t("academics.long name en")}
          type="text"
          sx={{ minWidth: 388 }}
          value={long_name_en}
          onChange={(e) => setLongNameEn(e.target.value)}
        />
        <TextField
          margin="dense"
          id="short_name_en"
          label={t("academics.short name en")}
          type="text"
          fullWidth
          value={short_name_en}
          onChange={(e) => setShortNameEn(e.target.value)}
        />
        <TextField
          margin="dense"
          id="long_name_fr"
          label={t("academics.long name fr")}
          type="text"
          fullWidth
          value={long_name_fr}
          onChange={(e) => setLongNameFr(e.target.value)}
        />
        <TextField
          margin="dense"
          id="short_name_fr"
          label={t("academics.short name fr")}
          type="text"
          fullWidth
          value={short_name_fr}
          onChange={(e) => setShortNameFr(e.target.value)}
        />
        <TextField
          margin="dense"
          id="number_of_years"
          label={t("academics.number of years")}
          type="number"
          fullWidth
          value={number_of_years}
          onChange={(e) => setNumberOfYears(e.target.value)}
        />
        <TextField
          margin="dense"
          id="reg_fee"
          label={t("academics.reg fee")}
          type="number"
          fullWidth
          value={reg_fee}
          onChange={(e) => setRegFee(e.target.value)}
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
