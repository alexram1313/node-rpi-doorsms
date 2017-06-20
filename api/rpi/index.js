//pin = 5 for testing
function createRpiInstance(pin, stateChangeCallback){

    var gpio = require('rpi-gpio');
    var debounce = require('debounce');

    var prev_state = true;
    gpio.on('change', debounce(function(channel, value) {
        if (value != prev_state){
            prev_state = value;
            if (typeof(stateChangeCallback) === 'function'){
                //callback(isClosed)
                stateChangeCallback(value);
            }
            else{
                console.log('Channel ' + channel + ' closed state is now ' + value);
            }
        }

        
    }, 115));
    gpio.setup(pin, gpio.DIR_HIGH, gpio.EDGE_BOTH);

    function destroyRpiInstance(){
        gpio.destroy(function(){});
    }
}

module.exports = createRpiInstance;