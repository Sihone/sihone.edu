import {
    MaterialReactTable,
    createMRTColumnHelper,
} from 'material-react-table';
import { Box, IconButton, Paper, TableContainer, styled } from '@mui/material';
import useData from 'app/hooks/useData';
import { useAuth } from 'app/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Delete, Edit, RequestQuote } from '@mui/icons-material';
import { numberWithCommas } from 'app/utils/utils';
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
    const { data: _students, deleteData } = useData("students", user.company_id);
    const { data: programs } = useData("academic_programs", user.company_id);
    const { data: tuitionPayments } = useData("tuition_payments", user.company_id);
    const { data: tuitionItems } = useData("tuition_items", user.company_id);
    const { data: invoiceList } = useData("tuitions", user.company_id);
    const [students, setStudents] = useState([]);
    const [showBalanceId, setShowBalanceId] = useState(null);
    const [item, setItem] = useState(null);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { t, i18n } = useTranslation();

    const columns = [
        columnHelper.accessor('student_id', {
          header: 'EID',
          size: 40,
        }),
        columnHelper.accessor('student', {
          header: t("students.full name"),
          size: 80,
        }),
        columnHelper.accessor('gender', {
          header: t("students.gender"),
          size: 40,
        }),
        columnHelper.accessor('contact', {
          header: t("students.table header.phone"),
          size: 100,
        }),
        columnHelper.accessor('parent', {
          header: t("students.table header.parent phone"),
          size: 70,
        }),
        columnHelper.accessor('program', {
          header: t("students.table header.program"),
          size: 120,
        }),
        columnHelper.accessor('fees', {
          header: t("students.table header.balance"),
          size: 70,
        }),
        columnHelper.accessor('actions', {
          header: t("main.actions"),
          size: 70,
        }),
      ];

    const handleDelete = (id) => {
      setItem(id);
    };
  
    const onDelete = async (id) => {
      await deleteData(id)
        .then(() => {
          setItem(null);
          enqueueSnackbar(t("main.success"), { variant: "success" });
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar(err.message || err.detail || err, { variant: "error" });
        });
    }

    useEffect(() => {
        if (_students) {
            const _data = _students.map((item) => {
              const program = programs.find((_item) => _item.id == item.program_id);
              const programName = i18n.language == "en" ? (program?.short_name_en + " - " + program?.name_en) : (program?.short_name_fr + " - " + program?.name_fr);
              const showBalance = showBalanceId == item.id;

              let _gender = item.gender === "male" ? "M" : "F";
              if (i18n.language == "fr") {
                _gender = item.gender === "male" ? "H" : "F";
              }

              const invoice = invoiceList.find((_item) => _item.student_id == item.id);
              const _payments = tuitionPayments.filter((payment) => payment.tuition_id === invoice?.id);
              const _totalPayments = _payments.reduce((acc, payment) => acc + payment.amount, 0);

              const _tuitionItems = tuitionItems.filter((_item) => _item.tuition_id === invoice?.id);
              const _totalItems = _tuitionItems.reduce((acc, _item) => acc + _item.price, 0);

              let initialBalance = invoice?.price - invoice?.rebate + _totalItems;

              const balance = initialBalance - _totalPayments;
              return {
                student_id: item.student_id,
                student: item.first_name + " " + item.last_name,
                gender: _gender,
                contact: <>
                  <p style={{margin: "0"}}>{item.phone}</p>
                  <p style={{margin: "0"}}>{item.email}</p>
                </>,
                parent: item.parent_phone,
                program: programName,
                fees: <div onMouseOver={() => setShowBalanceId(item.id)} onMouseOut={() => setShowBalanceId(null)}><span style={{color: showBalance ? "#000" : "transparent", textShadow: showBalance ? "none" : "0 0 5px #000"}}>
                  {showBalance ? numberWithCommas(balance) : "**,***"}
                  {user.currency}
                </span></div>,
                actions: (
                    <Box sx={{ display: 'flex', gap: '8px' }}>
                        <IconButton onClick={() => navigate("/tuition/" + item.tuition_id)}>
                            <RequestQuote />
                        </IconButton>
                        <IconButton onClick={() => navigate("/students/" + item.id)}>
                            <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(item.id)}>
                            <Delete />
                        </IconButton>
                    </Box>
                  ),
            }
          });
          setStudents(_data);
        }
    }, [_students, showBalanceId]);
  
    const table = useMaterialReactTableV2({
        columns,
        data: students,
        exportedFileName: t("students.title"),
    })
  
    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                routeSegments={[{ name: t("students.title") }]}
                />
            </div>

            <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer>
                    <MaterialReactTable table={table} />
                </TableContainer>
                <ConfirmationDialog
                  open={!!item}
                  title={t("students.dialog title")}
                  text={t("students.dialog content")}
                  onConfirmDialogClose={() => setItem(null)}
                  onYesClick={() => onDelete(item)}
                />
            </Paper>
        </Container>
    );
  };
  
  export default Example;
  