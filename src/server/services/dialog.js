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
 * @team, this is the basics of the message sending logic:
 * 
 * 1. Chatbot initiates intro dialog. Then Offers options for user choice : 1. place order 2. check order
 * 2.1 place order:
 *   2.1.1 chatbot asks for location
 *   2.1.2 user returns location
 *   2.1.3 chatbot returns url links to F&B places nearby. these will link to the merchant webviews.
 *   2.1.4 user selects url to preferred F&B place, and does ordering in merchant webview.
 * 
 * 2.2 check order
 *   2.2.2 chatbot pulls out order and returns to user
 *   2.2.3 The user will be returned with a receipt
 * 
 * 
 */



function introduction(psid, customer, text) {
  // @todo Sends the introduction message when Customers first initiate chat
  const recipient = {'id': psid};
  Client.sendText(recipient, ResponseTemplates.Introduction(customer.name));

  let messageData = {
    "message":{
      "text": "Hello, thanks for getting in touch."
    },
    "message":{
      "text":"How can we help you today?"
    }
  }

  sendRequest(psid, customer, messageData)

}



function sendButtonMessage(customer, text) {
  // Once the chatbot initiates the introduction message, customers can choose from options via buttons
  let messageData = {
    "message":{
      "attachment":{
        "type":"postback",
        "payload":{
          "buttons":[
            {
              "type":"Make an order",
              "payload":"make_order"
            },
            {
              "type":"Check my order",
              "payload": "check_order"
            }
          ]
        }
      }
    }

  }

  sendRequest(sender, messageData)
}

function decideMessage(customer, text1) {
//This function allows chatbot to continue the dialog flow, depending on 
//customer's choise: make_order or check_order

  let text1 = text.toLowerCase();
  if (text.includes("make_order")) {
    responseWithNearbyLocations(psid, shops);
  } else if (text.includes("check_order")) {
    sendCheckOrderMessage(sender);
  } else {
    sendText(customer, "How can we help you today?");
  }

}

function sendText(sender, text) {
  let messageData = {text: text};
  sendRequest(sender, messageData)
}


//TBC...
function responseWithNearbyLocations(psid, shops) {
  // @todo Return nearby locations to messenger client
  // Should this be text message list? Quick replies? Webview?
  // Using quick reply to prompt customer to share location

  let messageData = {

    "messaging_type": "RESPONSE",
    "message":{
      "text": "Please share your location so that we can find the nearest restaurants to you:",
      "quick_replies":[
        {
          "content_type":"location",
          "title":"Send location",
          "payload":"<POSTBACK_PAYLOAD>" //@todo: find out how to return the locations
        }
      ]
    }
  }

  sendRequest(sender, messageData)

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
