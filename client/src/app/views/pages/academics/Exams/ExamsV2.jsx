import {
    MaterialReactTable,
    createMRTColumnHelper,
} from 'material-react-table';
import { Box, Button, IconButton, Paper, Popover, TableContainer, Typography, styled } from '@mui/material';
import useData from 'app/hooks/useData';
import { useAuth } from 'app/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Add, Delete, Edit, HistoryEdu } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { Breadcrumb, ConfirmationDialog } from "app/components";
import { useMaterialReactTableV2 } from 'app/hooks/useMaterialReactTable';
import GradingDialog from './Grading';
import ExamDialog from "./ExamDialog";

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

const FlexBox = styled(Box)({ display: "flex", alignItems: "center" });
  
  const columnHelper = createMRTColumnHelper();
  
  const Example = () => {
    const {user} = useAuth();
    const { data: _exams, saveData, updateData, deleteData } = useData("academic_exams", user.company_id, user.currentAcademicYearId);
    const { data: employees } = useData("employees", user.company_id);
    const { data: courses } = useData("academic_courses", user.company_id);
    const { data: students } = useData("students", user.company_id);
    const { data: programs } = useData("academic_programs", user.company_id);
    const [exams, setExams] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const [open, setOpen] = useState(false);
    const [exam, setExam] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [program_ids_show, setProgramIdsShow] = useState(null);
    const [grading, setGrading] = useState(null);
    const [gradingStudents, setGradingStudents] = useState(null);

    const { t, i18n } = useTranslation();

    const columns = [
        columnHelper.accessor('name', {
          header: t("academics.table header.name"),
          size: 100,
        }),
        columnHelper.accessor('course', {
          header: t("academics.course"),
          size: 100,
        }),
        columnHelper.accessor('programs', {
          header: t("academics.table header.programs"),
          size: 100,
        }),
        columnHelper.accessor('date', {
          header: t("academics.table header.exam date"),
          size: 100,
        }),
        columnHelper.accessor('duration', {
          header: t("academics.table header.exam duration"),
          size: 80,
        }),
        columnHelper.accessor('average', {
          header: t("academics.table header.class average"),
          size: 100,
        }),
        columnHelper.accessor('graded', {
          header: t("academics.table header.graded"),
          size: 60,
        }),
        columnHelper.accessor('examiner', {
          header: t("academics.table header.examiner"),
          size: 120,
        }),
        columnHelper.accessor('actions', {
          header: t("main.actions"),
          size: 80,
        }),
      ];

      const handleClose = () => {
        setOpen(false);
        setExam(null);
      }
    
      const handleEdit = (row) => {
        setExam(row);
        setOpen(true);
      }
    
      const handleDeleteClick = (row) => {
        setExam(row);
        setConfirmDelete(true);
      }
    
      const handleDelete = () => {
        deleteData(exam.id)
        .then(() => {
          enqueueSnackbar(t("academics.delete success"), { variant: "success" });
        })
        .catch((error) => {
          console.log(error);
          enqueueSnackbar(t("academics.delete error"), { variant: "error" });
        });
        setConfirmDelete(false);
        setExam(null);
      }
    
      const onSave = async (data) => {
        await saveData(data)
        .then((response) => {
          enqueueSnackbar(t("academics.save success"), { variant: "success" });
        })
        .catch((error) => {
          console.log(error);
          enqueueSnackbar(t("academics.save error"), { variant: "error" });
        });
        setOpen(false);
      }
    
      const onUpdate = async (data) => {
        await updateData(data)
        .then((response) => {
          enqueueSnackbar(t("academics.update success"), { variant: "success" });
        })
        .catch((error) => {
          console.log(error);
          enqueueSnackbar(t("academics.update error"), { variant: "error" });
        });
        setOpen(false);
      }
    
      const handleShowPrograms = (event, program_ids_show) => {
        setProgramIdsShow(program_ids_show);
        setAnchorEl(event.currentTarget);
      };
    
      const handleCloseCourses = () => {
        setAnchorEl(null);
      };
    
      const handleGrading = (row) => {
        setGrading(row);
      };
    
      const handleCloseGrading = () => {
        setGrading(null);
        setGradingStudents(null);
      };

    useEffect(() => {
        if (_exams) {
            const _data = _exams.map((item) => {
              const course = courses?.find((_item) => _item.id == item.course_id);
              const course_name = i18n.language == "en" ? course?.name_en : course?.name_fr;
              const _grades = JSON.parse(item.grades || '[]');
              const program_ids = JSON.parse(course?.program_ids || '[]');
              const _students = students?.filter((_item) => program_ids?.includes(_item.program_id));
              const _graded = _students?.filter((_item) => _grades[_item.id] != undefined && _grades[_item.id] != null && _grades[_item.id] != "");
              const classAverage = _graded?.reduce((acc, _item) => acc + parseInt(_grades[_item.id]), 0) / _graded?.length;
              return {
                name: i18n.language == "en" ? item.name_en : item.name_fr,
                course: course_name,
                programs: program_ids.length > 0 ? (
                  <FlexBox>
                    <Button onClick={(event) => handleShowPrograms(event, program_ids)}>
                      {program_ids.length} {t("academics.programs")}
                    </Button>
                  </FlexBox>
                ) : (
                  <FlexBox>
                    {t("academics.no program")}
                  </FlexBox>
                ),
                date: item.date,
                duration: (item.duration || 0) + " mins",
                average: (classAverage ? classAverage.toFixed(2) : "-") + " / " + item.total_mark || "-",
                graded: t("academics.graded", { num: _graded.length, count: _students.length}),
                examiner: employees?.find((_item) => _item.id == item.employee_id)?.first_name + " " + employees?.find((_item) => _item.id == item.employee_id)?.last_name,
                actions: (
                    <Box sx={{ display: 'flex', gap: '8px' }}>
                        <IconButton onClick={() => handleGrading(item)}>
                          <HistoryEdu />
                        </IconButton>
                        <IconButton onClick={() => handleEdit(item)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(item)}>
                          <Delete />
                        </IconButton>
                    </Box>
                  ),
              }
          });
          setExams(_data);
        }
    }, [_exams, courses, students, employees]);
  
    const table = useMaterialReactTableV2({
        columns,
        data: exams,
        exportedFileName: t("academics.exams"),
        actions: [
            {
                icon: <Add />,
                label: t("academics.add exam"),
                onClick: () => {
                    setOpen(true);
                }
            }
        ]
    })

    const openShowCourses = Boolean(anchorEl);
    const showCoursesId = openShowCourses ? 'simple-popover' : undefined;
    useEffect(() => {
      if (grading) {
        const course = courses?.find((item) => item.id == grading.course_id);
        const program_ids = JSON.parse(course?.program_ids || '[]');
        const _students = students?.filter((item) => program_ids?.includes(item.program_id));
        setGradingStudents(_students);
      }
    }, [grading]);
  
    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                routeSegments={[{ name: t("academics.exams") }]}
                />
            </div>

            <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer>
                    <MaterialReactTable table={table} />
                </TableContainer>
                <ExamDialog
                  open={open}
                  onClose={handleClose}
                  save={onSave}
                  update={onUpdate}
                  exam={exam}
                  employees={employees}
                  courses={courses.filter((item) => !JSON.parse(item.exempted_academic_years).includes(user.currentAcademicYearId))}
                  t={t}
                  i18n={i18n}
                />
                <GradingDialog
                  open={grading}
                  onClose={handleCloseGrading}
                  exam={grading}
                  t={t}
                  i18n={i18n}
                  students={gradingStudents || []}
                  updateData={onUpdate}
                />
                <ConfirmationDialog
                  open={confirmDelete}
                  title={t("academics.delete exam title")}
                  text={t("academics.delete exam content")}
                  onConfirmDialogClose={() => setConfirmDelete(false)}
                  onYesClick={() => handleDelete(exam.id)}
                />
                <Popover
                  id={showCoursesId}
                  open={openShowCourses}
                  anchorEl={anchorEl}
                  onClose={handleCloseCourses}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    {
                      program_ids_show?.map((program_id) => {
                        const _program = programs?.find((item) => item.id == program_id);
                        return (
                          <Typography key={program_id} sx={{ mb: 1.5 }}>
                            {
                              i18n.language == "en" ? (
                                _program?.short_name_en + " - " + _program?.name_en
                              ) : (
                                _program?.short_name_fr + " - " + _program?.name_fr
                              )
                            }
                          </Typography>
                        )
                      })
                    }
                  </Box>

                </Popover>
            </Paper>
        </Container>
    );
  };
  
  export default Example;
  