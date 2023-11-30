import { AddCircle, Delete, Edit } from "@mui/icons-material";
import { Box, Paper, styled, Table, TableBody, TableCell, TableRow } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { Breadcrumb, ConfirmationDialog } from "app/components";
import { TableHead, TableToolbar } from "app/components/data-table";
import { getComparator, stableSort } from "app/components/data-table/utils";
import useTable from "app/hooks/useTable";
import useData from "app/hooks/useData";
import { useAuth } from "app/hooks/useAuth";
import { useTranslation } from 'react-i18next';
import { useState } from "react";
import { useSnackbar } from "notistack";
import TransactionDialog from "./TransactionDialog";
import { numberWithCommas } from "app/utils/utils";

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

const AcademicsList = () => {
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

  const { data, saveData, updateData, deleteData } = useData("finance_transactions", user.company_id);
  const { data: accounts } = useData("finance_accounts", user.company_id);
  const { data: employees } = useData("employees", user.company_id);
  const { t, i18n } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // TABLE HEADER COLUMN LIST
  const columns = [
    { id: "date", align: "left", disablePadding: true, label: t("finance.table header.date")  },
    { id: "description", align: "left", disablePadding: false, label: t("finance.table header.description") },
    { id: "amount", align: "left", disablePadding: false, label: t("finance.table header.amount") },
    { id: "type", align: "left", disablePadding: false, label: t("finance.table header.type") },
    { id: "employee", align: "left", disablePadding: false, label: t("finance.table header.employee") },
    { id: "account", align: "left", disablePadding: false, label: t("finance.table header.account") },
    { id: "edit", align: "center", disablePadding: false, label: t("finance.table header.actions") },
  ];

  const handleClose = () => {
    setOpen(false);
    setTransaction(null);
  }

  const handleEdit = (row) => {
    setTransaction(row);
    setOpen(true);
  }

  const handleDeleteClick = (row) => {
    setTransaction(row);
    setConfirmDelete(true);
  }

  const handleDelete = () => {
    deleteData(transaction.id)
    .then(() => {
      enqueueSnackbar(t("finance.delete success"), { variant: "success" });
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(t("finance.delete error"), { variant: "error" });
    });
    setConfirmDelete(false);
    setTransaction(null);
  }

  const onSave = async (data) => {
    await saveData(data)
    .then((response) => {
      enqueueSnackbar(t("finance.save success"), { variant: "success" });
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(t("finance.save error"), { variant: "error" });
    });
    setOpen(false);
  }

  const onUpdate = async (data) => {
    await updateData(data)
    .then((response) => {
      enqueueSnackbar(t("finance.update success"), { variant: "success" });
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(t("finance.update error"), { variant: "error" });
    });
    setOpen(false);
  }

  return (
    <Container>
      <div className="breadcrumb" style={{display: "flex", justifyContent: "space-between"}}>
        <Breadcrumb
          routeSegments={[{ name: t("finance.transactions") }]}
        />
      </div>

      <Paper sx={{ width: "100%", mb: 2 }}>
        
        <div style={{display: "flex", justifyContent: "space-between"}}>
         <TableToolbar title={t("finance.all transactions")} numSelected={selected.length} />
          <IconButton onClick={() => setOpen(true)} style={{padding: "8px 20px"}}>
            <AddCircle />
          </IconButton>
        </div>

        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead
              order={order}
              orderBy={orderBy}
              headCells={columns}
              rowCount={data.length}
              onRequestSort={handleRequestSort}
              showSelect={false}
            />

            <TableBody>
              {stableSort(data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.name}
                      role="checkbox"
                    >
                      <TableCell align="left" style={{paddingLeft: "16px"}}>
                        {row.date}
                      </TableCell>

                      <TableCell align="left">
                        {row.description}
                      </TableCell>

                      <TableCell align="left">
                        {row.type == "expense" && "("}
                        {numberWithCommas(row.amount)} {user.currency}
                        {row.type == "expense" && ")"}
                      </TableCell>

                      <TableCell align="left">
                        {row.type}
                      </TableCell>

                      <TableCell align="left">
                        {employees.find((employee) => employee.id == row.employee_id)?.first_name + " " + employees.find((employee) => employee.id == row.employee_id)?.last_name}
                      </TableCell>

                      <TableCell align="left">
                        {accounts.find((account) => account.id == row.account_id)?.name}
                      </TableCell>

                      <TableCell align="center">
                        <IconButton onClick={() => handleEdit(row)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(row)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          count={data.length}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <TransactionDialog
        open={open}
        onClose={handleClose}
        save={onSave}
        update={onUpdate}
        transaction={transaction}
        accounts={accounts}
        employees={employees}
        t={t}
      />
      <ConfirmationDialog
        open={confirmDelete}
        title={t("finance.delete transaction title")}
        text={t("finance.delete transaction content")}
        onConfirmDialogClose={() => setConfirmDelete(false)}
        onYesClick={() => handleDelete(transaction.id)}
      />
    </Container>
  );
};

export default AcademicsList;
