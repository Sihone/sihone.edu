import {
    MaterialReactTable,
    createMRTColumnHelper,
} from 'material-react-table';
import { Box, IconButton, Paper, TableContainer, TextField, styled } from '@mui/material';
import useData from 'app/hooks/useData';
import { useAuth } from 'app/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Visibility } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Breadcrumb } from "app/components";
import { useMaterialReactTableV2 } from 'app/hooks/useMaterialReactTable';
import SlipView from './SlipView';

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
    const { data: payrolls} = useData("payroll", user.company_id);
    
    const [filteredPayrolls, setFilteredPayrolls] = useState([]);
    const [selectedMonthYear, setSelectedMonthYear] = useState(null);
    const [paySlip, setPaySlip] = useState(null);

    const { t } = useTranslation();

    const columns = [
        columnHelper.accessor('employee', {
          header: t("payroll.table header.employee"),
          size: 120,
        }),
        columnHelper.accessor('month', {
          header: t("payroll.table header.pay month"),
          size: 60,
        }),
        columnHelper.accessor('total', {
          header: t("payroll.table header.total"),
          size: 60,
        }),
        columnHelper.accessor('date', {
          header: t("payroll.table header.date"),
          size: 60,
        }),
        columnHelper.accessor('actions', {
          header: t("main.actions"),
          size: 80,
        }),
      ];

    useEffect(() => {
        if (payrolls) {
            const _data = payrolls.map((item) => ({
                employee: item.first_name + " " + item.last_name,
                month: item.pay_period,
                total: item.total_salary,
                date: item.pay_date,
                actions: (
                    <Box sx={{ display: 'flex', gap: '8px' }}>
                        <IconButton onClick={() => viewPaySlip({
                          ...item,
                          name: item.first_name + " " + item.last_name,
                          hourly_salary: item.hourly_rate * item.total_hours,
                        })}>
                          <Visibility />
                        </IconButton>
                    </Box>
                  ),
            }));
            if (selectedMonthYear) {
                setFilteredPayrolls(_data.filter((item) => item.month === selectedMonthYear));
            } else {
              setFilteredPayrolls(_data);
            }
            
        }
    }, [payrolls, selectedMonthYear]);
  
    const table = useMaterialReactTableV2({
      columns,
      data: filteredPayrolls,
      exportedFileName: t("payroll.title"),
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

    const viewPaySlip = (paySlip) => {
      setPaySlip(paySlip);
    };
  
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
                <SlipView
                  open={!!paySlip}
                  onClose={() => setPaySlip(null)}
                  paySlip={paySlip}
                  t={t}
                  user={user}
                />
            </Paper>
        </Container>
    );
  };
  
  export default Example;
  