import React from 'react';
import ReactDOM from 'react-dom/client';
import CarbonFootprintAppWrapper from './App'; // Assuming your main App component is in App.jsx or App.js
import './index.css'; // For global styles, including Tailwind CSS imports

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CarbonFootprintAppWrapper />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// import reportWebVitals from './reportWebVitals';
// reportWebVitals();

