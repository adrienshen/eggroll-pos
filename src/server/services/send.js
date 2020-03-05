const M = require('messenger-node');

/**
 * @arwa Let's put all the messenge sending logic to FB messenger here
 * 
 */

function introduction() {
  // @todo Sends the introduction message when Customers first initiate chat

}

function responseWithNearbyLocations() {
  // @todo Return nearby locations to messenger client
  // Should this be text message list? Quick replies? Webview?

}

function startMenuSelection() {
  // @todo After selecting Merchant location, customers will select food items from Webview
  // We need a way to instruct Messenger to open webview
}

function askAboutPickupTimes() {
  // @todo After Customer makes their order, we need to ask for pickup time
  // In the database, it structure in 15 minute increments Eg. 15, 30, 45, 60
  // So perhaps a Quick Reply here would work

}

function askForOrderConfirmation() {
  //@todo Ask the Customer if they want to confirm the order

}

function respondWithReceipt() {
  // @todo Sends the receipt to customer, opened in a Webview
  // we already have the Receipt implmented in PR: https://github.com/adrienshen/facebook-bizchat-hackathon/pull/13/files
}