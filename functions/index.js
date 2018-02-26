'use strict';

const functions = require('firebase-functions');
const vapidKeys = require('./vapidKeys.json');
const gcmKeys = require('./gcmKeys.json');
const webpush = require('web-push');

// CORS Express middleware to enable CORS Requests.
const cors = require('cors')({
  origin: true, // Always allow the sender origin
});

webpush.setGCMAPIKey(gcmKeys.key);
webpush.setVapidDetails(
  'mailto:lauri.svan@specsign.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

exports.registrations = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // Parse the request into a token
    // TODO Request validation
    console.log(`Parsing request body ${JSON.stringify(req.body)}`);
    const endpoint = req.body.endpoint;
    const userKey = req.body.userKey;
    const userAuth = req.body.userAuth;

    const subscription = {
      endpoint: endpoint,
      keys: {
        p256dh: userKey,
        auth: userAuth,
      }
    };

    // This sample does not implement persistent storage - send the subscriber info
    // as part of 'send' endpoint payload.
    console.log(`TODO: Store this info for further reference: ${JSON.stringify(subscription)}`);
    res.status(204).end();
  });
});

function sendAndLog(subs, payload) {
  // Options are not really needed, because webpush is already configured
  const options = {};

  console.log(`Sending notification ${JSON.stringify(payload)}`);
  return webpush.sendNotification(subs, payload, options)
    // Handle the response
    .then(
      response => response,
      error => ({ statusCode: 500, headers: {},  body: error.message})
    )
    .then(response => {
      console.log(`statusCode: ${response.statusCode}, body: ${response.body}`);
      return response;
    });
}

exports.send = functions.https.onRequest((req, res) => {
  // TODO This code is not safely wrapped into promises or try/catch blocks
  cors(req, res, () => {
    const payload = JSON.stringify(req.body.payload);
    const subscriptions = req.body.subscriptions;

    // Send notification to all registered subscribers. Then respond as success
    console.log(`Sending notification to ${subscriptions.length} subscribers`);
    Promise.all(subscriptions.map(subs => sendAndLog(subs, payload)))
      .then(() => {
        res.status(200).send({ message: 'Success' });
      })
  });
});
