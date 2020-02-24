// Entry file for client react-app

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const root = document.getElementById('app-root');
console.log('root >> ', root);
if (root.hasChildNodes()) {
  ReactDOM.hydrate(<App />, root);
} else {
  ReactDOM.render(<App />, root);
}

try {
  if (module && module.hot) {
    module.hot.accept('./App', () => {
      const NextApp = require('./App').default;
      React.render(
        <NextApp />,
        root
      );
    });
  }
} catch (err) {
  console.error(err);
}

