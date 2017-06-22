var gpio = require('pigpio').Gpio
var debounce = require('debounce');
var next_state = true;

var armed = true;

//pin = 5 for testing
var createRpiInstance = function (pin, stateChangeCallback){

    var door = new gpio(pin, {
        mode: gpio.INPUT,
        pullUpDown: gpio.PUD_UP,
        edge: gpio.EITHER_EDGE
    });

    door.on('interrupt', debounce(function (level) {
         if ((armed) && (value == next_state)){
            next_state = !value;
            if (typeof(stateChangeCallback) === 'function'){
                //callback(isClosed)
                stateChangeCallback(value);
            }
            else{
                console.log('Channel ' + channel + ' open state is now ' + value);
            }
        }
    }, 115));

    return {
        destroyRpiInstance: function (){
            door.pullUpDown(gpio.PUD_OFF);
        },
        setArmedState: function(arm, callback){
            armed = arm;
            callback(armed);
        }
    };
};

module.exports = createRpiInstance;