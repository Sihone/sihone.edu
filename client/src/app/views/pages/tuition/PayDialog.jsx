import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const PayDialog = ({ open, onClose, save, id, t }) => {
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (!open) {
        resetForm();
    }
  }, [open]);

  const handleSave = () => {
    save({
      amount,
      tuition_id: id,
      payment_date: paymentDate
  });
    resetForm();
    onClose();
  }

  const disableSubmitButton = () => {
    return !amount;
  }

  const resetForm = () => {
    setAmount('');
    setPaymentDate(new Date().toISOString().slice(0, 10));
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} minWidth="md">
      <DialogTitle>{t("tuition.dialog payment title")}</DialogTitle>
      <DialogContent style={{display: "flex", flexDirection: "column", gap: "16px"}}>
        <TextField
          autoFocus
          margin="dense"
          id="amount"
          label={t("finance.table header.amount")}
          type="text"
          sx={{ minWidth: 388 }}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <TextField
          margin="dense"
          id="paymentDate"
          label={t("tuition.payment date")}
          type="text"
          sx={{ minWidth: 388 }}
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
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

export default PayDialog;
