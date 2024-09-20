import {
    MaterialReactTable,
    createMRTColumnHelper,
} from 'material-react-table';
import { Box, Button, FormControlLabel, IconButton, Paper, Select, Switch, TableContainer, styled } from '@mui/material';
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
import { inactiveStudents, completedStudents } from 'app/utils/utils';

import "./styles.css";

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
    const {data: academicYears} = useData("academic_years", user.company_id);
    const [studentList, setStudentList] = useState(_students);
    const [students, setStudents] = useState([]);
    const [showBalanceId, setShowBalanceId] = useState(null);
    const [item, setItem] = useState(null);
    const [showInactive, setShowInactive] = useState(false);
    const [showCompleted, setShowCompleted] = useState(false);
    const [academicYearId, setAcademicYearId] = useState(user.currentAcademicYearId);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { t, i18n } = useTranslation();

    const columns = [
        columnHelper.accessor('student_id', {
          header: 'EID',
          size: 20,
        }),
        columnHelper.accessor('status', {
          header: 'Status',
          size: 20,
        }),
        columnHelper.accessor('student', {
          header: t("students.full name"),
          size: 100,
        }),
        columnHelper.accessor('contact', {
          header: t("students.table header.phone"),
          size: 80,
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
    
    const handleInactiveToggle = () => {
      setShowInactive(!showInactive);
    }
    
    const handleCompletedToggle = () => {
      setShowCompleted(!showCompleted);
    }
    
    useEffect(() => {
      const tempList = _students.filter(obj => {
        let comparison = obj.status === "active";
        
        if (showInactive && showCompleted) {
          comparison =  obj.status === "active" || obj.status === "inactive" || obj.status === "completed";
        } else if (!showInactive && showCompleted) {
          comparison =  obj.status === "active" || obj.status === "completed";
        } else if (showInactive && !showCompleted) {
          comparison =  obj.status === "active" || obj.status === "inactive";
        } else if (!showInactive && !showCompleted) {
          comparison =  obj.status === "active";
        }
        if (academicYearId === "all") {
          return comparison;
        } else {
          return comparison && obj.academic_year_id === Number(academicYearId);
        }
          
      })
      setStudentList(tempList);
      setTimeout(inactiveStudents, 100);
      setTimeout(completedStudents, 100);
    }, [_students, showInactive, showCompleted, academicYearId]);

    useEffect(() => {
        if (studentList) {
            const _data = studentList.map((item) => {
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
                student_id: "(" + _gender + ") " + item.student_id,
                status: item.status,
                student: item.first_name + " " + item.last_name,
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
    }, [studentList, showBalanceId]);
  
    const table = useMaterialReactTableV2({
        columns,
        data: students,
        exportedFileName: t("students.title"),
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
            <option value="all">{t("main.show all")}</option>
          </Select>,
          _students.length > 0 && <FormControlLabel
            control={
              <Switch checked={showInactive} onChange={handleInactiveToggle}  />
            }
            label={t("students.inactive")}
          />,
          _students.length > 0 && <FormControlLabel
            control={
              <Switch checked={showCompleted} onChange={handleCompletedToggle}  />
            }
            label={t("students.completed")}
          />
        ]
    })
  
    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                routeSegments={[{ name: t("students.title") }]}
                />
                <Button variant="contained" onClick={() => navigate("/new-student")}>{t("main.menu.new student")}</Button>
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
  