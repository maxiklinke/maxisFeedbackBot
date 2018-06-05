//MARK: ---------------- Initialize app and set Listeners -------------------

const admin = require('firebase-admin');
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request');
const app = express()
//const port = 3000



/*
var serviceAccount = require('./chardjinn-firebase-adminsdk-8qg3e-25b4f64a8b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chardjinn.firebaseio.com"
});
// Get the database

const db = admin.firestore();
var ref = admin.app().database().ref();
var refAssistantResponses = db.collection('AssistantResponses'); //ref.child('AssistantResponses');
*/

const PAGE_ACCESS_TOKEN = "EAADBaYTyfQgBAFhEGE14uMvk2xSJ6AhwN9AD5Q1dMELmsQh4FaOB78QCpbURFcj3c5hZBvQ8imEXq0z0KFBZBSJduZCZC5zKo1AGa02JrI1rHgJr27NWNSOY1kQdI7Cdkxxy2i81goS366ejvQm8SBf869ZC76ZAs2MS4mU0PYVxbIZCUTrDInG"

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
  //init()
});


app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())


app.get('/', (req, res) => {
  //response.send('Hello from Express!'+ request)
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'verify_token') {
    console.log("token verified");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.status(403).end();
  }
})

app.get('/privacy', (req, res) => {
  //Show privacy stuff
  res.status(200).send("Facebook-Connect - Wir bieten Ihnen die Möglichkeit sich für unseren Dienst mit Facebook-Connect anzumelden. Eine zusätzliche Registrierung ist somit nicht möglich. Zur Anmeldung werden Sie auf die Seite von Facebook weitergeleitet, wo Sie sich mit ihren Nutzungsdaten anmelden können. Hierdurch werden ihre Facebook-Profil und unser Dienst verknüpft. Dadurch erhalten wir Einsicht auf die Informationen Ihres öffentlichen Profils. Diese Informationen werden anonymisiert und statistisch ausgewertet unseren Geschäftskunden zur Verfügung gestellt. Weitere Informationen zu Facebook-Connect und den Privatsphäre-Einstellungen entnehmen Sie bitte den Datenschutzhinweisen und den Nutzungsbedingungen der Facebook Inc.");
})


/* Handling all messenges */
app.post('/', (req, res) => {
  console.log(req.body);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});






//MARK: ---------------- handle Message -------------------

function sendMessage(event) {

  let sender = event.sender.id;
  let text = event.message.text;







  doNormalRespond(sender, "Thanks for the feedback. Send more feedback to get other crazy ways to say thank you.");
}












//MARK: ---------------- Create Facebook Response -------------------

function doNormalRespond(sender, message){
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: PAGE_ACCESS_TOKEN},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: {text: message}
    }
  }, function (error, response) {
    if (error) {
        console.log('Error sending message: ', error);
    } else if (response.body.error) {
        console.log('Error: ', response.body.error);
    }
  });
}
