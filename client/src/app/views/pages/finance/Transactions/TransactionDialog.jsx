import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';

const CycleDialog = ({ open, onClose, save, update, transaction, t, accounts, employees }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(null);
  const [type, setType] = useState(null);
  const [account, setAccount] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    if (open && transaction) {
        setDescription(transaction.description);
        setAmount(transaction.amount);
        setType(transaction.type);
        setAccount(transaction.account_id);
        setDate(transaction.date);
        setEmployee(transaction.employee_id);
    }
  }, [transaction]);

  useEffect(() => {
    if (!open) {
        resetForm();
    }
  }, [open]);

  const handleSave = () => {
    if (transaction) {
      update({
        id: transaction.id,
        description,
        amount,
        type,
        account_id: account,
        date,
        employee_id: employee
      });
    } else {
        save({
            description,
            amount,
            type,
            account_id: account,
            date,
            employee_id: employee
        });
    }
    resetForm();
    onClose();
  }

  const disableSubmitButton = () => {
    return !description || !amount || !type || !account || !date || !employee;
  }

  const resetForm = () => {
    setDescription('');
    setAmount(null);
    setType(null);
    setAccount(null);
    setDate(new Date().toISOString().slice(0, 10));
    setEmployee(null);
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} minWidth="md">
      <DialogTitle>{transaction ? t("finance.dialog transaction title edit") : t("finance.dialog transaction title")}</DialogTitle>
      <DialogContent style={{display: "flex", flexDirection: "column", gap: "16px"}}>
        <TextField
          autoFocus
          margin="dense"
          id="transaction_date"
          label={t("finance.table header.date")}
          type="date"
          sx={{ minWidth: 388 }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <TextField
          margin="dense"
          id="description"
          label={t("finance.table header.description")}
          type="text"
          sx={{ minWidth: 388 }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          margin="dense"
          id="amount"
          label={t("finance.table header.amount")}
          type="number"
          sx={{ minWidth: 388 }}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <TextField
          select
          size="small"
          name="type"
          label={t("finance.table header.type")}
          variant="outlined"
          fullWidth
          value={type}
          onChange={(e) => setType(e.target.value)}
          InputLabelProps={{
            shrink: !!type,
          }}
        >
          <MenuItem value={null}>{t("finance.select type")}</MenuItem>
          <MenuItem value="income">{t("finance.income")}</MenuItem>
          <MenuItem value="expense">{t("finance.expense")}</MenuItem>
        </TextField>
        <TextField
          select
          size="small"
          name="account"
          label={t("finance.table header.account")}
          variant="outlined"
          fullWidth
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          InputLabelProps={{
            shrink: !!account,
          }}
        >
          <MenuItem value={null}>{t("finance.select account")}</MenuItem>
          {accounts?.map((item) => {
            return (
              <MenuItem value={item.id} key={item.id}>
                {item.name}
              </MenuItem>
            )
          })}
        </TextField>
        <TextField
          select
          size="small"
          name="employee"
          label={t("finance.table header.employee")}
          variant="outlined"
          fullWidth
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
          InputLabelProps={{
            shrink: !!employee,
          }}
        >
          <MenuItem value={null}>{t("finance.select employee")}</MenuItem>
          {employees?.map((item) => {
            return (
              <MenuItem value={item.id} key={item.id}>
                {item.first_name + " " + item.last_name}
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
