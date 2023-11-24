const express = require('express');
const path = require('path');
const { loginRouter, profileRouter, resetPasswordRouter, registerRouter } = require('./server/auth/login');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.json());

app.post('/api/auth/login', loginRouter);
app.get('/api/auth/profile', profileRouter);
app.post('/api/auth/reset', resetPasswordRouter);
app.post('/api/auth/register', registerRouter);

// let the react app to handle any unknown routes 
// serve up the index.html if express does'nt recognize the route
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// start the server listening for requests
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
