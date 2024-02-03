const admin = require('firebase-admin');
// const serviceAccount = require('./../secrets/firebaseServiceKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


// Send a notification to the device
const sendNotificationToDevice = async (deviceToken, payload) =>{
    const message = {
        notification: {
          title: payload.title,
          body: payload.body
        }
      };
    admin.messaging().sendToDevice(deviceToken, message)
    .then((response) => {
        console.log('Successfully sent message:', response);
    })
    .catch((error) => {
        console.error('Error sending message:', error);
    });
}


module.exports = {
    sendNotificationToDevice
}