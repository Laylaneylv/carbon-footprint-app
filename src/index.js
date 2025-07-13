{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 Menlo-Regular;}
{\colortbl;\red255\green255\blue255;\red111\green14\blue195;\red236\green241\blue247;\red0\green0\blue0;
\red14\green110\blue109;\red24\green112\blue43;\red77\green80\blue85;}
{\*\expandedcolortbl;;\cssrgb\c51765\c18824\c80784;\cssrgb\c94118\c95686\c97647;\cssrgb\c0\c0\c0;
\cssrgb\c0\c50196\c50196;\cssrgb\c9412\c50196\c21961;\cssrgb\c37255\c38824\c40784;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs28 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 import\cf0 \strokec4  \cf5 \strokec5 React\cf0 \strokec4  \cf2 \strokec2 from\cf0 \strokec4  \cf6 \strokec6 'react'\cf0 \strokec4 ;\cb1 \
\cf2 \cb3 \strokec2 import\cf0 \strokec4  \cf5 \strokec5 ReactDOM\cf0 \strokec4  \cf2 \strokec2 from\cf0 \strokec4  \cf6 \strokec6 'react-dom/client'\cf0 \strokec4 ;\cb1 \
\cf2 \cb3 \strokec2 import\cf0 \strokec4  \cf5 \strokec5 CarbonFootprintAppWrapper\cf0 \strokec4  \cf2 \strokec2 from\cf0 \strokec4  \cf6 \strokec6 './App'\cf0 \strokec4 ; \cf7 \strokec7 // Assuming your main App component is in App.jsx or App.js\cf0 \cb1 \strokec4 \
\cf2 \cb3 \strokec2 import\cf0 \strokec4  \cf6 \strokec6 './index.css'\cf0 \strokec4 ; \cf7 \strokec7 // For global styles, including Tailwind CSS imports\cf0 \cb1 \strokec4 \
\
\cf2 \cb3 \strokec2 const\cf0 \strokec4  root = \cf5 \strokec5 ReactDOM\cf0 \strokec4 .createRoot(document.getElementById(\cf6 \strokec6 'root'\cf0 \strokec4 ));\cb1 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 root.render(\cb1 \
\cb3   <\cf5 \strokec5 React\cf0 \strokec4 .\cf5 \strokec5 StrictMode\cf0 \strokec4 >\cb1 \
\cb3     <\cf5 \strokec5 CarbonFootprintAppWrapper\cf0 \strokec4  />\cb1 \
\cb3   </\cf5 \strokec5 React\cf0 \strokec4 .\cf5 \strokec5 StrictMode\cf0 \strokec4 >\cb1 \
\cb3 );\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf7 \cb3 \strokec7 // If you want to start measuring performance in your app, pass a function\cf0 \cb1 \strokec4 \
\cf7 \cb3 \strokec7 // to log results (for example: reportWebVitals(console.log))\cf0 \cb1 \strokec4 \
\cf7 \cb3 \strokec7 // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals\cf0 \cb1 \strokec4 \
\cf7 \cb3 \strokec7 // import reportWebVitals from './reportWebVitals';\cf0 \cb1 \strokec4 \
\cf7 \cb3 \strokec7 // reportWebVitals();\cf0 \cb1 \strokec4 \
\
}