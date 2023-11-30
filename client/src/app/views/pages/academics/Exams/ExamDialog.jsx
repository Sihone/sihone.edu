import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import { useAuth } from 'app/hooks/useAuth';

const CourseDialog = ({ open, onClose, save, update, exam, t, i18n, employees, courses, modules, programs, cycles }) => {

  const { user } = useAuth();

  const [name_en, setNameEn] = useState('');
  const [name_fr, setNameFr] = useState('');
  const [employee, setEmployee] = useState(null);

  const [course, setCourse] = useState(null);
  const [module, setModule] = useState(null);
  const [program, setProgram] = useState(null);
  const [cycle, setCycle] = useState(null);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [duration, setDuration] = useState(null);
  const [total_mark, setTotalMark] = useState(null);

  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);


  useEffect(() => {
    if (open && exam) {
        const _employee = employees.find((item) => item.id == exam.employee_id);
        setNameEn(exam.name_en);
        setNameFr(exam.name_fr);
        setEmployee(_employee);

        const _course = courses.find((item) => item.id == exam.course_id);
        const _module = modules.find((item) => item.id == exam.module_id);
        const _program = programs.find((item) => item.id == exam.program_id);
        const _cycle = cycles.find((item) => item.id == exam.cycle_id);
        setCourse(_course);
        setModule(_module);
        setProgram(_program);
        setCycle(_cycle);

        setDate(exam.date);
        setDuration(exam.duration);
        setTotalMark(exam.total_mark);
    }
  }, [exam]);

  useEffect(() => {
    if (cycle) {
      const _programs = programs.filter((item) => item.cycle_id == cycle.id);
      setFilteredPrograms(_programs);
    }
  }, [cycle]);

  useEffect(() => {
    if (program) {
      const _courses = courses.filter((item) => JSON.parse(item.program_ids).includes(program.id) && !JSON.parse(item.exempted_academic_years).includes(user.currentAcademicYearId));
      setFilteredCourses(_courses);
    }
  }, [program]);

  useEffect(() => {
    if (course) {
      const _modules = modules.filter((item) => JSON.parse(item.course_ids).includes(course.id));
      setFilteredModules(_modules);
    }
  }, [course]);

  useEffect(() => {
    if (!open) {
        resetForm();
    }
  }, [open]);

  const handleSave = () => {
    if (exam) {
      update({
        id: exam.id,
        name_en,
        name_fr,
        course_id: course && course.id || null,
        module_id: module && module.id || null,
        program_id: program && program.id || null,
        cycle_id: cycle && cycle.id || null,
        employee_id: employee && employee.id || null,
        date,
        duration,
        total_mark,
        academic_year_id: user.currentAcademicYearId
      });
    } else {
        save({
            name_en,
            name_fr,
            course_id: course && course.id || null,
            module_id: module && module.id || null,
            program_id: program && program.id || null,
            cycle_id: cycle && cycle.id || null,
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
    return !name_en || !name_fr || !course ||  !program || !cycle || !employee || !date;
  }

  const resetForm = () => {
    setNameEn('');
    setNameFr('');
    setEmployee(null);

    setCourse(null);
    setModule(null);
    setProgram(null);
    setCycle(null);

    setDate(new Date().toISOString().slice(0, 10));
    setDuration(null);
    setTotalMark(null);
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  const handleCourseChange = (e) => {
    let _course = courses.find((item) => item.id == e.target.value);
    setCourse(_course);
    setModule(null);
  }

  const handleProgramChange = (e) => {
    let _program = programs.find((item) => item.id == e.target.value);
    setProgram(_program);
    setCourse(null);
    setModule(null);
  }

  const handleCycleChange = (e) => {
    let _cycle = cycles.find((item) => item.id == e.target.value);
    setCycle(_cycle);
    setProgram(null);
    setCourse(null);
    setModule(null);
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
          label={t("academics.table header.cycle")}
          variant="outlined"
          fullWidth
          value={cycle ? cycle.id : null}
          onChange={handleCycleChange}
          InputLabelProps={{
            shrink: !!cycle,
          }}
        >
          <MenuItem value={null}>{t("academics.select cycle")}</MenuItem>
          {cycles?.map((item) => {
            const _name = i18n.language == "en" ? item.long_name_en + " (" + item.short_name_en + ")" : item.name_fr + " (" + item.short_name_fr + ")";
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
          label={t("academics.table header.program")}
          variant="outlined"
          fullWidth
          value={program ? program.id : null}
          onChange={handleProgramChange}
          InputLabelProps={{
            shrink: !!program,
          }}
          disabled={!cycle}
        >
          <MenuItem value={null}>{t("academics.select program")}</MenuItem>
          {filteredPrograms?.map((item) => {
            const _name = i18n.language == "en" ? item.name_en : item.name_fr;
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
          label={t("academics.course")}
          variant="outlined"
          fullWidth
          value={course ? course.id : null}
          onChange={handleCourseChange}
          InputLabelProps={{
            shrink: !!course,
          }}
          disabled={!program}
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
          select
          size="small"
          name="role"
          label={t("academics.table header.module")}
          variant="outlined"
          fullWidth
          value={module ? module.id : null}
          onChange={(e) => setModule(modules.find((item) => item.id == e.target.value))}
          InputLabelProps={{
            shrink: !!module,
          }}
          disabled={!course}
        >
          <MenuItem value={null}>{t("academics.select module")}</MenuItem>
          {filteredModules?.map((item) => {
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
