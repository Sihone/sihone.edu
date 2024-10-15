import {
    MaterialReactTable,
    createMRTColumnHelper,
} from 'material-react-table';
import { Box, Button, Chip, FormControlLabel, IconButton, Paper, Select, Switch, TableContainer, styled } from '@mui/material';
import useData from 'app/hooks/useData';
import { useAuth } from 'app/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Delete, Edit, Laptop, RequestQuote } from '@mui/icons-material';
import { numberWithCommas } from 'app/utils/utils';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { Breadcrumb, ConfirmationDialog } from "app/components";
import { useMaterialReactTableV2 } from 'app/hooks/useMaterialReactTable';
import { inactiveStudents, completedStudents, deleteDuplicate } from 'app/utils/utils';

import "./styles.css";
import { green, orange, red } from '@mui/material/colors';

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
    const {data: academicCycles} = useData("academic_cycles", user.company_id);
    const {data: settings} = useData("settings", user.company_id);
    const [studentList, setStudentList] = useState(_students);
    const [students, setStudents] = useState([]);
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
        columnHelper.accessor('year', {
          header: t("students.table header.year"),
          size: 50,
        }),
        columnHelper.accessor('student', {
          header: t("students.full name"),
          size: 100,
        }),
        columnHelper.accessor('contact', {
          header: t("students.table header.phone"),
          size: 90,
        }),
        columnHelper.accessor('parent', {
          header: t("students.table header.parent phone"),
          size: 50,
        }),
        columnHelper.accessor('program', {
          header: t("students.table header.program"),
          size: 70,
        }),
        columnHelper.accessor('fees', {
          header: t("students.table header.balance"),
          size: 50,
        }),
        columnHelper.accessor('actions', {
          header: t("main.actions"),
          size: 50,
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
      
    }, [_students])
    
    useEffect(() => {
      if (academicYears.length > 0 && academicCycles.length > 0) {
        // const _tempStudents = deleteDuplicate(_students, 'id');
        const tempList = _students?.filter(obj => {
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
          const studentAcademicYear = academicYears.find((_item) => _item.id == obj.academic_year_id);
          const studentCycle = academicCycles.find((_item) => _item.id == obj.cycle_id);
          let numberOfYears = studentCycle?.number_of_years;
          const studentAcademicYears = [studentAcademicYear];
          const studentAcademicYearsIds = [studentAcademicYear?.id];
          for (let i = 1; i <= numberOfYears - 1; i++) {
            const startYear = new Date(studentAcademicYear.start_date).getFullYear() + i;
            const nextAcademicYear = academicYears.find((_item) => new Date(_item.start_date).getFullYear() == startYear);
            studentAcademicYears.push(nextAcademicYear);
            studentAcademicYearsIds.push(nextAcademicYear?.id);
          }
          
          return comparison && studentAcademicYearsIds.includes(Number(academicYearId));
            
        })
        setStudentList(tempList);
        setTimeout(inactiveStudents, 100);
        setTimeout(completedStudents, 100);
      }
    }, [_students, showInactive, showCompleted, academicYearId, academicYears, academicCycles]);

    useEffect(() => {
        if (studentList) {
            let _data = studentList.map((item) => {
              if (item.tuition_academic_year_id != academicYearId) {
                return null;
              }
              const program = programs.find((_item) => _item.id == item.program_id);
              const programName = i18n.language == "en" ? (program?.short_name_en + " - " + program?.name_en) : (program?.short_name_fr + " - " + program?.name_fr);

              let _gender = item.gender === "male" ? "M" : "F";
              if (i18n.language == "fr") {
                _gender = item.gender === "male" ? "H" : "F";
              }

              const invoice = invoiceList.find((_item) => _item.student_id == item.id && _item.academic_year_id == item.tuition_academic_year_id);
              const _payments = tuitionPayments.filter((payment) => payment.tuition_id === invoice?.id);
              const _totalPayments = _payments.reduce((acc, payment) => acc + payment.amount, 0);
              
              const studentAcademicYear = academicYears.find((_item) => _item.id == item.academic_year_id);
              const currentAcademicYear = academicYears.find((_item) => _item.id == academicYearId);
              const year = new Date(currentAcademicYear.start_date).getFullYear() - new Date(studentAcademicYear.start_date).getFullYear() + 1;
              const academicYearStr = t(`students.year.${year}`);

              const _tuitionItems = tuitionItems.filter((_item) => _item.tuition_id === invoice?.id);
              const _totalItems = _tuitionItems.reduce((acc, _item) => acc + _item.price, 0);

              let initialBalance = Number(invoice?.price) + Number(invoice?.reg_fee) - Number(invoice?.rebate) + _totalItems;
              
              if (year > 1) {
                initialBalance = Number(invoice?.price) - Number(invoice?.rebate) + _totalItems;
              }

              let balance = initialBalance - _totalPayments;
              if (item.needs_laptop && settings?.laptop_incentive) {
                balance += item.laptop_incentive;
              }
              
              let laptopStatus = { color: red[500], label: "main.included"};
              if (_totalPayments >= ((0.35 * initialBalance) + 50000)) {
                laptopStatus = { color: orange[500], label: "main.pending"};
              }
              if (item.laptop_id) {
                laptopStatus = { color: green[500], label: "main.assigned"};
              }
              
              return {
                student_id: item.student_id,
                year: academicYearStr,
                student: <>{item.first_name.toUpperCase() + " " + item.last_name.toUpperCase()} {item.status === "inactive" && <><br/><span style={{color: "red"}}>(inactive)</span></>} {item.status === "completed" && <><br/><span style={{color: "green"}}>(completed)</span></>}</>,
                contact: <>
                  <p style={{margin: "0"}}>{item.phone}</p>
                  <p style={{margin: "0"}}>{item.email}</p>
                </>,
                parent: item.parent_phone,
                program: programName,
                fees: <div
                        onMouseOver={() => {
                          document.getElementById(`showBalanceId${item.id}`).style.display = "block";
                          document.getElementById(`hideBalanceId${item.id}`).style.display = "none";
                        }}
                        onMouseOut={() => {
                          document.getElementById(`showBalanceId${item.id}`).style.display = "none";
                          document.getElementById(`hideBalanceId${item.id}`).style.display = "block";
                        }}
                        style={{display: "flex", flexDirection: "column"}}
                      >
                        <span id={`showBalanceId${item.id}`} style={{color: "#000", textShadow: "none", display: "none"}}>
                          {numberWithCommas(balance)}
                          {user.currency}
                        </span>
                        <span id={`hideBalanceId${item.id}`} style={{color: "transparent", textShadow: "0 0 5px #000"}}>
                          {"**,***"}
                          {user.currency}
                        </span>
                        {item.needs_laptop && settings?.laptop_incentive ? (<Laptop fontSize="small" sx={{color: laptopStatus.color}} />) : (null)}
                      </div>,
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
          _data = _data.filter((item) => item != null);
          setStudents(_data);   
        }
    }, [studentList, academicYearId, academicYears, academicCycles, invoiceList, tuitionPayments, tuitionItems, programs]);
  
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
  