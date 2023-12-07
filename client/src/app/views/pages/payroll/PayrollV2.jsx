import {
    MaterialReactTable,
    createMRTColumnHelper,
} from 'material-react-table';
import { Box, Chip, IconButton, Paper, TableContainer, TextField, styled } from '@mui/material';
import useData from 'app/hooks/useData';
import { useAuth } from 'app/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Add, Delete, Edit, Money } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { Breadcrumb, ConfirmationDialog } from "app/components";
import { useMaterialReactTableV2 } from 'app/hooks/useMaterialReactTable';

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
  
  const columnHelper = createMRTColumnHelper();
  
  const Example = () => {
    const {user} = useAuth();
    const { data: _employees } = useData("employees", user.company_id);
    const { data: attendances } = useData("attendance", user.company_id);
    const { data: payrolls, deleteData, saveData  } = useData("payroll", user.company_id);
    const [attendance, setAttendance] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

  const [pay, setPay] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [payroll, setPayroll] = useState(null);
  const [pay_date, setPayDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedMonthYear, setSelectedMonthYear] = useState(new Date().getFullYear() + "-" + (new Date().getMonth() + 1));

    const { t } = useTranslation();

    const columns = [
      columnHelper.accessor('employee', {
        header: t("payroll.table header.employee"),
        size: 120,
      }),
      columnHelper.accessor('period', {
        header: t("payroll.table header.pay period"),
        size: 60,
      }),
      columnHelper.accessor('base', {
        header: t("payroll.table header.basic salary"),
        size: 60,
      }),
      columnHelper.accessor('hourly', {
        header: t("payroll.table header.hourly salary"),
        size: 60,
      }),
      columnHelper.accessor('total', {
        header: t("payroll.table header.total"),
        size: 60,
      }),
      columnHelper.accessor('status', {
        header: t("payroll.table header.status"),
        size: 60,
      }),
      columnHelper.accessor('actions', {
        header: t("main.actions"),
        size: 80,
      }),
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

    useEffect(() => {
        if (_employees) {
            const _data = _employees.map((row) => {
              const numberOfHours = attendances?.filter((item) => item.employees_id === row.id && item.attendance_date.includes(selectedMonthYear)).reduce((a, b) => a + b.total_time, 0) / 60 / 60;
              const employee = row.first_name + " " + row.last_name;
              const period = row.pay_period;
              const base = row.base_salary;
              const hourly = row.hourly_rate * numberOfHours;
              const total = base + hourly;
              const existingPayroll = payrolls?.filter((item) => item.employees_id === row.id && item.pay_period === selectedMonthYear);
              const paid = existingPayroll.length === 1 ? true : false;
              return {
                employee,
                period,
                base,
                hourly,
                total,
                status: paid ? <Chip color="success" label={t("payroll.paid")} /> : <Chip color="error" label={t("payroll.unpaid")} />,
                actions: (
                  paid ? (
                    <IconButton onClick={() => handleDeleteClick(existingPayroll[0].id)}>
                      <Delete />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={() => handlePay({
                        employee_id: row.id,
                        pay_period: selectedMonthYear,
                        base_salary: base,
                        total_hours: numberOfHours,
                        hourly_rate: row.hourly_rate,
                        total_salary: total,
                        company_id: user.company_id,
                      })}
                    >
                      <Money />
                    </IconButton>
                  )
                ),
              };
            });
            setAttendance(_data);
        }
    }, [_employees, payrolls, attendances, selectedMonthYear]);
  
    const table = useMaterialReactTableV2({
      columns,
      data: attendance,
      exportedFileName: t("attendance.title"),
      extraComponents: [
        <TextField
          fullWidth
          size='small'
          label={t("payroll.table year month")}
          value={selectedMonthYear}
          onChange={(e) => setSelectedMonthYear(e.target.value)}
          type="month"
          sx={{ maxWidth: 200 }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      ],
    })

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
            <div className="breadcrumb">
                <Breadcrumb
                routeSegments={[{ name: t("attendance.title") }]}
                />
            </div>

            <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer>
                    <MaterialReactTable table={table} />
                </TableContainer>
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
  
  export default Example;
  