import { Visibility } from "@mui/icons-material";
import {
  alpha,
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  MenuItem,
  Paper,
  styled,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StyledTable } from "./InvoiceViewer";
import { useTranslation } from "react-i18next";
import { useAuth } from "app/hooks/useAuth";
import useData from "app/hooks/useData";
import { numberWithCommas } from "app/utils/utils";
import { Breadcrumb } from "app/components";

const Container = styled(Box)(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const InvoiceList = () => {
  const [invoiceList, setInvoiceList] = useState([]);

  const [filteredInvoiceList, setFilteredInvoiceList] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState(null);

  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { data: tuitions } = useData("tuitions", user.company_id);
  const { data: tuitionPayments } = useData("tuition_payments", user.company_id);
  const { data: tuitionItems } = useData("tuition_items", user.company_id);
  const { data: students } = useData("students", user.company_id);
  const { data: academicYears } = useData("academic_years", user.company_id);

  useEffect(() => {
    if (tuitions) {
      setInvoiceList(tuitions);
    }
  }, [tuitions]);

  const handeViewClick = (invoiceId) => {
    navigate(`/tuition/${invoiceId}`);
  };

  useEffect(() => {
    if (selectedStudentId) {
      const _data = invoiceList.filter((item) => item.student_id === selectedStudentId);
      setFilteredInvoiceList(_data);
    } else if (selectedAcademicYearId) {
      const _data = invoiceList.filter((item) => item.academic_year_id === selectedAcademicYearId);
      setFilteredInvoiceList(_data);
    } else {
      setFilteredInvoiceList(invoiceList);
    }
  }, [selectedStudentId, invoiceList, selectedAcademicYearId]);

  const studentOptions = [
    {id: null, label: t("students.all students")},
    ...students?.map((student) => ({...student, label: student.first_name + " " + student.last_name}))
  ];

  const handleStudentSelect = (studentId) => {
    setSelectedStudentId(studentId);
    setSelectedAcademicYearId(null);
  }

  const handleAcademicYearSelect = (academicYearId) => {
    setSelectedAcademicYearId(academicYearId);
    setSelectedStudentId(null);
  }

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: t("tuition.title") }]}
        />
      </div>
      <br />
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer style={{display: "flex", gap: "16px", padding: "32px 16px"}}>
          <Autocomplete
              disablePortal
              id="combo-box-demo"
              fullWidth
              options={studentOptions}
              renderInput={(params) => <TextField {...params} label={t("students.select student")} />}
              onChange={(event, value) => handleStudentSelect(value ? value.id : null)}
              value={studentOptions.find((item) => item.id === selectedStudentId)}
          />
          <TextField
            select
            name="academic_year"
            label={t("academics.table header.academic year")} 
            variant="outlined"
            fullWidth
            value={selectedAcademicYearId}
            onChange={(e) => handleAcademicYearSelect(e.target.value)}
            InputLabelProps={{
              shrink: !!selectedAcademicYearId,
            }}
          >
            <MenuItem value={null}>{t("academics.select academic year")}</MenuItem>
            {academicYears?.map((item) => {
              return (
                <MenuItem value={item.id} key={item.id}>
                  {item.name}
                </MenuItem>
              )
            })}
          </TextField>
        </TableContainer>

      </Paper>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Card elevation={6} sx={{ width: "100%", overflow: "auto" }}>
          <StyledTable sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow>
                <TableCell>{t("students.title")}</TableCell>
                <TableCell>{t("academics.table header.academic year")}</TableCell>
                <TableCell>{t("academics.table header.program")}</TableCell>
                <TableCell>{t("tuition.total")}</TableCell>
                <TableCell>{t("main.status")}</TableCell>
                <TableCell>{t("students.student status")}</TableCell>
                <TableCell align="center">{t("main.actions")}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredInvoiceList.map((invoice) => {
                const _payments = tuitionPayments.filter((payment) => payment.tuition_id === invoice.id);
                const _totalPayments = _payments.reduce((acc, payment) => acc + payment.amount, 0);

                const _tuitionItems = tuitionItems.filter((item) => item.tuition_id === invoice.id);
                const _totalItems = _tuitionItems.reduce((acc, item) => acc + item.price, 0);

                let initialBalance = invoice.price - invoice.rebate + _totalItems;

                const balance = initialBalance - _totalPayments;
                let status = t("tuition.unpaid");
                let statusColor = "error";
                if (balance == 0) {
                  status = t("tuition.paid");
                  statusColor = "success";
                }
                else if (balance < 0) {
                  status = t("tuition.overpaid");
                  statusColor = "primary";
                } 
                else if (balance == initialBalance) {
                  status = t("tuition.unpaid");
                  statusColor = "error";
                }
                else {
                  status = t("tuition.partial paid");
                  statusColor = "warning";
                }

                return (
                  <TableRow key={invoice.id} className={invoice.student_status == "inactive" && "student-row-inactive"}>
                    <TableCell align="left">{invoice.first_name} {invoice.last_name}</TableCell>
                    <TableCell align="left">{invoice.ay_name}</TableCell>
                    <TableCell align="left">{i18n.language == "en" ? invoice.name_en : invoice.name_fr}</TableCell>
                    <TableCell align="left">{numberWithCommas(balance)} {user.currency}</TableCell>
                    <TableCell align="left">
                      <Chip color={statusColor} label={status} />
                    </TableCell>
                    <TableCell align="left">
                      <Chip color={invoice.student_status == "active" ? "success" : "error"} label={t("main." + invoice.student_status)} />
                    </TableCell>
    
                    <TableCell align="center">
                      <IconButton onClick={() => handeViewClick(invoice.id)}>
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </StyledTable>
        </Card>
      </Paper>
    </Container>
  );
};

export default InvoiceList;
