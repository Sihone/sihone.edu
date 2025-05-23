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
import { numberWithCommas } from 'app/utils/utils';
import _ from 'lodash';

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
    const [totalAmount, setTotalAmount] = useState(0);

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
          header: t("payroll.pay dialog date"),
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
                employee: item.first_name.toUpperCase() + " " + item.last_name.toUpperCase(),
                month: item.pay_period,
                total: numberWithCommas(item.total_salary) + " " + user.currency,
                date: item.pay_date,
                actions: (
                    <Box sx={{ display: 'flex', gap: '8px' }}>
                        <IconButton onClick={() => viewPaySlip({
                          ...item,
                          name: item.first_name.toUpperCase() + " " + item.last_name.toUpperCase(),
                          hourly_salary: item.hourly_rate * item.total_hours,
                        })}>
                          <Visibility />
                        </IconButton>
                    </Box>
                  ),
            }));
            if (selectedMonthYear) {
                setFilteredPayrolls(_data.filter((item) => item.month === selectedMonthYear));
                setTotalAmount(payrolls.filter((item) => item.pay_period === selectedMonthYear).map((item) => item.total_salary).reduce((a, b) => a + b, 0));
            } else {
              setFilteredPayrolls(_data);
              setTotalAmount(payrolls.map((item) => item.total_salary).reduce((a, b) => a + b, 0));
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
        />,
        <div>
          {t("payroll.total amount")}
          <br />
          {numberWithCommas(totalAmount) + " " + user.currency}
        </div>
      ],
    })

    const viewPaySlip = (paySlip) => {
      setPaySlip(paySlip);
    };
  
    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                routeSegments={[{ name: t("payroll.slip title") }]}
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
                  payments={paySlip ? _.groupBy(payrolls, 'employees_id')[paySlip?.employees_id]: []}
                />
            </Paper>
        </Container>
    );
  };
  
  export default Example;
  