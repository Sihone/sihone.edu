import { AddCircle, Delete, Edit } from "@mui/icons-material";
import { Box, Paper, styled, Table, TableBody, TableCell, TableRow } from "@mui/material";
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
import ProgramDialog from "./ProgramDialog";

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

  const { data, saveData, updateData, deleteData } = useData("academic_programs", user.company_id);
  const { data: employees } = useData("employees", user.company_id);
  const { data: cycles } = useData("academic_cycles", user.company_id);
  const { data: students } = useData("students", user.company_id);
  const { t, i18n } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [program, setProgram] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // TABLE HEADER COLUMN LIST
  const columns = [
    { id: "name_en", align: "left", disablePadding: true, label: t("academics.table header.name") },
    { id: "cycle", align: "left", disablePadding: false, label: t("academics.table header.cycle") },
    { id: "students", align: "left", disablePadding: false, label: t("academics.table header.students") },
    { id: "price", align: "left", disablePadding: false, label: t("academics.table header.price") },
    { id: "head", align: "left", disablePadding: false, label: t("academics.table header.head") },
    { id: "edit", align: "center", disablePadding: false, label: t("academics.table header.actions") },
  ];

  const handleClose = () => {
    setOpen(false);
    setProgram(null);
  }

  const handleEdit = (row) => {
    setProgram(row);
    setOpen(true);
  }

  const handleDeleteClick = (row) => {
    setProgram(row);
    setConfirmDelete(true);
  }

  const handleDelete = () => {
    deleteData(program.id)
    .then(() => {
      enqueueSnackbar(t("academics.delete success"), { variant: "success" });
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(t("academics.delete error"), { variant: "error" });
    });
    setConfirmDelete(false);
    setProgram(null);
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

  return (
    <Container>
      <div className="breadcrumb" style={{display: "flex", justifyContent: "space-between"}}>
        <Breadcrumb
          routeSegments={[{ name: t("academics.programs") }]}
        />
      </div>

      <Paper sx={{ width: "100%", mb: 2 }}>
        
        <div style={{display: "flex", justifyContent: "space-between"}}>
         <TableToolbar title={t("academics.all programs")} numSelected={selected.length} />
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
                  const _cycle = cycles?.find((item) => item.id == row.cycle_id)
                  const numberOfStudents = students?.filter((item) => item.program_id == row.id).length;
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.name}
                      role="checkbox"
                    >
                      {
                        i18n.language === "en" ? (
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
                        { i18n.language === "en" ? _cycle?.long_name_en : _cycle?.long_name_fr }
                      </TableCell>

                      <TableCell align="left">{numberOfStudents}</TableCell>

                      <TableCell align="left">{row.price}</TableCell>

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
      <ProgramDialog
        open={open}
        onClose={handleClose}
        save={onSave}
        update={onUpdate}
        program={program}
        employees={employees}
        cycles={cycles}
        t={t}
      />
      <ConfirmationDialog
        open={confirmDelete}
        title={t("academics.delete program title")}
        text={t("academics.delete program content")}
        onConfirmDialogClose={() => setConfirmDelete(false)}
        onYesClick={() => handleDelete(program.id)}
      />
    </Container>
  );
};

export default AcademicsList;
