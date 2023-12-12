import {
    MaterialReactTable,
    createMRTColumnHelper,
} from 'material-react-table';
import { Box, IconButton, LinearProgress, Paper, TableContainer, styled } from '@mui/material';
import useData from 'app/hooks/useData';
import { useAuth } from 'app/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { Breadcrumb, ConfirmationDialog } from "app/components";
import { useMaterialReactTableV2 } from 'app/hooks/useMaterialReactTable';
import AttendanceDialog from './AttendanceDialog';

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
    const { enqueueSnackbar } = useSnackbar();

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
        if (_attendance) {
            const _data = _attendance.map((item) => ({
                employee: item.first_name + " " + item.last_name,
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
            setAttendance(_data);
        }
    }, [_attendance]);
  
    const table = useMaterialReactTableV2({
      columns,
      data: attendance,
      exportedFileName: t("attendance.title"),
      actions: [
        {
          label: t("attendance.add attendance"),
          onClick: () => setOpen(true),
          icon: <Add />,
        }
      ]
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
            </Paper>
        </Container>
    );
  };
  
  export default Example;
  