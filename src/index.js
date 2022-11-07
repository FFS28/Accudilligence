import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './store/modules';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// import Amplify from "aws-amplify";
// import awsExports from "./aws-exports";
// Amplify.configure(awsExports);

const store = createStore(rootReducer, composeWithDevTools());
//var cors = require('cors')
//this.use(cors())

// Nadezda code copy
//global variable
//window.$proxyUrl = "https://cors-anywhere.herokuapp.com/";
//window.$submitUrl = "https://uwbu2bfor9.execute-api.us-east-2.amazonaws.com/Dev";
//window.$followUpTAUrl = "https://uaptdt0v10.execute-api.us-east-2.amazonaws.com/Dev";
// NOTE CHANGE <BrowserRouter> to <React.StrictMode> to debug
ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
        <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
