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
  
  const totalYearlyRate = currentPayments.reduce((acc, payment) => {
    return acc + payment.yearly_rate;
  }, 0);
  
  const totalTransportRate = currentPayments.reduce((acc, payment) => {
    return acc + payment.transport_rate;
  }, 0);
  
  const totalIrpp = currentPayments.reduce((acc, payment) => {
    return acc + payment.irpp;
  }, 0);
  
  const totalTdl = currentPayments.reduce((acc, payment) => {
    return acc + payment.tdl;
  }, 0);
  
  const totalCfc = currentPayments.reduce((acc, payment) => {
    return acc + payment.cfc;
  }, 0);
  
  const totalRav = currentPayments.reduce((acc, payment) => {
    return acc + payment.rav;
  }, 0);
  
  const totalPvid = currentPayments.reduce((acc, payment) => {
    return acc + payment.pvid;
  }, 0);

  return (
    <Dialog open={open} onClose={handleClose} fullScreen>
      <div>
        <DialogActions className={'slip-actions'}>
          <Button onClick={handleClose} color="error" variant="contained">
            {t("main.close")}
          </Button>
          <PdfDownloader
            elementId={"printContent"}
            fileName={paySlip && paySlip.name + " - " + format(new Date(paySlip ? paySlip.pay_period + "-5" : null), "MMMM yyyy")}
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
                    <br/>
                    <div className={'slip-heading'}>{t("payroll.slip.earnings").toUpperCase()}</div>

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
                    
                    <div className={'slip-earnings'}>
                      <div style={{width: "18%"}}><b>{t("payroll.slip.years")}</b></div>
                      <div style={{width: "12%"}}>{numberWithCommas(paySlip.yearly_rate)}</div>
                      <div style={{width: "10%"}}></div>
                      <div style={{width: "30%"}}>{numberWithCommas(paySlip.yearly_rate) + " " + (paySlip.yearly_rate ? user.currency : "")}</div>
                      <div style={{width: "30%"}}>{numberWithCommas(totalYearlyRate) + " " + (totalYearlyRate ? user.currency : "")}</div>
                    </div>

                    <div className={'slip-list'}>
                      <div><b>{t("payroll.slip.gross amount")}</b></div>
                      <div><b>{numberWithCommas(hourlySalary + paySlip.base_salary + paySlip.yearly_rate) + " " + user.currency}</b></div>
                      <div><b>{numberWithCommas(totalHourlySalary + totalBaseSalary + totalYearlyRate) + " " + user.currency}</b></div>
                    </div>
                   
                    <br/>
                    <div className={'slip-heading'}>{t("payroll.slip.deductions").toUpperCase()}</div>

                    <div className={'slip-list'}>
                      <div><b>{t("payroll.slip.irpp")}</b></div>
                      <div>{numberWithCommas(paySlip.irpp) + " " + (paySlip.irpp ? user.currency : "")}</div>
                      <div>{numberWithCommas(totalIrpp) + " " + (totalIrpp ? user.currency : "")}</div>
                    </div>

                    <div className={'slip-list'}>
                      <div><b>{t("payroll.slip.tdl")}</b></div>
                      <div>{numberWithCommas(paySlip.tdl) + " " + (paySlip.tdl ? user.currency : "")}</div>
                      <div>{numberWithCommas(totalTdl) + " " + (totalTdl ? user.currency : "")}</div>
                    </div>

                    <div className={'slip-list'}>
                      <div><b>{t("payroll.slip.rav")}</b></div>
                      <div>{numberWithCommas(paySlip.rav) + " " + (paySlip.rav ? user.currency : "")}</div>
                      <div>{numberWithCommas(totalRav) + " " + (totalRav ? user.currency : "")}</div>
                    </div>
                    
                    <div className={'slip-list'}>
                      <div><b>{t("payroll.slip.cfc")}</b></div>
                      <div>{numberWithCommas(paySlip.cfc) + " " + (paySlip.cfc ? user.currency : "")}</div>
                      <div>{numberWithCommas(totalCfc) + " " + (totalCfc ? user.currency : "")}</div>
                    </div>
                    
                    <div className={'slip-list'}>
                      <div><b>{t("payroll.slip.pvid")}</b></div>
                      <div>{numberWithCommas(paySlip.pvid) + " " + (paySlip.pvid ? user.currency : "")}</div>
                      <div>{numberWithCommas(totalPvid) + " " + (totalPvid ? user.currency : "")}</div>
                    </div>

                    <div className={'slip-list'}>
                      <div><b>{t("payroll.slip.total deductions")}</b></div>
                      <div><b>{numberWithCommas(paySlip.irpp + paySlip.tdl + paySlip.rav + paySlip.cfc + paySlip.pvid) + " " + user.currency}</b></div>
                      <div><b>{numberWithCommas(totalIrpp + totalTdl + totalRav + totalCfc + totalPvid) + " " + user.currency}</b></div>
                    </div>

                    <br />
                    
                    <div className={'slip-heading'}>{t("payroll.slip.other earnings").toUpperCase()}</div>

                    <div className={'slip-earnings slip-earnings-header'}>
                      <div style={{width: "18%", backgroundColor: "transparent"}} />
                      <div style={{width: "12%"}}>{t("payroll.slip.rate")}</div>
                      <div style={{width: "10%"}}>{t("payroll.slip.hours")}</div>
                      <div style={{width: "30%"}}>{t("payroll.slip.current amount")}</div>
                      <div style={{width: "30%"}}>{t("payroll.slip.ytd amount")}</div>
                    </div>
                    
                    <div className={'slip-earnings'}>
                      <div style={{width: "18%"}}><b>{t("payroll.slip.transport")}</b></div>
                      <div style={{width: "12%"}}>{numberWithCommas(paySlip.transport_rate)}</div>
                      <div style={{width: "10%"}}></div>
                      <div style={{width: "30%"}}>{numberWithCommas(paySlip.transport_rate) + " " + (paySlip.transport_rate ? user.currency : "")}</div>
                      <div style={{width: "30%"}}>{numberWithCommas(totalTransportRate) + " " + (totalTransportRate ? user.currency : "")}</div>
                    </div>
                    
                    <div className={'slip-list'}>
                      <div><b>{t("payroll.slip.total other earnings")}</b></div>
                      <div><b>{numberWithCommas(paySlip.transport_rate) + " " + user.currency}</b></div>
                      <div><b>{numberWithCommas(totalTransportRate) + " " + user.currency}</b></div>
                    </div>
                   
                    
                    <br/>
                    <div className={'slip-list-total'}>
                      <div></div>
                      <div><b>{t("payroll.slip.current total")}</b></div>
                      <div><b>{t("payroll.slip.ytd total")}</b></div>
                    </div>

                    <div className={'slip-list'}>
                      <div><b>{t("payroll.slip.net pay")}</b></div>
                      <div>{numberWithCommas(hourlySalary + paySlip.base_salary + paySlip.yearly_rate + paySlip.transport_rate - paySlip.irpp - paySlip.tdl - paySlip.rav - paySlip.cfc - paySlip.pvid) + " " + user.currency}</div>
                      <div>{numberWithCommas(totalHourlySalary + totalBaseSalary + totalYearlyRate + totalTransportRate - totalIrpp - totalTdl - totalRav - totalCfc - totalPvid) + " " + user.currency}</div>
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
