var app  = require('express')();
var rpi  = require('./api/rpi');
var smtp = require('./api/mail');

//Message constants
const msg = '\nDoor was ';
const states = {false: 'closed', true:'opened'}

//Historical data
var events = new Array();

function postMsg(text){
    var time = new Date(new Date().getTime()).toLocaleTimeString();
    var msgToSend = text + ' at ' + time;
    smtp.sendMail(msgToSend);
    console.log(msgToSend);
    events.push(msgToSend);
}


//Instantiate our RPi doorsms API instance
var doorsms = rpi(5, function(openState){
    postMsg(msg+states[openState]);
});

//Routing
app.get('/', function(req, res){
    res.status(200).json({message:"Connected!"});
})

app.get('/arm/:state', function(req, res){
    var isValid = req.params.state == 'false' || req.params.state == 'true';

    if (isValid){
        var state = req.params.state == 'true';
        doorsms.setArmedState(state, function(state){

            var msgToSend = '\nSystem '+((!state)?'dis':'')+'armed'
            postMsg(msgToSend);
            res.status(200).json({armed:state});
        });
    }
    else {
        res.status(400).json({error: "Invalid parameter. Either pass 'true' or 'false'"})
    }

})

app.get('/events', function(req, res){
    res.status(200).json({events:events});
})

//Cleanup
function exitHandler(options, err) {
    if (options.cleanup){
        options.doorsms.destroyRpiInstance();
        console.log('Cleaned!');
    }
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{doorsms:doorsms, cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {doorsms:doorsms, exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {doorsms:doorsms, exit:true}));


//Start Server
var server = app.listen(process.env.PORT || 8080, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("API listening at http://%s:%s", host, port)
});