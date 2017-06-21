var app  = require('express');
var rpi  = require('./api/rpi');
var smtp = require('./api/mail');

//Message constants
const msg = '\nDoor was ';
const states = {false: 'closed', true:'opened'}

//Instantiate our RPi doorsms API instance
var doorsms = rpi(5, function(openState){
    smtp.sendMail(msg+states[openState]);
});





//Cleanup
function exitHandler(options, err) {
    if (options.cleanup){
        doorsms.destroyRpiInstance();
        console.log('Cleaned!');
    }
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));


//Start Server
var server = app.listen(process.env.PORT || 8080, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("API listening at http://%s:%s", host, port)
});