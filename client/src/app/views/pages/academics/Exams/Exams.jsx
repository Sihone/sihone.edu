import { AddCircle, Delete, Edit, Grading, HistoryEdu } from "@mui/icons-material";
import { Box, Button, Chip, Paper, Popover, styled, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { Breadcrumb, ConfirmationDialog } from "app/components";
import { TableHead, TableToolbar } from "app/components/data-table";
import { getComparator, stableSort } from "app/components/data-table/utils";
import useTable from "app/hooks/useTable";
import useData from "app/hooks/useData";
import { useAuth } from "app/hooks/useAuth";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import ExamDialog from "./ExamDialog";
import GradingDialog from "./Grading";

// styled components
const FlexBox = styled(Box)({ display: "flex", alignItems: "center" });

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: {
    margin: "16px",
  },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const AcademicsList = () => {
  const {
    page,
    order,
    orderBy,
    selected,
    rowsPerPage,

    isSelected,
    handleChangePage,
    handleRequestSort,
    handleChangeRowsPerPage,
  } = useTable({ defaultOrderBy: "name" });

  const { user } = useAuth();

  const { data, saveData, updateData, deleteData } = useData("academic_exams", user.company_id, user.currentAcademicYearId);
  const { data: employees } = useData("employees", user.company_id);
  const { data: courses } = useData("academic_courses", user.company_id);
  const { data: students } = useData("students", user.company_id);
  const { data: programs } = useData("academic_programs", user.company_id);

  const { t, i18n } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [exam, setExam] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [program_ids_show, setProgramIdsShow] = useState(null);
  const [grading, setGrading] = useState(null);
  const [gradingStudents, setGradingStudents] = useState(null);

  // TABLE HEADER COLUMN LIST
  const columns = [
    { id: "name", align: "left", disablePadding: true, label: t("academics.table header.name") },
    { id: "course", align: "left", disablePadding: false, label: t("academics.course")},
    { id: "program", align: "left", disablePadding: false, label: t("academics.table header.programs") },
    { id: "date", align: "left", disablePadding: false, label: t("academics.table header.exam date")},
    { id: "duration", align: "left", disablePadding: false, label: t("academics.table header.exam duration")},
    { id: "average", align: "left", disablePadding: false, label: t("academics.table header.class average")},
    { id: 'graded', align: 'left', disablePadding: false, label: t("academics.table header.graded")},
    { id: "examiner", align: "left", disablePadding: false, label: t("academics.table header.examiner")},
    { id: "edit", align: "center", disablePadding: false, label: t("academics.table header.actions") },
  ];

  const handleClose = () => {
    setOpen(false);
    setExam(null);
  }

  const handleEdit = (row) => {
    setExam(row);
    setOpen(true);
  }

  const handleDeleteClick = (row) => {
    setExam(row);
    setConfirmDelete(true);
  }

  const handleDelete = () => {
    deleteData(exam.id)
    .then(() => {
      enqueueSnackbar(t("academics.delete success"), { variant: "success" });
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(t("academics.delete error"), { variant: "error" });
    });
    setConfirmDelete(false);
    setExam(null);
  }

  const onSave = async (data) => {
    await saveData(data)
    .then((response) => {
      enqueueSnackbar(t("academics.save success"), { variant: "success" });
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(t("academics.save error"), { variant: "error" });
    });
    setOpen(false);
  }

  const onUpdate = async (data) => {
    await updateData(data)
    .then((response) => {
      enqueueSnackbar(t("academics.update success"), { variant: "success" });
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(t("academics.update error"), { variant: "error" });
    });
    setOpen(false);
  }

  const handleShowPrograms = (event, program_ids_show) => {
    setProgramIdsShow(program_ids_show);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseCourses = () => {
    setAnchorEl(null);
  };

  const handleGrading = (row) => {
    setGrading(row);
  };

  const handleCloseGrading = () => {
    setGrading(null);
    setGradingStudents(null);
  };

  useEffect(() => {
    if (grading) {
      const course = courses?.find((item) => item.id == grading.course_id);
      const program_ids = JSON.parse(course?.program_ids || '[]');
      const _students = students?.filter((item) => program_ids?.includes(item.program_id));
      setGradingStudents(_students);
    }
  }, [grading]);

  const openShowCourses = Boolean(anchorEl);
  const showCoursesId = openShowCourses ? 'simple-popover' : undefined;

  return (
    <Container>
      <div className="breadcrumb" style={{display: "flex", justifyContent: "space-between"}}>
        <Breadcrumb
          routeSegments={[{ name: t("academics.exams") }]}
        />
      </div>

      <Paper sx={{ width: "100%", mb: 2 }}>
        
        <div style={{display: "flex", justifyContent: "space-between"}}>
         <TableToolbar title={t("academics.all exams")} numSelected={selected.length} />
          <IconButton onClick={() => setOpen(true)} style={{padding: "8px 20px"}}>
            <AddCircle />
          </IconButton>
        </div>

        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead
              order={order}
              orderBy={orderBy}
              headCells={columns}
              rowCount={data.length}
              onRequestSort={handleRequestSort}
              showSelect={false}
            />

            <TableBody>
              {stableSort(data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const course = courses?.find((item) => item.id == row.course_id);
                  const course_name = i18n.language == "en" ? course?.name_en : course?.name_fr;
                  const _grades = JSON.parse(row.grades || '[]');
                  const program_ids = JSON.parse(course?.program_ids || '[]');
                  const _students = students?.filter((item) => program_ids?.includes(item.program_id));
                  const _graded = _students?.filter((item) => _grades[item.id] != undefined && _grades[item.id] != null && _grades[item.id] != "");
                  const classAverage = _graded?.reduce((acc, item) => acc + parseInt(_grades[item.id]), 0) / _graded?.length;
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.name}
                      role="checkbox"
                    >
                      {
                        i18n.language == "en" ? (
                          <TableCell align="left" style={{paddingLeft: "16px"}}>
                            {row.name_en}
                          </TableCell>
                        ) : (
                          <TableCell align="left" style={{paddingLeft: "16px"}}>
                            {row.name_fr}
                          </TableCell>
                        )
                      }

                      <TableCell align="left">{course_name}</TableCell>

                      <TableCell align="left">
                        {
                          program_ids.length > 0 ? (
                            <FlexBox>
                              <Button onClick={(event) => handleShowPrograms(event, program_ids)}>
                                {program_ids.length} {t("academics.programs")}
                              </Button>
                            </FlexBox>
                          ) : (
                            <FlexBox>
                              {t("academics.no program")}
                            </FlexBox>
                          )
                        }
                      </TableCell>

                      <TableCell align="left">{row.date}</TableCell>

                      <TableCell align="left">{row.duration || 0} mins</TableCell>

                      <TableCell align="left">{classAverage ? classAverage.toFixed(2) : "-"} / {row.total_mark || "-"}</TableCell>

                      <TableCell align="left">{ t("academics.graded", { num: _graded.length, count: _students.length}) }</TableCell>

                      <TableCell align="left">
                        {
                          employees?.find((item) => item.id == row.employee_id)?.first_name + " " + employees?.find((item) => item.id == row.employee_id)?.last_name
                        }
                      </TableCell>

                      <TableCell align="center">
                        <IconButton onClick={() => handleGrading(row)}>
                          <HistoryEdu />
                        </IconButton>
                        <IconButton onClick={() => handleEdit(row)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(row)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          count={data.length}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <ExamDialog
        open={open}
        onClose={handleClose}
        save={onSave}
        update={onUpdate}
        exam={exam}
        employees={employees}
        courses={courses.filter((item) => !JSON.parse(item.exempted_academic_years).includes(user.currentAcademicYearId))}
        t={t}
        i18n={i18n}
      />
      <GradingDialog
        open={grading}
        onClose={handleCloseGrading}
        exam={grading}
        t={t}
        i18n={i18n}
        students={gradingStudents || []}
        updateData={onUpdate}
      />
      <ConfirmationDialog
        open={confirmDelete}
        title={t("academics.delete exam title")}
        text={t("academics.delete exam content")}
        onConfirmDialogClose={() => setConfirmDelete(false)}
        onYesClick={() => handleDelete(exam.id)}
      />
      <Popover
        id={showCoursesId}
        open={openShowCourses}
        anchorEl={anchorEl}
        onClose={handleCloseCourses}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2 }}>
          {
            program_ids_show?.map((program_id) => {
              const _program = programs?.find((item) => item.id == program_id);
              return (
                <Typography key={program_id} sx={{ mb: 1.5 }}>
                  {
                    i18n.language == "en" ? (
                      _program?.short_name_en + " - " + _program?.name_en
                    ) : (
                      _program?.short_name_fr + " - " + _program?.name_fr
                    )
                  }
                </Typography>
              )
            })
          }
        </Box>

      </Popover>
    </Container>
  );
};

export default AcademicsList;
