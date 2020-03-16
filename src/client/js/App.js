import React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import {createBrowserHistory} from 'history';

import Lazy from './components/Lazy';
import HomeLanding from './pages/HomeLanding';

const history = createBrowserHistory();

const Pages = {
  AboutPage: (props) => <Lazy {...props} module={import('./pages/About')} />,
  Receipts: (props) => <Lazy {...props} module={import('./pages/Receipts')} />,
  MerchantRoutes: (props) => <Lazy {...props} module={import('./pages/MerchantRoutes')} />,
  CustomerRoutes: (props) => <Lazy {...props} module={import('./pages/CustomerRoutes')} />,
  Menus: (props) => <Lazy {...props} module={import('./pages/Menus')} />,
}

const SERVER_DATA = window.__VARS__ ? window.__VARS__ : null;

// FB Messenger Ext.
(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/messenger.Extensions.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'Messenger'));

function App() {
  // Data from express.js
  console.log('SERVER_DATA >> ', SERVER_DATA);
  return <div>
    <Router history={history}>

      <Switch>
        <Route path="/" exact component={HomeLanding} />
        <Route path="/about" exact component={Pages.AboutPage} />
        <Route path="/receipts/:id" exact component={Pages.Receipts} />

        {/* Merchant dashboard entry point */}
        <Route path="/merchant" exact component={Pages.MerchantRoutes} />

        {/* Ordering and Menu routes */}
        <Route path="/orders/:orderUuid/menus" exact component={Pages.Menus} />

        {/* Customer webview entry point: menus, receipts? */}
        <Route path="/customer" exact component={Pages.CustomerRoutes} />
      </Switch>

    </Router>
  </div>
}

export default App;
