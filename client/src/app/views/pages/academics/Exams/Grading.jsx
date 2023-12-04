import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, TableContainer, Table, TableBody, TableRow, TableCell, IconButton } from '@mui/material';
import {Close} from '@mui/icons-material';
import useTable from 'app/hooks/useTable';
import { getComparator, stableSort } from "app/components/data-table/utils";
import { TableHead, TableToolbar } from "app/components/data-table";

const GradingDialog = ({ open, onClose, updateData, exam, t, i18n, students }) => {
    const [grade, setGrade] = useState([]);

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

    const handleGradeChange = (id, value) => {
        const pair = {[id]: value};
        setGrade({...grade, ...pair});
    };

    useEffect(() => {
        if (open && exam) {
            let _grades = JSON.parse(exam.grades);
            // remove null values
            _grades = Object.fromEntries(Object.entries(_grades).filter(([_, v]) => v != null && v != ''));
            setGrade(_grades);
        }
    } , [exam]);

    const handleSave = () => {
        // Perform grading logic here
        // Use the grade and exam data to update the student's grade
        // Call the update function to save the changes
        updateData({
            ...exam,
            grades: JSON.stringify(grade)
        });
        onClose();
    };

    const columns = [
        { id: "sudent_id", align: "left", disablePadding: true, label: t("students.student id") },
        { id: "student_name", align: "left", disablePadding: false, label: t("students.student name") },
        { id: "grade", align: "left", disablePadding: false, label: t("academics.exam mark on", {value: exam?.total_mark}) },
    ];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen
        >
            <DialogTitle style={{display: "flex", justifyContent: "space-between"}}>
                {t('academics.exam grading')}: {i18n.language === 'en' ? exam?.name_en : exam?.name_fr}
                <IconButton onClick={onClose}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TableContainer>
                    <Table sx={{ minWidth: 750 }}>
                        <TableHead
                            order={order}
                            orderBy={orderBy}
                            headCells={columns}
                            rowCount={students?.length}
                            onRequestSort={handleRequestSort}
                            showSelect={false}
                        />

                        <TableBody>
                            {stableSort(students, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                ?.map((row) => {
                                    return (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={row.student_id}
                                            role="checkbox"
                                        >
                                            <TableCell style={{paddingLeft: "16px"}}>
                                                {row.student_id}
                                            </TableCell>
                                            <TableCell align="left">{row.first_name} {row.last_name}</TableCell>
                                            <TableCell align="left">
                                                <TextField
                                                    label={t('academics.exam mark')}
                                                    value={grade[row.id] || ''}
                                                    onChange={(e) => handleGradeChange(row.id, e.target.value)}
                                                    size='small'
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t('Cancel')}</Button>
                <Button onClick={handleSave} color="primary">{t('Save')}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default GradingDialog;
