const express = require('express');
const app = express();
const port = 3000;
const db = require('./config/mongoose');
const task = require('./models/task');
const employee = require('./models/employee');
const department = require('./models/department');
const upassword = require('./models/upassword');
const values = require('./models/values');
const layouts = require('express-ejs-layouts');


//use express router
app.use(express.static('assets'));
app.use(express.urlencoded());
app.use(layouts);
app.set('view engine','ejs');
app.set('views','./views');
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
app.use('/',require('./routes'));
app.use('/user',require('./routes/users'));


require('dotenv').config();
   
app.listen(port, function(err){
    if(err)
    {
        console.log(`error : ${err}`);
        return;
    }
    console.log(`Server is running on port:${port}`);
})
