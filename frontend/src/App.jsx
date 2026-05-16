import React, { useState } from 'react';
import axios from 'axios';
import CustomerForm from './components/CustomerForm';
import PredictionResults from './components/PredictionResults';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';


const App = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (customerData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Assuming FastAPI backend is running on port 8000
      const response = await axios.post(`${API_URL}/predict`, customerData);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to connect to the prediction server. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header fade-in">
        <h1>Bank Churn Intelligence</h1>
        <p>Advanced Machine Learning Customer Retention Platform</p>
      </header>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(226, 75, 74, 0.1)', border: '1px solid #E24B4A', color: '#E24B4A', borderRadius: '10px', marginBottom: '2rem', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <main className="main-content">
        <CustomerForm onSubmit={handlePredict} isLoading={isLoading} />
        <PredictionResults result={result} />
      </main>
    </div>
  );
};

export default App;
