const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.json());

// authentication routes
const { loginRouter, profileRouter, resetPasswordRouter, registerRouter } = require('./server/auth/login');
app.post('/api/auth/login', loginRouter);
app.get('/api/auth/profile', profileRouter);
app.post('/api/auth/reset', resetPasswordRouter);
app.post('/api/auth/register', registerRouter);

// employees routes
const { employeesGetRouter, employeeGetRouter, employeesPostRouter, employeesPutRouter, employeesDeleteRouter, passwordRouter } = require('./server/employees');
app.get('/api/employees/:company_id/:id', employeeGetRouter);
app.get('/api/employees/:company_id', employeesGetRouter);
app.post('/api/employees', employeesPostRouter);
app.put('/api/employees', employeesPutRouter);
app.delete('/api/employees/:id', employeesDeleteRouter);
app.put('/api/password', passwordRouter);

// roles routes
const { rolesGetRouter, roleGetRouter, rolesPostRouter, rolesPutRouter, rolesDeleteRouter } = require('./server/roles');
app.get('/api/roles/:company_id', rolesGetRouter);
app.get('/api/roles/:company_id/:id', roleGetRouter);
app.post('/api/roles', rolesPostRouter);
app.put('/api/roles', rolesPutRouter);
app.delete('/api/roles/:id', rolesDeleteRouter);

// companies routes
const { settingGetRouter, settingPutRouter } = require('./server/settings');
app.get('/api/settings/:company_id', settingGetRouter);
app.put('/api/settings', settingPutRouter);

// let the react app to handle any unknown routes 
// serve up the index.html if express does'nt recognize the route
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// start the server listening for requests
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
