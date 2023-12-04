import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import { useAuth } from 'app/hooks/useAuth';

const CourseDialog = ({ open, onClose, save, update, exam, t, i18n, employees, courses }) => {

  const { user } = useAuth();

  const [name_en, setNameEn] = useState('');
  const [name_fr, setNameFr] = useState('');
  const [employee, setEmployee] = useState(null);

  const [course, setCourse] = useState(null);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [duration, setDuration] = useState(null);
  const [total_mark, setTotalMark] = useState(20);

  const [filteredCourses, setFilteredCourses] = useState(courses);


  useEffect(() => {
    if (open && exam) {
        const _employee = employees.find((item) => item.id == exam.employee_id);
        setNameEn(exam.name_en);
        setNameFr(exam.name_fr);
        setEmployee(_employee);

        const _course = courses.find((item) => item.id == exam.course_id);
        setCourse(_course);

        setDate(exam.date);
        setDuration(exam.duration);
        setTotalMark(exam.total_mark || null);
    }
  }, [exam]);

  useEffect(() => {
    if (!open) {
        resetForm();
    }
  }, [open]);

  useEffect(() => {
    if (courses) {
      setFilteredCourses(courses);
    }
  }, [courses]);

  const handleSave = () => {
    if (exam) {
      update({
        id: exam.id,
        name_en,
        name_fr,
        course_id: course && course.id || null,
        module_id: null,
        program_id: null,
        cycle_id: null,
        employee_id: employee && employee.id || null,
        date,
        duration,
        total_mark,
        academic_year_id: user.currentAcademicYearId,
        grades: exam.grades
      });
    } else {
        save({
            name_en,
            name_fr,
            course_id: course && course.id || null,
            module_id: null,
            program_id: null,
            cycle_id: null,
            employee_id: employee && employee.id || null,
            date,
            duration,
            total_mark,
            academic_year_id: user.currentAcademicYearId
        });
    }
    resetForm();
    onClose();
  }

  const disableSubmitButton = () => {
    return !name_en || !name_fr || !course || !employee || !date;
  }

  const resetForm = () => {
    setNameEn('');
    setNameFr('');
    setEmployee(null);

    setCourse(null);

    setDate(new Date().toISOString().slice(0, 10));
    setDuration(null);
    setTotalMark(20);
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  const handleCourseChange = (e) => {
    let _course = courses.find((item) => item.id == e.target.value);
    setCourse(_course);
  }

  const handlEmployeeChange = (e) => {
    const employee = employees.find((item) => item.id == e.target.value);
    setEmployee(employee);
  }

  return (
    <Dialog open={open} onClose={handleClose} minWidth="md">
      <DialogTitle>{exam ? t("academics.dialog exam title edit") : t("academics.dialog exam title")}</DialogTitle>
      <DialogContent style={{display: "flex", flexDirection: "column", gap: "16px"}}>
        <TextField
          select
          autoFocus
          size="small"
          name="role"
          label={t("academics.table header.examiner")}
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
          label={t("academics.course")}
          variant="outlined"
          fullWidth
          value={course ? course.id : null}
          onChange={handleCourseChange}
          InputLabelProps={{
            shrink: !!course,
          }}
        >
          <MenuItem value={null}>{t("academics.select course")}</MenuItem>
          {filteredCourses?.map((item) => {
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
          id="name_fr"
          label={t("academics.exam name fr")}
          type="text"
          fullWidth
          value={name_fr}
          onChange={(e) => setNameFr(e.target.value)}
        />
        <TextField
          margin="dense"
          id="name_en"
          label={t("academics.exam name en")}
          type="text"
          sx={{ minWidth: 388 }}
          value={name_en}
          onChange={(e) => setNameEn(e.target.value)}
        />
        <TextField
          label={t("academics.table header.exam date")}
          value={date}
          onChange={(event) => setDate(event.target.value)}
          fullWidth
          type='date'
          InputLabelProps={{ shrink: !!date }}
        />
        <TextField
          label={t("academics.exam duration")}
          value={duration}
          onChange={(event) => setDuration(event.target.value)}
          fullWidth
          type='number'
          InputLabelProps={{ shrink: !!duration }}
        />
        <TextField
          label={t("academics.table header.exam total")}
          value={total_mark}
          onChange={(event) => setTotalMark(event.target.value)}
          fullWidth
          type='number'
          InputLabelProps={{ shrink: !!total_mark }}
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

export default CourseDialog;
