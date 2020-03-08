const Messenger = require('messenger-node');

const CONFIG = {
  // @todo: Get this from environment
  page_token: '<page_token>',
  app_token: '<app_token>',
  api_version: 'v2.11',
}

const ResponseTemplates = {
  Introduction: name => `Hey there ${name}, let\'s get you started with ordering from our participating Merchants. Would you mind sharing your location so we can find nearby shops for you?`,

}

const Client = new Messenger.Client(CONFIG);

/**
 * @arwa Let's put all the messenge sending logic to FB messenger here
 * 1. Chatbot initiates dialog. Offers options for user choice : 1. place order 2. check order
 * 2. user adds 
 * 
 * 
 * 
 */

function introduction(psid, customer) {
  // @todo Sends the introduction message when Customers first initiate chat
  const recipient = {'id': psid};
  Client.sendText(recipient, ResponseTemplates.Introduction(customer.name));
  
  "payload": {
    "template_type":"generic",
    "greeting": [
      {
        "locale":"default",
        "text":"Hello!" 
      }, {
        "locale":"en_US",
        "text":"Timeless apparel for the masses."
      }
    ]
  }

}

function responseWithNearbyLocations(psid, shops) {
  // @todo Return nearby locations to messenger client
  // Should this be text message list? Quick replies? Webview?

}

function startMenuSelection(psid) {
  // @todo After selecting Merchant location, customers will select food items from Webview
  // We need a way to instruct Messenger to open webview
}

function askAboutPickupTimes(psid) {
  // @todo After Customer makes their order, we need to ask for pickup time
  // In the database, it structure in 15 minute increments Eg. 15, 30, 45, 60
  // So perhaps a Quick Reply here would work

}

function askForOrderConfirmation(psid) {
  //@todo Ask the Customer if they want to confirm the order

}

function respondWithReceipt(psid, receiptId) {
  // @todo Sends the receipt to customer, opened in a Webview
  // we already have the Receipt implmented in PR: https://github.com/adrienshen/facebook-bizchat-hackathon/pull/13/files
}

function genericResponseText(psid, message) {
  // @todo regular text messages from our backend to Messenger
}

module.exports = {
  introduction,
  genericResponseText
}
