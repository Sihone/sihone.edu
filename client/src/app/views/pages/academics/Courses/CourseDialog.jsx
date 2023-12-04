import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';

const ProgramDialog = ({ open, onClose, save, update, course, t, i18n, employees, programs, academic_years, semesters }) => {
  const [name_en, setNameEn] = useState('');
  const [name_fr, setNameFr] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [coefficient, setCoefficient] = useState(null);
  const [description, setDescription] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [excludedAcademicYears, setExcludedAcademicYears] = useState([]);
  const [semester, setSemester] = useState(null);
  const [semesterPerYear, setSemesterPerYear] = useState([]);

  useEffect(() => {
    if (open && course) {
        const _employee = employees.find((item) => item.id == course.employee_id);
        setNameEn(course.name_en);
        setNameFr(course.name_fr);
        setSelectedPrograms(JSON.parse(course.program_ids || '[]'));
        setCoefficient(course.coefficient);
        setDescription(course.description);
        setEmployee(_employee);
        setExcludedAcademicYears(JSON.parse(course.exempted_academic_years || '[]'));
        setSemester(course.semester);
        setSemesterPerYear(JSON.parse(course.semester_per_year || '[]'));
    }
  }, [course]);

  useEffect(() => {
    if (!open) {
        resetForm();
    }
  }, [open]);

  const handleSave = () => {
    if (course) {
      update({
        id: course.id,
        name_en,
        name_fr,
        program_ids: JSON.stringify(selectedPrograms),
        coefficient,
        description,
        employee_id: employee && employee.id,
        exempted_academic_years: JSON.stringify(excludedAcademicYears),
        semester,
        semester_per_year: JSON.stringify(semesterPerYear)
      });
    } else {
        save({
            name_en,
            name_fr,
            program_ids: JSON.stringify(selectedPrograms),
            coefficient,
            description,
            employee_id: employee && employee.id,
            exempted_academic_years: JSON.stringify(excludedAcademicYears),
            semester,
            semester_per_year: JSON.stringify(semesterPerYear)
        });
    }
    resetForm();
    onClose();
  }

  const disableSubmitButton = () => {
    return !name_en || !name_fr || selectedPrograms.length === 0 || !coefficient;
  }

  const resetForm = () => {
    setNameEn('');
    setNameFr('');
    setSelectedPrograms([]);
    setDescription(null);
    setEmployee(null);
    setCoefficient(null);
    setExcludedAcademicYears([]);
    setSemester(null);
    setSemesterPerYear([]);
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  const handleProgramChange = (e) => {
    let _selectedPrograms = e.target.value;
    _selectedPrograms = _selectedPrograms.filter((item) => item);
    setSelectedPrograms(_selectedPrograms);
  }

  const handleExcludedAcademicYearChange = (e) => {
    let _excludedAcademicYears = e.target.value;
    _excludedAcademicYears = _excludedAcademicYears.filter((item) => item);
    setExcludedAcademicYears(_excludedAcademicYears);
  }

  const handlEmployeeChange = (e) => {
    const employee = employees.find((item) => item.id == e.target.value);
    setEmployee(employee);
  }

  return (
    <Dialog open={open} onClose={handleClose} minWidth="md">
      <DialogTitle>{course ? t("academics.dialog course title edit") : t("academics.dialog course title")}</DialogTitle>
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
          label={t("academics.table header.program")}
          variant="outlined"
          fullWidth
          value={selectedPrograms}
          onChange={handleProgramChange}
          InputLabelProps={{
            shrink: selectedPrograms.length > 0,
          }}
          SelectProps={{multiple: true}}
        >
          <MenuItem value={null}>{t("academics.select programs")}</MenuItem>
          {programs?.map((item) => {
            const _name = i18n.language == "en" ? item.short_name_en + " - " + item.name_en : item.short_name_fr + " - " + item.name_fr;
            return (
              <MenuItem value={item.id} key={item.id}>
                {_name}
              </MenuItem>
            )
          })}
        </TextField>
        <TextField
          select
          size="small"
          name="role"
          label={t("academics.table header.semester")}
          variant="outlined"
          fullWidth
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          InputLabelProps={{
            shrink: semester,
          }}
        >
          <MenuItem value={null}>{t("academics.select semester")}</MenuItem>
          {semesters.map((item) => {
            return (
              <MenuItem value={item.id} key={item.id}>
                {item.name}
              </MenuItem>
            )
          }
          )}
        </TextField>
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
        <TextField
          select
          size="small"
          name="role"
          label={t("academics.table header.excluded academic year")}
          variant="outlined"
          fullWidth
          value={excludedAcademicYears}
          onChange={handleExcludedAcademicYearChange}
          InputLabelProps={{
            shrink: excludedAcademicYears.length > 0,
          }}
          SelectProps={{multiple: true}}
        >
          <MenuItem value={null}>{t("academics.select academic year")}</MenuItem>
          {academic_years?.map((item) => {
            return (
              <MenuItem value={item.id} key={item.id}>
                {item.name}
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

export default ProgramDialog;
