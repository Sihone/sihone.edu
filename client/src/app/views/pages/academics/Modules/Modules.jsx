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
import { useState } from "react";
import { useSnackbar } from "notistack";
import ModuleDialog from "./ModuleDialog";

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

  const { data, saveData, updateData, deleteData } = useData("academic_modules", user.company_id);
  const { data: employees } = useData("employees", user.company_id);
  const { data: courses } = useData("academic_courses", user.company_id);
  const { t, i18n } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [module, setModule] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [course_ids_show, setCourseIdsShow] = useState(null);

  // TABLE HEADER COLUMN LIST
  const columns = [
    { id: "name", align: "left", disablePadding: true, label: t("academics.table header.name") },
    { id: "course", align: "left", disablePadding: false, label: t("academics.table header.course") },
    { id: "coefficient", align: "left", disablePadding: false, label: t("academics.table header.coefficient") },
    { id: "description", align: "left", disablePadding: false, label: t("academics.table header.description") },
    { id: "head", align: "left", disablePadding: false, label: t("academics.table header.module head") },
    { id: "edit", align: "center", disablePadding: false, label: t("academics.table header.actions") },
  ];

  const handleClose = () => {
    setOpen(false);
    setModule(null);
  }

  const handleEdit = (row) => {
    setModule(row);
    setOpen(true);
  }

  const handleDeleteClick = (row) => {
    setModule(row);
    setConfirmDelete(true);
  }

  const handleDelete = () => {
    deleteData(module.id)
    .then(() => {
      enqueueSnackbar(t("academics.delete success"), { variant: "success" });
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(t("academics.delete error"), { variant: "error" });
    });
    setConfirmDelete(false);
    setModule(null);
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
          routeSegments={[{ name: t("academics.modules") }]}
        />
      </div>

      <Paper sx={{ width: "100%", mb: 2 }}>
        
        <div style={{display: "flex", justifyContent: "space-between"}}>
         <TableToolbar title={t("academics.all modules")} numSelected={selected.length} />
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
                  const course_ids = JSON.parse(row.course_ids || '[]');
                  const excluded_academic_years = JSON.parse(row.exempted_academic_years || '[]');
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

                      <TableCell align="left">
                        {
                          course_ids.length > 0 ? (
                            <FlexBox>
                              <Button onClick={(event) => handleShowCourses(event, course_ids)}>
                                {course_ids.length} {t("academics.courses")}
                              </Button>
                            </FlexBox>
                          ) : (
                            <FlexBox>
                              {t("academics.no course")}
                            </FlexBox>
                          )
                        }
                      </TableCell>

                      <TableCell align="left">{row.coefficient}</TableCell>

                      <TableCell align="left">{row.description || "-"}</TableCell>

                      <TableCell align="left">
                        {employees?.find((item) => item.id == row.employee_id)?.first_name || "-" + " " + (employees?.find((item) => item.id == row.employee_id)?.last_name || "-")}
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
      <ModuleDialog
        open={open}
        onClose={handleClose}
        save={onSave}
        update={onUpdate}
        module={module}
        employees={employees}
        courses={courses}
        t={t}
        i18n={i18n}
      />
      <ConfirmationDialog
        open={confirmDelete}
        title={t("academics.delete module title")}
        text={t("academics.delete module content")}
        onConfirmDialogClose={() => setConfirmDelete(false)}
        onYesClick={() => handleDelete(module.id)}
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
