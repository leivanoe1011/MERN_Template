
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthProvider from './Context/AuthContext';

import "./styles/common.css";
import "./styles/chatroom.css";

ReactDOM.render(
  
  <AuthProvider>
    <App />
  </AuthProvider>, document.getElementById('root')

);
