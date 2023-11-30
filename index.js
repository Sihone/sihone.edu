const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.json());

// authentication routes
const { loginRouter, profileRouter, resetPasswordRouter, registerRouter } = require('./server-mysql/auth/login');
app.post('/api/auth/login', loginRouter);
app.get('/api/auth/profile', profileRouter);
app.post('/api/auth/reset', resetPasswordRouter);
app.post('/api/auth/register', registerRouter);

// employees routes
const { employeesGetRouter, employeeGetRouter, employeesPostRouter, employeesPutRouter, employeesDeleteRouter, passwordRouter } = require('./server-mysql/employees');
app.get('/api/employees/:company_id/:id', employeeGetRouter);
app.get('/api/employees/:company_id', employeesGetRouter);
app.post('/api/employees', employeesPostRouter);
app.put('/api/employees', employeesPutRouter);
app.delete('/api/employees/:id', employeesDeleteRouter);
app.put('/api/password', passwordRouter);

// roles routes
const { rolesGetRouter, roleGetRouter, rolesPostRouter, rolesPutRouter, rolesDeleteRouter } = require('./server-mysql/roles');
app.get('/api/roles/:company_id', rolesGetRouter);
app.get('/api/roles/:company_id/:id', roleGetRouter);
app.post('/api/roles', rolesPostRouter);
app.put('/api/roles', rolesPutRouter);
app.delete('/api/roles/:id', rolesDeleteRouter);

// companies routes
const { settingGetRouter, settingPutRouter } = require('./server-mysql/settings');
app.get('/api/settings/:company_id', settingGetRouter);
app.put('/api/settings', settingPutRouter);

// attendance routes
const { attendanceGetAllRouter, attendanceGetRouter, attendancePostRouter, attendancePutRouter, attendanceDeleteRouter } = require('./server-mysql/attendance');
app.get('/api/attendance/:company_id/:id', attendanceGetRouter);
app.get('/api/attendance/:company_id', attendanceGetAllRouter);
app.post('/api/attendance', attendancePostRouter);
app.put('/api/attendance', attendancePutRouter);
app.delete('/api/attendance/:id', attendanceDeleteRouter);

// payroll routes
const { payrollGetAllRouter, payrollGetRouter, payrollPostRouter, payrollPutRouter, payrollDeleteRouter } = require('./server-mysql/payroll');
app.get('/api/payroll/:company_id/:id', payrollGetRouter);
app.get('/api/payroll/:company_id', payrollGetAllRouter);
app.post('/api/payroll', payrollPostRouter);
app.put('/api/payroll', payrollPutRouter);
app.delete('/api/payroll/:id', payrollDeleteRouter);

// academic years routes
const { academicYearsGetAllRouter, academicYearGetRouter, academicYearsPostRouter, academicYearsPutRouter, academicYearsDeleteRouter } = require('./server-mysql/academic_years');
app.get('/api/academic_years/:company_id/:id', academicYearGetRouter);
app.get('/api/academic_years/:company_id', academicYearsGetAllRouter);
app.post('/api/academic_years', academicYearsPostRouter);
app.put('/api/academic_years', academicYearsPutRouter);
app.delete('/api/academic_years/:id', academicYearsDeleteRouter);

// academic cycles routes
const { academicCycleGetAllRouter, academicCycleGetRouter, academicCyclePostRouter, academicCyclePutRouter, academicCycleDeleteRouter } = require('./server-mysql/academic_cycles');
app.get('/api/academic_cycles/:company_id/:id', academicCycleGetRouter);
app.get('/api/academic_cycles/:company_id', academicCycleGetAllRouter);
app.post('/api/academic_cycles', academicCyclePostRouter);
app.put('/api/academic_cycles', academicCyclePutRouter);
app.delete('/api/academic_cycles/:id', academicCycleDeleteRouter);

