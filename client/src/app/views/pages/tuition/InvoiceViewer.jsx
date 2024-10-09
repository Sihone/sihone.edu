import {
  Box,
  Button,
  Chip,
  Divider,
  Icon,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { FlexBetween } from "app/components/FlexBox";
import { H5, Paragraph } from "app/components/Typography";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getInvoiceById } from "./InvoiceService";
import { useAuth } from "app/hooks/useAuth";
import { useTranslation } from "react-i18next";
import useData from "app/hooks/useData";
import { numberWithCommas } from "app/utils/utils";
import PayDialog from "./PayDialog";
import { ConfirmationDialog } from "app/components";
import { useSnackbar } from "notistack";
import TuitionItemsDialog from "./TuitionItemsDialog";
import RebateDialog from "./RebateDialog";
import PrintAndPdfDownloader from "app/components/PrintAndPdfDownloader";

const ButtonBox = styled(FlexBetween)(() => ({
  paddingLeft: "16px",
  paddingRight: "16px",
  marginBottom: "20px",
  alignItems: "center",
  "& button": { fontSize: "13px", textTransform: "capitalize" },
}));

const TextBox = styled("div")(() => ({
  textAlign: "right",
  "& h5": { fontWeight: "500", textTransform: "capitalize" },
}));

const StyledH5 = styled(H5)(() => ({
  fontSize: 15,
  "& span": { fontWeight: "normal" },
}));

export const StyledTable = styled(Table)(({ theme }) => ({
  "& thead": {
    "& tr": {
      background: theme.palette.background.default,
      "& th": { paddingLeft: 0, paddingRight: 0 },
      "& th:first-of-type": {
        paddingLeft: "24px !important",
        [theme.breakpoints.down("sm")]: { paddingLeft: "16px !important" },
      },
    },
  },
  "& tbody": {
    "& tr": {
      "& td": { paddingLeft: 0, textTransform: "capitalize" },
      "& td:first-of-type": {
        paddingLeft: "24px !important",
        [theme.breakpoints.down("sm")]: { paddingLeft: "16px !important" },
      },
    },
  },
}));

