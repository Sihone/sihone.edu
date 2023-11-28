import { Delete, Edit, Money } from "@mui/icons-material";
import { Chip, Box, Paper, styled, Table, TableBody, TableCell, TableRow, TextField, Autocomplete } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { Breadcrumb, ConfirmationDialog } from "app/components";
import { TableHead, TableToolbar } from "app/components/data-table";
import { H5 } from "app/components/Typography";
import useTable from "app/hooks/useTable";
import useData from "app/hooks/useData";
import { useAuth } from "app/hooks/useAuth";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { numberWithCommas } from "app/utils/utils";

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

const Payroll = () => {
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

  const { data: attendances } = useData("attendance", user.company_id);
  const { data: employees } = useData("employees", user.company_id);
  const { data: payrolls, deleteData, saveData, updateData  } = useData("payroll", user.company_id);
  const { t } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();

  const [pay, setPay] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [payroll, setPayroll] = useState(null);
  const [pay_date, setPayDate] = useState(new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate());

  const [filteredEmployees, setFilteredEmployees] = useState();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedMonthYear, setSelectedMonthYear] = useState(new Date().getFullYear() + "-" + (new Date().getMonth() + 1));

  useEffect(() => {
    if (selectedEmployeeId) {
      const _data = employees.filter((item) => item.id === selectedEmployeeId);
      setFilteredEmployees(_data);
    } else {
      setFilteredEmployees(employees);
    }
  }, [selectedEmployeeId, employees]);

  // TABLE HEADER COLUMN LIST
  const columns = [
    { id: "employee", align: "left", disablePadding: true, label: t("payroll.table header.employee") },
    { id: "pay_period", align: "left", disablePadding: false, label: t("payroll.table header.pay period") },
    { id: "base_salary", align: "left", disablePadding: false, label: t("payroll.table header.basic salary") },
    { id: "hourly_salary", align: "left", disablePadding: false, label: t("payroll.table header.hourly salary") },
    { id: "total", align: "left", disablePadding: false, label: t("payroll.table header.total") },
    { id: "status", align: "left", disablePadding: false, label: t("payroll.table header.status") },
    { id: "edit", align: "center", disablePadding: false, label: t("payroll.table header.actions") },
  ];

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmDelete(true);
  }

  const handlePay = (data) => {
    setPayroll(data);
    setPay(true);
  }

  const handleDelete = () => {
    deleteData(deleteId) 
    .then(() => {
      enqueueSnackbar(t("payroll.delete success"), { variant: "success" });
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(t("payroll.delete error"), { variant: "error" });
    });
    setConfirmDelete(false);
    setDeleteId(null);
  }

  const handlePayroll = () => {
    saveData({
      ...payroll,
      pay_date: pay_date,
    })
    .then(() => {
      enqueueSnackbar(t("payroll.pay success"), { variant: "success" });
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(t("payroll.pay error"), { variant: "error" });
    });
    setPay(false);
    setPayroll(null);
  }

  const employeesOptions = [
    {id: null, label: t("payroll.table filter all")},
    ...employees?.map((employee) => ({...employee, label: employee.first_name + " " + employee.last_name}))
  ];

  const payContent = (
    <>
      <p>{t("payroll.pay dialog content")}</p>
      <TextField
        fullWidth
        label={t("payroll.pay dialog date")}
        value={pay_date}
        onChange={(e) => setPayDate(e.target.value)}
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
      />
    </>
  );

  return (
    <Container>
      <div className="breadcrumb" style={{display: "flex", justifyContent: "space-between"}}>
        <Breadcrumb
          routeSegments={[{ name: t("payroll.title") }]}
        />
      </div>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer style={{display: "flex", gap: "16px", padding: "32px 16px"}}>
          <Autocomplete
              disablePortal
              id="combo-box-demo"
              fullWidth
              options={employeesOptions}
              renderInput={(params) => <TextField {...params} label={t("attendance.table header.employee")} />}
              onChange={(event, value) => setSelectedEmployeeId(value ? value.id : null)}
              value={employeesOptions.find((item) => item.id === selectedEmployeeId)}
          />
          <TextField
            fullWidth
            label={t("payroll.table year month")}
            value={selectedMonthYear}
            onChange={(e) => setSelectedMonthYear(e.target.value)}
            type="month"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </TableContainer>

      </Paper>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableToolbar title={t("payroll.table title")} numSelected={selected.length} />

        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead
              order={order}
              orderBy={orderBy}
              headCells={columns}
              rowCount={filteredEmployees?.length} 
              onRequestSort={handleRequestSort}
              showSelect={false}
            />

            <TableBody>
              {filteredEmployees?.map((row) => {
                  const _attendances = attendances?.filter((item) => item.employees_id === row.id);
                  const numberOfHours = attendances?.filter((item) => item.employees_id === row.id && item.attendance_date.includes(selectedMonthYear)).reduce((a, b) => a + b.total_time, 0) / 60 / 60;
                  const name = row.first_name + " " + row.last_name;
                  const pay_period = row.pay_period;
                  const base_salary = row.base_salary;
                  const hourly_salary = row.hourly_rate * numberOfHours;
                  const total = base_salary + hourly_salary;
                  const existingPayroll = payrolls?.filter((item) => item.employees_id === row.id && item.pay_period === selectedMonthYear);
                  const paid = existingPayroll.length === 1 ? true : false;

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={name}
                      role="checkbox"
                    >
                      <TableCell component="th" scope="row" padding="none" style={{paddingLeft: "16px"}}>
                        <FlexBox gap={1}>
                          <H5 fontSize={15}>{name}</H5>
                        </FlexBox>
                      </TableCell>

                      <TableCell align="left">{pay_period}</TableCell>

                      <TableCell align="left">{numberWithCommas(base_salary) + " " + user.currency}</TableCell>

                      <TableCell align="left">{numberWithCommas(hourly_salary) + " " + user.currency}</TableCell>

                      <TableCell align="left">{numberWithCommas(total) + " " + user.currency}</TableCell>

                      <TableCell align="left">{paid ? <Chip color="success" label={t("payroll.paid")} /> : <Chip color="error" label={t("payroll.unpaid")} />}</TableCell>

                      <TableCell align="center">
                        {
                          paid ? (
                            <IconButton onClick={() => handleDeleteClick(existingPayroll[0].id)}>
                              <Delete />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() => handlePay({
                                employee_id: row.id,
                                pay_period: selectedMonthYear,
                                base_salary: base_salary,
                                total_hours: numberOfHours,
                                hourly_rate: row.hourly_rate,
                                total_salary: total,
                                company_id: user.company_id,
                              })}
                            >
                              <Money />
                            </IconButton>
                          )
                        }
                        
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
          count={filteredEmployees?.length}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <ConfirmationDialog
        open={confirmDelete}
        title={t("payroll.delete dialog title")}
        text={t("payroll.delete dialog content")}
        onConfirmDialogClose={() => setConfirmDelete(false)}
        onYesClick={() => handleDelete()}
      />
      <ConfirmationDialog
        open={pay}
        title={t("payroll.pay dialog title")}
        text={payContent}
        onConfirmDialogClose={() => setPay(false)}
        onYesClick={() => handlePayroll()}
      />
    </Container>
  );
};

export default Payroll;
