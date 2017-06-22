var Gpio = require('pigpio').Gpio
var debounce = require('debounce');
var next_state = true;

var armed = true;

//pin = 5 for testing
var createRpiInstance = function (pin, stateChangeCallback){

    console.log(pin);

    var door = new Gpio(pin, {
        mode: Gpio.INPUT,
        pullUpDown: Gpio.PUD_UP,
        edge: Gpio.EITHER_EDGE
    });

    door.on('interrupt', debounce(function (value) {
        console.log(value);
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
            door.pullUpDown(Gpio.PUD_OFF);
            door.disableInterrupt();
        },
        setArmedState: function(arm, callback){
            armed = arm;
            callback(armed);
        }
    };
};

module.exports = createRpiInstance;