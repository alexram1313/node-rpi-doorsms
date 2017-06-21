var gpio = require('rpi-gpio');
var debounce = require('debounce');
var next_state = true;

var armed = true;

//pin = 5 for testing
var createRpiInstance = function (pin, stateChangeCallback){
    gpio.on('change', debounce(function(channel, value) {
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
    gpio.setup(pin, gpio.DIR_IN, gpio.EDGE_BOTH);

    return {
        destroyRpiInstance: function (){
            gpio.destroy(function(){});
        },
        setArmedState: function(arm, callback){
            armed = arm;
            callback(armed);
        }
    };
};

module.exports = createRpiInstance;