const Messenger = require('messenger-node');

const CONFIG = {
  // @todo: Get this from environment
  page_token: '<page_token>',
  app_token: '<app_token>',
  api_version: 'v2.11',
}

const standardResponses = require('../services/response')

const ResponseTemplates = {
  Introduction: name => `Hey there ${name}, let\'s get you started with ordering from our participating Merchants. Would you mind sharing your location so we can find nearby shops for you?`,
  ViewReceipt: (name, receiptId) => standardResponses.genButtonTemplate(
    `Hey there ${name}, here is your receipt!`,
    {
      type: 'web_url',
      title: 'View Receipt',
      url: `${SERVER_URL}/receipts/${receiptId}`,
      webview_height_ratio: 'tall',
      messenger_extensions: true,
    }
  ),
  Confirmation: () => standardResponses.genQuickReply('Would you like to confirm your order?',[ {"content_type":"text","payload":"OrderCancel","title":"Confirm"}, {"content_type":"text","payload":"OrderCancel","title":"Cancel"}]),
  SelectPickUpTime: () => standardResponses.genQuickReply('When do you want to pick it up?',
  [ 
    {"content_type":"text","payload":"Order15","title":"15 mins"},
    {"content_type":"text","payload":"Order30","title":"30 mins"},
    {"content_type":"text","payload":"Order45","title":"45 mins"},
    {"content_type":"text","payload":"Order60","title":"60 mins"},]),
  GenericMessage: message => `${message}`
}

const Client = new Messenger.Client(CONFIG);

/**
 * @arwa Let's put all the messenge sending logic to FB messenger here
 *
 */

function introduction(psid, customer) {
  // @todo Sends the introduction message when Customers first initiate chat
  const recipient = {'id': psid};
  Client.sendText(recipient, ResponseTemplates.Introduction(customer.name));
  Client.sendTemplate(recipient,ResponseTemplates)
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
  const recipient = {'id': psid};
  Client.sendTemplate(recipient, ResponseTemplates.SelectPickUpTime(customer.name));

}

function askForOrderConfirmation(psid) {
  //@todo Ask the Customer if they want to confirm the order
  const recipient = {'id': psid};
  Client.sendTemplate(recipient, ResponseTemplates.Confirmation());

}

function respondWithReceipt(psid, receiptId) {
  // @todo Sends the receipt to customer, opened in a Webview
  // we already have the Receipt implmented in PR: https://github.com/adrienshen/facebook-bizchat-hackathon/pull/13/files
  const recipient = {'id': psid};
  Client.sendTemplate(recipient, ResponseTemplates.ViewReceipt(customer.name,receiptId));
}

function genericResponseText(psid, message) {
  // @todo regular text messages from our backend to Messenger
  const recipient = {'id': psid};
  Client.sendText(recipient, message);
}

module.exports = {
  introduction,
  genericResponseText
}
