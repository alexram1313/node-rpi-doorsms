var gcm = require('node-gcm');
// var cred = require('./../../cred.json');
var cred = require('./../../credpersonal.json');

//Functions
var createGcmInstance = function(){
    var sender = gcm.Sender(cred.server_key);
    var regTokens = [];

    var sendMsg = function(text){
        var message = new gcm.Message({
            priority: 'high',
            contentAvailable: true,
            delayWhileIdle: true,
            timeToLive: 3,
            dryRun: true,
            data: {
                event: text
            },
            notification: {
                title: text,
                icon: "ic_launcher",
                body: text+" courtesy of your door sensor."
            }
        });

        sender.send(message, { registrationTokens: regTokens }, function (err, response) {
            if(err) console.error(err);
            else    console.log(response);
        });
    }

    var insertRegToken = function(token){
        regTokens = [token]; //If only using one registration token
        // regTokens.push(token) //If using multiple tokens.
    }

    return {
        sendMsg:sendMsg,
        insertRegToken:insertRegToken
    }
};

module.exports = createGcmInstance;