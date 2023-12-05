import { Autocomplete, Box, MenuItem, Paper, TextField, styled } from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import { Breadcrumb } from "app/components";
import { TableToolbar } from "app/components/data-table";
import useTable from "app/hooks/useTable";
import { useAuth } from "app/hooks/useAuth";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useData from "app/hooks/useData";
import TranscriptData from "./TranscriptData";
import { set } from "lodash"

// styled components
const FlexBox = styled(Box)({ display: "flex", alignItems: "center" });

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

const Transcripts = () => {
  const {
    page,
    order,
    orderBy,
    selected,
    rowsPerPage,

    isSelected,
    handleChangePage,
    handleRequestSort,
    handleChangeRowsPerPage,
  } = useTable({ defaultOrderBy: "name" });

  const { user } = useAuth();
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(user.currentAcademicYearId);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [allStudents, setAllStudents] = useState([]);

  const { t } = useTranslation();
  const { data: academicYears } = useData("academic_years", user.company_id);
  const { data: exams } = useData("academic_exams", user.company_id);
  const { data: courses } = useData("academic_courses", user.company_id);
  const { data: programs } = useData("academic_programs", user.company_id);

  useEffect(() => {
    if (selectedAcademicYear) {
        fetch(`/api/students_ay/${user.company_id}/${selectedAcademicYear}`)
            .then(response => response.json())
            .then(responseData => {
                setAllStudents(responseData?.map((student) => (
                    {
                        id: student.id,
                        label: student.first_name + ' ' + student.last_name,
                        student_id: student.student_id,
                        dob: student.dob,
                        academic_year: academicYears.find((ay) => ay.id === student.academic_year_id),
                        program: programs.find((program) => program.id === student.program_id),
                    }
                )));
            })
            .catch(error => {
                console.log('Error fetching and parsing data', error);
            });
    }
    }, [selectedAcademicYear, academicYears, programs]);

    const handleAcademicYearChange = (event) => {
        setSelectedAcademicYear(event.target.value);
        setSelectedStudent(null);
    }

    const handleStudentChange = (event) => {
        setSelectedStudent(null);
        setSelectedStudent(event.target.value);
    }

  return (
    <Container>
      <div className="breadcrumb" style={{display: "flex", justifyContent: "space-between"}}>
        <Breadcrumb
          routeSegments={[{ name: t("academics.transcript") }]}
        />
      </div>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableToolbar title={t("academics.select year and student")} numSelected={selected.length} />
        <TableContainer style={{display: "flex", gap: "16px", padding: "16px"}}>
            <TextField
                select
                name="role"
                label={t("academics.table header.program")}
                variant="outlined"
                value={selectedAcademicYear}
                onChange={handleAcademicYearChange}
                InputLabelProps={{
                    shrink: !!selectedAcademicYear,
                }}
                >
                    <MenuItem value={null}>{t("academics.select academic year")}</MenuItem>
                    {academicYears?.map((item) => {
                        return (
                            <MenuItem value={item.id} key={item.id}>
                                {item.name}
                            </MenuItem>
                        )
                    })}
            </TextField>
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={allStudents}
                sx={{ width: 300 }}
                value={selectedStudent}
                renderInput={(params) => <TextField {...params} label={t("students.title")} />}
                onChange={(event, value) => setSelectedStudent(value)}
            />
        </TableContainer>
      </Paper>
      {selectedStudent && (
            <TranscriptData
                student={selectedStudent}
                exams={exams}
                courses={courses}
                user={user}
            />
        )}
    </Container>
  );
};

export default Transcripts;
