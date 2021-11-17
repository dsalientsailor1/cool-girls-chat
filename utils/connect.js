const express = require("express");
var http = require("http");
const app = express();
// const port = process.env.PORT || 61120;
const port = 36939;
var server = http.createServer(app);
app.use(express.json());
const mongoConnect = require('./database').mongoConnect;

// module.exports = app;

mongoConnect(()=>{
    server.listen(port, () => {
      console.log("server started");
    });
  
  })
module.exports = server;
  