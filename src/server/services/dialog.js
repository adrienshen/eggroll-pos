const Messenger = require('messenger-node');

const CONFIG = {
  page_token: process.env.PAGE_ACCESS_TOKEN,
  app_token: process.env.APP_ID,
  api_version: 'v2.11',
}

const standardResponses = require('../services/response')

const ResponseTemplates = {
  Introduction: name => `Hey there ${name}, let\'s get you started with ordering from our participating Merchants. Would you mind sharing your location so we can find nearby shops for you?`,
  ShowListOfMerchants: `Here's a list of available Merchants near you`,
  WhenToPickupQuickReply: {
    quickReplies: [
      {
        content_type: 'text',
        title: 'In 15 minutes',
        payload: 15,
      },
      {
        content_type: 'text',
        title: 'In 30 minutes',
        payload: 30,
      },
      {
        content_type: 'text',
        title: 'In 45 minutes',
        payload: 45,
      },
      {
        content_type: 'text',
        title: 'In 1 hour',
        payload: 60,
      }
    ],
    text: 'When would you like to pickup your order?',
  },
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
}

const Client = new Messenger.Client(CONFIG);

/**
 * @arwa Let's put all the messenge sending logic to FB messenger here
 *
 */

async function introduction(psid, customer) {
  // @todo Sends the introduction message when Customers first initiate chat
  const recipient = {'id': psid};
  const results = await Client.sendText(recipient, ResponseTemplates.Introduction(customer.name));
  console.log('results from introduction >> ', results);
}

async function askAboutFoodType(psid, customer) {

}

async function responseWithNearbyLocations(psid, merchants) {
  // @todo Return nearby locations to messenger client
  // Should this be text message list? Quick replies? Webview?

  try {
    const recipient = {'id': psid};
    const elements = merchants.map(m => {
      // @todo: use actual orderUuid from database
      const uuid = '0fc6535c-0700-4926-8504-76c8b1c24fb4';

      return {
        title: `#${m.id} - ${m.business_name}`,
        image_url: 'https://placekitten.com/g/300/200',
        subtitle: m.description || '',
        default_action: {
          type: 'web_url',
          url: `https://0175863f.ngrok.io/orders/${uuid}/menus`,
          webview_height_ratio: 'FULL',
        },
        buttons: [
          {
            type: 'web_url',
            url: `https://0175863f.ngrok.io/orders/${uuid}/menus`,
            title: 'View Menu',
            webview_height_ratio: 'FULL',
          }
        ],
      }
    });
    const template = {
      template_type: 'generic',
      elements,
    };
  
    // console.log('results from responseWithNearbyLocations >> ', results);
    return await Client.sendTemplate(recipient, template);
  } catch(err) {
    Client.sendText(recipient, `Hmm... we didn't understand that. What's your postal code again?`);
  }
}

function startMenuSelection(psid) {
  // @todo After selecting Merchant location, customers will select food items from Webview
  // We need a way to instruct Messenger to open webview
}

async function askAboutPickupTimes(customer, lineItems) {
  let totalItemsAdded = 0;
  let totalPriceCents = 0;
  lineItems.forEach(line => {
    totalItemsAdded += line.quantity;
    totalPriceCents += parseInt(line.price_cents);
  });

  // console.log(totalItemsAdded, totalPriceCents);

  const recipient = {'id': customer.psid};
  const {quickReplies, text} = ResponseTemplates.WhenToPickupQuickReply;
  await Client.sendText(recipient, `Great! We've added ${totalItemsAdded} items to your order cart subtotaling about ${(totalPriceCents/100).toFixed(2)}`);
  setTimeout(Client.sendQuickReplies(recipient, quickReplies, text), 1000);
}

function askForOrderConfirmation(psid) {
  //@todo Ask the Customer if they want to confirm the order

}

function respondWithReceipt(psid, receiptId) {
  // @todo Sends the receipt to customer, opened in a Webview
  // we already have the Receipt implmented in PR: https://github.com/adrienshen/facebook-bizchat-hackathon/pull/13/files
  const recipient = {'id': psid};
  Client.sendTemplate(recipient, ResponseTemplates.ViewReceipt(customer.name,receiptId));
}

function genericResponseText(psid, message) {
  // @todo regular text messages from our backend to Messenger
}

module.exports = {
  introduction,
  genericResponseText,
  responseWithNearbyLocations,
  askAboutPickupTimes,
}
