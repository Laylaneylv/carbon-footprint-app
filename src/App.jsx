{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 Menlo-Regular;}
{\colortbl;\red255\green255\blue255;\red111\green14\blue195;\red236\green241\blue247;\red0\green0\blue0;
\red14\green110\blue109;\red24\green112\blue43;\red77\green80\blue85;\red164\green69\blue11;\red191\green28\blue37;
}
{\*\expandedcolortbl;;\cssrgb\c51765\c18824\c80784;\cssrgb\c94118\c95686\c97647;\cssrgb\c0\c0\c0;
\cssrgb\c0\c50196\c50196;\cssrgb\c9412\c50196\c21961;\cssrgb\c37255\c38824\c40784;\cssrgb\c70980\c34902\c3137;\cssrgb\c80392\c19216\c19216;
}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs28 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 import\cf0 \strokec4  \cf5 \strokec5 React\cf0 \strokec4 , \{ useState, useEffect, createContext, useContext, useCallback \} \cf2 \strokec2 from\cf0 \strokec4  \cf6 \strokec6 'react'\cf0 \strokec4 ;\cb1 \strokec4 \
\cf2 \cb3 \strokec2 import\cf0 \strokec4  \{ initializeApp \} \cf2 \strokec2 from\cf0 \strokec4  \cf6 \strokec6 'firebase/app'\cf0 \strokec4 ;\cb1 \strokec4 \
\cf2 \cb3 \strokec2 import\cf0 \strokec4  \{ getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged \} \cf2 \strokec2 from\cf0 \strokec4  \cf6 \strokec6 'firebase/auth'\cf0 \strokec4 ;\cb1 \strokec4 \
\cf2 \cb3 \strokec2 import\cf0 \strokec4  \{ getFirestore, doc, setDoc, getDoc, collection, query, onSnapshot, serverTimestamp \} \cf2 \strokec2 from\cf0 \strokec4  \cf6 \strokec6 'firebase/firestore'\cf0 \strokec4 ;\cb1 \strokec4 \
\cf2 \cb3 \strokec2 import\cf0 \strokec4  \{ \cf5 \strokec5 BarChart\cf0 \strokec4 , \cf5 \strokec5 Bar\cf0 \strokec4 , \cf5 \strokec5 XAxis\cf0 \strokec4 , \cf5 \strokec5 YAxis\cf0 \strokec4 , \cf5 \strokec5 CartesianGrid\cf0 \strokec4 , \cf5 \strokec5 Tooltip\cf0 \strokec4 , \cf5 \strokec5 Legend\cf0 \strokec4 , \cf5 \strokec5 ResponsiveContainer\cf0 \strokec4  \} \cf2 \strokec2 from\cf0 \strokec4  \cf6 \strokec6 'recharts'\cf0 \strokec4 ;\cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf7 \cb3 \strokec7 // --- Firebase Context and Provider ---\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 const\cf0 \strokec4  \cf5 \strokec5 FirebaseContext\cf0 \strokec4  = createContext(\cf2 \strokec2 null\cf0 \strokec4 );\cb1 \strokec4 \
\
\cf2 \cb3 \strokec2 export\cf0 \strokec4  \cf2 \strokec2 const\cf0 \strokec4  \cf5 \strokec5 FirebaseProvider\cf0 \strokec4  = (\{ children \}) => \{\cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  [app, setApp] = useState(\cf2 \strokec2 null\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  [db, setDb] = useState(\cf2 \strokec2 null\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  [auth, setAuth] = useState(\cf2 \strokec2 null\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  [userId, setUserId] = useState(\cf2 \strokec2 null\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  [isAuthReady, setIsAuthReady] = useState(\cf2 \strokec2 false\cf0 \strokec4 );\cb1 \strokec4 \
\
\cb3 \strokec4   useEffect(() => \{\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 try\cf0 \strokec4  \{\cb1 \strokec4 \
\cb3 \strokec4       \cf7 \strokec7 // Access global variables provided by the Canvas environment\cf0 \cb1 \strokec4 \
\cb3 \strokec4       \cf2 \strokec2 const\cf0 \strokec4  firebaseConfig = \cf2 \strokec2 typeof\cf0 \strokec4  __firebase_config !== \cf6 \strokec6 'undefined'\cf0 \strokec4  ? \cf5 \strokec5 JSON\cf0 \strokec4 .parse(__firebase_config) : \{\};\cb1 \strokec4 \
\cb3 \strokec4       \cf2 \strokec2 const\cf0 \strokec4  initialAuthToken = \cf2 \strokec2 typeof\cf0 \strokec4  __initial_auth_token !== \cf6 \strokec6 'undefined'\cf0 \strokec4  ? __initial_auth_token : \cf2 \strokec2 null\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4       \cf2 \strokec2 const\cf0 \strokec4  appId = \cf2 \strokec2 typeof\cf0 \strokec4  __app_id !== \cf6 \strokec6 'undefined'\cf0 \strokec4  ? __app_id : \cf6 \strokec6 'default-app-id'\cf0 \strokec4 ; \cf7 \strokec7 // Use default if not provided\cf0 \cb1 \strokec4 \
\
\cb3 \strokec4       \cf2 \strokec2 const\cf0 \strokec4  initializedApp = initializeApp(firebaseConfig);\cb1 \strokec4 \
\cb3 \strokec4       \cf2 \strokec2 const\cf0 \strokec4  firestoreDb = getFirestore(initializedApp);\cb1 \strokec4 \
\cb3 \strokec4       \cf2 \strokec2 const\cf0 \strokec4  firebaseAuth = getAuth(initializedApp);\cb1 \strokec4 \
\
\cb3 \strokec4       setApp(initializedApp);\cb1 \strokec4 \
\cb3 \strokec4       setDb(firestoreDb);\cb1 \strokec4 \
\cb3 \strokec4       setAuth(firebaseAuth);\cb1 \strokec4 \
\
\cb3 \strokec4       \cf2 \strokec2 const\cf0 \strokec4  unsubscribe = onAuthStateChanged(firebaseAuth, \cf2 \strokec2 async\cf0 \strokec4  (user) => \{\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 if\cf0 \strokec4  (user) \{\cb1 \strokec4 \
\cb3 \strokec4           setUserId(user.uid);\cb1 \strokec4 \
\cb3 \strokec4         \} \cf2 \strokec2 else\cf0 \strokec4  \{\cb1 \strokec4 \
\cb3 \strokec4           \cf7 \strokec7 // If no user, try to sign in with custom token or anonymously\cf0 \cb1 \strokec4 \
\cb3 \strokec4           \cf2 \strokec2 if\cf0 \strokec4  (initialAuthToken) \{\cb1 \strokec4 \
\cb3 \strokec4             \cf2 \strokec2 try\cf0 \strokec4  \{\cb1 \strokec4 \
\cb3 \strokec4               \cf2 \strokec2 await\cf0 \strokec4  signInWithCustomToken(firebaseAuth, initialAuthToken);\cb1 \strokec4 \
\cb3 \strokec4               setUserId(firebaseAuth.currentUser.uid); \cf7 \strokec7 // Set UID after successful sign-in\cf0 \cb1 \strokec4 \
\cb3 \strokec4             \} \cf2 \strokec2 catch\cf0 \strokec4  (error) \{\cb1 \strokec4 \
\cb3 \strokec4               console.error(\cf6 \strokec6 "Error signing in with custom token:"\cf0 \strokec4 , error);\cb1 \strokec4 \
\cb3 \strokec4               \cf7 \strokec7 // Fallback to anonymous if custom token fails\cf0 \cb1 \strokec4 \
\cb3 \strokec4               \cf2 \strokec2 const\cf0 \strokec4  anonymousUser = \cf2 \strokec2 await\cf0 \strokec4  signInAnonymously(firebaseAuth);\cb1 \strokec4 \
\cb3 \strokec4               setUserId(anonymousUser.user.uid);\cb1 \strokec4 \
\cb3 \strokec4             \}\cb1 \strokec4 \
\cb3 \strokec4           \} \cf2 \strokec2 else\cf0 \strokec4  \{\cb1 \strokec4 \
\cb3 \strokec4             \cf2 \strokec2 const\cf0 \strokec4  anonymousUser = \cf2 \strokec2 await\cf0 \strokec4  signInAnonymously(firebaseAuth);\cb1 \strokec4 \
\cb3 \strokec4             setUserId(anonymousUser.user.uid);\cb1 \strokec4 \
\cb3 \strokec4           \}\cb1 \strokec4 \
\cb3 \strokec4         \}\cb1 \strokec4 \
\cb3 \strokec4         setIsAuthReady(\cf2 \strokec2 true\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4       \});\cb1 \strokec4 \
\
\cb3 \strokec4       \cf2 \strokec2 return\cf0 \strokec4  () => unsubscribe(); \cf7 \strokec7 // Cleanup subscription\cf0 \cb1 \strokec4 \
\cb3 \strokec4     \} \cf2 \strokec2 catch\cf0 \strokec4  (error) \{\cb1 \strokec4 \
\cb3 \strokec4       console.error(\cf6 \strokec6 "Firebase initialization error:"\cf0 \strokec4 , error);\cb1 \strokec4 \
\cb3 \strokec4     \}\cb1 \strokec4 \
\cb3 \strokec4   \}, []);\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 return\cf0 \strokec4  (\cb1 \strokec4 \
\cb3 \strokec4     <\cf5 \strokec5 FirebaseContext\cf0 \strokec4 .\cf5 \strokec5 Provider\cf0 \strokec4  value=\{\{ app, db, auth, userId, isAuthReady \}\}>\cb1 \strokec4 \
\cb3 \strokec4       \{children\}\cb1 \strokec4 \
\cb3 \strokec4     </\cf5 \strokec5 FirebaseContext\cf0 \strokec4 .\cf5 \strokec5 Provider\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4   );\cb1 \strokec4 \
\cb3 \strokec4 \};\cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 export\cf0 \strokec4  \cf2 \strokec2 const\cf0 \strokec4  useFirebase = () => useContext(\cf5 \strokec5 FirebaseContext\cf0 \strokec4 );\cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf7 \cb3 \strokec7 // --- Modal Component ---\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 const\cf0 \strokec4  \cf5 \strokec5 Modal\cf0 \strokec4  = (\{ show, title, message, onClose, onConfirm, showConfirmButton = \cf2 \strokec2 false\cf0 \strokec4  \}) => \{\cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4   \cf2 \strokec2 if\cf0 \strokec4  (!show) \cf2 \strokec2 return\cf0 \strokec4  \cf2 \strokec2 null\cf0 \strokec4 ;\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 return\cf0 \strokec4  (\cb1 \strokec4 \
\cb3 \strokec4     <div className=\cf6 \strokec6 "fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4       <div className=\cf6 \strokec6 "bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-auto"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4         <h3 className=\cf6 \strokec6 "text-xl font-semibold text-gray-900 mb-4"\cf0 \strokec4 >\{title\}</h3>\cb1 \strokec4 \
\cb3 \strokec4         <p className=\cf6 \strokec6 "text-gray-700 mb-6"\cf0 \strokec4 >\{message\}</p>\cb1 \strokec4 \
\cb3 \strokec4         <div className=\cf6 \strokec6 "flex justify-end space-x-3"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4           <button\cb1 \strokec4 \
\cb3 \strokec4             onClick=\{onClose\}\cb1 \strokec4 \
\cb3 \strokec4             className=\cf6 \strokec6 "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"\cf0 \cb1 \strokec4 \
\cb3 \strokec4           >\cb1 \strokec4 \
\cb3 \strokec4             \{showConfirmButton ? \cf6 \strokec6 'Cancel'\cf0 \strokec4  : \cf6 \strokec6 'Close'\cf0 \strokec4 \}\cb1 \strokec4 \
\cb3 \strokec4           </button>\cb1 \strokec4 \
\cb3 \strokec4           \{showConfirmButton && (\cb1 \strokec4 \
\cb3 \strokec4             <button\cb1 \strokec4 \
\cb3 \strokec4               onClick=\{onConfirm\}\cb1 \strokec4 \
\cb3 \strokec4               className=\cf6 \strokec6 "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"\cf0 \cb1 \strokec4 \
\cb3 \strokec4             >\cb1 \strokec4 \
\cb3 \strokec4               \cf5 \strokec5 Confirm\cf0 \cb1 \strokec4 \
\cb3 \strokec4             </button>\cb1 \strokec4 \
\cb3 \strokec4           )\}\cb1 \strokec4 \
\cb3 \strokec4         </div>\cb1 \strokec4 \
\cb3 \strokec4       </div>\cb1 \strokec4 \
\cb3 \strokec4     </div>\cb1 \strokec4 \
\cb3 \strokec4   );\cb1 \strokec4 \
\cb3 \strokec4 \};\cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf7 \cb3 \strokec7 // --- Carbon Footprint Calculation Logic ---\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 const\cf0 \strokec4  calculateCarbonFootprint = (formData) => \{\cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4   \cf2 \strokec2 let\cf0 \strokec4  totalCO2e = \cf8 \strokec8 0\cf0 \strokec4 ; \cf7 \strokec7 // in kg CO2e\cf0 \cb1 \strokec4 \
\
\cb3 \strokec4   \cf7 \strokec7 // Emission factors (simplified, global averages for demonstration)\cf0 \cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  emissionFactors = \{\cb1 \strokec4 \
\cb3 \strokec4     electricity_kwh_per_year: \cf8 \strokec8 0.233\cf0 \strokec4 , \cf7 \strokec7 // kg CO2e per kWh (approx global average)\cf0 \cb1 \strokec4 \
\cb3 \strokec4     natural_gas_therms_per_year: \cf8 \strokec8 5.3\cf0 \strokec4 , \cf7 \strokec7 // kg CO2e per therm\cf0 \cb1 \strokec4 \
\cb3 \strokec4     car_km_per_year_gasoline: \cf8 \strokec8 0.18\cf0 \strokec4 , \cf7 \strokec7 // kg CO2e per km (average gasoline car)\cf0 \cb1 \strokec4 \
\cb3 \strokec4     flight_km_per_year: \cf8 \strokec8 0.18\cf0 \strokec4 , \cf7 \strokec7 // kg CO2e per km (economy short-haul, simplified)\cf0 \cb1 \strokec4 \
\cb3 \strokec4     diet_meat_heavy: \cf8 \strokec8 2.5\cf0 \strokec4  * \cf8 \strokec8 365\cf0 \strokec4 , \cf7 \strokec7 // kg CO2e per year\cf0 \cb1 \strokec4 \
\cb3 \strokec4     diet_average: \cf8 \strokec8 1.8\cf0 \strokec4  * \cf8 \strokec8 365\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4     diet_vegetarian: \cf8 \strokec8 1.0\cf0 \strokec4  * \cf8 \strokec8 365\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4     diet_vegan: \cf8 \strokec8 0.7\cf0 \strokec4  * \cf8 \strokec8 365\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4     consumption_low: \cf8 \strokec8 1000\cf0 \strokec4 , \cf7 \strokec7 // kg CO2e per year\cf0 \cb1 \strokec4 \
\cb3 \strokec4     consumption_medium: \cf8 \strokec8 2000\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4     consumption_high: \cf8 \strokec8 3000\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4   \};\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  categoryBreakdown = \{\cb1 \strokec4 \
\cb3 \strokec4     home: \cf8 \strokec8 0\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4     transport: \cf8 \strokec8 0\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4     food: \cf8 \strokec8 0\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4     consumption: \cf8 \strokec8 0\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4     total: \cf8 \strokec8 0\cf0 \cb1 \strokec4 \
\cb3 \strokec4   \};\cb1 \strokec4 \
\
\cb3 \strokec4   \cf7 \strokec7 // 1. Home Energy\cf0 \cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 if\cf0 \strokec4  (formData.electricityUsage) \{\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  electricityCO2e = parseFloat(formData.electricityUsage) * \cf8 \strokec8 12\cf0 \strokec4  * emissionFactors.electricity_kwh_per_year;\cb1 \strokec4 \
\cb3 \strokec4     totalCO2e += electricityCO2e;\cb1 \strokec4 \
\cb3 \strokec4     categoryBreakdown.home += electricityCO2e;\cb1 \strokec4 \
\cb3 \strokec4   \}\cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 if\cf0 \strokec4  (formData.heatingFuel === \cf6 \strokec6 'naturalGas'\cf0 \strokec4  && formData.naturalGasUsage) \{\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  naturalGasCO2e = parseFloat(formData.naturalGasUsage) * \cf8 \strokec8 12\cf0 \strokec4  * emissionFactors.natural_gas_therms_per_year;\cb1 \strokec4 \
\cb3 \strokec4     totalCO2e += naturalGasCO2e;\cb1 \strokec4 \
\cb3 \strokec4     categoryBreakdown.home += naturalGasCO2e;\cb1 \strokec4 \
\cb3 \strokec4   \}\cb1 \strokec4 \
\cb3 \strokec4   \cf7 \strokec7 // Add more heating types if needed (e.g., electricity for heating, oil)\cf0 \cb1 \strokec4 \
\
\cb3 \strokec4   \cf7 \strokec7 // 2. Transportation\cf0 \cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 if\cf0 \strokec4  (formData.carMileage) \{\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  carCO2e = parseFloat(formData.carMileage) * emissionFactors.car_km_per_year_gasoline;\cb1 \strokec4 \
\cb3 \strokec4     totalCO2e += carCO2e;\cb1 \strokec4 \
\cb3 \strokec4     categoryBreakdown.transport += carCO2e;\cb1 \strokec4 \
\cb3 \strokec4   \}\cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 if\cf0 \strokec4  (formData.publicTransportUsage === \cf6 \strokec6 'frequent'\cf0 \strokec4 ) \{\cb1 \strokec4 \
\cb3 \strokec4     \cf7 \strokec7 // Arbitrary reduction for public transport use\cf0 \cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  publicTransportReduction = \cf8 \strokec8 500\cf0 \strokec4 ; \cf7 \strokec7 // kg CO2e\cf0 \cb1 \strokec4 \
\cb3 \strokec4     totalCO2e = \cf5 \strokec5 Math\cf0 \strokec4 .max(\cf8 \strokec8 0\cf0 \strokec4 , totalCO2e - publicTransportReduction); \cf7 \strokec7 // Ensure it doesn't go negative\cf0 \cb1 \strokec4 \
\cb3 \strokec4     categoryBreakdown.transport = \cf5 \strokec5 Math\cf0 \strokec4 .max(\cf8 \strokec8 0\cf0 \strokec4 , categoryBreakdown.transport - publicTransportReduction);\cb1 \strokec4 \
\cb3 \strokec4   \}\cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 if\cf0 \strokec4  (formData.flightHours) \{\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  flightCO2e = parseFloat(formData.flightHours) * \cf8 \strokec8 800\cf0 \strokec4  * emissionFactors.flight_km_per_year; \cf7 \strokec7 // Assuming avg 800km/hr flight\cf0 \cb1 \strokec4 \
\cb3 \strokec4     totalCO2e += flightCO2e;\cb1 \strokec4 \
\cb3 \strokec4     categoryBreakdown.transport += flightCO2e;\cb1 \strokec4 \
\cb3 \strokec4   \}\cb1 \strokec4 \
\
\cb3 \strokec4   \cf7 \strokec7 // 3. Food & Diet\cf0 \cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 if\cf0 \strokec4  (formData.dietType) \{\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 let\cf0 \strokec4  dietCO2e = \cf8 \strokec8 0\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 switch\cf0 \strokec4  (formData.dietType) \{\cb1 \strokec4 \
\cb3 \strokec4       \cf2 \strokec2 case\cf0 \strokec4  \cf6 \strokec6 'meatHeavy'\cf0 \strokec4 : dietCO2e = emissionFactors.diet_meat_heavy; \cf2 \strokec2 break\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4       \cf2 \strokec2 case\cf0 \strokec4  \cf6 \strokec6 'average'\cf0 \strokec4 : dietCO2e = emissionFactors.diet_average; \cf2 \strokec2 break\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4       \cf2 \strokec2 case\cf0 \strokec4  \cf6 \strokec6 'vegetarian'\cf0 \strokec4 : dietCO2e = emissionFactors.diet_vegetarian; \cf2 \strokec2 break\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4       \cf2 \strokec2 case\cf0 \strokec4  \cf6 \strokec6 'vegan'\cf0 \strokec4 : dietCO2e = emissionFactors.diet_vegan; \cf2 \strokec2 break\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4       \cf2 \strokec2 default\cf0 \strokec4 : \cf2 \strokec2 break\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4     \}\cb1 \strokec4 \
\cb3 \strokec4     totalCO2e += dietCO2e;\cb1 \strokec4 \
\cb3 \strokec4     categoryBreakdown.food += dietCO2e;\cb1 \strokec4 \
\cb3 \strokec4   \}\cb1 \strokec4 \
\
\cb3 \strokec4   \cf7 \strokec7 // 4. General Consumption\cf0 \cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 if\cf0 \strokec4  (formData.consumptionLevel) \{\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 let\cf0 \strokec4  consumptionCO2e = \cf8 \strokec8 0\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 switch\cf0 \strokec4  (formData.consumptionLevel) \{\cb1 \strokec4 \
\cb3 \strokec4       \cf2 \strokec2 case\cf0 \strokec4  \cf6 \strokec6 'low'\cf0 \strokec4 : consumptionCO2e = emissionFactors.consumption_low; \cf2 \strokec2 break\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4       \cf2 \strokec2 case\cf0 \strokec4  \cf6 \strokec6 'medium'\cf0 \strokec4 : consumptionCO2e = emissionFactors.consumption_medium; \cf2 \strokec2 break\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4       \cf2 \strokec2 case\cf0 \strokec4  \cf6 \strokec6 'high'\cf0 \strokec4 : consumptionCO2e = emissionFactors.consumption_high; \cf2 \strokec2 break\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4       \cf2 \strokec2 default\cf0 \strokec4 : \cf2 \strokec2 break\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4     \}\cb1 \strokec4 \
\cb3 \strokec4     totalCO2e += consumptionCO2e;\cb1 \strokec4 \
\cb3 \strokec4     categoryBreakdown.consumption += consumptionCO2e;\cb1 \strokec4 \
\cb3 \strokec4   \}\cb1 \strokec4 \
\
\cb3 \strokec4   categoryBreakdown.total = totalCO2e;\cb1 \strokec4 \
\
\cb3 \strokec4   \cf7 \strokec7 // Convert to tonnes\cf0 \cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  totalTonnes = totalCO2e / \cf8 \strokec8 1000\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4   categoryBreakdown.home /= \cf8 \strokec8 1000\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4   categoryBreakdown.transport /= \cf8 \strokec8 1000\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4   categoryBreakdown.food /= \cf8 \strokec8 1000\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4   categoryBreakdown.consumption /= \cf8 \strokec8 1000\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4   categoryBreakdown.total = totalTonnes;\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 return\cf0 \strokec4  \{ totalTonnes, categoryBreakdown \};\cb1 \strokec4 \
\cb3 \strokec4 \};\cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf7 \cb3 \strokec7 // --- Welcome Screen ---\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 const\cf0 \strokec4  \cf5 \strokec5 WelcomeScreen\cf0 \strokec4  = (\{ onStart \}) => (\cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4   <div className=\cf6 \strokec6 "flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg text-center"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4     <h2 className=\cf6 \strokec6 "text-3xl font-bold text-gray-800 mb-4"\cf0 \strokec4 >\cf5 \strokec5 Welcome\cf0 \strokec4  to \cf5 \strokec5 Your\cf0 \strokec4  \cf5 \strokec5 Personal\cf0 \strokec4  \cf5 \strokec5 Carbon\cf0 \strokec4  \cf5 \strokec5 Footprint\cf0 \strokec4  \cf5 \strokec5 Calculator\cf0 \strokec4 !</h2>\cb1 \strokec4 \
\cb3 \strokec4     <p className=\cf6 \strokec6 "text-lg text-gray-600 mb-6"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4       \cf5 \strokec5 Ever\cf0 \strokec4  wondered about your impact on the planet? \cf5 \strokec5 This\cf0 \strokec4  tool helps you understand your carbon footprint across key areas \cf2 \strokec2 of\cf0 \strokec4  your life.\cb1 \strokec4 \
\cb3 \strokec4     </p>\cb1 \strokec4 \
\cb3 \strokec4     <p className=\cf6 \strokec6 "text-md text-gray-500 mb-8"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4       \cf5 \strokec5 We\cf6 \strokec6 'll guide you through a few simple questions about your home, travel, diet, and consumption habits. Unlike other tools, we aim to give you a clear picture and actionable insights without overwhelming you.\cf0 \cb1 \strokec4 \
\cb3 \strokec4     </p>\cb1 \strokec4 \
\cb3 \strokec4     <button\cb1 \strokec4 \
\cb3 \strokec4       onClick=\{onStart\}\cb1 \strokec4 \
\cb3 \strokec4       className=\cf6 \strokec6 "px-8 py-4 bg-green-600 text-white font-semibold text-xl rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"\cf0 \cb1 \strokec4 \
\cb3 \strokec4     >\cb1 \strokec4 \
\cb3 \strokec4       \cf5 \strokec5 Get\cf0 \strokec4  \cf5 \strokec5 Started\cf0 \cb1 \strokec4 \
\cb3 \strokec4     </button>\cb1 \strokec4 \
\cb3 \strokec4   </div>\cb1 \strokec4 \
\cb3 \strokec4 );\cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf7 \cb3 \strokec7 // --- Questionnaire Sections ---\cf0 \cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 const\cf0 \strokec4  \cf5 \strokec5 HomeEnergyForm\cf0 \strokec4  = (\{ formData, handleChange \}) => (\cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4   <div className=\cf6 \strokec6 "space-y-6"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4     <h3 className=\cf6 \strokec6 "text-2xl font-semibold text-gray-800"\cf0 \strokec4 >\cf8 \strokec8 1\cf0 \strokec4 . \cf5 \strokec5 Home\cf0 \strokec4  \cf5 \strokec5 Energy\cf0 \strokec4 </h3>\cb1 \strokec4 \
\cb3 \strokec4     <p className=\cf6 \strokec6 "text-gray-600"\cf0 \strokec4 >\cf5 \strokec5 Let\cf6 \strokec6 's start with your home'\cf0 \strokec4 s energy consumption.</p>\cb1 \strokec4 \
\
\cb3 \strokec4     <div>\cb1 \strokec4 \
\cb3 \strokec4       <label htmlFor=\cf6 \strokec6 "electricityUsage"\cf0 \strokec4  className=\cf6 \strokec6 "block text-gray-700 text-lg font-medium mb-2"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4         \cf5 \strokec5 Average\cf0 \strokec4  monthly electricity usage (\cf2 \strokec2 in\cf0 \strokec4  kWh):\cb1 \strokec4 \
\cb3 \strokec4       </label>\cb1 \strokec4 \
\cb3 \strokec4       <input\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 type\cf0 \strokec4 =\cf6 \strokec6 "number"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         id=\cf6 \strokec6 "electricityUsage"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         name=\cf6 \strokec6 "electricityUsage"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         value=\{formData.electricityUsage || \cf6 \strokec6 ''\cf0 \strokec4 \}\cb1 \strokec4 \
\cb3 \strokec4         onChange=\{handleChange\}\cb1 \strokec4 \
\cb3 \strokec4         placeholder=\cf6 \strokec6 "e.g., 300"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         className=\cf6 \strokec6 "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         min=\cf6 \strokec6 "0"\cf0 \cb1 \strokec4 \
\cb3 \strokec4       />\cb1 \strokec4 \
\cb3 \strokec4       <p className=\cf6 \strokec6 "text-sm text-gray-500 mt-1"\cf0 \strokec4 >\cf5 \strokec5 Check\cf0 \strokec4  your electricity bill \cf2 \strokec2 for\cf0 \strokec4  \cf2 \strokec2 this\cf0 \strokec4  information.</p>\cb1 \strokec4 \
\cb3 \strokec4     </div>\cb1 \strokec4 \
\
\cb3 \strokec4     <div>\cb1 \strokec4 \
\cb3 \strokec4       <label htmlFor=\cf6 \strokec6 "heatingFuel"\cf0 \strokec4  className=\cf6 \strokec6 "block text-gray-700 text-lg font-medium mb-2"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4         \cf5 \strokec5 What\cf0 \strokec4  \cf2 \strokec2 is\cf0 \strokec4  your primary heating fuel?\cb1 \strokec4 \
\cb3 \strokec4       </label>\cb1 \strokec4 \
\cb3 \strokec4       <select\cb1 \strokec4 \
\cb3 \strokec4         id=\cf6 \strokec6 "heatingFuel"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         name=\cf6 \strokec6 "heatingFuel"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         value=\{formData.heatingFuel || \cf6 \strokec6 ''\cf0 \strokec4 \}\cb1 \strokec4 \
\cb3 \strokec4         onChange=\{handleChange\}\cb1 \strokec4 \
\cb3 \strokec4         className=\cf6 \strokec6 "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"\cf0 \cb1 \strokec4 \
\cb3 \strokec4       >\cb1 \strokec4 \
\cb3 \strokec4         <option value=\cf6 \strokec6 ""\cf0 \strokec4 >\cf5 \strokec5 Select\cf0 \strokec4  an option</option>\cb1 \strokec4 \
\cb3 \strokec4         <option value=\cf6 \strokec6 "naturalGas"\cf0 \strokec4 >\cf5 \strokec5 Natural\cf0 \strokec4  \cf5 \strokec5 Gas\cf0 \strokec4 </option>\cb1 \strokec4 \
\cb3 \strokec4         <option value=\cf6 \strokec6 "electricity"\cf0 \strokec4 >\cf5 \strokec5 Electricity\cf0 \strokec4 </option>\cb1 \strokec4 \
\cb3 \strokec4         <option value=\cf6 \strokec6 "oil"\cf0 \strokec4 >\cf5 \strokec5 Heating\cf0 \strokec4  \cf5 \strokec5 Oil\cf0 \strokec4 </option>\cb1 \strokec4 \
\cb3 \strokec4         <option value=\cf6 \strokec6 "none"\cf0 \strokec4 >\cf5 \strokec5 No\cf0 \strokec4  dedicated heating</option>\cb1 \strokec4 \
\cb3 \strokec4       </select>\cb1 \strokec4 \
\cb3 \strokec4     </div>\cb1 \strokec4 \
\
\cb3 \strokec4     \{formData.heatingFuel === \cf6 \strokec6 'naturalGas'\cf0 \strokec4  && (\cb1 \strokec4 \
\cb3 \strokec4       <div>\cb1 \strokec4 \
\cb3 \strokec4         <label htmlFor=\cf6 \strokec6 "naturalGasUsage"\cf0 \strokec4  className=\cf6 \strokec6 "block text-gray-700 text-lg font-medium mb-2"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4           \cf5 \strokec5 Average\cf0 \strokec4  monthly natural gas usage (\cf2 \strokec2 in\cf0 \strokec4  therms or m\cf9 \strokec9 \'b3\cf0 \strokec4 ):\cb1 \strokec4 \
\cb3 \strokec4         </label>\cb1 \strokec4 \
\cb3 \strokec4         <input\cb1 \strokec4 \
\cb3 \strokec4           \cf2 \strokec2 type\cf0 \strokec4 =\cf6 \strokec6 "number"\cf0 \cb1 \strokec4 \
\cb3 \strokec4           id=\cf6 \strokec6 "naturalGasUsage"\cf0 \cb1 \strokec4 \
\cb3 \strokec4           name=\cf6 \strokec6 "naturalGasUsage"\cf0 \cb1 \strokec4 \
\cb3 \strokec4           value=\{formData.naturalGasUsage || \cf6 \strokec6 ''\cf0 \strokec4 \}\cb1 \strokec4 \
\cb3 \strokec4           onChange=\{handleChange\}\cb1 \strokec4 \
\cb3 \strokec4           placeholder=\cf6 \strokec6 "e.g., 50 therms or 150 m\'b3"\cf0 \cb1 \strokec4 \
\cb3 \strokec4           className=\cf6 \strokec6 "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"\cf0 \cb1 \strokec4 \
\cb3 \strokec4           min=\cf6 \strokec6 "0"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         />\cb1 \strokec4 \
\cb3 \strokec4         <p className=\cf6 \strokec6 "text-sm text-gray-500 mt-1"\cf0 \strokec4 >\cf5 \strokec5 Refer\cf0 \strokec4  to your gas bill.</p>\cb1 \strokec4 \
\cb3 \strokec4       </div>\cb1 \strokec4 \
\cb3 \strokec4     )\}\cb1 \strokec4 \
\cb3 \strokec4   </div>\cb1 \strokec4 \
\cb3 \strokec4 );\cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 const\cf0 \strokec4  \cf5 \strokec5 TransportationForm\cf0 \strokec4  = (\{ formData, handleChange \}) => (\cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4   <div className=\cf6 \strokec6 "space-y-6"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4     <h3 className=\cf6 \strokec6 "text-2xl font-semibold text-gray-800"\cf0 \strokec4 >\cf8 \strokec8 2\cf0 \strokec4 . \cf5 \strokec5 Transportation\cf0 \strokec4 </h3>\cb1 \strokec4 \
\cb3 \strokec4     <p className=\cf6 \strokec6 "text-gray-600"\cf0 \strokec4 >\cf5 \strokec5 How\cf0 \strokec4  \cf2 \strokec2 do\cf0 \strokec4  you \cf2 \strokec2 get\cf0 \strokec4  around?</p>\cb1 \strokec4 \
\
\cb3 \strokec4     <div>\cb1 \strokec4 \
\cb3 \strokec4       <label htmlFor=\cf6 \strokec6 "carMileage"\cf0 \strokec4  className=\cf6 \strokec6 "block text-gray-700 text-lg font-medium mb-2"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4         \cf5 \strokec5 Average\cf0 \strokec4  annual car mileage (\cf2 \strokec2 in\cf0 \strokec4  km), \cf2 \strokec2 if\cf0 \strokec4  applicable:\cb1 \strokec4 \
\cb3 \strokec4       </label>\cb1 \strokec4 \
\cb3 \strokec4       <input\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 type\cf0 \strokec4 =\cf6 \strokec6 "number"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         id=\cf6 \strokec6 "carMileage"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         name=\cf6 \strokec6 "carMileage"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         value=\{formData.carMileage || \cf6 \strokec6 ''\cf0 \strokec4 \}\cb1 \strokec4 \
\cb3 \strokec4         onChange=\{handleChange\}\cb1 \strokec4 \
\cb3 \strokec4         placeholder=\cf6 \strokec6 "e.g., 12000"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         className=\cf6 \strokec6 "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         min=\cf6 \strokec6 "0"\cf0 \cb1 \strokec4 \
\cb3 \strokec4       />\cb1 \strokec4 \
\cb3 \strokec4       <p className=\cf6 \strokec6 "text-sm text-gray-500 mt-1"\cf0 \strokec4 >\cf5 \strokec5 Estimate\cf0 \strokec4  your yearly driving distance.</p>\cb1 \strokec4 \
\cb3 \strokec4     </div>\cb1 \strokec4 \
\
\cb3 \strokec4     <div>\cb1 \strokec4 \
\cb3 \strokec4       <label htmlFor=\cf6 \strokec6 "publicTransportUsage"\cf0 \strokec4  className=\cf6 \strokec6 "block text-gray-700 text-lg font-medium mb-2"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4         \cf5 \strokec5 How\cf0 \strokec4  often \cf2 \strokec2 do\cf0 \strokec4  you use \cf2 \strokec2 public\cf0 \strokec4  transport (bus, train, subway)?\cb1 \strokec4 \
\cb3 \strokec4       </label>\cb1 \strokec4 \
\cb3 \strokec4       <select\cb1 \strokec4 \
\cb3 \strokec4         id=\cf6 \strokec6 "publicTransportUsage"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         name=\cf6 \strokec6 "publicTransportUsage"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         value=\{formData.publicTransportUsage || \cf6 \strokec6 ''\cf0 \strokec4 \}\cb1 \strokec4 \
\cb3 \strokec4         onChange=\{handleChange\}\cb1 \strokec4 \
\cb3 \strokec4         className=\cf6 \strokec6 "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"\cf0 \cb1 \strokec4 \
\cb3 \strokec4       >\cb1 \strokec4 \
\cb3 \strokec4         <option value=\cf6 \strokec6 ""\cf0 \strokec4 >\cf5 \strokec5 Select\cf0 \strokec4  an option</option>\cb1 \strokec4 \
\cb3 \strokec4         <option value=\cf6 \strokec6 "never"\cf0 \strokec4 >\cf5 \strokec5 Never\cf0 \strokec4 /\cf5 \strokec5 Rarely\cf0 \strokec4 </option>\cb1 \strokec4 \
\cb3 \strokec4         <option value=\cf6 \strokec6 "sometimes"\cf0 \strokec4 >\cf5 \strokec5 Sometimes\cf0 \strokec4 </option>\cb1 \strokec4 \
\cb3 \strokec4         <option value=\cf6 \strokec6 "frequent"\cf0 \strokec4 >\cf5 \strokec5 Frequently\cf0 \strokec4  (daily/most days)</option>\cb1 \strokec4 \
\cb3 \strokec4       </select>\cb1 \strokec4 \
\cb3 \strokec4     </div>\cb1 \strokec4 \
\
\cb3 \strokec4     <div>\cb1 \strokec4 \
\cb3 \strokec4       <label htmlFor=\cf6 \strokec6 "flightHours"\cf0 \strokec4  className=\cf6 \strokec6 "block text-gray-700 text-lg font-medium mb-2"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4         \cf5 \strokec5 Average\cf0 \strokec4  annual flight hours (estimate round trip):\cb1 \strokec4 \
\cb3 \strokec4       </label>\cb1 \strokec4 \
\cb3 \strokec4       <input\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 type\cf0 \strokec4 =\cf6 \strokec6 "number"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         id=\cf6 \strokec6 "flightHours"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         name=\cf6 \strokec6 "flightHours"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         value=\{formData.flightHours || \cf6 \strokec6 ''\cf0 \strokec4 \}\cb1 \strokec4 \
\cb3 \strokec4         onChange=\{handleChange\}\cb1 \strokec4 \
\cb3 \strokec4         placeholder=\cf6 \strokec6 "e.g., 10 (for a couple of short trips)"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         className=\cf6 \strokec6 "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         min=\cf6 \strokec6 "0"\cf0 \cb1 \strokec4 \
\cb3 \strokec4       />\cb1 \strokec4 \
\cb3 \strokec4       <p className=\cf6 \strokec6 "text-sm text-gray-500 mt-1"\cf0 \strokec4 >\cf5 \strokec5 Consider\cf0 \strokec4  all flights \cf2 \strokec2 in\cf0 \strokec4  a year.</p>\cb1 \strokec4 \
\cb3 \strokec4     </div>\cb1 \strokec4 \
\cb3 \strokec4   </div>\cb1 \strokec4 \
\cb3 \strokec4 );\cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 const\cf0 \strokec4  \cf5 \strokec5 FoodConsumptionForm\cf0 \strokec4  = (\{ formData, handleChange \}) => (\cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4   <div className=\cf6 \strokec6 "space-y-6"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4     <h3 className=\cf6 \strokec6 "text-2xl font-semibold text-gray-800"\cf0 \strokec4 >\cf8 \strokec8 3\cf0 \strokec4 . \cf5 \strokec5 Food\cf0 \strokec4  & \cf5 \strokec5 Diet\cf0 \strokec4 </h3>\cb1 \strokec4 \
\cb3 \strokec4     <p className=\cf6 \strokec6 "text-gray-600"\cf0 \strokec4 >\cf5 \strokec5 What\cf0 \strokec4  does your diet look like?</p>\cb1 \strokec4 \
\
\cb3 \strokec4     <div>\cb1 \strokec4 \
\cb3 \strokec4       <label htmlFor=\cf6 \strokec6 "dietType"\cf0 \strokec4  className=\cf6 \strokec6 "block text-gray-700 text-lg font-medium mb-2"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4         \cf5 \strokec5 Which\cf0 \strokec4  best describes your diet?\cb1 \strokec4 \
\cb3 \strokec4       </label>\cb1 \strokec4 \
\cb3 \strokec4       <select\cb1 \strokec4 \
\cb3 \strokec4         id=\cf6 \strokec6 "dietType"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         name=\cf6 \strokec6 "dietType"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         value=\{formData.dietType || \cf6 \strokec6 ''\cf0 \strokec4 \}\cb1 \strokec4 \
\cb3 \strokec4         onChange=\{handleChange\}\cb1 \strokec4 \
\cb3 \strokec4         className=\cf6 \strokec6 "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"\cf0 \cb1 \strokec4 \
\cb3 \strokec4       >\cb1 \strokec4 \
\cb3 \strokec4         <option value=\cf6 \strokec6 ""\cf0 \strokec4 >\cf5 \strokec5 Select\cf0 \strokec4  an option</option>\cb1 \strokec4 \
\cb3 \strokec4         <option value=\cf6 \strokec6 "meatHeavy"\cf0 \strokec4 >\cf5 \strokec5 Meat\cf0 \strokec4 -heavy (meat \cf2 \strokec2 with\cf0 \strokec4  most meals)</option>\cb1 \strokec4 \
\cb3 \strokec4         <option value=\cf6 \strokec6 "average"\cf0 \strokec4 >\cf5 \strokec5 Average\cf0 \strokec4  (meat a few times a week)</option>\cb1 \strokec4 \
\cb3 \strokec4         <option value=\cf6 \strokec6 "vegetarian"\cf0 \strokec4 >\cf5 \strokec5 Vegetarian\cf0 \strokec4 </option>\cb1 \strokec4 \
\cb3 \strokec4         <option value=\cf6 \strokec6 "vegan"\cf0 \strokec4 >\cf5 \strokec5 Vegan\cf0 \strokec4 </option>\cb1 \strokec4 \
\cb3 \strokec4       </select>\cb1 \strokec4 \
\cb3 \strokec4     </div>\cb1 \strokec4 \
\
\cb3 \strokec4     <div>\cb1 \strokec4 \
\cb3 \strokec4       <label htmlFor=\cf6 \strokec6 "consumptionLevel"\cf0 \strokec4  className=\cf6 \strokec6 "block text-gray-700 text-lg font-medium mb-2"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4         \cf5 \strokec5 How\cf0 \strokec4  would you describe your general consumption habits (shopping, \cf2 \strokec2 new\cf0 \strokec4  items)?\cb1 \strokec4 \
\cb3 \strokec4       </label>\cb1 \strokec4 \
\cb3 \strokec4       <select\cb1 \strokec4 \
\cb3 \strokec4         id=\cf6 \strokec6 "consumptionLevel"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         name=\cf6 \strokec6 "consumptionLevel"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         value=\{formData.consumptionLevel || \cf6 \strokec6 ''\cf0 \strokec4 \}\cb1 \strokec4 \
\cb3 \strokec4         onChange=\{handleChange\}\cb1 \strokec4 \
\cb3 \strokec4         className=\cf6 \strokec6 "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"\cf0 \cb1 \strokec4 \
\cb3 \strokec4       >\cb1 \strokec4 \
\cb3 \strokec4         <option value=\cf6 \strokec6 ""\cf0 \strokec4 >\cf5 \strokec5 Select\cf0 \strokec4  an option</option>\cb1 \strokec4 \
\cb3 \strokec4         <option value=\cf6 \strokec6 "low"\cf0 \strokec4 >\cf5 \strokec5 Low\cf0 \strokec4  (buy only essentials, repair often)</option>\cb1 \strokec4 \
\cb3 \strokec4         <option value=\cf6 \strokec6 "medium"\cf0 \strokec4 >\cf5 \strokec5 Medium\cf0 \strokec4  (buy \cf2 \strokec2 new\cf0 \strokec4  items regularly, balance \cf2 \strokec2 with\cf0 \strokec4  reuse)</option>\cb1 \strokec4 \
\cb3 \strokec4         <option value=\cf6 \strokec6 "high"\cf0 \strokec4 >\cf5 \strokec5 High\cf0 \strokec4  (frequent purchases, focus on \cf2 \strokec2 new\cf0 \strokec4  trends)</option>\cb1 \strokec4 \
\cb3 \strokec4       </select>\cb1 \strokec4 \
\cb3 \strokec4     </div>\cb1 \strokec4 \
\cb3 \strokec4   </div>\cb1 \strokec4 \
\cb3 \strokec4 );\cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf7 \cb3 \strokec7 // --- Questionnaire Component ---\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 const\cf0 \strokec4  \cf5 \strokec5 Questionnaire\cf0 \strokec4  = (\{ onComplete, initialFormData = \{\} \}) => \{\cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  [currentStep, setCurrentStep] = useState(\cf8 \strokec8 0\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  [formData, setFormData] = useState(initialFormData);\cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  steps = [\cf5 \strokec5 HomeEnergyForm\cf0 \strokec4 , \cf5 \strokec5 TransportationForm\cf0 \strokec4 , \cf5 \strokec5 FoodConsumptionForm\cf0 \strokec4 ];\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  handleChange = (e) => \{\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  \{ name, value \} = e.target;\cb1 \strokec4 \
\cb3 \strokec4     setFormData((prev) => (\{ ...prev, [name]: value \}));\cb1 \strokec4 \
\cb3 \strokec4   \};\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  handleNext = () => \{\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 if\cf0 \strokec4  (currentStep < steps.length - \cf8 \strokec8 1\cf0 \strokec4 ) \{\cb1 \strokec4 \
\cb3 \strokec4       setCurrentStep(currentStep + \cf8 \strokec8 1\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4     \} \cf2 \strokec2 else\cf0 \strokec4  \{\cb1 \strokec4 \
\cb3 \strokec4       onComplete(formData);\cb1 \strokec4 \
\cb3 \strokec4     \}\cb1 \strokec4 \
\cb3 \strokec4   \};\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  handleBack = () => \{\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 if\cf0 \strokec4  (currentStep > \cf8 \strokec8 0\cf0 \strokec4 ) \{\cb1 \strokec4 \
\cb3 \strokec4       setCurrentStep(currentStep - \cf8 \strokec8 1\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4     \}\cb1 \strokec4 \
\cb3 \strokec4   \};\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  \cf5 \strokec5 CurrentForm\cf0 \strokec4  = steps[currentStep];\cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  progress = ((currentStep + \cf8 \strokec8 1\cf0 \strokec4 ) / steps.length) * \cf8 \strokec8 100\cf0 \strokec4 ;\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 return\cf0 \strokec4  (\cb1 \strokec4 \
\cb3 \strokec4     <div className=\cf6 \strokec6 "bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto w-full"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4       <div className=\cf6 \strokec6 "mb-8"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4         <h2 className=\cf6 \strokec6 "text-3xl font-bold text-gray-800 mb-4 text-center"\cf0 \strokec4 >\cf5 \strokec5 Your\cf0 \strokec4  \cf5 \strokec5 Carbon\cf0 \strokec4  \cf5 \strokec5 Footprint\cf0 \strokec4  \cf5 \strokec5 Journey\cf0 \strokec4 </h2>\cb1 \strokec4 \
\cb3 \strokec4         <div className=\cf6 \strokec6 "w-full bg-gray-200 rounded-full h-3"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4           <div\cb1 \strokec4 \
\cb3 \strokec4             className=\cf6 \strokec6 "bg-green-500 h-3 rounded-full transition-all duration-500 ease-out"\cf0 \cb1 \strokec4 \
\cb3 \strokec4             style=\{\{ width: \cf6 \strokec6 `\cf0 \strokec4 $\{progress\}\cf6 \strokec6 %`\cf0 \strokec4  \}\}\cb1 \strokec4 \
\cb3 \strokec4           ></div>\cb1 \strokec4 \
\cb3 \strokec4         </div>\cb1 \strokec4 \
\cb3 \strokec4         <p className=\cf6 \strokec6 "text-right text-sm text-gray-500 mt-2"\cf0 \strokec4 >\{currentStep + \cf8 \strokec8 1\cf0 \strokec4 \} \cf2 \strokec2 of\cf0 \strokec4  \{steps.length\} steps</p>\cb1 \strokec4 \
\cb3 \strokec4       </div>\cb1 \strokec4 \
\
\cb3 \strokec4       <\cf5 \strokec5 CurrentForm\cf0 \strokec4  formData=\{formData\} handleChange=\{handleChange\} />\cb1 \strokec4 \
\
\cb3 \strokec4       <div className=\cf6 \strokec6 "mt-8 flex justify-between"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4         \{currentStep > \cf8 \strokec8 0\cf0 \strokec4  && (\cb1 \strokec4 \
\cb3 \strokec4           <button\cb1 \strokec4 \
\cb3 \strokec4             onClick=\{handleBack\}\cb1 \strokec4 \
\cb3 \strokec4             className=\cf6 \strokec6 "px-6 py-3 bg-gray-300 text-gray-800 rounded-full font-semibold hover:bg-gray-400 transition-colors"\cf0 \cb1 \strokec4 \
\cb3 \strokec4           >\cb1 \strokec4 \
\cb3 \strokec4             \cf5 \strokec5 Back\cf0 \cb1 \strokec4 \
\cb3 \strokec4           </button>\cb1 \strokec4 \
\cb3 \strokec4         )\}\cb1 \strokec4 \
\cb3 \strokec4         <button\cb1 \strokec4 \
\cb3 \strokec4           onClick=\{handleNext\}\cb1 \strokec4 \
\cb3 \strokec4           className=\{\cf6 \strokec6 `px-6 py-3 rounded-full font-semibold transition-all duration-300 \cf0 \strokec4 $\{\cb1 \strokec4 \
\cb3 \strokec4             currentStep === steps.length - \cf8 \strokec8 1\cf0 \cb1 \strokec4 \
\cb3 \strokec4               ? \cf6 \strokec6 'bg-blue-600 text-white hover:bg-blue-700'\cf0 \cb1 \strokec4 \
\cb3 \strokec4               : \cf6 \strokec6 'bg-green-600 text-white hover:bg-green-700'\cf0 \cb1 \strokec4 \
\cb3 \strokec4           \}\cf6 \strokec6  \cf0 \strokec4 $\{currentStep === \cf8 \strokec8 0\cf0 \strokec4  ? \cf6 \strokec6 'ml-auto'\cf0 \strokec4  : \cf6 \strokec6 ''\cf0 \strokec4 \}\cf6 \strokec6 `\cf0 \strokec4 \}\cb1 \strokec4 \
\cb3 \strokec4         >\cb1 \strokec4 \
\cb3 \strokec4           \{currentStep === steps.length - \cf8 \strokec8 1\cf0 \strokec4  ? \cf6 \strokec6 'Calculate My Footprint'\cf0 \strokec4  : \cf6 \strokec6 'Next'\cf0 \strokec4 \}\cb1 \strokec4 \
\cb3 \strokec4         </button>\cb1 \strokec4 \
\cb3 \strokec4       </div>\cb1 \strokec4 \
\cb3 \strokec4     </div>\cb1 \strokec4 \
\cb3 \strokec4   );\cb1 \strokec4 \
\cb3 \strokec4 \};\cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf7 \cb3 \strokec7 // --- Results Screen ---\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 const\cf0 \strokec4  \cf5 \strokec5 ResultsScreen\cf0 \strokec4  = (\{ carbonFootprint, categoryBreakdown, onRecalculate, onSaveResults, userId \}) => \{\cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  data = [\cb1 \strokec4 \
\cb3 \strokec4     \{ name: \cf6 \strokec6 'Home Energy'\cf0 \strokec4 , value: parseFloat(categoryBreakdown.home.toFixed(\cf8 \strokec8 2\cf0 \strokec4 )) \},\cb1 \strokec4 \
\cb3 \strokec4     \{ name: \cf6 \strokec6 'Transportation'\cf0 \strokec4 , value: parseFloat(categoryBreakdown.transport.toFixed(\cf8 \strokec8 2\cf0 \strokec4 )) \},\cb1 \strokec4 \
\cb3 \strokec4     \{ name: \cf6 \strokec6 'Food & Diet'\cf0 \strokec4 , value: parseFloat(categoryBreakdown.food.toFixed(\cf8 \strokec8 2\cf0 \strokec4 )) \},\cb1 \strokec4 \
\cb3 \strokec4     \{ name: \cf6 \strokec6 'Consumption'\cf0 \strokec4 , value: parseFloat(categoryBreakdown.consumption.toFixed(\cf8 \strokec8 2\cf0 \strokec4 )) \},\cb1 \strokec4 \
\cb3 \strokec4   ];\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  recommendations = \{\cb1 \strokec4 \
\cb3 \strokec4     home: [\cb1 \strokec4 \
\cb3 \strokec4       \cf6 \strokec6 "Switch to renewable energy sources if available (e.g., green electricity tariffs, solar panels)."\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4       \cf6 \strokec6 "Improve home insulation to reduce heating/cooling needs."\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4       \cf6 \strokec6 "Unplug electronics when not in use (vampire load)."\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4       \cf6 \strokec6 "Use energy-efficient appliances (look for ENERGY STAR ratings)."\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4       \cf6 \strokec6 "Lower thermostat in winter, raise in summer, or use smart thermostats."\cf0 \cb1 \strokec4 \
\cb3 \strokec4     ],\cb1 \strokec4 \
\cb3 \strokec4     transport: [\cb1 \strokec4 \
\cb3 \strokec4       \cf6 \strokec6 "Walk, cycle, or use public transport more often."\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4       \cf6 \strokec6 "Consider carpooling or ride-sharing."\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4       \cf6 \strokec6 "If buying a car, choose an electric or hybrid vehicle."\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4       \cf6 \strokec6 "Combine errands to reduce driving trips."\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4       \cf6 \strokec6 "Reduce air travel where possible; consider train for shorter distances."\cf0 \cb1 \strokec4 \
\cb3 \strokec4     ],\cb1 \strokec4 \
\cb3 \strokec4     food: [\cb1 \strokec4 \
\cb3 \strokec4       \cf6 \strokec6 "Reduce consumption of meat and dairy, especially red meat."\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4       \cf6 \strokec6 "Eat more plant-based meals."\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4       \cf6 \strokec6 "Buy local and seasonal produce to reduce transportation emissions."\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4       \cf6 \strokec6 "Minimize food waste by planning meals and composting scraps."\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4       \cf6 \strokec6 "Choose sustainably sourced and organic products."\cf0 \cb1 \strokec4 \
\cb3 \strokec4     ],\cb1 \strokec4 \
\cb3 \strokec4     consumption: [\cb1 \strokec4 \
\cb3 \strokec4       \cf6 \strokec6 "Buy less, choose quality over quantity."\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4       \cf6 \strokec6 "Repair items instead of replacing them."\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4       \cf6 \strokec6 "Shop second-hand or donate/sell unused items."\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4       \cf6 \strokec6 "Reduce, reuse, recycle \'96 prioritize reduction and reuse."\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4       \cf6 \strokec6 "Support companies with sustainable practices and transparent supply chains."\cf0 \cb1 \strokec4 \
\cb3 \strokec4     ]\cb1 \strokec4 \
\cb3 \strokec4   \};\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  globalAverage = \cf8 \strokec8 4.5\cf0 \strokec4 ; \cf7 \strokec7 // Example global average in tonnes CO2e per person per year (can vary widely)\cf0 \cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  comparisonMessage = carbonFootprint.totalTonnes > globalAverage\cb1 \strokec4 \
\cb3 \strokec4     ? \cf6 \strokec6 `Your footprint is higher than the estimated global average of \cf0 \strokec4 $\{globalAverage\}\cf6 \strokec6  tonnes CO2e per person.`\cf0 \cb1 \strokec4 \
\cb3 \strokec4     : \cf6 \strokec6 `Your footprint is lower than the estimated global average of \cf0 \strokec4 $\{globalAverage\}\cf6 \strokec6  tonnes CO2e per person. Great job!`\cf0 \strokec4 ;\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 return\cf0 \strokec4  (\cb1 \strokec4 \
\cb3 \strokec4     <div className=\cf6 \strokec6 "bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto w-full"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4       <h2 className=\cf6 \strokec6 "text-3xl font-bold text-gray-800 mb-6 text-center"\cf0 \strokec4 >\cf5 \strokec5 Your\cf0 \strokec4  \cf5 \strokec5 Carbon\cf0 \strokec4  \cf5 \strokec5 Footprint\cf0 \strokec4  \cf5 \strokec5 Result\cf0 \strokec4 !</h2>\cb1 \strokec4 \
\
\cb3 \strokec4       <div className=\cf6 \strokec6 "bg-blue-50 p-6 rounded-lg mb-8 text-center border border-blue-200"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4         <p className=\cf6 \strokec6 "text-xl text-gray-700 mb-2"\cf0 \strokec4 >\cf5 \strokec5 Your\cf0 \strokec4  estimated annual carbon footprint \cf2 \strokec2 is\cf0 \strokec4 :</p>\cb1 \strokec4 \
\cb3 \strokec4         <p className=\cf6 \strokec6 "text-5xl font-extrabold text-blue-700"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4           \{carbonFootprint.totalTonnes.toFixed(\cf8 \strokec8 2\cf0 \strokec4 )\} tonnes \cf5 \strokec5 CO\cf9 \strokec9 \uc0\u8322 \cf0 \strokec4 e\cb1 \strokec4 \
\cb3 \strokec4         </p>\cb1 \strokec4 \
\cb3 \strokec4         <p className=\cf6 \strokec6 "text-md text-gray-600 mt-3"\cf0 \strokec4 >\{comparisonMessage\}</p>\cb1 \strokec4 \
\cb3 \strokec4         \{userId && (\cb1 \strokec4 \
\cb3 \strokec4           <p className=\cf6 \strokec6 "text-sm text-gray-500 mt-2"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4             \cf5 \strokec5 Your\cf0 \strokec4  \cf5 \strokec5 User\cf0 \strokec4  \cf5 \strokec5 ID\cf0 \strokec4 : <span className=\cf6 \strokec6 "font-mono text-gray-700 break-all"\cf0 \strokec4 >\{userId\}</span>\cb1 \strokec4 \
\cb3 \strokec4           </p>\cb1 \strokec4 \
\cb3 \strokec4         )\}\cb1 \strokec4 \
\cb3 \strokec4       </div>\cb1 \strokec4 \
\
\cb3 \strokec4       <h3 className=\cf6 \strokec6 "text-2xl font-semibold text-gray-800 mb-4"\cf0 \strokec4 >\cf5 \strokec5 Breakdown\cf0 \strokec4  by \cf5 \strokec5 Category\cf0 \strokec4 :</h3>\cb1 \strokec4 \
\cb3 \strokec4       <div className=\cf6 \strokec6 "h-80 mb-8"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4         <\cf5 \strokec5 ResponsiveContainer\cf0 \strokec4  width=\cf6 \strokec6 "100%"\cf0 \strokec4  height=\cf6 \strokec6 "100%"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4           <\cf5 \strokec5 BarChart\cf0 \cb1 \strokec4 \
\cb3 \strokec4             data=\{data\}\cb1 \strokec4 \
\cb3 \strokec4             margin=\{\{ top: \cf8 \strokec8 20\cf0 \strokec4 , right: \cf8 \strokec8 30\cf0 \strokec4 , left: \cf8 \strokec8 20\cf0 \strokec4 , bottom: \cf8 \strokec8 5\cf0 \strokec4  \}\}\cb1 \strokec4 \
\cb3 \strokec4           >\cb1 \strokec4 \
\cb3 \strokec4             <\cf5 \strokec5 CartesianGrid\cf0 \strokec4  strokeDasharray=\cf6 \strokec6 "3 3"\cf0 \strokec4  />\cb1 \strokec4 \
\cb3 \strokec4             <\cf5 \strokec5 XAxis\cf0 \strokec4  dataKey=\cf6 \strokec6 "name"\cf0 \strokec4  />\cb1 \strokec4 \
\cb3 \strokec4             <\cf5 \strokec5 YAxis\cf0 \strokec4  label=\{\{ value: \cf6 \strokec6 'Tonnes CO\uc0\u8322 e'\cf0 \strokec4 , angle: -\cf8 \strokec8 90\cf0 \strokec4 , position: \cf6 \strokec6 'insideLeft'\cf0 \strokec4  \}\} />\cb1 \strokec4 \
\cb3 \strokec4             <\cf5 \strokec5 Tooltip\cf0 \strokec4  formatter=\{(value) => \cf6 \strokec6 `\cf0 \strokec4 $\{value.toFixed(\cf8 \strokec8 2\cf0 \strokec4 )\}\cf6 \strokec6  tonnes CO\uc0\u8322 e`\cf0 \strokec4 \} />\cb1 \strokec4 \
\cb3 \strokec4             <\cf5 \strokec5 Legend\cf0 \strokec4  />\cb1 \strokec4 \
\cb3 \strokec4             <\cf5 \strokec5 Bar\cf0 \strokec4  dataKey=\cf6 \strokec6 "value"\cf0 \strokec4  fill=\cf6 \strokec6 "#4CAF50"\cf0 \strokec4  name=\cf6 \strokec6 "Carbon Footprint"\cf0 \strokec4  radius=\{[\cf8 \strokec8 10\cf0 \strokec4 , \cf8 \strokec8 10\cf0 \strokec4 , \cf8 \strokec8 0\cf0 \strokec4 , \cf8 \strokec8 0\cf0 \strokec4 ]\} />\cb1 \strokec4 \
\cb3 \strokec4           </\cf5 \strokec5 BarChart\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4         </\cf5 \strokec5 ResponsiveContainer\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4       </div>\cb1 \strokec4 \
\
\cb3 \strokec4       <h3 className=\cf6 \strokec6 "text-2xl font-semibold text-gray-800 mb-4"\cf0 \strokec4 >\cf5 \strokec5 Actionable\cf0 \strokec4  \cf5 \strokec5 Recommendations\cf0 \strokec4 :</h3>\cb1 \strokec4 \
\cb3 \strokec4       <div className=\cf6 \strokec6 "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4         <div className=\cf6 \strokec6 "bg-green-50 p-5 rounded-lg border border-green-200"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4           <h4 className=\cf6 \strokec6 "text-xl font-semibold text-green-800 mb-3"\cf0 \strokec4 >\cf5 \strokec5 Home\cf0 \strokec4  \cf5 \strokec5 Energy\cf0 \strokec4 </h4>\cb1 \strokec4 \
\cb3 \strokec4           <ul className=\cf6 \strokec6 "list-disc list-inside text-gray-700 space-y-1"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4             \{recommendations.home.map((tip, index) => <li key=\{index\}>\{tip\}</li>)\}\cb1 \strokec4 \
\cb3 \strokec4           </ul>\cb1 \strokec4 \
\cb3 \strokec4         </div>\cb1 \strokec4 \
\cb3 \strokec4         <div className=\cf6 \strokec6 "bg-green-50 p-5 rounded-lg border border-green-200"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4           <h4 className=\cf6 \strokec6 "text-xl font-semibold text-green-800 mb-3"\cf0 \strokec4 >\cf5 \strokec5 Transportation\cf0 \strokec4 </h4>\cb1 \strokec4 \
\cb3 \strokec4           <ul className=\cf6 \strokec6 "list-disc list-inside text-gray-700 space-y-1"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4             \{recommendations.transport.map((tip, index) => <li key=\{index\}>\{tip\}</li>)\}\cb1 \strokec4 \
\cb3 \strokec4           </ul>\cb1 \strokec4 \
\cb3 \strokec4         </div>\cb1 \strokec4 \
\cb3 \strokec4         <div className=\cf6 \strokec6 "bg-green-50 p-5 rounded-lg border border-green-200"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4           <h4 className=\cf6 \strokec6 "text-xl font-semibold text-green-800 mb-3"\cf0 \strokec4 >\cf5 \strokec5 Food\cf0 \strokec4  & \cf5 \strokec5 Diet\cf0 \strokec4 </h4>\cb1 \strokec4 \
\cb3 \strokec4           <ul className=\cf6 \strokec6 "list-disc list-inside text-gray-700 space-y-1"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4             \{recommendations.food.map((tip, index) => <li key=\{index\}>\{tip\}</li>)\}\cb1 \strokec4 \
\cb3 \strokec4           </ul>\cb1 \strokec4 \
\cb3 \strokec4         </div>\cb1 \strokec4 \
\cb3 \strokec4         <div className=\cf6 \strokec6 "bg-green-50 p-5 rounded-lg border border-green-200"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4           <h4 className=\cf6 \strokec6 "text-xl font-semibold text-green-800 mb-3"\cf0 \strokec4 >\cf5 \strokec5 Consumption\cf0 \strokec4 </h4>\cb1 \strokec4 \
\cb3 \strokec4           <ul className=\cf6 \strokec6 "list-disc list-inside text-gray-700 space-y-1"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4             \{recommendations.consumption.map((tip, index) => <li key=\{index\}>\{tip\}</li>)\}\cb1 \strokec4 \
\cb3 \strokec4           </ul>\cb1 \strokec4 \
\cb3 \strokec4         </div>\cb1 \strokec4 \
\cb3 \strokec4       </div>\cb1 \strokec4 \
\
\cb3 \strokec4       <div className=\cf6 \strokec6 "flex justify-center space-x-4"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4         <button\cb1 \strokec4 \
\cb3 \strokec4           onClick=\{onRecalculate\}\cb1 \strokec4 \
\cb3 \strokec4           className=\cf6 \strokec6 "px-6 py-3 bg-gray-300 text-gray-800 rounded-full font-semibold hover:bg-gray-400 transition-colors"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         >\cb1 \strokec4 \
\cb3 \strokec4           \cf5 \strokec5 Recalculate\cf0 \cb1 \strokec4 \
\cb3 \strokec4         </button>\cb1 \strokec4 \
\cb3 \strokec4         <button\cb1 \strokec4 \
\cb3 \strokec4           onClick=\{onSaveResults\}\cb1 \strokec4 \
\cb3 \strokec4           className=\cf6 \strokec6 "px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         >\cb1 \strokec4 \
\cb3 \strokec4           \cf5 \strokec5 Save\cf0 \strokec4  \cf5 \strokec5 My\cf0 \strokec4  \cf5 \strokec5 Results\cf0 \cb1 \strokec4 \
\cb3 \strokec4         </button>\cb1 \strokec4 \
\cb3 \strokec4       </div>\cb1 \strokec4 \
\cb3 \strokec4     </div>\cb1 \strokec4 \
\cb3 \strokec4   );\cb1 \strokec4 \
\cb3 \strokec4 \};\cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf7 \cb3 \strokec7 // --- History Screen ---\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 const\cf0 \strokec4  \cf5 \strokec5 HistoryScreen\cf0 \strokec4  = (\{ onBackToCalculator \}) => \{\cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  \{ db, userId, isAuthReady \} = useFirebase();\cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  [history, setHistory] = useState([]);\cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  [loading, setLoading] = useState(\cf2 \strokec2 true\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  [error, setError] = useState(\cf2 \strokec2 null\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  appId = \cf2 \strokec2 typeof\cf0 \strokec4  __app_id !== \cf6 \strokec6 'undefined'\cf0 \strokec4  ? __app_id : \cf6 \strokec6 'default-app-id'\cf0 \strokec4 ;\cb1 \strokec4 \
\
\cb3 \strokec4   useEffect(() => \{\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 if\cf0 \strokec4  (!isAuthReady || !db || !userId) \{\cb1 \strokec4 \
\cb3 \strokec4       \cf2 \strokec2 if\cf0 \strokec4  (isAuthReady && (!db || !userId)) \{\cb1 \strokec4 \
\cb3 \strokec4         console.warn(\cf6 \strokec6 "Firestore or User ID not ready for history fetch."\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4       \}\cb1 \strokec4 \
\cb3 \strokec4       \cf2 \strokec2 return\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4     \}\cb1 \strokec4 \
\
\cb3 \strokec4     setLoading(\cf2 \strokec2 true\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4     setError(\cf2 \strokec2 null\cf0 \strokec4 );\cb1 \strokec4 \
\
\cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  q = collection(db, \cf6 \strokec6 `artifacts/\cf0 \strokec4 $\{appId\}\cf6 \strokec6 /users/\cf0 \strokec4 $\{userId\}\cf6 \strokec6 /carbon_footprints`\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  unsubscribe = onSnapshot(q,\cb1 \strokec4 \
\cb3 \strokec4       (snapshot) => \{\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 const\cf0 \strokec4  footprints = [];\cb1 \strokec4 \
\cb3 \strokec4         snapshot.forEach((doc) => \{\cb1 \strokec4 \
\cb3 \strokec4           footprints.push(\{ id: doc.id, ...doc.data() \});\cb1 \strokec4 \
\cb3 \strokec4         \});\cb1 \strokec4 \
\cb3 \strokec4         \cf7 \strokec7 // Sort by timestamp if available, otherwise by ID\cf0 \cb1 \strokec4 \
\cb3 \strokec4         footprints.sort((a, b) => (b.timestamp?.toDate() || \cf8 \strokec8 0\cf0 \strokec4 ) - (a.timestamp?.toDate() || \cf8 \strokec8 0\cf0 \strokec4 ));\cb1 \strokec4 \
\cb3 \strokec4         setHistory(footprints);\cb1 \strokec4 \
\cb3 \strokec4         setLoading(\cf2 \strokec2 false\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4       \},\cb1 \strokec4 \
\cb3 \strokec4       (err) => \{\cb1 \strokec4 \
\cb3 \strokec4         console.error(\cf6 \strokec6 "Error fetching history:"\cf0 \strokec4 , err);\cb1 \strokec4 \
\cb3 \strokec4         setError(\cf6 \strokec6 "Failed to load history. Please try again later."\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4         setLoading(\cf2 \strokec2 false\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4       \}\cb1 \strokec4 \
\cb3 \strokec4     );\cb1 \strokec4 \
\
\cb3 \strokec4     \cf2 \strokec2 return\cf0 \strokec4  () => unsubscribe(); \cf7 \strokec7 // Cleanup listener on component unmount\cf0 \cb1 \strokec4 \
\cb3 \strokec4   \}, [db, userId, isAuthReady, appId]);\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 if\cf0 \strokec4  (loading) \{\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 return\cf0 \strokec4  (\cb1 \strokec4 \
\cb3 \strokec4       <div className=\cf6 \strokec6 "flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto w-full"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4         <p className=\cf6 \strokec6 "text-gray-700 text-lg"\cf0 \strokec4 >\cf5 \strokec5 Loading\cf0 \strokec4  your history...</p>\cb1 \strokec4 \
\cb3 \strokec4       </div>\cb1 \strokec4 \
\cb3 \strokec4     );\cb1 \strokec4 \
\cb3 \strokec4   \}\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 if\cf0 \strokec4  (error) \{\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 return\cf0 \strokec4  (\cb1 \strokec4 \
\cb3 \strokec4       <div className=\cf6 \strokec6 "flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto w-full text-red-600"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4         <p className=\cf6 \strokec6 "text-lg"\cf0 \strokec4 >\{error\}</p>\cb1 \strokec4 \
\cb3 \strokec4         <button\cb1 \strokec4 \
\cb3 \strokec4           onClick=\{onBackToCalculator\}\cb1 \strokec4 \
\cb3 \strokec4           className=\cf6 \strokec6 "mt-6 px-6 py-3 bg-gray-300 text-gray-800 rounded-full font-semibold hover:bg-gray-400 transition-colors"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         >\cb1 \strokec4 \
\cb3 \strokec4           \cf5 \strokec5 Back\cf0 \strokec4  to \cf5 \strokec5 Calculator\cf0 \cb1 \strokec4 \
\cb3 \strokec4         </button>\cb1 \strokec4 \
\cb3 \strokec4       </div>\cb1 \strokec4 \
\cb3 \strokec4     );\cb1 \strokec4 \
\cb3 \strokec4   \}\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 return\cf0 \strokec4  (\cb1 \strokec4 \
\cb3 \strokec4     <div className=\cf6 \strokec6 "bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto w-full"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4       <h2 className=\cf6 \strokec6 "text-3xl font-bold text-gray-800 mb-6 text-center"\cf0 \strokec4 >\cf5 \strokec5 Your\cf0 \strokec4  \cf5 \strokec5 Carbon\cf0 \strokec4  \cf5 \strokec5 Footprint\cf0 \strokec4  \cf5 \strokec5 History\cf0 \strokec4 </h2>\cb1 \strokec4 \
\
\cb3 \strokec4       \{history.length === \cf8 \strokec8 0\cf0 \strokec4  ? (\cb1 \strokec4 \
\cb3 \strokec4         <p className=\cf6 \strokec6 "text-center text-gray-600 text-lg"\cf0 \strokec4 >\cf5 \strokec5 No\cf0 \strokec4  saved footprints yet. \cf5 \strokec5 Calculate\cf0 \strokec4  your first one!</p>\cb1 \strokec4 \
\cb3 \strokec4       ) : (\cb1 \strokec4 \
\cb3 \strokec4         <div className=\cf6 \strokec6 "space-y-4"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4           \{history.map((entry) => (\cb1 \strokec4 \
\cb3 \strokec4             <div key=\{entry.id\} className=\cf6 \strokec6 "bg-gray-50 p-4 rounded-lg border border-gray-200"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4               <p className=\cf6 \strokec6 "font-semibold text-lg text-gray-800"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4                 \cf5 \strokec5 Date\cf0 \strokec4 : \{entry.timestamp ? \cf2 \strokec2 new\cf0 \strokec4  \cf5 \strokec5 Date\cf0 \strokec4 (entry.timestamp.toDate()).toLocaleDateString() : \cf6 \strokec6 'N/A'\cf0 \strokec4 \}\cb1 \strokec4 \
\cb3 \strokec4               </p>\cb1 \strokec4 \
\cb3 \strokec4               <p className=\cf6 \strokec6 "text-gray-700"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4                 \cf5 \strokec5 Total\cf0 \strokec4  \cf5 \strokec5 Footprint\cf0 \strokec4 : <span className=\cf6 \strokec6 "font-bold text-blue-700"\cf0 \strokec4 >\{entry.totalTonnes.toFixed(\cf8 \strokec8 2\cf0 \strokec4 )\} tonnes \cf5 \strokec5 CO\cf9 \strokec9 \uc0\u8322 \cf0 \strokec4 e</span>\cb1 \strokec4 \
\cb3 \strokec4               </p>\cb1 \strokec4 \
\cb3 \strokec4               <div className=\cf6 \strokec6 "text-sm text-gray-600 mt-2"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4                 <p>\cf5 \strokec5 Home\cf0 \strokec4 : \{entry.categoryBreakdown.home.toFixed(\cf8 \strokec8 2\cf0 \strokec4 )\} tCO\cf9 \strokec9 \uc0\u8322 \cf0 \strokec4 e</p>\cb1 \strokec4 \
\cb3 \strokec4                 <p>\cf5 \strokec5 Transport\cf0 \strokec4 : \{entry.categoryBreakdown.transport.toFixed(\cf8 \strokec8 2\cf0 \strokec4 )\} tCO\cf9 \strokec9 \uc0\u8322 \cf0 \strokec4 e</p>\cb1 \strokec4 \
\cb3 \strokec4                 <p>\cf5 \strokec5 Food\cf0 \strokec4 : \{entry.categoryBreakdown.food.toFixed(\cf8 \strokec8 2\cf0 \strokec4 )\} tCO\cf9 \strokec9 \uc0\u8322 \cf0 \strokec4 e</p>\cb1 \strokec4 \
\cb3 \strokec4                 <p>\cf5 \strokec5 Consumption\cf0 \strokec4 : \{entry.categoryBreakdown.consumption.toFixed(\cf8 \strokec8 2\cf0 \strokec4 )\} tCO\cf9 \strokec9 \uc0\u8322 \cf0 \strokec4 e</p>\cb1 \strokec4 \
\cb3 \strokec4               </div>\cb1 \strokec4 \
\cb3 \strokec4             </div>\cb1 \strokec4 \
\cb3 \strokec4           ))\}\cb1 \strokec4 \
\cb3 \strokec4         </div>\cb1 \strokec4 \
\cb3 \strokec4       )\}\cb1 \strokec4 \
\
\cb3 \strokec4       <div className=\cf6 \strokec6 "flex justify-center mt-8"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4         <button\cb1 \strokec4 \
\cb3 \strokec4           onClick=\{onBackToCalculator\}\cb1 \strokec4 \
\cb3 \strokec4           className=\cf6 \strokec6 "px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"\cf0 \cb1 \strokec4 \
\cb3 \strokec4         >\cb1 \strokec4 \
\cb3 \strokec4           \cf5 \strokec5 Back\cf0 \strokec4  to \cf5 \strokec5 Calculator\cf0 \cb1 \strokec4 \
\cb3 \strokec4         </button>\cb1 \strokec4 \
\cb3 \strokec4       </div>\cb1 \strokec4 \
\cb3 \strokec4     </div>\cb1 \strokec4 \
\cb3 \strokec4   );\cb1 \strokec4 \
\cb3 \strokec4 \};\cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf7 \cb3 \strokec7 // --- Main App Component ---\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 const\cf0 \strokec4  \cf5 \strokec5 App\cf0 \strokec4  = () => \{\cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  [currentPage, setCurrentPage] = useState(\cf6 \strokec6 'welcome'\cf0 \strokec4 ); \cf7 \strokec7 // 'welcome', 'questionnaire', 'results', 'history'\cf0 \cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  [formData, setFormData] = useState(\{\});\cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  [carbonFootprint, setCarbonFootprint] = useState(\cf2 \strokec2 null\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  [categoryBreakdown, setCategoryBreakdown] = useState(\cf2 \strokec2 null\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  [showModal, setShowModal] = useState(\cf2 \strokec2 false\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  [modalContent, setModalContent] = useState(\{ title: \cf6 \strokec6 ''\cf0 \strokec4 , message: \cf6 \strokec6 ''\cf0 \strokec4 , showConfirm: \cf2 \strokec2 false\cf0 \strokec4  \});\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  \{ db, userId, isAuthReady \} = useFirebase();\cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  appId = \cf2 \strokec2 typeof\cf0 \strokec4  __app_id !== \cf6 \strokec6 'undefined'\cf0 \strokec4  ? __app_id : \cf6 \strokec6 'default-app-id'\cf0 \strokec4 ;\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  handleStartQuiz = () => \{\cb1 \strokec4 \
\cb3 \strokec4     setCurrentPage(\cf6 \strokec6 'questionnaire'\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4     setFormData(\{\}); \cf7 \strokec7 // Reset form data for a new calculation\cf0 \cb1 \strokec4 \
\cb3 \strokec4   \};\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  handleCompleteQuiz = (data) => \{\cb1 \strokec4 \
\cb3 \strokec4     setFormData(data);\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  \{ totalTonnes, categoryBreakdown \} = calculateCarbonFootprint(data);\cb1 \strokec4 \
\cb3 \strokec4     setCarbonFootprint(\{ totalTonnes \});\cb1 \strokec4 \
\cb3 \strokec4     setCategoryBreakdown(categoryBreakdown);\cb1 \strokec4 \
\cb3 \strokec4     setCurrentPage(\cf6 \strokec6 'results'\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4   \};\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  handleRecalculate = () => \{\cb1 \strokec4 \
\cb3 \strokec4     setCurrentPage(\cf6 \strokec6 'questionnaire'\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4   \};\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  handleSaveResults = useCallback(\cf2 \strokec2 async\cf0 \strokec4  () => \{\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 if\cf0 \strokec4  (!db || !userId || !carbonFootprint || !categoryBreakdown) \{\cb1 \strokec4 \
\cb3 \strokec4       setModalContent(\{\cb1 \strokec4 \
\cb3 \strokec4         title: \cf6 \strokec6 'Error'\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4         message: \cf6 \strokec6 'Cannot save results. Please ensure you are logged in and have calculated a footprint.'\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4         showConfirm: \cf2 \strokec2 false\cf0 \cb1 \strokec4 \
\cb3 \strokec4       \});\cb1 \strokec4 \
\cb3 \strokec4       setShowModal(\cf2 \strokec2 true\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4       \cf2 \strokec2 return\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4     \}\cb1 \strokec4 \
\
\cb3 \strokec4     \cf2 \strokec2 try\cf0 \strokec4  \{\cb1 \strokec4 \
\cb3 \strokec4       \cf7 \strokec7 // Use addDoc to automatically generate a document ID\cf0 \cb1 \strokec4 \
\cb3 \strokec4       \cf2 \strokec2 const\cf0 \strokec4  docRef = collection(db, \cf6 \strokec6 `artifacts/\cf0 \strokec4 $\{appId\}\cf6 \strokec6 /users/\cf0 \strokec4 $\{userId\}\cf6 \strokec6 /carbon_footprints`\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4       \cf2 \strokec2 await\cf0 \strokec4  setDoc(doc(docRef), \{ \cf7 \strokec7 // Using doc(docRef) to create a new document with an auto-generated ID\cf0 \cb1 \strokec4 \
\cb3 \strokec4         totalTonnes: carbonFootprint.totalTonnes,\cb1 \strokec4 \
\cb3 \strokec4         categoryBreakdown: categoryBreakdown,\cb1 \strokec4 \
\cb3 \strokec4         formData: formData, \cf7 \strokec7 // Save the raw form data for potential future analysis\cf0 \cb1 \strokec4 \
\cb3 \strokec4         timestamp: serverTimestamp() \cf7 \strokec7 // Firestore server timestamp\cf0 \cb1 \strokec4 \
\cb3 \strokec4       \});\cb1 \strokec4 \
\cb3 \strokec4       setModalContent(\{\cb1 \strokec4 \
\cb3 \strokec4         title: \cf6 \strokec6 'Success!'\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4         message: \cf6 \strokec6 'Your carbon footprint has been saved to your history.'\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4         showConfirm: \cf2 \strokec2 false\cf0 \cb1 \strokec4 \
\cb3 \strokec4       \});\cb1 \strokec4 \
\cb3 \strokec4       setShowModal(\cf2 \strokec2 true\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4     \} \cf2 \strokec2 catch\cf0 \strokec4  (e) \{\cb1 \strokec4 \
\cb3 \strokec4       console.error(\cf6 \strokec6 "Error adding document: "\cf0 \strokec4 , e);\cb1 \strokec4 \
\cb3 \strokec4       setModalContent(\{\cb1 \strokec4 \
\cb3 \strokec4         title: \cf6 \strokec6 'Error'\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4         message: \cf6 \strokec6 `Failed to save your footprint. Error: \cf0 \strokec4 $\{e.message\}\cf6 \strokec6 `\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4         showConfirm: \cf2 \strokec2 false\cf0 \cb1 \strokec4 \
\cb3 \strokec4       \});\cb1 \strokec4 \
\cb3 \strokec4       setShowModal(\cf2 \strokec2 true\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4     \}\cb1 \strokec4 \
\cb3 \strokec4   \}, [db, userId, carbonFootprint, categoryBreakdown, formData, appId]);\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  handleViewHistory = () => \{\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 if\cf0 \strokec4  (!isAuthReady || !userId) \{\cb1 \strokec4 \
\cb3 \strokec4       setModalContent(\{\cb1 \strokec4 \
\cb3 \strokec4         title: \cf6 \strokec6 'Authentication Required'\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4         message: \cf6 \strokec6 'Please wait a moment while we set up your session to view history. If this persists, try refreshing.'\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4         showConfirm: \cf2 \strokec2 false\cf0 \cb1 \strokec4 \
\cb3 \strokec4       \});\cb1 \strokec4 \
\cb3 \strokec4       setShowModal(\cf2 \strokec2 true\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4       \cf2 \strokec2 return\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4     \}\cb1 \strokec4 \
\cb3 \strokec4     setCurrentPage(\cf6 \strokec6 'history'\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4   \};\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 const\cf0 \strokec4  handleCloseModal = () => \{\cb1 \strokec4 \
\cb3 \strokec4     setShowModal(\cf2 \strokec2 false\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4   \};\cb1 \strokec4 \
\
\cb3 \strokec4   \cf7 \strokec7 // Show loading state while Firebase is initializing\cf0 \cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 if\cf0 \strokec4  (!isAuthReady) \{\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 return\cf0 \strokec4  (\cb1 \strokec4 \
\cb3 \strokec4       <div className=\cf6 \strokec6 "min-h-screen flex items-center justify-center bg-gray-100 font-inter p-4"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4         <div className=\cf6 \strokec6 "text-center text-gray-700 text-xl"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4           \cf5 \strokec5 Loading\cf0 \strokec4  application...\cb1 \strokec4 \
\cb3 \strokec4         </div>\cb1 \strokec4 \
\cb3 \strokec4       </div>\cb1 \strokec4 \
\cb3 \strokec4     );\cb1 \strokec4 \
\cb3 \strokec4   \}\cb1 \strokec4 \
\
\cb3 \strokec4   \cf2 \strokec2 return\cf0 \strokec4  (\cb1 \strokec4 \
\cb3 \strokec4     <div className=\cf6 \strokec6 "min-h-screen flex flex-col items-center justify-center bg-gray-100 font-inter p-4"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4       <style>\cb1 \strokec4 \
\cb3 \strokec4         \{\cf6 \strokec6 `\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf6 \cb3 \strokec6           @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6           body \{\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6             font-family: 'Inter', sans-serif;\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6           \}\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         `\cf0 \strokec4 \}\cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4       </style>\cb1 \strokec4 \
\cb3 \strokec4       <div className=\cf6 \strokec6 "w-full max-w-5xl"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4         <header className=\cf6 \strokec6 "flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-8"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4           <h1 className=\cf6 \strokec6 "text-4xl font-extrabold text-green-700"\cf0 \strokec4 >\cf5 \strokec5 EcoTrace\cf0 \strokec4 </h1>\cb1 \strokec4 \
\cb3 \strokec4           <nav>\cb1 \strokec4 \
\cb3 \strokec4             <ul className=\cf6 \strokec6 "flex space-x-4"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4               <li>\cb1 \strokec4 \
\cb3 \strokec4                 <button\cb1 \strokec4 \
\cb3 \strokec4                   onClick=\{() => setCurrentPage(\cf6 \strokec6 'welcome'\cf0 \strokec4 )\}\cb1 \strokec4 \
\cb3 \strokec4                   className=\cf6 \strokec6 "px-4 py-2 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"\cf0 \cb1 \strokec4 \
\cb3 \strokec4                 >\cb1 \strokec4 \
\cb3 \strokec4                   \cf5 \strokec5 Home\cf0 \cb1 \strokec4 \
\cb3 \strokec4                 </button>\cb1 \strokec4 \
\cb3 \strokec4               </li>\cb1 \strokec4 \
\cb3 \strokec4               <li>\cb1 \strokec4 \
\cb3 \strokec4                 <button\cb1 \strokec4 \
\cb3 \strokec4                   onClick=\{handleViewHistory\}\cb1 \strokec4 \
\cb3 \strokec4                   className=\cf6 \strokec6 "px-4 py-2 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"\cf0 \cb1 \strokec4 \
\cb3 \strokec4                 >\cb1 \strokec4 \
\cb3 \strokec4                   \cf5 \strokec5 My\cf0 \strokec4  \cf5 \strokec5 History\cf0 \cb1 \strokec4 \
\cb3 \strokec4                 </button>\cb1 \strokec4 \
\cb3 \strokec4               </li>\cb1 \strokec4 \
\cb3 \strokec4             </ul>\cb1 \strokec4 \
\cb3 \strokec4           </nav>\cb1 \strokec4 \
\cb3 \strokec4         </header>\cb1 \strokec4 \
\
\cb3 \strokec4         <main className=\cf6 \strokec6 "flex-grow flex items-center justify-center"\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4           \{currentPage === \cf6 \strokec6 'welcome'\cf0 \strokec4  && <\cf5 \strokec5 WelcomeScreen\cf0 \strokec4  onStart=\{handleStartQuiz\} />\}\cb1 \strokec4 \
\cb3 \strokec4           \{currentPage === \cf6 \strokec6 'questionnaire'\cf0 \strokec4  && <\cf5 \strokec5 Questionnaire\cf0 \strokec4  onComplete=\{handleCompleteQuiz\} initialFormData=\{formData\} />\}\cb1 \strokec4 \
\cb3 \strokec4           \{currentPage === \cf6 \strokec6 'results'\cf0 \strokec4  && carbonFootprint && categoryBreakdown && (\cb1 \strokec4 \
\cb3 \strokec4             <\cf5 \strokec5 ResultsScreen\cf0 \cb1 \strokec4 \
\cb3 \strokec4               carbonFootprint=\{carbonFootprint\}\cb1 \strokec4 \
\cb3 \strokec4               categoryBreakdown=\{categoryBreakdown\}\cb1 \strokec4 \
\cb3 \strokec4               onRecalculate=\{handleRecalculate\}\cb1 \strokec4 \
\cb3 \strokec4               onSaveResults=\{handleSaveResults\}\cb1 \strokec4 \
\cb3 \strokec4               userId=\{userId\}\cb1 \strokec4 \
\cb3 \strokec4             />\cb1 \strokec4 \
\cb3 \strokec4           )\}\cb1 \strokec4 \
\cb3 \strokec4           \{currentPage === \cf6 \strokec6 'history'\cf0 \strokec4  && <\cf5 \strokec5 HistoryScreen\cf0 \strokec4  onBackToCalculator=\{() => setCurrentPage(\cf6 \strokec6 'welcome'\cf0 \strokec4 )\} />\}\cb1 \strokec4 \
\cb3 \strokec4         </main>\cb1 \strokec4 \
\cb3 \strokec4       </div>\cb1 \strokec4 \
\
\cb3 \strokec4       <\cf5 \strokec5 Modal\cf0 \cb1 \strokec4 \
\cb3 \strokec4         show=\{showModal\}\cb1 \strokec4 \
\cb3 \strokec4         title=\{modalContent.title\}\cb1 \strokec4 \
\cb3 \strokec4         message=\{modalContent.message\}\cb1 \strokec4 \
\cb3 \strokec4         onClose=\{handleCloseModal\}\cb1 \strokec4 \
\cb3 \strokec4         showConfirmButton=\{modalContent.showConfirm\}\cb1 \strokec4 \
\cb3 \strokec4       />\cb1 \strokec4 \
\cb3 \strokec4     </div>\cb1 \strokec4 \
\cb3 \strokec4   );\cb1 \strokec4 \
\cb3 \strokec4 \};\cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 export\cf0 \strokec4  \cf2 \strokec2 default\cf0 \strokec4  \cf2 \strokec2 function\cf0 \strokec4  \cf5 \strokec5 CarbonFootprintAppWrapper\cf0 \strokec4 () \{\cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4   \cf2 \strokec2 return\cf0 \strokec4  (\cb1 \strokec4 \
\cb3 \strokec4     <\cf5 \strokec5 FirebaseProvider\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4       <\cf5 \strokec5 App\cf0 \strokec4  />\cb1 \strokec4 \
\cb3 \strokec4     </\cf5 \strokec5 FirebaseProvider\cf0 \strokec4 >\cb1 \strokec4 \
\cb3 \strokec4   );\cb1 \strokec4 \
\cb3 \strokec4 \}\cb1 \strokec4 \
\
}