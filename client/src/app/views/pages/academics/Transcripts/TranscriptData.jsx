import React, { useEffect, useState } from 'react';
import { TableContainer, Table, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import useTable from 'app/hooks/useTable';
import { TableHead, TableToolbar } from "app/components/data-table";
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { semesters } from 'app/utils/constant';
import "./styles.css"
import { format } from 'date-fns';

const TranscriptData = ({ student, exams, courses, user }) => {
    const [courseList, setCourseList] = useState([]);
    const [totalCoefficient, setTotalCoefficient] = useState(0);
    const [totalGrade, setTotalGrade] = useState(0);
    const [classAverage, setClassAverage] = useState(0);
    const { t, i18n } = useTranslation();

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

    const columns = [
        { id: "course", align: "left", disablePadding: true, label: t("academics.course") },
        { id: "coefficient", align: "left", disablePadding: false, label: t("academics.table header.coefficient") },
        { id: "grade", align: "left", disablePadding: false, label: t("academics.average") },
        { id: "total_mark", align: "left", disablePadding: false, label: t("academics.table header.exam total") },
    ];

    useEffect(() => {
        if (exams) {
            const _examsByCourse = _.groupBy(exams, 'course_id');

            let _totalGrade = 0;
            let _classAverage = 0;
            let _totalCoefficient = 0;

            const _courses = Object.keys(_examsByCourse).map((course_id) => {
                const _course = courses.find((item) => item.id == course_id);
                const _exams = _examsByCourse[course_id];
                let student_grade = 0;
                let mark_count = 0;
                let hasMark = false;

                let class_grade = 0;
                
                _exams.forEach((exam) => {
                    const _grades = JSON.parse(exam.grades);
                    if (_grades[student.id]) {
                        student_grade += (_grades[student.id] / exam.total_mark) * 20;
                        class_grade += ((Object.values(_grades).reduce((a, b) => a + Number(b), 0) / Object.values(_grades).length) / exam.total_mark) * 20;
                        mark_count++;

                        hasMark = true;
                    }
                });

                if (!hasMark) {
                    return null;
                }

                _totalGrade += (student_grade/mark_count) * _course.coefficient;
                _classAverage += (class_grade/mark_count) * _course.coefficient;

                _totalCoefficient += _course.coefficient;

                return {
                    course: i18n.language == "en" ? _course.name_en : _course.name_fr,
                    coefficient: _course.coefficient,
                    grade: (student_grade/mark_count).toFixed(2),
                    total_mark: ((student_grade/mark_count) * _course.coefficient).toFixed(2),
                    semester: _course.semester
                }
            });
            setCourseList(_courses.filter((course) => course));
            setTotalCoefficient(_totalCoefficient);
            setTotalGrade(_totalGrade);
            setClassAverage(_classAverage);
        }
    }, [exams, student, courses, i18n.language]);

    return (
        <Paper sx={{ width: "100%", mb: 2 }}>
            <TableContainer style={{padding: "16px"}}>
                <div style={{paddingLeft: "16px", paddingRight: "16px"}}>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div>
                            <h4>{student.label}</h4>
                            <h5>{t("students.student id")}: {student.student_id}</h5>
                            <h5>{t("students.dob")}: {student.dob}</h5>
                            <h5>{t("academics.year admitted")}: <b>{student.academic_year?.name}</b></h5>
                        </div>
                        <div style={{textAlign: "right"}}>
                            <h4>{t("academics.transcript")}</h4>
                            <h5>{user.company_name}</h5>
                            <h5>{i18n.language == "en" ? student.program.long_name_en : student.program.long_name_fr}</h5>
                            <h5>{i18n.language == "en" ? student.program.name_en : student.program.name_fr}</h5>
                        </div>
                    </div>

                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <h5>{t("academics.table header.exam score")}: <b>{totalGrade.toFixed(2)}</b></h5>
                        <h5>{t("academics.table header.coefficient")}: <b>{totalCoefficient}</b></h5>
                        <h5>{t("academics.overall average")}: <b>{(totalGrade/totalCoefficient).toFixed(2)}</b></h5>
                        
                        <h5>{t("academics.table header.class average")}: <b>{(classAverage/totalCoefficient).toFixed(2)}</b></h5>
                        <h5>{t("main.date printed")}: {format(new Date(), "MMM dd, yyyy")}</h5>
                    </div>
                </div>
                <Table sx={{ minWidth: 750 }}>
                    <TableHead
                        order={order}
                        orderBy={orderBy}
                        headCells={columns}
                        onRequestSort={handleRequestSort}
                        showSelect={false}
                    />

                    <TableBody>
                        {Object.keys(_.groupBy(courseList, 'semester')).map((semesterId) => {
                                const coursesPerSemester =  _.groupBy(courseList, 'semester')[semesterId];
                                const semester = semesters(t).find((item) => item.id === Number(semesterId));
                                const row = coursesPerSemester.map((course) => {
                                    return (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={course.course}
                                            role="checkbox"
                                        >
                                            <TableCell align="left" style={{paddingLeft: "16px"}}>
                                                {course.course}
                                            </TableCell>

                                            <TableCell align="left">{course.coefficient}</TableCell>

                                            <TableCell align="left">
                                                {course.grade}
                                            </TableCell>

                                            <TableCell align="left">{course.total_mark}</TableCell>
                                        </TableRow>
                                    );
                                })
                                return (
                                    <>
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={semester.name}
                                            role="checkbox"
                                            className="semester-row"
                                        >
                                            <TableCell align="left" style={{paddingLeft: "16px"}} th>
                                                <b>{semester.name}</b>
                                            </TableCell>

                                            <TableCell align="left"></TableCell>

                                            <TableCell align="left"></TableCell>

                                            <TableCell align="left"></TableCell>
                                        </TableRow>
                                        {row}
                                    </>
                                )
                            }
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
        );
};

export default TranscriptData;
