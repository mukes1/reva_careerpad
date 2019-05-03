const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: "",
  apiSecret: ""
});

module.exports.sendBulkSms = (senderNumber, message, phoneNumbers) => {

    //Loop through each number and send sms message to
    for (let i = 0; i < phoneNumbers.length; i++) {
      let number = phoneNumbers[i];
  
      // ensure number starts with country code (in this case, India (91))
      number = number.startsWith('0') ? number.replace('0', '91') : number;
      
      nexmo.message.sendSms(senderNumber, number, message, (err, result) => {
        if (err) console.log(err);
        console.log(result);
  
        // after the message has been successfully sent to the last number, send a server response
        if(i === phoneNumbers.length - 1){
          console.log('message sent');
          // You can now return server response.
        }
      });
    }
  };
