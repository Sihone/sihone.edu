import { AddCircle, Delete, Edit, TrendingFlat } from "@mui/icons-material";
import { Box, Paper, styled, Table, TableBody, TableCell, TableRow } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { Breadcrumb, ConfirmationDialog } from "app/components";
import { TableHead, TableToolbar } from "app/components/data-table";
import { getComparator, stableSort } from "app/components/data-table/utils";
import { H5 } from "app/components/Typography";
import useTable from "app/hooks/useTable";
import useData from "app/hooks/useData";
import { useAuth } from "app/hooks/useAuth";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import YearDialog from "./YearDialog";
import { useSnackbar } from "notistack";
import CycleDialog from "./CycleDialog";

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

  const { data, saveData, updateData, deleteData } = useData("academic_years", user.company_id);
  const { data: cycles, saveData: saveCycle, updateData: updateCycle, deleteData: deleteCycle } = useData("academic_cycles", user.company_id);
  const { data: settings } = useData("settings", user.company_id);
  const { t } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [academics, setAcademics] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [currentAcademicYear, setCurrentAcademicYear] = useState(null);

  const [open2, setOpen2] = useState(false);
  const [cycle, setCycle] = useState(null);
  const [confirmDelete2, setConfirmDelete2] = useState(false);

  // TABLE HEADER COLUMN LIST
  const columns = [
    { id: "academic_year", align: "left", disablePadding: true, label: t("academics.table header.academic year") },
    { id: "start_date", align: "left", disablePadding: false, label: t("academics.table header.start date") },
    { id: "end_date", align: "left", disablePadding: false, label: t("academics.table header.end date") },
    { id: "grade_total", align: "left", disablePadding: false, label: t("academics.table header.grade total") },
    { id: "active", align: "left", disablePadding: false, label: t("academics.table header.active") },
    { id: "edit", align: "center", disablePadding: false, label: t("academics.table header.actions") },
  ];

  const columns2 = [
    { id: "name_en", align: "left", disablePadding: true, label: t("academics.table header.name en") },
    { id: "name_fr", align: "left", disablePadding: false, label: t("academics.table header.name fr") },
    { id: "edit", align: "center", disablePadding: false, label: t("academics.table header.actions") },
  ];

  useEffect(() => {
    if (settings) {
      setCurrentAcademicYear(settings.current_academic_year);
    }
  }, [settings]);

  const handleClose = () => {
    setOpen(false);
    setAcademics(null);
  }

  const handleClose2 = () => {
    setOpen2(false);
    setCycle(null);
  }

  const handleEdit = (row) => {
    setAcademics(row);
    setOpen(true);
  }

  const handleEdit2 = (row) => {
    setCycle(row);
    setOpen2(true);
  }

  const handleDeleteClick = (row) => {
    setAcademics(row);
    setConfirmDelete(true);
  }

  const handleDeleteClick2 = (row) => {
    setCycle(row);
    setConfirmDelete2(true);
  }

  const handleDelete = () => {
    deleteData(academics.id)
    .then(() => {
      enqueueSnackbar(t("academics.delete success"), { variant: "success" });
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(t("academics.delete error"), { variant: "error" });
    });
    setConfirmDelete(false);
    setAcademics(null);
  }

  const handleDelete2 = () => {
    deleteCycle(cycle.id)
    .then(() => {
      enqueueSnackbar(t("academics.delete success"), { variant: "success" });
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(t("academics.delete error"), { variant: "error" });
    });
    setConfirmDelete2(false);
    setCycle(null);
  }

  const onSave = async (data) => {
    await saveData({
      name: data.name,
      start_date: data.start_date,
      end_date: data.end_date,
      grade_total: data.grade_total,
      active: data.active,
    })
    .then((response) => {
      enqueueSnackbar(t("academics.save success"), { variant: "success" });
      if (data.active) {
        setCurrentAcademicYear(response.id);
      }
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(t("academics.save error"), { variant: "error" });
    });
    setOpen(false);
  }

  const onSave2 = async (data) => {
    await saveCycle({
      long_name_en: data.long_name_en,
      long_name_fr: data.long_name_fr,
      short_name_en: data.short_name_en,
      short_name_fr: data.short_name_fr,
    })
    .then((response) => {
      enqueueSnackbar(t("academics.save success"), { variant: "success" });
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(t("academics.save error"), { variant: "error" });
    });
    setOpen2(false);
  }

  const onUpdate = async (data) => {
    await updateData(data)
    .then((response) => {
      enqueueSnackbar(t("academics.update success"), { variant: "success" });
      if (data.active) {
        setCurrentAcademicYear(response.id);
      } else if (currentAcademicYear == response.id) {
        setCurrentAcademicYear(null);
      }
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(t("academics.update error"), { variant: "error" });
    });
    setOpen(false);
  }

  const onUpdate2 = async (data) => {
    await updateCycle(data)
    .then((response) => {
      enqueueSnackbar(t("academics.update success"), { variant: "success" });
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(t("academics.update error"), { variant: "error" });
    });
    setOpen2(false);
  }

  return (
    <Container>
      <div className="breadcrumb" style={{display: "flex", justifyContent: "space-between"}}>
        <Breadcrumb
          routeSegments={[{ name: t("academics.title") }]}
        />
      </div>

      <Paper sx={{ width: "100%", mb: 2 }}>
        
        <div style={{display: "flex", justifyContent: "space-between"}}>
         <TableToolbar title={t("academics.table year")} numSelected={selected.length} />
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
                      <TableCell component="th" scope="row" padding="none" style={{paddingLeft: "16px"}}>
                        <FlexBox gap={1}>
                          <H5 fontSize={15}>{row.name}</H5>
                        </FlexBox>
                      </TableCell>

                      <TableCell align="left">{row.start_date}</TableCell>

                      <TableCell align="left">{row.end_date}</TableCell>

                      <TableCell align="left">{row.grade_total}</TableCell>

                      <TableCell align="left">{currentAcademicYear === row.id ? "Active" : "Inactive"}</TableCell>

                      <TableCell align="center">
                        <IconButton onClick={() => handleEdit(row)}>
                          <Edit />
                        </IconButton>

                        {
                          currentAcademicYear !== row.id &&
                          <IconButton onClick={() => handleDeleteClick(row)}>
                            <Delete />
                          </IconButton>
                        }
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

      <Paper sx={{ width: "100%", mb: 2 }}>
        <div style={{display: "flex", justifyContent: "space-between"}}>
         <TableToolbar title={t("academics.table cycle")} numSelected={selected.length} />
          <IconButton onClick={() => setOpen2(true)} style={{padding: "8px 20px"}}>
            <AddCircle />
          </IconButton>
        </div>

        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead
              order={order}
              orderBy={orderBy}
              headCells={columns2}
              rowCount={cycles.length}
              onRequestSort={handleRequestSort}
              showSelect={false}
            />

            <TableBody>
              {stableSort(cycles, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.id}
                      role="checkbox"
                    >
                      <TableCell align="left" style={{paddingLeft: "16px"}}>
                        {row.long_name_en} ({row.short_name_en})
                      </TableCell>

                      <TableCell align="left">
                        {row.long_name_fr} ({row.short_name_fr})
                      </TableCell>

                      <TableCell align="center">
                        <IconButton onClick={() => handleEdit2(row)}>
                          <Edit />
                        </IconButton>

                        <IconButton onClick={() => handleDeleteClick2(row)}>
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
          count={cycles.length}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <YearDialog
        open={open}
        onClose={handleClose}
        save={onSave}
        update={onUpdate}
        academicYear={academics}
        currentAcademicYear={currentAcademicYear}
        t={t}
      />
      <CycleDialog
        open={open2}
        onClose={handleClose2}
        save={onSave2}
        update={onUpdate2}
        cycle={cycle}
        t={t}
      />
      <ConfirmationDialog
        open={confirmDelete}
        title={t("academics.delete year title")}
        text={t("academics.delete year content")}
        onConfirmDialogClose={() => setConfirmDelete(false)}
        onYesClick={() => handleDelete(academics.id)}
      />
      <ConfirmationDialog
        open={confirmDelete2}
        title={t("academics.delete cycle title")}
        text={t("academics.delete cycle content")}
        onConfirmDialogClose={() => setConfirmDelete2(false)}
        onYesClick={() => handleDelete2(cycle.id)}
      />
    </Container>
  );
};

export default AcademicsList;