const InvoiceViewer = ({ toggleInvoiceEditor }) => {
  const { id } = useParams();
  const [initialBalance, setInitialBalance] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [payments, setPayments] = useState([]);
  const [balance, setBalance] = useState(0);
  const [status, setStatus] = useState("error");
  const [statusColor, setStatusColor] = useState("error");
  const [showPayDialog, setShowPayDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [tuition_items, setTuitionItems] = useState([]);
  const [showRebateDialog, setShowRebateDialog] = useState(false);
  const [currentStudentYear, setCurrentStudentYear] = useState(0);

  const {user} = useAuth();
  const {data: invoice, updateData: updateRebate} = useData("tuitions", user.company_id, id);
  const { data: tuitionItems, saveData: saveTuitionItem, deleteData: deleteTuitionItem } = useData("tuition_items", user.company_id);
  const { data: items, saveData: saveItem } = useData("items", user.company_id);
  const { data: tuitionPayments, saveData: savePayment, deleteData: deletePayment } = useData("tuition_payments", user.company_id);
  const { data: academicYears } = useData("academic_years", user.company_id);
  const {t, i18n} = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  
  useEffect(() => {
    if (invoice && invoice.id && academicYears && academicYears.length) {
      const studentAcademicYear = academicYears.find((_item) => _item.id == invoice.student_academic_year_id);
      const currentAcademicYear = academicYears.find((_item) => _item.id == invoice.academic_year_id);
      const year = new Date(currentAcademicYear.start_date).getFullYear() - new Date(studentAcademicYear.start_date).getFullYear() + 1;
      setCurrentStudentYear(year);
    }
  }, [invoice, academicYears]);
  

  const handlePrint = () => window.print();

  const onDeletePayment = async () => {
    await deletePayment(deleteId)
      .then(() => {
        setDeleteId(null);
        enqueueSnackbar(t("main.success"), { variant: "success" });
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar(err.message || err.detail || err, { variant: "error" });
      });
  }

  const onDeleteItem = async () => {
    await deleteTuitionItem(deleteItemId)
      .then(() => {
        setDeleteItemId(null);
        enqueueSnackbar(t("main.success"), { variant: "success" });
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar(err.message || err.detail || err, { variant: "error" });
      });
  }
      

  useEffect(() => {
    if (invoice && tuitionItems && tuitionPayments) {
      const _payments = tuitionPayments.filter((payment) => payment.tuition_id === invoice.id);
      const _tuitionItems = tuitionItems.filter((item) => item.tuition_id === invoice.id);
      setPayments(_payments);
      setTuitionItems(_tuitionItems);

      const _totalPayments = _payments.reduce((acc, payment) => acc + payment.amount, 0);
      setPaymentAmount(_totalPayments);
      
      let _balance = 0;
      if (currentStudentYear === 1) {
        setInitialBalance(Number(invoice.price) + Number(invoice.reg_fee) - invoice.rebate + _tuitionItems.reduce((acc, item) => acc + Number(item.price), 0));
        _balance = Number(invoice.price) + Number(invoice.reg_fee) + _tuitionItems.reduce((acc, item) => acc + Number(item.price), 0) - _totalPayments - invoice.rebate;
      } else {
        setInitialBalance(Number(invoice.price) - invoice.rebate + _tuitionItems.reduce((acc, item) => acc + Number(item.price), 0));
        _balance = Number(invoice.price) + _tuitionItems.reduce((acc, item) => acc + Number(item.price), 0) - _totalPayments - invoice.rebate;
      }
      setBalance(_balance);

      let _status = "";
      let _statusColor = "";
      if (_balance == 0) {
        _status = t("tuition.paid");
        _statusColor = "success";
      }
      else if (_balance < 0) {
        _status = t("tuition.overpaid");
        _statusColor = "primary";
      } 
      else if (_balance == initialBalance) {
        _status = t("tuition.unpaid");
        _statusColor = "error";
      }
      else {
        _status = t("tuition.partial paid");
        _statusColor = "warning";
      }

      setStatus(_status);
      setStatusColor(_statusColor);
    }
  }, [invoice, tuitionItems, tuitionPayments, initialBalance, currentStudentYear]);

  let subTotalCost = Number(invoice.price) + Number(invoice.reg_fee);
  if (currentStudentYear > 1) {
    subTotalCost = Number(invoice.price);
  }
  
  const academicYearStr = t(`students.year.${currentStudentYear}`);

  return (
    <Box py={2} className="invoice-viewer">
      <ButtonBox className="viewer_actions">
        <Link to="/tuition/list">
          <IconButton>
            <Icon>arrow_back</Icon>
          </IconButton>
        </Link>
        <div>
          <Button
            sx={{ mr: 2, py: 1 }}
            variant="contained"
            color="success"
            onClick={() => setShowPayDialog(true)}
            startIcon={<Icon>attach_money</Icon>}
          >
            {t("tuition.pay")}
          </Button>
          <Button
            sx={{ mr: 2, py: 1 }}
            variant="contained"
            color="primary"
            onClick={() => setShowItemDialog(true)}
            startIcon={<Icon>add</Icon>}
          >
            {t("tuition.add item")}
          </Button>
          <Button
            sx={{ mr: 2, py: 1 }}
            variant="contained"
            color="warning"
            onClick={() => setShowRebateDialog(true)}
            startIcon={<Icon>percentage</Icon>}
          >
            {t("tuition.add rebate")}
          </Button>
          <PrintAndPdfDownloader
            elementId={"print-area"}
            fileName={`${invoice.first_name?.toUpperCase()}_${invoice.last_name?.toUpperCase()}_Y${currentStudentYear}`}
            color="secondary"
            orientation="l"
            replaceOptions={
              [
                {
                  id: "invoice-status",
                  html: status
                },
                {
                  id: "delete-icon",
                  html: ""
                }
              ]
            }
          />
          <PrintAndPdfDownloader
            elementId={"print-area"}
            fileName={`${invoice.first_name?.toUpperCase()}_${invoice.last_name?.toUpperCase()}_Y${currentStudentYear}`}
            color="error"
            orientation="l"
            replaceOptions={
              [
                {
                  id: "invoice-status",
                  html: status
                },
                {
                  id: "delete-icon",
                  html: ""
                }
              ]
            }
            print
          />
        </div>
      </ButtonBox>

      <div id="print-area" style={{ padding: "20px" }}>
        <FlexBetween px={2} mb={2} className="viewer__order-info">
          <Box>
            <StyledH5 sx={{ mb: 1 }}>{user.company_name}</StyledH5>
            <StyledH5 sx={{ mb: 1 }}>{t("tuition.summary")}</StyledH5>
            <Paragraph>{invoice.first_name?.toUpperCase()} {invoice.last_name?.toUpperCase()}</Paragraph>
            <Paragraph sx={{ mb: 1 }}>#{invoice.studentId}</Paragraph>
            <Paragraph>{i18n.language == "en" ? invoice.name_en : invoice.name_fr}</Paragraph>
            <Paragraph>{i18n.language == "en" ? invoice.long_name_en : invoice.long_name_fr}</Paragraph>
            <Paragraph>{academicYearStr}</Paragraph>
          </Box>

          <TextBox>
            <StyledH5 sx={{ mb: 1 }}>
              <strong>{t("main.status")}: </strong>
              <span className="invoice-status">
                <Chip color={statusColor} label={status} />
              </span>
            </StyledH5>

            <StyledH5>
              <strong>{t("tuition.date")}: </strong>
              <span>{invoice.created_at && format(new Date(invoice.created_at), "MMMM dd, yyyy")}</span>
            </StyledH5>
            
            <StyledH5>
              <strong>{t("tuition.print date")}: </strong>
              <span>{format(new Date(), "MMMM dd, yyyy")}</span>
            </StyledH5>
          </TextBox>
        </FlexBetween>

        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell align="left">
                {t("tuition.item")}
              </TableCell>
              <TableCell align="right">
                {t("tuition.amount")}
              </TableCell>
              <TableCell align="right" style={{paddingRight: "32px"}}>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {
              currentStudentYear == 1 && (
                <TableRow>
                  <TableCell align="left">{t("tuition.registration")}</TableCell>
                  <TableCell align="right" style={{paddingRight: "0"}}>{numberWithCommas(invoice.reg_fee)} {user.currency}</TableCell>
                  <TableCell align="right" style={{paddingRight: "32px"}}></TableCell>
                </TableRow>
              )
            }
            <TableRow>
              <TableCell align="left">{t("tuition.program fees")}: {i18n.language == "en" ? (invoice.short_name_en + " - " + invoice.name_en) : (invoice.short_name_fr + " - " + invoice.name_fr)}</TableCell>
              <TableCell align="right" style={{paddingRight: "0"}}>{numberWithCommas(invoice.price)} {user.currency}</TableCell>
              <TableCell align="right" style={{paddingRight: "32px"}}></TableCell>
            </TableRow>
            {tuition_items.map((item, index) => {
              subTotalCost += Number(item.price);
              return (
                <TableRow key={index}>
                  <TableCell align="left">{item.name}</TableCell>
                  <TableCell align="right" style={{paddingRight: "0"}}>{numberWithCommas(item.price)} {user.currency}</TableCell>
                  <TableCell align="right" style={{paddingRight: "32px"}}>
                    <IconButton onClick={() => setDeleteItemId(item.id)}>
                      <span className="delete-icon"><Icon>delete</Icon></span>
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </StyledTable>

        <FlexBetween px={2} mb={2} className="viewer__order-info">
          <Box px={2} py={1} maxWidth={300}>
            <h4>{t("tuition.payment info")}</h4>
            {
              payments.map((payment, index) => {
                return (
                  <FlexBetween key={index}>
                    <Paragraph>
                      <b>{format(new Date(payment.payment_date), "MMM dd, yyyy")}:</b>
                    </Paragraph>
                    <Paragraph style={{paddingLeft: "8px"}}> {numberWithCommas(payment.amount)} {user.currency}</Paragraph>
                    <IconButton onClick={() => setDeleteId(payment.id)}>
                      <span className="delete-icon"><Icon>delete</Icon></span>
                    </IconButton>
                  </FlexBetween>
                );
              })
            }
          </Box>

          <Box px={2} py={1} maxWidth={300} marginLeft="auto">
            <FlexBetween my={2}>
              <Paragraph>
                {t("tuition.subtotal")}:
              </Paragraph>
              <Paragraph style={{paddingLeft: "8px"}}>{numberWithCommas(subTotalCost)} {user.currency}</Paragraph>
            </FlexBetween>

            {
              invoice?.rebate > 0 && (
                <FlexBetween my={2}>
                  <Paragraph>
                    {t("tuition.rebate")}:
                  </Paragraph>
                  <Paragraph style={{paddingLeft: "8px"}}>({numberWithCommas(invoice?.rebate)} {user.currency})</Paragraph>
                </FlexBetween>
              )
            }
            <FlexBetween my={2}>
              <Paragraph>
                {t("tuition.payments")}:
              </Paragraph>
              <Paragraph style={{paddingLeft: "8px"}}>({numberWithCommas(paymentAmount)} {user.currency})</Paragraph>
            </FlexBetween>

            <FlexBetween>
              <H5>
                {t("tuition.total")}:
              </H5>
              <H5 style={{paddingLeft: "8px"}}>{numberWithCommas(balance)} {user.currency}</H5>
            </FlexBetween>
          </Box>
        </FlexBetween>
      </div>
      <PayDialog
        open={showPayDialog}
        onClose={() => setShowPayDialog(false)}
        save={savePayment}
        id={id}
        t={t}
      />
      <TuitionItemsDialog
        open={showItemDialog}
        onClose={() => setShowItemDialog(false)}
        saveItem={saveItem}
        saveTuitionItem={saveTuitionItem}
        items={items}
        id={id}
        t={t}
      />
      <RebateDialog
        open={showRebateDialog}
        onClose={() => setShowRebateDialog(false)}
        update={updateRebate}
        id={id}
        t={t}
        amount={invoice?.rebate}
      />
      <ConfirmationDialog
        open={!!deleteId}
        title={t("tuition.dialog delete pay title")}
        text={t("tuition.dialog delete pay content")}
        onConfirmDialogClose={() => setDeleteId(null)}
        onYesClick={() => onDeletePayment()}
      />
      <ConfirmationDialog
        open={!!deleteItemId}
        title={t("tuition.dialog delete item title")}
        text={t("tuition.dialog delete item content")}
        onConfirmDialogClose={() => setDeleteItemId(null)}
        onYesClick={() => onDeleteItem()}
      />
    </Box>
  );
};

export default InvoiceViewer;
