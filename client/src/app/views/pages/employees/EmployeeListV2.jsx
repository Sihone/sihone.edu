import {
    MaterialReactTable,
    createMRTColumnHelper,
} from 'material-react-table';
import { Box, IconButton, Paper, TableContainer, styled } from '@mui/material';
import useData from 'app/hooks/useData';
import { getSections, useAuth } from 'app/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Delete, Edit } from '@mui/icons-material';
import { hasAccess } from 'app/utils/utils';
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
    const { data: _employees, deleteData } = useData("employees", user.company_id);
    const [employees, setEmployees] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { t } = useTranslation();

    const columns = [
        columnHelper.accessor('employee_id', {
          header: 'EID',
          size: 40,
        }),
        columnHelper.accessor('first_name', {
          header: t("main.first name"),
          size: 120,
        }),
        columnHelper.accessor('last_name', {
          header: t("main.last name"),
          size: 120,
        }),
        columnHelper.accessor('phone', {
          header: t("main.phone"),
          size: 100,
        }),
        columnHelper.accessor('email', {
          header: t("main.email"),
          size: 120,
        }),
        columnHelper.accessor('role', {
          header: t("main.role"),
          size: 80,
        }),
        columnHelper.accessor('actions', {
          header: t("main.actions"),
          size: 80,
        }),
      ];

    const handleDelete = (id) => {
        setDeleteId(id);
    };

    const onDelete = async () => {
        await deleteData(deleteId)
        .then(() => {
            setDeleteId(null);
            enqueueSnackbar(t("main.success"), { variant: "success" });
        })
        .catch((err) => {
            console.error(err);
            enqueueSnackbar(err.message || err.detail || err, { variant: "error" });
        });
    }

    useEffect(() => {
        if (_employees) {
            const _data = _employees.map((item) => ({
                employee_id: item.employee_id,
                first_name: item.first_name.toUpperCase(),
                last_name: item.last_name.toUpperCase(),
                phone: item.phone,
                email: item.email,
                role: item.role_name,
                actions: (
                    <Box sx={{ display: 'flex', gap: '8px' }}>
                        <IconButton onClick={() => navigate("/employees/" + item.id)}>
                            <Edit />
                        </IconButton>

                        {
                            item.super == 0 && hasAccess(user.permissions, getSections(t).delete_employee.id) && (
                            <IconButton onClick={() => handleDelete(item.id)}>
                                <Delete />
                            </IconButton>
                            )
                        }
                    </Box>
                  ),
            }));
            setEmployees(_data);
        }
    }, [_employees]);
  
    const table = useMaterialReactTableV2({
        columns,
        data: employees,
        exportedFileName: t("employees.title"),
    })
  
    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                routeSegments={[{ name: t("employees.title") }]}
                />
            </div>

            <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer>
                    <MaterialReactTable table={table} />
                </TableContainer>
                <ConfirmationDialog
                    open={!!deleteId}
                    title={t("employees.dialog title")}
                    text={t("employees.dialog content")}
                    onConfirmDialogClose={() => setDeleteId(null)}
                    onYesClick={onDelete}
                />
            </Paper>
        </Container>
    );
  };
  
  export default Example;
  