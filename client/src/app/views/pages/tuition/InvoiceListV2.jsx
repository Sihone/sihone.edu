import {
    MaterialReactTable,
    createMRTColumnHelper,
} from 'material-react-table';
import { Box, Chip, IconButton, Paper, TableContainer, styled } from '@mui/material';
import useData from 'app/hooks/useData';
import { useAuth } from 'app/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Visibility } from '@mui/icons-material';
import { numberWithCommas } from 'app/utils/utils';
import { useTranslation } from 'react-i18next';
import { Breadcrumb } from "app/components";
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
    const { data: _tuitions } = useData("tuitions", user.company_id);
    const { data: tuitionPayments } = useData("tuition_payments", user.company_id);
    const { data: tuitionItems } = useData("tuition_items", user.company_id);
    const { data: students } = useData("students", user.company_id);

    const [tuitions, setTuitions] = useState([]);

    const navigate = useNavigate();

    const { t, i18n } = useTranslation();

    const columns = [
        columnHelper.accessor('studentId', {
          header: 'EID',
          size: 40,
        }),
        columnHelper.accessor('student', {
          header: t("students.full name"),
          size: 120,
        }),
        columnHelper.accessor('year', {
          header: t("academics.table header.academic year"),
          size: 80,
        }),
        columnHelper.accessor('program', {
          header: t("academics.table header.academic year"),
          size: 100,
        }),
        columnHelper.accessor('fees', {
          header: t("tuition.total"),
          size: 80,
        }),
        columnHelper.accessor('status', {
          header: t("main.status"),
          size: 80,
        }),
        columnHelper.accessor('student_status', {
          header: t("students.student status"),
          size: 80,
        }),
        columnHelper.accessor('actions', {
          header: t("main.actions"),
          size: 80,
        }),
      ];

    useEffect(() => {
        if (_tuitions) {
            const _data = _tuitions.map((invoice) => {
              if (!invoice.student_status) return;
              const _payments = tuitionPayments.filter((payment) => payment.tuition_id === invoice.id);
              const _totalPayments = _payments.reduce((acc, payment) => acc + payment.amount, 0);

              const _tuitionItems = tuitionItems.filter((item) => item.tuition_id === invoice.id);
              const _totalItems = _tuitionItems.reduce((acc, item) => acc + item.price, 0);

              let initialBalance = invoice.price - invoice.rebate + _totalItems;

              const balance = initialBalance - _totalPayments;
              let status = t("tuition.unpaid");
              let statusColor = "error";
              if (balance == 0) {
                status = t("tuition.paid");
                statusColor = "success";
              }
              else if (balance < 0) {
                status = t("tuition.overpaid");
                statusColor = "primary";
              } 
              else if (balance == initialBalance) {
                status = t("tuition.unpaid");
                statusColor = "error";
              }
              else {
                status = t("tuition.partial paid");
                statusColor = "warning";
              }
              
              return {
                studentId: invoice.studentId,
                student: invoice.first_name + " " + invoice.last_name,
                year: invoice.ay_name,
                program: i18n.language == "en" ? invoice.name_en : invoice.name_fr,
                fees: numberWithCommas(balance) + " " + user.currency,
                status: <Chip color={statusColor} label={status} />,
                student_status: <Chip color={invoice.student_status == "active" ? "success" : "error"} label={t("main." + invoice.student_status)} />,
                actions: (
                    <Box sx={{ display: 'flex', gap: '8px' }}>
                       <IconButton onClick={() => navigate(`/tuition/${invoice.id}`)}>
                        <Visibility />
                      </IconButton>
                    </Box>
                  ),
            }
          });
          setTuitions(_data.filter((item) => item));
        }
    }, [tuitions, tuitionPayments, tuitionItems]);
  
    const table = useMaterialReactTableV2({
        columns,
        data: tuitions,
        exportedFileName: t("tuition.title"),
    })
  
    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                routeSegments={[{ name: t("tuition.title") }]}
                />
            </div>

            <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer>
                    <MaterialReactTable table={table} />
                </TableContainer>
            </Paper>
        </Container>
    );
  };
  
  export default Example;
  