import { Delete, Edit } from "@mui/icons-material";
import { Box, Checkbox, Paper, styled, Table, TableBody, TableCell, TableRow } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { Breadcrumb, ConfirmationDialog } from "app/components";
import { TableHead, TableToolbar } from "app/components/data-table";
import { getComparator, stableSort } from "app/components/data-table/utils";
import { H5 } from "app/components/Typography";
import useTable from "app/hooks/useTable";
import useData from "app/hooks/useData";
import { useNavigate } from "react-router-dom";
import { useAuth } from "app/hooks/useAuth";
import { useTranslation } from 'react-i18next';
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

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

const EmployeeList = () => {
  const {
    page,
    order,
    orderBy,
    selected,
    rowsPerPage,

    isSelected,
    handleClick,
    handleChangePage,
    handleRequestSort,
    handleSelectAllClick,
    handleChangeRowsPerPage,
  } = useTable({ defaultOrderBy: "name" });

  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: users, deleteData } = useData("employees", user.company_id);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [deleteId, setDeleteId] = useState(null);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  // TABLE HEADER COLUMN LIST
  const columns = [
    { id: "name", align: "left", disablePadding: true, label: t("employees.table header.name") },
    { id: "phone", align: "left", disablePadding: false, label: t("employees.table header.phone") },
    { id: "email", align: "left", disablePadding: false, label: t("employees.table header.email") },
    { id: "role", align: "left", disablePadding: false, label: t("employees.table header.role") },
    { id: "edit", align: "center", disablePadding: false, label: t("employees.table header.actions") },
  ];

  const handleSelectAllRows = (event) => {
    const newSelected = users.map((n) => n.name);
    handleSelectAllClick(event.target.checked, newSelected);
  };

  useEffect(() => {
    if (users) {
      const _employees = users?.map((item) => {
        if (item.super == 1) return null;
        return {
          id: item.id,
          name: item.first_name + " " + item.last_name,
          phone: item.phone,
          email: item.email,
          role: item.role_name + " - " + item.role_description ,
          super: item.super,
        }
      });
      setFilteredEmployees(_employees.filter((item) => item));
    }
  }, [users]);

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
    

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: t("employees.title") }]}
        />
      </div>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableToolbar title={t("employees.table title")} numSelected={selected.length} />

        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead
              order={order}
              orderBy={orderBy}
              headCells={columns}
              numSelected={selected.length}
              rowCount={filteredEmployees.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllRows}
              showSelect={false}
            />

            <TableBody>
              {stableSort(filteredEmployees, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isItemSelected = isSelected(row.name);

                  if (row.super == 1) {
                    return null;
                  }

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.name}
                    >
                      <TableCell component="th" scope="row" style={{paddingLeft: "16px"}}>
                        <FlexBox gap={1}>
                          <H5 fontSize={15}>{row.name}</H5>
                        </FlexBox>
                      </TableCell>

                      <TableCell align="left">{row.phone}</TableCell>

                      <TableCell align="left">{row.email}</TableCell>

                      <TableCell align="left">{row.role}</TableCell>

                      <TableCell align="center">
                        <IconButton onClick={() => navigate("/employees/" + row.id)}>
                          <Edit />
                        </IconButton>

                        {
                          row.super == 0 && (
                            <IconButton onClick={() => handleDelete(row.id)}>
                              <Delete />
                            </IconButton>
                          )
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <ConfirmationDialog
          open={!!deleteId}
          title={t("employees.dialog title")}
          text={t("employees.dialog content")}
          onConfirmDialogClose={() => setDeleteId(null)}
          onYesClick={onDelete}
        />
        <TablePagination
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          count={filteredEmployees.length}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default EmployeeList;
