const express = require('express');
const cors = require('cors');
const {globalErrHandler, notFoundErr,} = require('../middleware/globalErrHandler');
const wasteBinRouter = require('../routes/wastebin/wastebin');
const managerRouter = require('../routes/user/manager');
const residentRouter = require('../routes/user/resident'); 



const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:2025' }));

//Waste Bin routes
app.use('/api/wastebin', wasteBinRouter);
//User routes
//residents
app.use('/api/resident', residentRouter);

//Manager routes
app.use('/api/manager', managerRouter);
//Error handling
app.use(notFoundErr);
app.use(globalErrHandler);

module.exports = app;