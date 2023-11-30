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
import AccountDialog from "./AccountDialog";
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

  const { data, saveData, updateData, deleteData } = useData("finance_accounts", user.company_id);
  const { data: transactions } = useData("finance_transactions", user.company_id);
  const { t, i18n } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // TABLE HEADER COLUMN LIST
  const columns = [
    { id: "name", align: "left", disablePadding: true, label: t("finance.table header.name") },
    { id: "description", align: "left", disablePadding: false, label: t("finance.table header.description") },
    { id: "balance", align: "left", disablePadding: false, label: t("finance.table header.balance") },
    { id: "edit", align: "center", disablePadding: false, label: t("finance.table header.actions") },
  ];

  const handleClose = () => {
    setOpen(false);
    setAccount(null);
  }

  const handleEdit = (row) => {
    setAccount(row);
    setOpen(true);
  }

  const handleDeleteClick = (row) => {
    setAccount(row);
    setConfirmDelete(true);
  }

  const handleDelete = () => {
    deleteData(account.id)
    .then(() => {
      enqueueSnackbar(t("finance.delete success"), { variant: "success" });
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(t("finance.delete error"), { variant: "error" });
    });
    setConfirmDelete(false);
    setAccount(null);
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
          routeSegments={[{ name: t("finance.accounts") }]}
        />
      </div>

      <Paper sx={{ width: "100%", mb: 2 }}>
        
        <div style={{display: "flex", justifyContent: "space-between"}}>
         <TableToolbar title={t("finance.all accounts")} numSelected={selected.length} />
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
                  const _transactions = transactions.filter((transaction) => transaction.account_id === row.id);
                  let balance = _transactions.reduce((acc, transaction) => {
                    if (transaction.type === "income") {
                      return acc + transaction.amount;
                    } else {
                      return acc - transaction.amount;
                    }
                  }, 0);
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.name}
                      role="checkbox"
                    >
                      <TableCell align="left" style={{paddingLeft: "16px"}}>
                        {row.name}
                      </TableCell>

                      <TableCell align="left">
                        {row.description}
                      </TableCell>

                      <TableCell align="left">
                        {balance < 0 && "("}
                        {numberWithCommas(balance < 0 ? (balance * -1) : balance)} {user.currency}
                        {balance < 0 && ")"}
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
      <AccountDialog
        open={open}
        onClose={handleClose}
        save={onSave}
        update={onUpdate}
        account={account}
        t={t}
      />
      <ConfirmationDialog
        open={confirmDelete}
        title={t("finance.delete account title")}
        text={t("finance.delete account content")}
        onConfirmDialogClose={() => setConfirmDelete(false)}
        onYesClick={() => handleDelete(account.id)}
      />
    </Container>
  );
};

export default AcademicsList;
