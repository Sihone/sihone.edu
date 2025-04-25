import {
    MaterialReactTable,
    createMRTColumnHelper,
} from 'material-react-table';
import { Box, FormControlLabel, IconButton, LinearProgress, Paper, Switch, TableContainer, TextField, Typography, styled } from '@mui/material';
import useData from 'app/hooks/useData';
import { useAuth } from 'app/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Add, Delete, Edit, Upload } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { Breadcrumb, ConfirmationDialog } from "app/components";
import { useMaterialReactTableV2 } from 'app/hooks/useMaterialReactTable';
import AttendanceDialog from './AttendanceDialog';
import AttendanceUploadDialog from './AttendanceUploadDialog';

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
    const { data: _attendance, deleteData, saveData, updateData, loading } = useData("attendance", user.company_id);
    const { data: employees } = useData("employees", user.company_id);
    const [attendance, setAttendance] = useState([]);
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selectedFromDate, setSelectedFromDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - new Date().getDay() + 2).toISOString().slice(0, 10))
    const [selectedToDate, setSelectedToDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + (6 - new Date().getDay()) + 2).toISOString().slice(0, 10))
    const [showAll, setShowAll] = useState(false);
    const [totalHours, setTotalHours] = useState(0);
    const { enqueueSnackbar } = useSnackbar();
    
    const [uploadOpen, setUploadOpen] = useState(false);

    const { t } = useTranslation();

    const columns = [
        columnHelper.accessor('employee', {
          header: t("attendance.table header.employee"),
          size: 120,
        }),
        columnHelper.accessor('date', {
          header: t("attendance.table header.date"),
          size: 60,
        }),
        columnHelper.accessor('clock_in', {
          header: t("attendance.table header.clock in"),
          size: 60,
        }),
        columnHelper.accessor('clock_out', {
          header: t("attendance.table header.clock out"),
          size: 60,
        }),
        columnHelper.accessor('total', {
          header: t("attendance.table header.total"),
          size: 60,
        }),
        columnHelper.accessor('actions', {
          header: t("main.actions"),
          size: 80,
        }),
      ];

    const handleClose = () => {
      setOpen(false);
      setUploadOpen(false);
      setSelectedAttendance(null);
    }
  
    const handleEdit = (row) => {
      setSelectedAttendance(row);
      setOpen(true);
    }
  
    const handleDeleteClick = (row) => {
      setSelectedAttendance(row);
      setConfirmDelete(true);
    }
  
    const handleDelete = (id) => {
      deleteData(id)
      .then(() => {
        enqueueSnackbar(t("attendance.delete success"), { variant: "success" });
      })
      .catch((error) => {
        console.log(error);
        enqueueSnackbar(t("attendance.delete error"), { variant: "error" });
      });
      setConfirmDelete(false);
      setSelectedAttendance(null);
    }

    useEffect(() => {
        let _data = _attendance;
        if (_attendance) {
            _data = _attendance.map((item) => ({
                employee: item.first_name.toUpperCase() + " " + item.last_name.toUpperCase(),
                date: item.attendance_date,
                clock_in: item.clock_in,
                clock_out: item.clock_out,
                total: (item.total_time / 60 / 60).toFixed(2),
                actions: (
                    <Box sx={{ display: 'flex', gap: '8px' }}>
                        <IconButton onClick={() => handleEdit(item)}>
                          <Edit />
                        </IconButton>

                        <IconButton onClick={() => handleDeleteClick(item)}>
                          <Delete />
                        </IconButton>
                    </Box>
                  ),
            }));
        }
        if (!showAll) {
          _data = _data.filter((item) => new Date(item.date) >= new Date(selectedFromDate) && new Date(item.date) <= new Date(selectedToDate));
        }
        setAttendance(_data);
        setTotalHours(_data.reduce((total, item) => total + parseFloat(item.total), 0));
    }, [_attendance, selectedFromDate, selectedToDate, showAll]);
  
    const table = useMaterialReactTableV2({
      columns,
      data: attendance,
      exportedFileName: t("attendance.title"),
      actions: [
        {
          label: t("attendance.add attendance"),
          onClick: () => setOpen(true),
          icon: <Add />,
        },
        {
          label: t("attendance.upload attendance"),
          onClick: () => setUploadOpen(true),
          icon: <Upload />,
        }
      ],
      extraComponents: [
        <TextField
          fullWidth
          size='small'
          label={t("main.filter from")}
          value={selectedFromDate}
          onChange={(e) => setSelectedFromDate(e.target.value)}
          type="date"
          sx={{ maxWidth: 200 }}
          InputLabelProps={{
            shrink: true,
          }}
          disabled={showAll}
        />,
        <TextField
          fullWidth
          size='small'
          label={t("main.filter to")}
          value={selectedToDate}
          onChange={(e) => setSelectedToDate(e.target.value)}
          type="date"
          sx={{ maxWidth: 200 }}
          InputLabelProps={{
            shrink: true,
          }}
          disabled={showAll}
        />,
        <FormControlLabel
          label={t("attendance.show all")}
          labelPlacement='start'
          control={
            <Switch
              checked={showAll}
              onChange={(e) => setShowAll(e.target.checked)}
            />
          }
        />,
        <TextField
          fullWidth
          size='small'
          label={t("attendance.total hours")}
          value={totalHours}
          type="text"
          sx={{ maxWidth: 200 }}
          InputLabelProps={{
            shrink: true,
          }}
          disabled={true}
        />,
      ],
    })
  
    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                routeSegments={[{ name: t("attendance.title") }]}
                />
            </div>

            <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer>
                  {loading && <LinearProgress />}
                  <MaterialReactTable table={table} />
                </TableContainer>
                <AttendanceDialog
                  open={open}
                  onClose={handleClose}
                  employees={employees}
                  save={saveData}
                  update={updateData}
                  attendance={selectedAttendance}
                  enqueueSnackbar={enqueueSnackbar}
                  t={t}
                />
                <ConfirmationDialog
                  open={confirmDelete}
                  title={t("attendance.delete dialog title")}
                  text={t("attendance.delete dialog content")}
                  onConfirmDialogClose={() => setConfirmDelete(false)}
                  onYesClick={() => handleDelete(selectedAttendance.id)}
                />
                <AttendanceUploadDialog
                  open={uploadOpen}
                  onClose={handleClose}
                  t={t}
                  enqueueSnackbar={enqueueSnackbar}
                  save={saveData}
                />
            </Paper>
        </Container>
    );
  };
  
  export default Example;
  