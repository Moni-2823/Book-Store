require('dotenv').config();        
const express = require('express'); // import express module

const Routes = require('./routes/index');
const connectMongo = require('./config/dbconnection.js');
const cors = require('cors');

connectMongo();

const app = express();
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({
extended: true
}));

const options = {
    definition : {
        info : {
            title : 'Node JS API for Book Project',
            description: 'API Infomation',
            contact: {
                name: "Amazing"
            },
            servers: ["http://localhost:8020"]
        },
    },
    apis: ["./routes/index.js " ,"./routes/admin/index.js"]
}

// cors handling here
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, x-csrf-token, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, PATCH, GET, POST, DELETE");
      return res.status(200).json({});
    }
    next();
  });

// logging for device for every hit and req time
app.use((req, res, next) => {
    console.log("/...")
    console.log(":::device:::",req.headers['user-agent'], ":::time:::", new Date())
    console.log(":::/:/:api point<<<", req.path, ">>>api point end/:/:/:::")
    console.log(":::start body<<<", req.body, ">>>end body:::")
    console.log(":::start query<<<", req.query, ">>>end query:::")
    console.log(".../")
    next()
})
//
//all routes here
app.use(Routes);

app.use(function(req,res,next) {
    res.status(404).send({message: "No Matching Route Please Check Again...!!"});
    return
});
 // error handler
 // define as the last app.use callback
app.use(function(err, req, res, next) {
console.log('err', err)
res.status(err.status || 500);
res.json({
    Error: {
        message: err.message
    }
});
});

module.exports = app;