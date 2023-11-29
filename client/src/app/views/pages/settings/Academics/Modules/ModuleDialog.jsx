import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';

const CourseDialog = ({ open, onClose, save, update, module, t, i18n, employees, courses }) => {
  const [name_en, setNameEn] = useState('');
  const [name_fr, setNameFr] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [coefficient, setCoefficient] = useState(null);
  const [description, setDescription] = useState(null);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    if (open && module) {
        const _employee = employees.find((item) => item.id == module.employee_id);
        setNameEn(module.name_en);
        setNameFr(module.name_fr);
        setSelectedCourses(JSON.parse(module.course_ids || '[]'));
        setCoefficient(module.coefficient);
        setDescription(module.description);
        setEmployee(_employee);
    }
  }, [module]);

  useEffect(() => {
    if (!open) {
        resetForm();
    }
  }, [open]);

  const handleSave = () => {
    if (module) {
      update({
        id: module.id,
        name_en,
        name_fr,
        course_ids: JSON.stringify(selectedCourses),
        coefficient,
        description,
        employee_id: employee && employee.id
      });
    } else {
        save({
            name_en,
            name_fr,
            course_ids: JSON.stringify(selectedCourses),
            coefficient,
            description,
            employee_id: employee && employee.id
        });
    }
    resetForm();
    onClose();
  }

  const disableSubmitButton = () => {
    return !name_en || !name_fr || !coefficient;
  }

  const resetForm = () => {
    setNameEn('');
    setNameFr('');
    setSelectedCourses([]);
    setDescription(null);
    setEmployee(null);
    setCoefficient(null);
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  const handleCourseChange = (e) => {
    let _selectedCourses = e.target.value;
    _selectedCourses.forEach((item, index) => {
      if (item == null) {
        _selectedCourses = [];
      }
    });
    setSelectedCourses(_selectedCourses);
  }

  const handlEmployeeChange = (e) => {
    const employee = employees.find((item) => item.id == e.target.value);
    setEmployee(employee);
  }

  return (
    <Dialog open={open} onClose={handleClose} minWidth="md">
      <DialogTitle>{module ? t("academics.dialog module title edit") : t("academics.dialog module title")}</DialogTitle>
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
          margin="dense"
          id="coefficient"
          label={t("academics.table header.coefficient")}
          type="number"
          fullWidth
          value={coefficient}
          onChange={(e) => setCoefficient(e.target.value)}
        />
        <TextField
          select
          size="small"
          name="role"
          label={t("academics.table header.course")}
          variant="outlined"
          fullWidth
          value={selectedCourses}
          onChange={handleCourseChange}
          InputLabelProps={{
            shrink: selectedCourses.length > 0,
          }}
          SelectProps={{multiple: true}}
        >
          <MenuItem value={null}>{t("academics.select courses")}</MenuItem>
          {courses?.map((item) => {
            const _name = i18n.language == "en" ? item.name_en : item.name_fr;
            return (
              <MenuItem value={item.id} key={item.id}>
                {_name}
              </MenuItem>
            )
          })}
        </TextField>
        <TextField
          margin="dense"
          id="description"
          label={t("academics.table header.description")}
          type="text"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          select
          size="small"
          name="role"
          label={t("academics.table header.course head")}
          variant="outlined"
          fullWidth
          value={employee ? employee.id : null}
          onChange={handlEmployeeChange}
          InputLabelProps={{
            shrink: !!employee,
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

export default CourseDialog;
