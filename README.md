# Node.js Raspberry Pi Texting Door Sensor Server

Retrieve door state and arm state changes and arm/disarm remotely with this API server to be run on a Raspberry Pi.

See the video: https://www.youtube.com/watch?v=wQlXgi7THG8

## How to use

1. Clone the GitHub repo

```
git clone https://github.com/alexram1313/node-rpi-doorsms
```

2. Change the information in cred.json to your details.

  - `server`: Your email provider's SMTP server address
  - `port`: Your email provider's SMTP port
  - `from`: Your email address
  - `to`: Recipient email address or SMS Gateway address
  - `pass`: Your email password

3. Connect a normally-closed reed switch to ground and GPIO20 (can be changed in index.js)

4. Run using `sudo node index.js`

## API

- `/`: Returns a connected message
- `/events`: Returns all recorded door state and arm state change events
- `/arm/true`: Arms the system and records all door state changes
- `/arm/false`: Disarms the system and disables recording door state changes
