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
}

const SERVER_DATA = window.__VARS__ ? window.__VARS__ : null;

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
        
        {/* Customer webview entry point: menus, receipts? */}
        <Route path="/customer" exact component={Pages.CustomerRoutes} />
      </Switch>

    </Router>
  </div>
}

export default App;
