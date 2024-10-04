import React, {useEffect, useState} from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Autocomplete } from '@mui/material';
import { numberWithCommas } from 'app/utils/utils';
import PdfDownloader from 'app/components/PdfDownloadButton';
import { format } from 'date-fns';
import "./styles.css";

const SlipView = ({ open, onClose, paySlip, t, user, payments }) => {
  const handleClose = () => {
    onClose();
  }

  const [currentPayments, setCurrentPayments] = useState([]); // payments done in the current year

  useEffect(() => {
    if (open) {
      const currentYear = new Date().getUTCFullYear();

      // filter payments done in the current year before this pay slip
      const _currentPayments = payments.filter((payment) => {
        const paymentYear = new Date(payment.pay_period).getUTCFullYear();
        return paymentYear === currentYear && new Date(payment.pay_period) <= new Date(paySlip.pay_period);
      });
      setCurrentPayments(_currentPayments);
    }
  }, [open, payments]);

  const totalBaseSalary = currentPayments.reduce((acc, payment) => {
    return acc + payment.base_salary;
  }, 0);

  const totalHourlySalary = currentPayments.reduce((acc, payment) => {
    return acc + (payment.total_hours * payment.hourly_rate);
  }, 0);

  const hourlySalary = paySlip ? (paySlip.total_hours * paySlip.hourly_rate) : 0;

  return (
    <Dialog open={open} onClose={handleClose} fullScreen>
      <div>
        <DialogActions className={'slip-actions'}>
          <Button onClick={handleClose} color="error" variant="contained">
            {t("main.close")}
          </Button>
          <PdfDownloader
            elementId={"printContent"}
            fileName={paySlip && paySlip.name}
            landscape={false}
          />
        </DialogActions>
        <DialogContent style={{display: "flex", flexDirection: "column", gap: "16px", marginTop: "-37mm"}}>
          {
            paySlip && (
              <>
                <div id="printContent" style={{maxWidth: "800px", margin: "40px auto", width: "100%"}}>
                  <div style={{margin: "20mm 16mm"}}>
                    <div className={"slip-header"}>
                      <div style={{width: "50%"}}>
                        <div style={{fontSize: "18px", fontWeight: "bold"}}>{t("payroll.slip dialog title")}</div>
                      </div>
                      <div className={"slip-logo"}>
                        
                      </div>
                    </div>
                    <div className={'slip-info'}>
                      <div>
                        <div><b>{t("payroll.slip.company name")}</b></div>
                        <div>{user.company_name}</div>
                        <div><b>{t("payroll.slip.company address")}</b></div>
                        <div>{user.company_address}</div>
                        <div><b>{t("payroll.slip.company registration")}</b></div>
                        <div>{user.company_registration}</div>
                      </div>
                      <div>
                        <div><b>{t("payroll.slip.employee name")}</b></div>
                        <div>{paySlip.name}</div>
                        <div><b>{t("payroll.slip.employee id")}</b></div>
                        <div>{paySlip.employee_id}</div>
                        <div><b>{t("payroll.slip.employee title")}</b></div>
                        <div>{paySlip.title}</div>
                      </div>
                    </div>

                    <div className={'slip-pay-period'}>
                      <div>
                        <div style={{fontWeight: "bold"}}>{t("payroll.slip.pay period")}</div>
                        <div>{format(new Date(paySlip ? paySlip.pay_period + "-5" : null), "MMMM, yyyy")}</div>
                      </div>
                      {/* <div>
                        <div style={{fontWeight: "bold"}}>{t("payroll.slip.pay period to")}</div>
                        <div>{format(new Date(paySlip?.pay_period), "MMM dd, yyyy")}</div>
                      </div> */}
                      <div>
                        <div style={{fontWeight: "bold"}}>{t("payroll.pay dialog date")}</div>
                        <div>{format(new Date(paySlip ? paySlip.pay_date + "T00:00:00" : null), "MMMM dd, yyyy")}</div>
                      </div>
                    </div>

                    <div className={'slip-heading'}>{t("payroll.slip.earnings")}</div>

                    <div className={'slip-earnings slip-earnings-header'}>
                      <div style={{width: "18%", backgroundColor: "transparent"}} />
                      <div style={{width: "12%"}}>{t("payroll.slip.rate")}</div>
                      <div style={{width: "10%"}}>{t("payroll.slip.hours")}</div>
                      <div style={{width: "30%"}}>{t("payroll.slip.current amount")}</div>
                      <div style={{width: "30%"}}>{t("payroll.slip.ytd amount")}</div>
                    </div>

                    <div className={'slip-earnings'}>
                      <div style={{width: "18%"}}><b>{t("payroll.slip.base salary")}</b></div>
                      <div style={{width: "12%"}}>{numberWithCommas(paySlip.base_salary)}</div>
                      <div style={{width: "10%"}}></div>
                      <div style={{width: "30%"}}>{numberWithCommas(paySlip.base_salary) + " " + (paySlip.base_salary ? user.currency : "")}</div>
                      <div style={{width: "30%"}}>{numberWithCommas(totalBaseSalary) + " " + (totalBaseSalary ? user.currency : "")}</div>
                    </div>

                    <div className={'slip-earnings'}>
                      <div style={{width: "18%"}}><b>{t("payroll.slip.hourly salary")}</b></div>
                      <div style={{width: "12%"}}>{numberWithCommas(paySlip.hourly_rate)}</div>
                      <div style={{width: "10%"}}>{paySlip.total_hours}</div>
                      <div style={{width: "30%"}}>{numberWithCommas(hourlySalary) + " " + (hourlySalary ? user.currency : "")}</div>
                      <div style={{width: "30%"}}>{numberWithCommas(totalHourlySalary) + " " + (totalHourlySalary ? user.currency : "")}</div>
                    </div>

                    <div className={'slip-heading'}>{t("payroll.slip.gross pay")}</div>

                    <div className={'slip-list'}>
                      <div><b>{t("payroll.slip.gross amount")}</b></div>
                      <div>{numberWithCommas(hourlySalary + paySlip.base_salary) + " " + user.currency}</div>
                      <div>{numberWithCommas(totalHourlySalary + totalBaseSalary) + " " + user.currency}</div>
                    </div>
                   
                    <div className={'slip-heading'}>{t("payroll.slip.deductions")}</div>

                    <div className={'slip-list'}>
                      <div><b>{t("payroll.slip.social security")}</b></div>
                      <div>{0}</div>
                      <div>{0}</div>
                    </div>

                    <div className={'slip-list'}>
                      <div><b>{t("payroll.slip.insurance")}</b></div>
                      <div>{0}</div>
                      <div>{0}</div>
                    </div>

                    <div className={'slip-list'}>
                      <div><b>{t("payroll.slip.other")}</b></div>
                      <div>{0}</div>
                      <div>{0}</div>
                    </div>

                    <div className={'slip-list'}>
                      <div><b>{t("payroll.slip.total deductions")}</b></div>
                      <div>{0}</div>
                      <div>{0}</div>
                    </div>

                    <br />
                    <div className={'slip-list-total'}>
                      <div></div>
                      <div><b>{t("payroll.slip.current total")}</b></div>
                      <div><b>{t("payroll.slip.ytd total")}</b></div>
                    </div>

                    <div className={'slip-list'}>
                      <div><b>{t("payroll.slip.net pay")}</b></div>
                      <div>{numberWithCommas(hourlySalary + paySlip.base_salary) + " " + user.currency}</div>
                      <div>{numberWithCommas(totalHourlySalary + totalBaseSalary) + " " + user.currency}</div>
                    </div>
                  </div>
                </div>
              </>
            )
          }
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default SlipView;
