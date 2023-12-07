import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

const TuitionItemsDialog = ({ open, onClose, saveItem, saveTuitionItem, id, t, items }) => {
  const [price, setPrice] = useState('');
  const [name, setName] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!open) {
        resetForm();
    }
  }, [open]);

  const handleAddItem = async () => {
    const _item = await saveItem({
      price,
      name
    });
    if (_item) {
      saveTuitionItem({
        tuition_id: id,
        item_id: _item.id
      });
    }
    resetForm();
    onClose();
  }

  const handleSave = () => {
    saveTuitionItem({
      tuition_id: id,
      item_id: selectedItemId
    });
    resetForm();
    onClose();
  }


  const disableSubmitButton1 = () => {
    return !selectedItemId;
  }

  const disableSubmitButton2 = () => {
    return !price || !name;
  }

  const resetForm = () => {
    setPrice('');
    setName('');
    setSelectedItemId(null);
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} minWidth="md">
      <DialogTitle>{t("tuition.dialog add item title")}</DialogTitle>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="adding items">
            <Tab label={t("tuition.existing items")} value="1" />
            <Tab label={t("tuition.new item")} value="2" />
          </TabList>
        </Box>
        <TabPanel value='1'>
          <DialogContent style={{display: "flex", flexDirection: "column", gap: "16px"}}>
            <TextField
              select
              margin="dense"
              id="item"
              label={t("tuition.select item")}
              type="text"
              sx={{ minWidth: 388 }}
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
            >
              {items.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name} ({item.price})
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              {t("main.cancel")}
            </Button>
            <Button onClick={handleSave} color="primary" variant="contained" disabled={disableSubmitButton1()}>
              {t("main.submit")}
            </Button>
          </DialogActions>
        </TabPanel>
        <TabPanel value='2'>
          <DialogContent style={{display: "flex", flexDirection: "column", gap: "16px"}}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={t("tuition.item name")}
              type="text"
              sx={{ minWidth: 388 }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="dense"
              id="price"
              label={t("tuition.item price")}
              type="text"
              sx={{ minWidth: 388 }}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              {t("main.cancel")}
            </Button>
            <Button onClick={handleAddItem} color="primary" variant="contained" disabled={disableSubmitButton2()}>
              {t("main.submit")}
            </Button>
          </DialogActions>
        </TabPanel>
      </TabContext>
    </Dialog>
  );
};

export default TuitionItemsDialog;
