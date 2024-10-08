import {
    MaterialReactTable,
    createMRTColumnHelper,
} from 'material-react-table';
import { Box, Chip, IconButton, LinearProgress, Paper, TableContainer, TextField, styled } from '@mui/material';
import useData from 'app/hooks/useData';
import { useAuth } from 'app/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Add, Delete, Edit, Payment } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { Breadcrumb, ConfirmationDialog } from "app/components";
import { useMaterialReactTableV2 } from 'app/hooks/useMaterialReactTable';
import { numberWithCommas } from 'app/utils/utils';

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
    const { data: payrolls, deleteData, saveData, loading  } = useData("payroll", user.company_id);
    const { data: settings } = useData("settings", user.company_id);
    const [attendance, setAttendance] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

  const [pay, setPay] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [payroll, setPayroll] = useState(null);
  const [pay_date, setPayDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedMonthYear, setSelectedMonthYear] = useState(new Date().getFullYear() + "-" + (new Date().getMonth() + 1));

    const { t } = useTranslation();

    let columns = [
      columnHelper.accessor('employee', {
        header: t("payroll.table header.employee"),
        size: 100,
      }),
      columnHelper.accessor('base', {
        header: t("payroll.table header.basic salary"),
        size: 60,
      }),
      columnHelper.accessor('hourly', {
        header: t("payroll.table header.hourly salary"),
        size: 60,
      }),
      // columnHelper.accessor('work_experience', {
      //   header: t("payroll.table header.work experience"),
      //   size: 30,
      // }),
      columnHelper.accessor('years_experience', {
        header: t("payroll.table header.years experience"),
        size: 60,
      }),
     columnHelper.accessor('transport', {
        header: t("payroll.table header.transportation"),
        size: 60,
      }),
      columnHelper.accessor('withholdings', {
        header: t("payroll.table header.withholding"),
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
        size: 40,
      }),
    ];
    columns = columns.filter(n => n);
  
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
              const base = row.base_salary;
              const hourly = row.hourly_rate * numberOfHours;
              const existingPayroll = payrolls?.filter((item) => item.employees_id === row.id && item.pay_period === selectedMonthYear);
              const paid = existingPayroll.length === 1 ? true : false;
              
              let yearsOfExperienceAmnt = 0;
              let workLevelAmnt = 0;
              let transportAmnt = 0;
              
              if (settings?.automatic_salary) {
                const yearsOfExperience = Math.floor(row.start_date ? (new Date() - new Date(row.start_date)) / (1000 * 60 * 60 * 24 * 365) : 0);
                yearsOfExperienceAmnt = settings?.years_experience && yearsOfExperience > 1 ? 0.02 *yearsOfExperience * base : 0;
                workLevelAmnt = settings?.work_experience ? row.work_level * base / 100 : 0;
                transportAmnt = settings?.transportation ? base * 0.05 : 0;
              }
              
              const partialTotal = base + hourly + yearsOfExperienceAmnt + workLevelAmnt;
              const pvid  = 0.042 * partialTotal;
              let irpp = 0;
              if (partialTotal < 62001) {
                irpp = 0;
              } else {
                irpp = 0.1 * ((0.7 * partialTotal) - pvid - 41667);
              }
              const cac_irpp = 0.1 * irpp;
              let irpp_total = irpp + cac_irpp;
              irpp_total = irpp_total < 0 ? 0 : irpp_total;
              const rav = 750;
              let cfc = 0.01 * partialTotal;
              if (partialTotal < 60000) {
                cfc = 0.01 * 60000;
              }
              
              let tdl = 0;
              if (partialTotal < 62001) {
                tdl = 0;
              } else if (partialTotal < 75001) {
                tdl = 3000;
              } else if (partialTotal < 100001) {
                tdl = 6000;
              } else if (partialTotal < 125001) {
                tdl = 9000;
              } else if (partialTotal < 150001) {
                tdl = 12000;
              } else if (partialTotal < 175001) {
                tdl = 15000;
              } else if (partialTotal < 200001) {
                tdl = 18000;
              } else if (partialTotal < 250001) {
                tdl = 22000;
              } else {
                tdl = 25000;
              }
              tdl = tdl/12;
              const withholdings = base === 0 ? 0 : Math.floor(irpp_total) + Math.floor(rav) + Math.floor(cfc) + Math.floor(tdl) + Math.floor(pvid);
              
              const total = base + hourly + yearsOfExperienceAmnt + workLevelAmnt + transportAmnt - withholdings;
              
              return {
                employee,
                base: numberWithCommas(base.toFixed(0)) + " " + user.currency,
                hourly: numberWithCommas(hourly.toFixed(0)) + " " + user.currency,
                years_experience: numberWithCommas(yearsOfExperienceAmnt.toFixed(0)) + " " + user.currency,
                work_experience: numberWithCommas(workLevelAmnt.toFixed(0)) + " " + user.currency,
                transport: numberWithCommas(transportAmnt.toFixed(0)) + " " + user.currency,
                withholdings: <span title={`irpp ${irpp_total.toFixed(0)} + rav ${rav.toFixed(0)} + cfc ${cfc.toFixed(0)} + tdl ${tdl.toFixed(0)} + pvid ${pvid.toFixed(0)}`}>{numberWithCommas(withholdings.toFixed(0)) + " " + user.currency}</span>,
                total: numberWithCommas(total.toFixed(0)) + " " + user.currency,
                status: paid ? <Chip color="success" label={t("payroll.paid")} /> : (total !== 0 ? <Chip color="error" label={t("payroll.unpaid")} /> : <Chip label={t("payroll.no balance")} />),
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
                        yearly_rate: yearsOfExperienceAmnt,
                        transport_rate: transportAmnt,
                        irpp: irpp_total,
                        rav: rav,
                        cfc: cfc,
                        pvid: pvid,
                        tdl: tdl,
                        withholdings: withholdings,
                        total_salary: total,
                        company_id: user.company_id,
                      })}
                      disabled={total === 0}
                    >
                      <Payment />
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
          key="month-year"
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
      sorting: [
        {
          id: "total",
          desc: true,
        },
      ]
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
                routeSegments={[{ name: t("payroll.title") }]}
                />
            </div>
            
            <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer>
                    {loading && <LinearProgress />}
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
  