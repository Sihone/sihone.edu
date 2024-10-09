import {
    MaterialReactTable,
    createMRTColumnHelper,
} from 'material-react-table';
import { Box, Chip, FormControlLabel, IconButton, Paper, Select, Switch, TableContainer, styled } from '@mui/material';
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
    const { data: academicYears } = useData("academic_years", user.company_id);

    const [tuitionList, setTuitionList] = useState(_tuitions);
    const [tuitions, setTuitions] = useState([]);
    const [academicYearId, setAcademicYearId] = useState(user.currentAcademicYearId);

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
        // columnHelper.accessor('student_status', {
        //   header: t("students.student status"),
        //   size: 80,
        // }),
        columnHelper.accessor('actions', {
          header: t("main.actions"),
          size: 80,
        }),
      ];
    
    useEffect(() => {
        if (academicYears.length > 0) {
          const tempTuitionList = _tuitions.filter((tuition) => {
            return tuition.student_status === "active" && tuition.academic_year_id === Number(academicYearId);
          });
          setTuitionList(tempTuitionList);
        }
    }, [academicYearId, _tuitions, academicYears]);

    useEffect(() => {
        if (tuitionList) {
            const _data = tuitionList.map((invoice) => {
              if (!invoice.student_status) return null;
              const _payments = tuitionPayments.filter((payment) => payment.tuition_id === invoice.id);
              const _totalPayments = _payments.reduce((acc, payment) => acc + payment.amount, 0);

              const _tuitionItems = tuitionItems.filter((item) => item.tuition_id === invoice.id);
              const _totalItems = _tuitionItems.reduce((acc, item) => acc + item.price, 0);
              
              const studentAcademicYear = academicYears.find((_item) => _item.id == invoice.student_academic_year_id);
              const currentAcademicYear = academicYears.find((_item) => _item.id == academicYearId);
              const year = new Date(currentAcademicYear.start_date).getFullYear() - new Date(studentAcademicYear.start_date).getFullYear() + 1;
              const academicYearStr = t(`students.year.${year}`);

              let initialBalance = Number(invoice.price) + Number(invoice.reg_fee) - Number(invoice.rebate) + _totalItems;
              if (year > 1) {
                initialBalance = Number(invoice.price) - Number(invoice.rebate) + _totalItems;
              }
              

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
                year: academicYearStr,
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
    }, [tuitionPayments, tuitionItems, tuitionList, academicYears, academicYearId]);
  
    const table = useMaterialReactTableV2({
        columns,
        data: tuitions,
        exportedFileName: t("tuition.title"),
        otherActions: [
          <Select
            size="small"
            native
            variant="outlined"
            value={academicYearId}
            onChange={(e) => setAcademicYearId(e.target.value)}
            sx={{ mb: 3 }}
            style={{margin: "32px"}}
          >
            {academicYears?.map((item, ind) => {
              return (
                <option value={item.id} key={item.name}>{item.name}</option>
              )
            })}
          </Select>,
        ],
        sorting: [
          {
            id: "year",
            desc: false
          },
          {
            id: "student",
            desc: false
          }
        ]
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
  