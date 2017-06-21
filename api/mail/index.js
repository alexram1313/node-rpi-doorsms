var fs = require('fs');
const nodemailer = require('nodemailer');

var ready = false;
var transporter;
var mailOptions;

fs.readFile('credpersonal.json', function(err, data){
    if (err) throw err;

    details = JSON.parse(data);
    transporter = nodemailer.createTransport({
        host: details.server,
        port: details.port,
        secure: details.port == 465, // secure:true for port 465, secure:false for port 587
        requireTLS: details.port == 587, //true for port 587
        auth: {
            user: details.from,
            pass: details.pass
        }
    });

    mailOptions = {
        from: '"RPi Door Sensor" <'+details.from+'>', // sender address
        to: details.to, // list of receivers
        subject: 'Door Status', // Subject line
        text: 'Hello world', // plain text body
        html: '<span>Hello world</span>' // html body
    };
    ready = true;
});

module.exports = {
    sendMail: function(text){
        if (ready){
            mailOptions.text = "\n"+text;
            mailOptions.html = "\n<span>"+text+"</span>";
            // send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    return console.log(error);
                }
                // console.log(text);
                // console.log('Message %s sent: %s', info.messageId, info.response);
            });
        }
        else{
            console.log("Not ready");
        }
    }
}