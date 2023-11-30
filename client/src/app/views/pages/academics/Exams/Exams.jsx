import { AddCircle, Delete, Edit } from "@mui/icons-material";
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

  const { data, saveData, updateData, deleteData } = useData("academic_exams", user.company_id);
  const { data: employees } = useData("employees", user.company_id);
  const { data: courses } = useData("academic_courses", user.company_id);
  const { data: modules } = useData("academic_modules", user.company_id);
  const { data: programs } = useData("academic_programs", user.company_id);
  const { data: cycles } = useData("academic_cycles", user.company_id);

  const { t, i18n } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [exam, setExam] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [course_ids_show, setCourseIdsShow] = useState(null);

  // TABLE HEADER COLUMN LIST
  const columns = [
    { id: "name", align: "left", disablePadding: true, label: t("academics.table header.name") },
    { id: "program", align: "left", disablePadding: false, label: t("academics.table header.program") },
    { id: "course", align: "left", disablePadding: false, label: t("academics.course")},
    { id: "module", align: "left", disablePadding: false, label: t("academics.table header.module")},
    { id: "date", align: "left", disablePadding: false, label: t("academics.table header.exam date")},
    { id: "duration", align: "left", disablePadding: false, label: t("academics.table header.exam duration")},
    { id: "total", align: "left", disablePadding: false, label: t("academics.table header.exam total")},
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

  const handleShowCourses = (event, course_ids_show) => {
    setCourseIdsShow(course_ids_show);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseCourses = () => {
    setAnchorEl(null);
  };

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
                  const program_name = i18n.language == "en" ? programs?.find((item) => item.id == row.program_id)?.name_en : programs?.find((item) => item.id == row.program_id)?.name_fr;
                  const course_name = i18n.language == "en" ? courses?.find((item) => item.id == row.course_id)?.name_en : courses?.find((item) => item.id == row.course_id)?.name_fr;
                  const module_name = i18n.language == "en" ? modules?.find((item) => item.id == row.module_id)?.name_en : modules?.find((item) => item.id == row.module_id)?.name_fr;
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

                      <TableCell align="left">{program_name}</TableCell>

                      <TableCell align="left">{course_name}</TableCell>

                      <TableCell align="left">{module_name}</TableCell>

                      <TableCell align="left">{row.date}</TableCell>

                      <TableCell align="left">{row.duration || 0} mins</TableCell>

                      <TableCell align="left">{row.total_mark}</TableCell>

                      <TableCell align="left">{ t("academics.graded", { num: 8, count: 10}) }</TableCell>

                      <TableCell align="left">
                        {
                          employees?.find((item) => item.id == row.employee_id)?.first_name + " " + employees?.find((item) => item.id == row.employee_id)?.last_name
                        }
                      </TableCell>

                      <TableCell align="center">
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
        courses={courses}
        modules={modules}
        programs={programs}
        cycles={cycles}
        t={t}
        i18n={i18n}
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
            course_ids_show?.map((course_id) => {
              const _course = courses?.find((item) => item.id == course_id);
              return (
                <Typography key={course_id} sx={{ mb: 1.5 }}>
                  {
                    i18n.language == "en" ? (
                      _course?.name_en
                    ) : (
                      _course?.name_fr
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
