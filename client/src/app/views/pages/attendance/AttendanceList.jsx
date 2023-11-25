import { AddCircle, Delete, Edit, TrendingFlat } from "@mui/icons-material";
import { Box, Paper, styled, Table, TableBody, TableCell, TableRow } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { Breadcrumb, ConfirmationDialog } from "app/components";
import { TableHead, TableToolbar } from "app/components/data-table";
import { getComparator, stableSort } from "app/components/data-table/utils";
import { H5 } from "app/components/Typography";
import useTable from "app/hooks/useTable";
import useData from "app/hooks/useData";
import useAuth from "app/hooks/useAuth";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import AttendanceDialog from "./AttendanceDialog";
import { useSnackbar } from "notistack";

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

const AttendanceList = () => {
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

  const { data, saveData, updateData, deleteData } = useData("attendance", user.company_id);
  const { data: employees } = useData("employees", user.company_id);
  const { t } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [attendance, setAttendance] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // TABLE HEADER COLUMN LIST
  const columns = [
    { id: "employee", align: "left", disablePadding: true, label: t("attendance.table header.employee") },
    { id: "date", align: "left", disablePadding: false, label: t("attendance.table header.date") },
    { id: "clock_in", align: "left", disablePadding: false, label: t("attendance.table header.clock in") },
    { id: "clock_out", align: "left", disablePadding: false, label: t("attendance.table header.clock out") },
    { id: "total", align: "left", disablePadding: false, label: t("attendance.table header.total") },
    { id: "edit", align: "center", disablePadding: false, label: t("attendance.table header.actions") },
  ];

  useEffect(() => {
    if (data) {
      const _data = data.map((item) => ({
        id: item.id,
        name: item.first_name + " " + item.last_name,
        attendance_date: item.attendance_date,
        clock_in: item.clock_in,
        clock_out: item.clock_out,
        total: item.total_time / 60 / 60,
        employee_id: item.employees_id
      }));
      setFilteredData(_data.reverse());
    }
  }, [data]);

  const handleClose = () => {
    setOpen(false);
    setAttendance(null);
  }

  const handleEdit = (row) => {
    setAttendance(row);
    setOpen(true);
  }

  const handleDeleteClick = (row) => {
    setAttendance(row);
    setConfirmDelete(true);
  }

  const handleDelete = (id) => {
    deleteData(id)
    .then(() => {
      enqueueSnackbar(t("attendance.delete success"), { variant: "success" });
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(t("attendance.delete error"), { variant: "error" });
    });
    setConfirmDelete(false);
    setAttendance(null);
  }

  return (
    <Container>
      <div className="breadcrumb" style={{display: "flex", justifyContent: "space-between"}}>
        <Breadcrumb
          routeSegments={[{ name: t("attendance.title") }]}
        />
        <div>
          <IconButton onClick={() => setOpen(true)}>
            <AddCircle />
          </IconButton>
        </div>
      </div>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableToolbar title={t("attendance.table title")} numSelected={selected.length} />

        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead
              order={order}
              orderBy={orderBy}
              headCells={columns}
              rowCount={filteredData.length}
              onRequestSort={handleRequestSort}
              showSelect={false}
            />

            <TableBody>
              {stableSort(filteredData, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isItemSelected = isSelected(row.name);

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.name}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                    >
                      <TableCell component="th" scope="row" padding="none" style={{paddingLeft: "16px"}}>
                        <FlexBox gap={1}>
                          <H5 fontSize={15}>{row.name}</H5>
                        </FlexBox>
                      </TableCell>

                      <TableCell align="left">{row.attendance_date}</TableCell>

                      <TableCell align="left">{row.clock_in}</TableCell>

                      <TableCell align="left">{row.clock_out}</TableCell>

                      <TableCell align="left">{row.total}</TableCell>

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
          count={filteredData.length}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <AttendanceDialog
        open={open}
        onClose={handleClose}
        employees={employees}
        save={saveData}
        update={updateData}
        attendance={attendance}
        t={t}
      />
      <ConfirmationDialog
        open={confirmDelete}
        title={t("attendance.delete dialog title")}
        text={t("attendance.delete dialog content")}
        onConfirmDialogClose={() => setConfirmDelete(false)}
        onYesClick={() => handleDelete(attendance.id)}
      />
    </Container>
  );
};

export default AttendanceList;
