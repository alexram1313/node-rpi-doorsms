var gcm = require('node-gcm');
// var cred = require('./../../cred.json');
var cred = require('./../../credpersonal.json');

//Functions
var createGcmInstance = function(){
    var sender = gcm.Sender(cred.server_key);
    var regTokens = [];

    var sendMsg = function(text, onErr){
        var message = new gcm.Message({
            priority: 'high',
            contentAvailable: true,
            delayWhileIdle: true,
            timeToLive: 3,
            // dryRun: true,
            data: {
                title: text,
                icon: "ic_launcher",
                body: text+" courtesy of your door sensor."
            }
        });

        message.addNotification({
            title: text,
            body: text+" courtesy of your door sensor.",
            icon: 'ic_launcher',
            sound: 'default'
        });

        sender.send(message, { registrationTokens: regTokens }, function (err, response) {
            if(err) {
                console.log("Error");
                console.error(err);
                if (typeof(onErr) !== 'undefined') onErr();
            }
            else {
                console.log("Success");
                console.log(response);
            }
        });
    }

    var insertRegToken = function(token){
        regTokens = [token];     //If only using one registration token
        // regTokens.push(token) //If using multiple tokens.
    }

    return {
        sendMsg:sendMsg,
        insertRegToken:insertRegToken
    }
};

module.exports = createGcmInstance;