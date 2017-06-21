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
    rpi.setArmedState(req.params.state, function(state){
        var msgToSend = '\nSystem '+((!state)?'dis':'')+'armed'
        postMsg(msgToSend);
        res.status(200).json({armed:state});
    });
})

app.get('/events', function(req, res){
    rpi.setArmedState(req.params.state, function(state){
        res.status(200).json({events:events});
    });
})

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