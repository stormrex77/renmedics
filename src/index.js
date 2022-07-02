import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter } from 'react-router-dom';

import {GoogleOAuthProvider} from '@react-oauth/google';

import { Provider } from "react-redux";
import store from './components/store';
/*
<GoogleOAuthProvider clientId='328488836448-kt7892ah27774oievjl9nihvu9oobic9.apps.googleusercontent.com'>
      
      </GoogleOAuthProvider>
*/

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <GoogleOAuthProvider clientId='328488836448-kn201a2ln0h6uadl87kpshfbeomeemr1.apps.googleusercontent.com'>
      <Provider store={store}>
        <App />      
      </Provider>
      </GoogleOAuthProvider>    
    </HashRouter>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
