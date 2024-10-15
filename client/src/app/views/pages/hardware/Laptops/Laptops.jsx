import { AddCircle, Delete, Edit } from "@mui/icons-material";
import { Box, Link, Paper, styled, Table, TableBody, TableCell, TableRow } from "@mui/material";
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
import LaptopDialog from "./LaptopDialog";
import { useNavigate } from "react-router-dom";

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

const LaptopList = () => {
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

  const { data, saveData, updateData, deleteData } = useData("laptops", user.company_id);
  const { data: students } = useData("students", user.company_id);
  const { data: employees } = useData("employees", user.company_id);
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [laptop, setLaptop] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // TABLE HEADER COLUMN LIST
  const columns = [
    { id: "make_model", align: "left", disablePadding: true, label: t("hardware.laptop.make model") },
    { id: "serial_number", align: "left", disablePadding: false, label: t("hardware.laptop.serial") },
    { id: "status", align: "left", disablePadding: false, label: t("hardware.laptop.status") },
    { id: "owner", align: "left", disablePadding: false, label: t("hardware.laptop.owner") },
    { id: "edit", align: "center", disablePadding: false, label: t("hardware.laptop.actions") },
  ];

  const handleClose = () => {
    setOpen(false);
    setLaptop(null);
  }

  const handleEdit = (row) => {
    setLaptop(row);
    setOpen(true);
  }

  const handleDeleteClick = (row) => {
    setLaptop(row);
    setConfirmDelete(true);
  }

  const handleDelete = () => {
    deleteData(laptop.id)
    .then(() => {
      enqueueSnackbar(t("hardware.delete success"), { variant: "success" });
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(t("hardware.delete error"), { variant: "error" });
    });
    setConfirmDelete(false);
    setLaptop(null);
  }

  const onSave = async (data) => {
    await saveData(data)
    .then((response) => {
      enqueueSnackbar(t("hardware.save success"), { variant: "success" });
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(t("hardware.save error"), { variant: "error" });
    });
    setOpen(false);
  }

  const onUpdate = async (data) => {
    await updateData(data)
    .then((response) => {
      enqueueSnackbar(t("hardware.update success"), { variant: "success" });
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(t("hardware.update error"), { variant: "error" });
    });
    setOpen(false);
  }

  return (
    <Container>
      <div className="breadcrumb" style={{display: "flex", justifyContent: "space-between"}}>
        <Breadcrumb
          routeSegments={[{ name: t("hardware.laptop.title") }]}
        />
      </div>

      <Paper sx={{ width: "100%", mb: 2 }}>
        
        <div style={{display: "flex", justifyContent: "space-between"}}>
         <TableToolbar title={t("hardware.laptop.all")} numSelected={selected.length} />
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
                  let ownerName = null;
                  const student = students.find(student => student.laptop_id === row?.id);
                  if (student) {
                    ownerName = <Link onClick={() => navigate("/students/" + student.id)} style={{cursor: "pointer"}}>{student.first_name + " " + student.last_name}</Link>;
                  }
                  const employee = employees.find(employee => employee.laptop_id === row?.id);
                  if (employee) {
                    ownerName = <Link onClick={() => navigate("/employees/" + employee.id)} style={{cursor: "pointer"}}>{employee.first_name + " " + employee.last_name}</Link>;
                  }
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.id}
                      role="checkbox"
                    >
                      <TableCell align="left" style={{paddingLeft: "16px"}}>
                        {row.make_model}
                      </TableCell>

                      <TableCell align="left">
                        {row.serial_number}
                      </TableCell>
                      
                      <TableCell align="left">
                        {row.status ? t("hardware.laptop.active") : t("hardware.laptop.inactive")}
                      </TableCell>

                      <TableCell align="left">
                        {ownerName}
                      </TableCell>

                      <TableCell align="center">
                        <>
                          <IconButton onClick={() => handleEdit(row)}>
                            <Edit />
                          </IconButton>
                          {!ownerName &&
                          <IconButton onClick={() => handleDeleteClick(row)}>
                            <Delete />
                          </IconButton>}
                        </>
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
      <LaptopDialog
        open={open}
        onClose={handleClose}
        save={onSave}
        update={onUpdate}
        laptop={laptop}
        t={t}
      />
      <ConfirmationDialog
        open={confirmDelete}
        title={t("hardware.laptop.delete title")}
        text={t("hardware.laptop.delete content")}
        onConfirmDialogClose={() => setConfirmDelete(false)}
        onYesClick={() => handleDelete(laptop.id)}
      />
    </Container>
  );
};

export default LaptopList;
