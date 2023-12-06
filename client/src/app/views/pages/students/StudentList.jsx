import { Delete, Edit, TrendingFlat, Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Checkbox, Link, Paper, styled, Table, TableBody, TableCell, TableRow } from "@mui/material";
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
import { numberWithCommas } from "app/utils/utils";
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

const StudentList = () => {
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

  const { data: _students, deleteData } = useData("students", user.company_id);
  const { data: programs } = useData("academic_programs", user.company_id);
  const { data: tuitionPayments } = useData("tuition_payments", user.company_id);
  const { data: tuitionItems } = useData("tuition_items", user.company_id);
  const { data: invoiceList } = useData("tuitions", user.company_id);
  const { t, i18n } = useTranslation();

  const [item, setItem] = useState(null);
  const [showBalanceId, setShowBalanceId] = useState(null);

  const [inactive, setInactive] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (_students) {
      if (inactive) {
        setStudents(_students);
      } else {
        setStudents(_students.filter((item) => item.status == "active"));
      }
    }
  }, [_students, inactive]);


  const { enqueueSnackbar } = useSnackbar();

  // TABLE HEADER COLUMN LIST
  const columns = [
    { id: "name", align: "left", disablePadding: true, label: t("students.table header.name") },
    { id: "phone", align: "left", disablePadding: false, label: t("students.table header.phone") },
    { id: "parent-phone", align: "left", disablePadding: false, label: t("students.table header.parent phone") },
    { id: "program", align: "left", disablePadding: false, label: t("students.table header.program") },
    { id: "balance", align: "left", disablePadding: false, label: t("students.table header.balance") },
    { id: "edit", align: "center", disablePadding: false, label: t("main.actions") },
  ];

  const handleDelete = (id) => {
    setItem(id);
  };

  const onDelete = async (id) => {
    await deleteData(id)
      .then(() => {
        setItem(null);
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
          routeSegments={[{ name: t("students.title") }]}
        />
      </div>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center" , paddingRight: "16px"}}>
          <TableToolbar title={t("students.table title")} numSelected={selected.length} />
          <Link onClick={() => setInactive(!inactive)} style={{cursor: "pointer"}}>
            {inactive ? t("students.hide inactive") : t("students.show inactive")}
          </Link>
        </div>

        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead
              order={order}
              orderBy={orderBy}
              headCells={columns}
              numSelected={selected.length}
              rowCount={students.length}
              onRequestSort={handleRequestSort}
              showSelect={false}
            />

            <TableBody>
              {stableSort(students, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isItemSelected = isSelected(row.name);
                  const program = programs.find((item) => item.id == row.program_id);
                  const programName = i18n.language == "en" ? (program?.short_name_en + " - " + program?.name_en) : (program?.short_name_fr + " - " + program?.name_fr);
                  const showBalance = showBalanceId == row.id;

                  let _gender = row.gender === "male" ? "M" : "F";
                  if (i18n.language == "fr") {
                    _gender = row.gender === "male" ? "H" : "F";
                  }

                  const invoice = invoiceList.find((item) => item.student_id == row.id);
                  const _payments = tuitionPayments.filter((payment) => payment.tuition_id === invoice?.id);
                  const _totalPayments = _payments.reduce((acc, payment) => acc + payment.amount, 0);

                  const _tuitionItems = tuitionItems.filter((item) => item.tuition_id === invoice?.id);
                  const _totalItems = _tuitionItems.reduce((acc, item) => acc + item.price, 0);

                  let initialBalance = invoice?.price - invoice?.rebate + _totalItems;

                  const balance = initialBalance - _totalPayments;

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.id}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                      className={row.status == "inactive" && "student-row-inactive"}
                    >
                      <TableCell align="left" component="th" scope="row" padding="checkbox" style={{paddingLeft: "16px"}}>
                          <H5 fontSize={15}>{row.first_name + " " + row.last_name} ({_gender})</H5>
                          <p style={{margin: "0"}}>#{row.student_id}</p>
                      </TableCell>

                      <TableCell align="left">
                        <p style={{margin: "0"}}>{row.phone}</p>
                        <p style={{margin: "0"}}>{row.email}</p>
                      </TableCell>

                      <TableCell align="left">{row.parent_phone}</TableCell>

                      <TableCell align="left">
                        {programName}
                      </TableCell>

                      <TableCell
                        align="left"
                        onMouseOver={() => setShowBalanceId(row.id)}
                        onMouseOut={() => setShowBalanceId(null)}
                      >
                        {
                          <span style={{color: showBalance ? "#000" : "transparent", textShadow: showBalance ? "none" : "0 0 5px #000"}}>
                            {showBalance ? numberWithCommas(balance) : "**,***"}
                            {user.currency}
                          </span>
                        }
                      </TableCell>

                      <TableCell align="center">
                        <IconButton onClick={() => navigate("/students/" + row.id)}>
                          <Edit />
                        </IconButton>

                        <IconButton onClick={() => handleDelete(row.id)}>
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
          count={students.length}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <ConfirmationDialog
        open={!!item}
        title={t("students.dialog title")}
        text={t("students.dialog content")}
        onConfirmDialogClose={() => setItem(null)}
        onYesClick={() => onDelete(item)}
      />
    </Container>
  );
};

export default StudentList;
