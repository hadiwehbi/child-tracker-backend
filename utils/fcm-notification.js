const fs = require('firebase-admin');
const serviceAccount = require('./path/to/key.json');
const { initializeApp } = require('firebase-admin/app');

initializeApp({
    credential: applicationDefault(),
    databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});

const app = initializeApp();


















const serverKey = '<SERVER_KEY>';
const fcm = new FCM(serverKey);

var message = {
to:'<DEVICE_TOKEN>',
    notification: {
        title: 'NotifcatioTestAPP',
        body: '{"Message from node js app"}',
    },

    data: { //you can send only notification or only data(or include both)
        title: 'ok cdfsdsdfsd',
        body: '{"name" : "okg ooggle ogrlrl","product_id" : "123","final_price" : "0.00035"}'
    }

};

fcm.send(message, function(err, response) {
    if (err) {
        console.log("Something has gone wrong!"+err);
        console.log("Respponse:! "+response);
    } else {
        // showToast("Successfully sent with response");
        console.log("Successfully sent with response: ", response);
    }

});