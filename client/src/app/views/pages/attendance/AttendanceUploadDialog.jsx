import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const AttendanceUploadDialog = ({ open, onClose, t, enqueueSnackbar, save}) => {
  
    const [attendances, setAttendances] = React.useState([]);
  
    const handleUpload = (event) => {
        // extract the file to add attendance 1 by 1
        const reader = new FileReader();
        reader.onload = () => {
            const content = reader.result;
            const lines = content.split('\n');
            const attendances = lines.map((line) => {
                const columns = line.split(',');
                return {
                    employee_id: columns[0],
                    attendance_date: columns[3],
                    clock_in: columns[4],
                    clock_out: columns[5],
                };
            });
            setAttendances(attendances);
        };
        reader.readAsText(event.target.files[0]);
    }
    
    const onSubmit = () => {
        Promise.all(
          attendances.map((attendance) => {
              return handleSave(attendance);
          })
        )
        .then(() => {
          enqueueSnackbar(t("attendance.upload success"), { variant: "success" });
        })
        .catch((error) => {
          console.log(error);
          enqueueSnackbar(t("attendance.upload error"), { variant: "error" });
        });
        onClose();
    }
    
    const handleSave = (attendance) => {
        return save({
            employee_id: attendance.employee_id,
            attendance_date: attendance.attendance_date,
            clock_in: attendance.clock_in,
            clock_out: attendance.clock_out
        })
        .then(() => {
          return true;
        })
        .catch((error) => {
          console.log(error);
          enqueueSnackbar(t("attendance.save error"), { variant: "error" });
        });
    }
    // uploading attendance from a csv file
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{t("attendance.upload attendance")}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label={t("attendance.upload attendance")}
                    type="file"
                    fullWidth
                    variant="standard"
                    onChange={handleUpload}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t("attendance.cancel")}</Button>
                <Button onClick={onSubmit}>{t("attendance.upload")}</Button>
            </DialogActions>
        </Dialog>
    )
    
};

export default AttendanceUploadDialog;
