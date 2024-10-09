import { Close, Visibility } from "@mui/icons-material";
import { Box, Paper, styled, Table, TableBody, TableCell, TableRow, TextField, Autocomplete, InputAdornment } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { Breadcrumb } from "app/components";
import { TableHead, TableToolbar } from "app/components/data-table";
import { H5 } from "app/components/Typography";
import useTable from "app/hooks/useTable";
import useData from "app/hooks/useData";
import { useAuth } from "app/hooks/useAuth";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import { numberWithCommas } from "app/utils/utils";
import SlipView from "./SlipView";

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

  const { data: employees } = useData("employees", user.company_id);
  const { data: payrolls } = useData("payroll", user.company_id);
  const { t } = useTranslation();

  const [filteredPayrolls, setFilteredPayrolls] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedMonthYear, setSelectedMonthYear] = useState(null);
  const [paySlip, setPaySlip] = useState(null);

  useEffect(() => {
    if (selectedEmployeeId && selectedMonthYear) {
      const _data = payrolls.filter((item) => item.employees_id === selectedEmployeeId && item.pay_period === selectedMonthYear);
      setFilteredPayrolls(_data);
    } else if (selectedEmployeeId) {
      const _data = payrolls.filter((item) => item.employees_id === selectedEmployeeId);
      setFilteredPayrolls(_data);
    } else if (selectedMonthYear) {
      const _data = payrolls.filter((item) => item.pay_period === selectedMonthYear);
      setFilteredPayrolls(_data);
    } else {
      setFilteredPayrolls(payrolls);
    }
  }, [selectedEmployeeId, selectedMonthYear, payrolls]);

  // TABLE HEADER COLUMN LIST
  const columns = [
    { id: "employee", align: "left", disablePadding: true, label: t("payroll.table header.employee") },
    { id: "salary_month", align: "left", disablePadding: false, label: t("payroll.table header.pay month") },
    { id: "total", align: "left", disablePadding: false, label: t("payroll.table header.total") },
    { id: "pay_date", align: "left", disablePadding: false, label: t("payroll.pay dialog date") },
    { id: "edit", align: "center", disablePadding: false, label: t("payroll.table header.actions") },
  ];

  const viewPaySlip = (paySlip) => {
    setPaySlip(paySlip);
  };

  const handClosePaySlip = () => {
    setPaySlip(null);
  };

  const employeesOptions = [
    {id: null, label: t("payroll.table filter all")},
    ...employees?.map((employee) => ({...employee, label: employee.first_name + " " + employee.last_name}))
  ];

  return (
    <Container>
      <div className="breadcrumb" style={{display: "flex", justifyContent: "space-between"}}>
        <Breadcrumb
          routeSegments={[{ name: t("payroll.slip title") }]}
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
            InputProps={{ // <-- This is where the toggle button is added.
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setSelectedMonthYear(null)}
                  >
                    <Close />
                  </IconButton>
                </InputAdornment>
              )
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
              rowCount={filteredPayrolls?.length} 
              onRequestSort={handleRequestSort}
              showSelect={false}
            />

            <TableBody>
              {filteredPayrolls?.map((row) => {
                  const name = row.first_name.toUpperCase() + " " + row.last_name.toUpperCase();
                  row.name = name;

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.id}
                      role="checkbox"
                    >
                      <TableCell component="th" scope="row" padding="none" style={{paddingLeft: "16px"}}>
                        <FlexBox gap={1}>
                          <H5 fontSize={15}>{name}</H5>
                        </FlexBox>
                      </TableCell>

                      <TableCell align="left">{row.pay_period}</TableCell>

                      <TableCell align="left">{numberWithCommas(row.total_salary) + " " + user.currency}</TableCell>

                      <TableCell align="left">{row.pay_date}</TableCell>

                      <TableCell align="center">
                        <IconButton onClick={() => viewPaySlip(row)}>
                          <Visibility />
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
          count={filteredPayrolls?.length}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <SlipView
        open={!!paySlip}
        onClose={() => setPaySlip(null)}
        paySlip={paySlip}
        t={t}
        user={user}
      />
    </Container>
  );
};

export default Payroll;
