import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const CycleDialog = ({ open, onClose, save, update, account, t }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (open && account) {
        setName(account.name);
        setDescription(account.description);
    }
  }, [account]);

  useEffect(() => {
    if (!open) {
        resetForm();
    }
  }, [open]);

  const handleSave = () => {
    if (account) {
      update({
        id: account.id,
        name,
        description
      });
    } else {
        save({
            name,
            description
        });
    }
    resetForm();
    onClose();
  }

  const disableSubmitButton = () => {
    return !name;
  }

  const resetForm = () => {
    setName('');
    setDescription('');
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} minWidth="md">
      <DialogTitle>{account ? t("finance.dialog account title edit") : t("finance.dialog account title")}</DialogTitle>
      <DialogContent style={{display: "flex", flexDirection: "column", gap: "16px"}}>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={t("finance.table header.name")}
          type="text"
          sx={{ minWidth: 388 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
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
