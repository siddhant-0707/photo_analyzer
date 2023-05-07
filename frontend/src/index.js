import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';

const apiUrl = 'http://localhost:5000';

ReactDOM.render(
  <React.StrictMode>
    <App apiUrl={apiUrl}/>
  </React.StrictMode>,
  document.getElementById('root')
);
