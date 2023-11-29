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
import CourseDialog from "./CourseDialog";

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

  const { data, saveData, updateData, deleteData } = useData("academic_courses", user.company_id);
  const { data: employees } = useData("employees", user.company_id);
  const { data: programs } = useData("academic_programs", user.company_id);
  const { data: academic_years } = useData("academic_years", user.company_id);
  const { t, i18n } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [course, setCourse] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [program_ids_show, setProgramIdsShow] = useState(null);

  // TABLE HEADER COLUMN LIST
  const columns = [
    { id: "name", align: "left", disablePadding: true, label: t("academics.table header.name") },
    { id: "program", align: "left", disablePadding: false, label: t("academics.table header.program") },
    { id: "coefficient", align: "left", disablePadding: false, label: t("academics.table header.coefficient") },
    { id: "description", align: "left", disablePadding: false, label: t("academics.table header.description") },
    { id: "exluded_academic_year", align: "left", disablePadding: false, label: t("academics.table header.excluded academic year") },
    { id: "head", align: "left", disablePadding: false, label: t("academics.table header.course head") },
    { id: "edit", align: "center", disablePadding: false, label: t("academics.table header.actions") },
  ];

  const handleClose = () => {
    setOpen(false);
    setCourse(null);
  }

  const handleEdit = (row) => {
    setCourse(row);
    setOpen(true);
  }

  const handleDeleteClick = (row) => {
    setCourse(row);
    setConfirmDelete(true);
  }

  const handleDelete = () => {
    deleteData(course.id)
    .then(() => {
      enqueueSnackbar(t("academics.delete success"), { variant: "success" });
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(t("academics.delete error"), { variant: "error" });
    });
    setConfirmDelete(false);
    setCourse(null);
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

  const handleClosePrograms = () => {
    setAnchorEl(null);
  };

  const openShowPrograms = Boolean(anchorEl);
  const showProgramsId = openShowPrograms ? 'simple-popover' : undefined;

  return (
    <Container>
      <div className="breadcrumb" style={{display: "flex", justifyContent: "space-between"}}>
        <Breadcrumb
          routeSegments={[{ name: t("academics.courses") }]}
        />
      </div>

      <Paper sx={{ width: "100%", mb: 2 }}>
        
        <div style={{display: "flex", justifyContent: "space-between"}}>
         <TableToolbar title={t("academics.all courses")} numSelected={selected.length} />
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
                  const program_ids = JSON.parse(row.program_ids || '[]');
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

                      <TableCell align="left">{row.coefficient}</TableCell>

                      <TableCell align="left">{row.description}</TableCell>

                      <TableCell align="left">
                        {
                          excluded_academic_years.length > 0 ? (
                            excluded_academic_years.map((academic_year) => (
                              <Chip color="error" label={academic_years?.find((item) => item.id == academic_year)?.name} />
                            ))
                          ) : (
                            <FlexBox>
                              {t("academics.no excluded academic year")}
                            </FlexBox>
                          )
                        }
                      </TableCell>

                      <TableCell align="left">
                        {employees?.find((item) => item.id == row.employee_id)?.first_name + " " + employees?.find((item) => item.id == row.employee_id)?.last_name}
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
      <CourseDialog
        open={open}
        onClose={handleClose}
        save={onSave}
        update={onUpdate}
        course={course}
        employees={employees}
        programs={programs}
        academic_years={academic_years}
        t={t}
      />
      <ConfirmationDialog
        open={confirmDelete}
        title={t("academics.delete course title")}
        text={t("academics.delete course content")}
        onConfirmDialogClose={() => setConfirmDelete(false)}
        onYesClick={() => handleDelete(course.id)}
      />
      <Popover
        id={showProgramsId}
        open={openShowPrograms}
        anchorEl={anchorEl}
        onClose={handleClosePrograms}
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