// academic programs routes
const { academicProgramGetAllRouter, academicProgramGetRouter, academicProgramPostRouter, academicProgramPutRouter, academicProgramDeleteRouter } = require('./server-mysql/academic_programs');
app.get('/api/academic_programs/:company_id/:id', academicProgramGetRouter);
app.get('/api/academic_programs/:company_id', academicProgramGetAllRouter);
app.post('/api/academic_programs', academicProgramPostRouter);
app.put('/api/academic_programs', academicProgramPutRouter);
app.delete('/api/academic_programs/:id', academicProgramDeleteRouter);

// academic courses routes
const { academicCourseGetAllRouter, academicCourseGetRouter, academicCoursePostRouter, academicCoursePutRouter, academicCourseDeleteRouter } = require('./server-mysql/academic_courses');
app.get('/api/academic_courses/:company_id/:id', academicCourseGetRouter);
app.get('/api/academic_courses/:company_id', academicCourseGetAllRouter);
app.post('/api/academic_courses', academicCoursePostRouter);
app.put('/api/academic_courses', academicCoursePutRouter);
app.delete('/api/academic_courses/:id', academicCourseDeleteRouter);

// academic modules routes
const { academicModuleGetAllRouter, academicModuleGetRouter, academicModulePostRouter, academicModulePutRouter, academicModuleDeleteRouter } = require('./server-mysql/academic_modules');
app.get('/api/academic_modules/:company_id/:id', academicModuleGetRouter);
app.get('/api/academic_modules/:company_id', academicModuleGetAllRouter);
app.post('/api/academic_modules', academicModulePostRouter);
app.put('/api/academic_modules', academicModulePutRouter);
app.delete('/api/academic_modules/:id', academicModuleDeleteRouter);

// academic exams routes
const { academicExamsGetAllRouter, academicExamsGetRouter, academicExamsPostRouter, academicExamsPutRouter, academicExamsDeleteRouter } = require('./server-mysql/academic_exams');
app.get('/api/academic_exams/:company_id/:id', academicExamsGetRouter);
app.get('/api/academic_exams/:company_id', academicExamsGetAllRouter);
app.post('/api/academic_exams', academicExamsPostRouter);
app.put('/api/academic_exams', academicExamsPutRouter);
app.delete('/api/academic_exams/:id', academicExamsDeleteRouter);

// finance accounts routes
const { financeAccountsGetAllRouter, financeAccountGetRouter, financeAccountsPostRouter, financeAccountsPutRouter, financeAccountsDeleteRouter } = require('./server-mysql/finance_accounts');
app.get('/api/finance_accounts/:company_id/:id', financeAccountGetRouter);
app.get('/api/finance_accounts/:company_id', financeAccountsGetAllRouter);
app.post('/api/finance_accounts', financeAccountsPostRouter);
app.put('/api/finance_accounts', financeAccountsPutRouter);
app.delete('/api/finance_accounts/:id', financeAccountsDeleteRouter);

// finance transactions routes
const { financeTransactionsGetAllRouter, financeTransactionsGetRouter, financeTransactionsPostRouter, financeTransactionsPutRouter, financeTransactionsDeleteRouter } = require('./server-mysql/finance_transactions');
app.get('/api/finance_transactions/:company_id/:id', financeTransactionsGetRouter);
app.get('/api/finance_transactions/:company_id', financeTransactionsGetAllRouter);
app.post('/api/finance_transactions', financeTransactionsPostRouter);
app.put('/api/finance_transactions', financeTransactionsPutRouter);
app.delete('/api/finance_transactions/:id', financeTransactionsDeleteRouter);

// students routes
const { studentsGetAllRouter, studentGetRouter, studentsPostRouter, studentsPutRouter, studentsDeleteRouter } = require('./server-mysql/students');
app.get('/api/students/:company_id/:id', studentGetRouter);
app.get('/api/students/:company_id', studentsGetAllRouter);
app.post('/api/students', studentsPostRouter);
app.put('/api/students', studentsPutRouter);
app.delete('/api/students/:id', studentsDeleteRouter);

// let the react app to handle any unknown routes 
// serve up the index.html if express does'nt recognize the route
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// start the server listening for requests
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
