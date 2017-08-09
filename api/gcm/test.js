var gcm  = require('./index.js')();

//Reg Token
console.log("Inserting Reg Token");

//Obtain the device registration token from the Android Logcat. Search for "Refreshed Token"
//If you can't find it, uninstall then reinstall the door sensor app.
const REG_TOKEN = "c5qMf_EyzRQ:APA91bHXtYRgwD7WtMukcBWwNlU9xkKWv64WUF3iBKecJfzXJFqf3D18GM1LB-v9pqPSW6lSOFuDthS-NiW69OA7LZsM6Squkv1D1Bay7Yn9QAf1S8DwV5DiPUU_Ooyhcz94qxl3nocS";
gcm.insertRegToken(REG_TOKEN);

//Sending 
console.log("Sending arbitrary message");
gcm.sendMsg("Derpy!");
//Show should notification on device with title "Derpy!" and text "Derpy! courtesy of your door sensor"