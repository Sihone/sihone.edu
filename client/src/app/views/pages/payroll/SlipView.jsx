import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Autocomplete } from '@mui/material';
import { numberWithCommas } from 'app/utils/utils';

const SlipView = ({ open, onClose, paySlip, t, user }) => {
  const handleClose = () => {
    onClose();
  }

  const styles = {
    slipLabel: {
      fontSize: "16px",
      fontWeight: "bold",
      paddingBottom: "4px",
      borderBottom: "1px solid #ccc",
      width: "25%",
      marginBottom: "8px"
    },
    slipValue: {
      fontSize: "16px",
      paddingBottom: "4px",
      borderBottom: "1px solid #ccc",
      width: "25%",
      marginBottom: "8px"
    }
  }

  const printContent = () => {
    const printDivCSS = new String (
      '<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">'
    );
    const styles = `
      @page { size: landscape; }
      body {
        font-family: 'Roboto', sans-serif;
      }
      .MuiButton-root {
        display: none;
      }
      .MuiDialog-paper {
        overflow: visible;
      }
    `;
    const printContent = document.getElementById("printContent").innerHTML;
    const printWindow = window.open('', '', 'height=400,width=800');
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write(printDivCSS);
    printWindow.document.write(`<style>${styles}</style>`);
    printWindow.document.write(`
    <script type="text/javascript">
    window.onfocus=function(){ window.close();}
    </script>
    `);
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  }

  return (
    <Dialog open={open} onClose={handleClose} fullScreen>
      <div style={{maxWidth: "1140px", margin: "40px auto", width: "100%"}}>
        <DialogTitle style={{display: "flex", justifyContent: "space-between"}}>
          {t("payroll.slip dialog title")}
          
        </DialogTitle>
        <DialogContent id="printContent" style={{display: "flex", flexDirection: "column", gap: "16px"}}>
          {
            paySlip && (
              <>
                <div>
                  <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>

                    <div style={{...styles.slipLabel, borderTop: "1px solid #ccc", paddingTop: "8px"}}>
                      {t("payroll.slip.company name")}
                    </div>
                    <div style={{...styles.slipValue, borderTop: "1px solid #ccc", paddingTop: "8px"}}>{user.company_name}</div>

                    <div style={{...styles.slipLabel, borderTop: "1px solid #ccc", paddingTop: "8px"}}>
                      {t("payroll.slip.company address")}
                    </div>
                    <div style={{...styles.slipValue, borderTop: "1px solid #ccc", paddingTop: "8px"}}>{user.company_address}</div>

                    <div style={styles.slipLabel}>
                      {t("payroll.slip.company phone")}
                    </div>
                    <div style={styles.slipValue}>{user.company_phone}</div>

                    <div style={styles.slipLabel}>
                      {t("payroll.slip.company registration")}
                    </div>
                    <div style={styles.slipValue}>{user.company_registration}</div>
                    <div style={{width: "100%", height: "30px"}} />

                    <div style={styles.slipLabel}>
                      {t("payroll.slip.employee name")}
                    </div>
                    <div style={styles.slipValue}>{paySlip.name}</div>
                    <div style={styles.slipLabel}>
                      {t("payroll.slip.employee id")}
                    </div>
                    <div style={styles.slipValue}>{paySlip.employee_id}</div>
                    
                    <div style={styles.slipLabel}>
                      {t("payroll.slip.employee phone")}
                    </div>
                    <div style={styles.slipValue}>{paySlip.phone}</div>
                    <div style={styles.slipLabel}>
                      {t("payroll.slip.employee start date")}
                    </div>
                    <div style={styles.slipValue}>{paySlip.start_date}</div>

                    <div style={styles.slipLabel}>
                      {t("payroll.slip.pay period")}
                    </div>
                    <div style={styles.slipValue}>{paySlip.pay_period}</div>
                    <div style={styles.slipLabel}>
                      {t("payroll.pay dialog date")}
                    </div>
                    <div style={styles.slipValue}>{paySlip.pay_date}</div>
                    <div style={{width: "100%", height: "30px"}} />

                    <div style={styles.slipLabel}>
                      {t("payroll.table header.basic salary")}
                    </div>
                    <div style={styles.slipValue}>{numberWithCommas(paySlip.base_salary) + " " + user.currency}</div>

                    <div style={styles.slipLabel}>
                      {t("payroll.slip.deductions")}
                    </div>
                    <div style={styles.slipValue}>{numberWithCommas(paySlip.deductions) + " " + user.currency}</div>

                    <div style={styles.slipLabel}>
                      {t("payroll.table header.hourly salary")}
                    </div>
                    <div style={styles.slipValue}>{numberWithCommas(paySlip.hourly_salary) + " " + user.currency}</div>

                    <div style={styles.slipLabel}>
                      {t("main.other")}
                    </div>
                    <div style={styles.slipValue}>{numberWithCommas(paySlip.other) + " " + user.currency}</div>
                    <div style={{width: "100%", height: "30px"}} />

                    <div style={styles.slipLabel}>
                      {t("payroll.table header.total")}
                    </div>
                    <div style={styles.slipValue}>{numberWithCommas(paySlip.total_salary) + " " + user.currency}</div>
                    <div style={styles.slipValue}/>
                    <div style={styles.slipValue}/>
                  </div>
                </div>
              </>
            )
          }
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              {t("main.close")}
            </Button>
            <Button onClick={printContent} color="primary" variant="contained">
              {t("main.print")}
            </Button>
          </DialogActions>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default SlipView;
