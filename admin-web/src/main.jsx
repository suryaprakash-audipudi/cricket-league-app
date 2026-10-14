// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// core, cache, మరియు provider అన్నింటినీ ఒకే రూట్ ప్యాకేజీ నుండి క్లీన్ గా ఇంపోర్ట్ చేస్తున్నాం
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'; // core నుండి క్లయింట్
import { ApolloProvider } from '@apollo/client/react'; 

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://us-central1-cricket-global-league.cloudfunctions.net/api',
  }),
  cache: new InMemoryCache(),
});


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
