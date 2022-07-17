const express = require('express');
const dotEnv = require('dotenv').config()
const tpssAPI = require('./controller/api')
const path = require('path')
const validateInput = require('./models/inputSchema')
const errorHandler = require('./utils/errorHandler')
const createError = require('http-errors')

const app = express();
const PORT = process.env.PORT;

/****************************************************************Middleware Start*********************************************************/
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

//Error Handler
app.use(errorHandler)

/****************************************************************Middleware End**********************************************************/




/******************************************************************Route Start**************************************************************/

app.post('/split-payments/compute', validateInput, tpssAPI)

/******************************************************************Route End****************************************************************/






app.listen(`${PORT}`, ()=>{
    console.log(`Listening on port ${PORT}`)
})
