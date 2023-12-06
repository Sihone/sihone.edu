import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const RebateDialog = ({ open, onClose, update, id, t, amount }) => {
  const [rebate, setRebate] = useState(0);

  useEffect(() => {
    if (!open) {
        resetForm();
    }
    if (open && amount) {
        setRebate(amount);
    }
  }, [open, amount]);

  const handleSave = () => {
    update({
      rebate,
      id,
  });
    resetForm();
    onClose();
  }

  const disableSubmitButton = () => {
    return !rebate;
  }

  const resetForm = () => {
    setRebate(0);
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} minWidth="md">
      <DialogTitle>{t("tuition.dialog rebate title")}</DialogTitle>
      <DialogContent style={{display: "flex", flexDirection: "column", gap: "16px"}}>
        <TextField
          autoFocus
          margin="dense"
          id="rebate"
          label={t("tuition.rebate amount")}
          type="text"
          sx={{ minWidth: 388 }}
          value={rebate}
          onChange={(e) => setRebate(e.target.value)}
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

export default RebateDialog;
