import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Firebase Context and Provider ---
const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
  const [app, setApp] = useState(null);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    try {
      // Access global variables provided by the Canvas environment
      const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
      const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'; // Use default if not provided

      const initializedApp = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(initializedApp);
      const firebaseAuth = getAuth(initializedApp);

      setApp(initializedApp);
      setDb(firestoreDb);
      setAuth(firebaseAuth);

      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          // If no user, try to sign in with custom token or anonymously
          if (initialAuthToken) {
            try {
              await signInWithCustomToken(firebaseAuth, initialAuthToken);
              setUserId(firebaseAuth.currentUser.uid); // Set UID after successful sign-in
            } catch (error) {
              console.error("Error signing in with custom token:", error);
              // Fallback to anonymous if custom token fails
              const anonymousUser = await signInAnonymously(firebaseAuth);
              setUserId(anonymousUser.user.uid);
            }
          } else {
            const anonymousUser = await signInAnonymously(firebaseAuth);
            setUserId(anonymousUser.user.uid);
          }
        }
        setIsAuthReady(true);
      });

      return () => unsubscribe(); // Cleanup subscription
    } catch (error) {
      console.error("Firebase initialization error:", error);
    }
  }, []);

  return (
    <FirebaseContext.Provider value={{ app, db, auth, userId, isAuthReady }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);

// --- Modal Component ---
const Modal = ({ show, title, message, onClose, onConfirm, showConfirmButton = false }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-auto">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            {showConfirmButton ? 'Cancel' : 'Close'}
          </button>
          {showConfirmButton && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Carbon Footprint Calculation Logic ---
const calculateCarbonFootprint = (formData) => {
  let totalCO2e = 0; // in kg CO2e

  // Emission factors (simplified, global averages for demonstration)
  const emissionFactors = {
    electricity_kwh_per_year: 0.233, // kg CO2e per kWh (approx global average)
    natural_gas_therms_per_year: 5.3, // kg CO2e per therm
    car_km_per_year_gasoline: 0.18, // kg CO2e per km (average gasoline car)
    flight_km_per_year: 0.18, // kg CO2e per km (economy short-haul, simplified)
    diet_meat_heavy: 2.5 * 365, // kg CO2e per year
    diet_average: 1.8 * 365,
    diet_vegetarian: 1.0 * 365,
    diet_vegan: 0.7 * 365,
    consumption_low: 1000, // kg CO2e per year
    consumption_medium: 2000,
    consumption_high: 3000,
  };

  const categoryBreakdown = {
    home: 0,
    transport: 0,
    food: 0,
    consumption: 0,
    total: 0
  };

  // 1. Home Energy
  if (formData.electricityUsage) {
    const electricityCO2e = parseFloat(formData.electricityUsage) * 12 * emissionFactors.electricity_kwh_per_year;
    totalCO2e += electricityCO2e;
    categoryBreakdown.home += electricityCO2e;
  }
  if (formData.heatingFuel === 'naturalGas' && formData.naturalGasUsage) {
    const naturalGasCO2e = parseFloat(formData.naturalGasUsage) * 12 * emissionFactors.natural_gas_therms_per_year;
    totalCO2e += naturalGasCO2e;
    categoryBreakdown.home += naturalGasCO2e;
  }
  // Add more heating types if needed (e.g., electricity for heating, oil)

  // 2. Transportation
  if (formData.carMileage) {
    const carCO2e = parseFloat(formData.carMileage) * emissionFactors.car_km_per_year_gasoline;
    totalCO2e += carCO2e;
    categoryBreakdown.transport += carCO2e;
  }
  if (formData.publicTransportUsage === 'frequent') {
    // Arbitrary reduction for public transport use
    const publicTransportReduction = 500; // kg CO2e
    totalCO2e = Math.max(0, totalCO2e - publicTransportReduction); // Ensure it doesn't go negative
    categoryBreakdown.transport = Math.max(0, categoryBreakdown.transport - publicTransportReduction);
  }
  if (formData.flightHours) {
    const flightCO2e = parseFloat(formData.flightHours) * 800 * emissionFactors.flight_km_per_year; // Assuming avg 800km/hr flight
    totalCO2e += flightCO2e;
    categoryBreakdown.transport += flightCO2e;
  }

  // 3. Food & Diet
  if (formData.dietType) {
    let dietCO2e = 0;
    switch (formData.dietType) {
      case 'meatHeavy': dietCO2e = emissionFactors.diet_meat_heavy; break;
      case 'average': dietCO2e = emissionFactors.diet_average; break;
      case 'vegetarian': dietCO2e = emissionFactors.diet_vegetarian; break;
      case 'vegan': dietCO2e = emissionFactors.diet_vegan; break;
      default: break;
    }
    totalCO2e += dietCO2e;
    categoryBreakdown.food += dietCO2e;
  }

  // 4. General Consumption
  if (formData.consumptionLevel) {
    let consumptionCO2e = 0;
    switch (formData.consumptionLevel) {
      case 'low': consumptionCO2e = emissionFactors.consumption_low; break;
      case 'medium': consumptionCO2e = emissionFactors.consumption_medium; break;
      case 'high': consumptionCO2e = emissionFactors.consumption_high; break;
      default: break;
    }
    totalCO2e += consumptionCO2e;
    categoryBreakdown.consumption += consumptionCO2e;
  }

  categoryBreakdown.total = totalCO2e;

  // Convert to tonnes
  const totalTonnes = totalCO2e / 1000;
  categoryBreakdown.home /= 1000;
  categoryBreakdown.transport /= 1000;
  categoryBreakdown.food /= 1000;
  categoryBreakdown.consumption /= 1000;
  categoryBreakdown.total = totalTonnes;

  return { totalTonnes, categoryBreakdown };
};

// --- Welcome Screen ---
const WelcomeScreen = ({ onStart }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg text-center">
    <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Your Personal Carbon Footprint Calculator!</h2>
    <p className="text-lg text-gray-600 mb-6">
      Ever wondered about your impact on the planet? This tool helps you understand your carbon footprint across key areas of your life.
    </p>
    <p className="text-md text-gray-500 mb-8">
      We'll guide you through a few simple questions about your home, travel, diet, and consumption habits. Unlike other tools, we aim to give you a clear picture and actionable insights without overwhelming you.
    </p>
    <button
      onClick={onStart}
      className="px-8 py-4 bg-green-600 text-white font-semibold text-xl rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
    >
      Get Started
    </button>
  </div>
);

// --- Questionnaire Sections ---

const HomeEnergyForm = ({ formData, handleChange }) => (
  <div className="space-y-6">
    <h3 className="text-2xl font-semibold text-gray-800">1. Home Energy</h3>
    <p className="text-gray-600">Let's start with your home's energy consumption.</p>

    <div>
      <label htmlFor="electricityUsage" className="block text-gray-700 text-lg font-medium mb-2">
        Average monthly electricity usage (in kWh):
      </label>
      <input
        type="number"
        id="electricityUsage"
        name="electricityUsage"
        value={formData.electricityUsage || ''}
        onChange={handleChange}
        placeholder="e.g., 300"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
        min="0"
      />
      <p className="text-sm text-gray-500 mt-1">Check your electricity bill for this information.</p>
    </div>

    <div>
      <label htmlFor="heatingFuel" className="block text-gray-700 text-lg font-medium mb-2">
        What is your primary heating fuel?
      </label>
      <select
        id="heatingFuel"
        name="heatingFuel"
        value={formData.heatingFuel || ''}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
      >
        <option value="">Select an option</option>
        <option value="naturalGas">Natural Gas</option>
        <option value="electricity">Electricity</option>
        <option value="oil">Heating Oil</option>
        <option value="none">No dedicated heating</option>
      </select>
    </div>

    {formData.heatingFuel === 'naturalGas' && (
      <div>
        <label htmlFor="naturalGasUsage" className="block text-gray-700 text-lg font-medium mb-2">
          Average monthly natural gas usage (in therms or m³):
        </label>
        <input
          type="number"
          id="naturalGasUsage"
          name="naturalGasUsage"
          value={formData.naturalGasUsage || ''}
          onChange={handleChange}
          placeholder="e.g., 50 therms or 150 m³"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
          min="0"
        />
        <p className="text-sm text-gray-500 mt-1">Refer to your gas bill.</p>
      </div>
    )}
  </div>
);

const TransportationForm = ({ formData, handleChange }) => (
  <div className="space-y-6">
    <h3 className="text-2xl font-semibold text-gray-800">2. Transportation</h3>
    <p className="text-gray-600">How do you get around?</p>

    <div>
      <label htmlFor="carMileage" className="block text-gray-700 text-lg font-medium mb-2">
        Average annual car mileage (in km), if applicable:
      </label>
      <input
        type="number"
        id="carMileage"
        name="carMileage"
        value={formData.carMileage || ''}
        onChange={handleChange}
        placeholder="e.g., 12000"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
        min="0"
      />
      <p className="text-sm text-gray-500 mt-1">Estimate your yearly driving distance.</p>
    </div>

    <div>
      <label htmlFor="publicTransportUsage" className="block text-gray-700 text-lg font-medium mb-2">
        How often do you use public transport (bus, train, subway)?
      </label>
      <select
        id="publicTransportUsage"
        name="publicTransportUsage"
        value={formData.publicTransportUsage || ''}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
      >
        <option value="">Select an option</option>
        <option value="never">Never/Rarely</option>
        <option value="sometimes">Sometimes</option>
        <option value="frequent">Frequently (daily/most days)</option>
      </select>
    </div>

    <div>
      <label htmlFor="flightHours" className="block text-gray-700 text-lg font-medium mb-2">
        Average annual flight hours (estimate round trip):
      </label>
      <input
        type="number"
        id="flightHours"
        name="flightHours"
        value={formData.flightHours || ''}
        onChange={handleChange}
        placeholder="e.g., 10 (for a couple of short trips)"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
        min="0"
      />
      <p className="text-sm text-gray-500 mt-1">Consider all flights in a year.</p>
    </div>
  </div>
);

const FoodConsumptionForm = ({ formData, handleChange }) => (
  <div className="space-y-6">
    <h3 className="text-2xl font-semibold text-gray-800">3. Food & Diet</h3>
    <p className="text-gray-600">What does your diet look like?</p>

    <div>
      <label htmlFor="dietType" className="block text-gray-700 text-lg font-medium mb-2">
        Which best describes your diet?
      </label>
      <select
        id="dietType"
        name="dietType"
        value={formData.dietType || ''}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
      >
        <option value="">Select an option</option>
        <option value="meatHeavy">Meat-heavy (meat with most meals)</option>
        <option value="average">Average (meat a few times a week)</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="vegan">Vegan</option>
      </select>
    </div>

    <div>
      <label htmlFor="consumptionLevel" className="block text-gray-700 text-lg font-medium mb-2">
        How would you describe your general consumption habits (shopping, new items)?
      </label>
      <select
        id="consumptionLevel"
        name="consumptionLevel"
        value={formData.consumptionLevel || ''}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
      >
        <option value="">Select an option</option>
        <option value="low">Low (buy only essentials, repair often)</option>
        <option value="medium">Medium (buy new items regularly, balance with reuse)</option>
        <option value="high">High (frequent purchases, focus on new trends)</option>
      </select>
    </div>
  </div>
);

// --- Questionnaire Component ---
const Questionnaire = ({ onComplete, initialFormData = {} }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const steps = [HomeEnergyForm, TransportationForm, FoodConsumptionForm];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentForm = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Your Carbon Footprint Journey</h2>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-right text-sm text-gray-500 mt-2">{currentStep + 1} of {steps.length} steps</p>
      </div>

      <CurrentForm formData={formData} handleChange={handleChange} />

      <div className="mt-8 flex justify-between">
        {currentStep > 0 && (
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-full font-semibold hover:bg-gray-400 transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
            currentStep === steps.length - 1
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          } ${currentStep === 0 ? 'ml-auto' : ''}`}
        >
          {currentStep === steps.length - 1 ? 'Calculate My Footprint' : 'Next'}
        </button>
      </div>
    </div>
  );
};

// --- Results Screen ---
const ResultsScreen = ({ carbonFootprint, categoryBreakdown, onRecalculate, onSaveResults, userId }) => {
  const data = [
    { name: 'Home Energy', value: parseFloat(categoryBreakdown.home.toFixed(2)) },
    { name: 'Transportation', value: parseFloat(categoryBreakdown.transport.toFixed(2)) },
    { name: 'Food & Diet', value: parseFloat(categoryBreakdown.food.toFixed(2)) },
    { name: 'Consumption', value: parseFloat(categoryBreakdown.consumption.toFixed(2)) },
  ];

  const recommendations = {
    home: [
      "Switch to renewable energy sources if available (e.g., green electricity tariffs, solar panels).",
      "Improve home insulation to reduce heating/cooling needs.",
      "Unplug electronics when not in use (vampire load).",
      "Use energy-efficient appliances (look for ENERGY STAR ratings).",
      "Lower thermostat in winter, raise in summer, or use smart thermostats."
    ],
    transport: [
      "Walk, cycle, or use public transport more often.",
      "Consider carpooling or ride-sharing.",
      "If buying a car, choose an electric or hybrid vehicle.",
      "Combine errands to reduce driving trips.",
      "Reduce air travel where possible; consider train for shorter distances."
    ],
    food: [
      "Reduce consumption of meat and dairy, especially red meat.",
      "Eat more plant-based meals.",
      "Buy local and seasonal produce to reduce transportation emissions.",
      "Minimize food waste by planning meals and composting scraps.",
      "Choose sustainably sourced and organic products."
    ],
    consumption: [
      "Buy less, choose quality over quantity.",
      "Repair items instead of replacing them.",
      "Shop second-hand or donate/sell unused items.",
      "Reduce, reuse, recycle – prioritize reduction and reuse.",
      "Support companies with sustainable practices and transparent supply chains."
    ]
  };

  const globalAverage = 4.5; // Example global average in tonnes CO2e per person per year (can vary widely)
  const comparisonMessage = carbonFootprint.totalTonnes > globalAverage
    ? `Your footprint is higher than the estimated global average of ${globalAverage} tonnes CO2e per person.`
    : `Your footprint is lower than the estimated global average of ${globalAverage} tonnes CO2e per person. Great job!`;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Carbon Footprint Result!</h2>

      <div className="bg-blue-50 p-6 rounded-lg mb-8 text-center border border-blue-200">
        <p className="text-xl text-gray-700 mb-2">Your estimated annual carbon footprint is:</p>
        <p className="text-5xl font-extrabold text-blue-700">
          {carbonFootprint.totalTonnes.toFixed(2)} tonnes CO₂e
        </p>
        <p className="text-md text-gray-600 mt-3">{comparisonMessage}</p>
        {userId && (
          <p className="text-sm text-gray-500 mt-2">
            Your User ID: <span className="font-mono text-gray-700 break-all">{userId}</span>
          </p>
        )}
      </div>

      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Breakdown by Category:</h3>
      <div className="h-80 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Tonnes CO₂e', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => `${value.toFixed(2)} tonnes CO₂e`} />
            <Legend />
            <Bar dataKey="value" fill="#4CAF50" name="Carbon Footprint" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Actionable Recommendations:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-50 p-5 rounded-lg border border-green-200">
          <h4 className="text-xl font-semibold text-green-800 mb-3">Home Energy</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {recommendations.home.map((tip, index) => <li key={index}>{tip}</li>)}
          </ul>
        </div>
        <div className="bg-green-50 p-5 rounded-lg border border-green-200">
          <h4 className="text-xl font-semibold text-green-800 mb-3">Transportation</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {recommendations.transport.map((tip, index) => <li key={index}>{tip}</li>)}
          </ul>
        </div>
        <div className="bg-green-50 p-5 rounded-lg border border-green-200">
          <h4 className="text-xl font-semibold text-green-800 mb-3">Food & Diet</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {recommendations.food.map((tip, index) => <li key={index}>{tip}</li>)}
          </ul>
        </div>
        <div className="bg-green-50 p-5 rounded-lg border border-green-200">
          <h4 className="text-xl font-semibold text-green-800 mb-3">Consumption</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {recommendations.consumption.map((tip, index) => <li key={index}>{tip}</li>)}
          </ul>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={onRecalculate}
          className="px-6 py-3 bg-gray-300 text-gray-800 rounded-full font-semibold hover:bg-gray-400 transition-colors"
        >
          Recalculate
        </button>
        <button
          onClick={onSaveResults}
          className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
        >
          Save My Results
        </button>
      </div>
    </div>
  );
};

// --- History Screen ---
const HistoryScreen = ({ onBackToCalculator }) => {
  const { db, userId, isAuthReady } = useFirebase();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

  useEffect(() => {
    if (!isAuthReady || !db || !userId) {
      if (isAuthReady && (!db || !userId)) {
        console.warn("Firestore or User ID not ready for history fetch.");
      }
      return;
    }

    setLoading(true);
    setError(null);

    const q = collection(db, `artifacts/${appId}/users/${userId}/carbon_footprints`);
    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const footprints = [];
        snapshot.forEach((doc) => {
          footprints.push({ id: doc.id, ...doc.data() });
        });
        // Sort by timestamp if available, otherwise by ID
        footprints.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));
        setHistory(footprints);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching history:", err);
        setError("Failed to load history. Please try again later.");
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [db, userId, isAuthReady, appId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto w-full">
        <p className="text-gray-700 text-lg">Loading your history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto w-full text-red-600">
        <p className="text-lg">{error}</p>
        <button
          onClick={onBackToCalculator}
          className="mt-6 px-6 py-3 bg-gray-300 text-gray-800 rounded-full font-semibold hover:bg-gray-400 transition-colors"
        >
          Back to Calculator
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Carbon Footprint History</h2>

      {history.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No saved footprints yet. Calculate your first one!</p>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => (
            <div key={entry.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="font-semibold text-lg text-gray-800">
                Date: {entry.timestamp ? new Date(entry.timestamp.toDate()).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-gray-700">
                Total Footprint: <span className="font-bold text-blue-700">{entry.totalTonnes.toFixed(2)} tonnes CO₂e</span>
              </p>
              <div className="text-sm text-gray-600 mt-2">
                <p>Home: {entry.categoryBreakdown.home.toFixed(2)} tCO₂e</p>
                <p>Transport: {entry.categoryBreakdown.transport.toFixed(2)} tCO₂e</p>
                <p>Food: {entry.categoryBreakdown.food.toFixed(2)} tCO₂e</p>
                <p>Consumption: {entry.categoryBreakdown.consumption.toFixed(2)} tCO₂e</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8">
        <button
          onClick={onBackToCalculator}
          className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
        >
          Back to Calculator
        </button>
      </div>
    </div>
  );
};

// --- Main App Component ---
const App = () => {
  const [currentPage, setCurrentPage] = useState('welcome'); // 'welcome', 'questionnaire', 'results', 'history'
  const [formData, setFormData] = useState({});
  const [carbonFootprint, setCarbonFootprint] = useState(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', showConfirm: false });

  const { db, userId, isAuthReady } = useFirebase();
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

  const handleStartQuiz = () => {
    setCurrentPage('questionnaire');
    setFormData({}); // Reset form data for a new calculation
  };

  const handleCompleteQuiz = (data) => {
    setFormData(data);
    const { totalTonnes, categoryBreakdown } = calculateCarbonFootprint(data);
    setCarbonFootprint({ totalTonnes });
    setCategoryBreakdown(categoryBreakdown);
    setCurrentPage('results');
  };

  const handleRecalculate = () => {
    setCurrentPage('questionnaire');
  };

  const handleSaveResults = useCallback(async () => {
    if (!db || !userId || !carbonFootprint || !categoryBreakdown) {
      setModalContent({
        title: 'Error',
        message: 'Cannot save results. Please ensure you are logged in and have calculated a footprint.',
        showConfirm: false
      });
      setShowModal(true);
      return;
    }

    try {
      // Use addDoc to automatically generate a document ID
      const docRef = collection(db, `artifacts/${appId}/users/${userId}/carbon_footprints`);
      await setDoc(doc(docRef), { // Using doc(docRef) to create a new document with an auto-generated ID
        totalTonnes: carbonFootprint.totalTonnes,
        categoryBreakdown: categoryBreakdown,
        formData: formData, // Save the raw form data for potential future analysis
        timestamp: serverTimestamp() // Firestore server timestamp
      });
      setModalContent({
        title: 'Success!',
        message: 'Your carbon footprint has been saved to your history.',
        showConfirm: false
      });
      setShowModal(true);
    } catch (e) {
      console.error("Error adding document: ", e);
      setModalContent({
        title: 'Error',
        message: `Failed to save your footprint. Error: ${e.message}`,
        showConfirm: false
      });
      setShowModal(true);
    }
  }, [db, userId, carbonFootprint, categoryBreakdown, formData, appId]);

  const handleViewHistory = () => {
    if (!isAuthReady || !userId) {
      setModalContent({
        title: 'Authentication Required',
        message: 'Please wait a moment while we set up your session to view history. If this persists, try refreshing.',
        showConfirm: false
      });
      setShowModal(true);
      return;
    }
    setCurrentPage('history');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Show loading state while Firebase is initializing
  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-inter p-4">
        <div className="text-center text-gray-700 text-xl">
          Loading application...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-inter p-4">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
        `}
      </style>
      <div className="w-full max-w-5xl">
        <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-8">
          <h1 className="text-4xl font-extrabold text-green-700">EcoTrace</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <button
                  onClick={() => setCurrentPage('welcome')}
                  className="px-4 py-2 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={handleViewHistory}
                  className="px-4 py-2 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  My History
                </button>
              </li>
            </ul>
          </nav>
        </header>

        <main className="flex-grow flex items-center justify-center">
          {currentPage === 'welcome' && <WelcomeScreen onStart={handleStartQuiz} />}
          {currentPage === 'questionnaire' && <Questionnaire onComplete={handleCompleteQuiz} initialFormData={formData} />}
          {currentPage === 'results' && carbonFootprint && categoryBreakdown && (
            <ResultsScreen
              carbonFootprint={carbonFootprint}
              categoryBreakdown={categoryBreakdown}
              onRecalculate={handleRecalculate}
              onSaveResults={handleSaveResults}
              userId={userId}
            />
          )}
          {currentPage === 'history' && <HistoryScreen onBackToCalculator={() => setCurrentPage('welcome')} />}
        </main>
      </div>

      <Modal
        show={showModal}
        title={modalContent.title}
        message={modalContent.message}
        onClose={handleCloseModal}
        showConfirmButton={modalContent.showConfirm}
      />
    </div>
  );
};

export default function CarbonFootprintAppWrapper() {
  return (
    <FirebaseProvider>
      <App />
    </FirebaseProvider>
  );
}

