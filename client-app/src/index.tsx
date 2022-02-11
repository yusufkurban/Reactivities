import React from 'react';
import ReactDOM from 'react-dom';
import './app/layout/styles.css';
import 'semantic-ui-css/semantic.min.css'
import 'react-calendar/dist/Calendar.css'
import App from './app/layout/App';
import reportWebVitals from './reportWebVitals';
import { store, StoreContext } from './app/stores/store';
import { BrowserRouter } from 'react-router-dom';

//<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.11/semantic.min.css"/>
ReactDOM.render(
  <StoreContext.Provider value={store}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
   
    </StoreContext.Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
