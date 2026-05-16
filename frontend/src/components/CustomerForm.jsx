import React, { useState } from 'react';
import { Send } from 'lucide-react';

const CustomerForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    CreditScore: 650,
    Gender: 1, // 0=Female, 1=Male
    Age: 40,
    Tenure: 5,
    Balance: 50000,
    NumOfProducts: 2,
    HasCrCard: 1,
    IsActiveMember: 1,
    EstimatedSalary: 60000,
    Geography_Germany: 0,
    Geography_Spain: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Map select values to the expected numbers
    if (name === 'Geography') {
      setFormData(prev => ({
        ...prev,
        Geography_Germany: value === 'Germany' ? 1 : 0,
        Geography_Spain: value === 'Spain' ? 1 : 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Derived state for Geography select
  const currentGeography = formData.Geography_Germany === 1 ? 'Germany' : 
                           formData.Geography_Spain === 1 ? 'Spain' : 'France';

  return (
    <div className="glass-panel left-panel fade-in">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '600' }}>Customer Details</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label className="form-label">Credit Score</label>
          <input type="number" className="form-input" name="CreditScore" value={formData.CreditScore} onChange={handleChange} required min="300" max="850" />
        </div>

        <div className="form-group">
          <label className="form-label">Age</label>
          <input type="number" className="form-input" name="Age" value={formData.Age} onChange={handleChange} required min="18" max="100" />
        </div>

        <div className="form-group">
          <label className="form-label">Gender</label>
          <select className="form-select" name="Gender" value={formData.Gender} onChange={handleChange}>
            <option value={1}>Male</option>
            <option value={0}>Female</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Geography</label>
          <select className="form-select" name="Geography" value={currentGeography} onChange={handleChange}>
            <option value="France">France</option>
            <option value="Germany">Germany</option>
            <option value="Spain">Spain</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Tenure (Years)</label>
          <input type="number" className="form-input" name="Tenure" value={formData.Tenure} onChange={handleChange} required min="0" max="10" />
        </div>

        <div className="form-group">
          <label className="form-label">Balance ($)</label>
          <input type="number" className="form-input" name="Balance" value={formData.Balance} onChange={handleChange} required min="0" />
        </div>

        <div className="form-group">
          <label className="form-label">Number of Products</label>
          <input type="number" className="form-input" name="NumOfProducts" value={formData.NumOfProducts} onChange={handleChange} required min="1" max="4" />
        </div>

        <div className="form-group">
          <label className="form-label">Estimated Salary ($)</label>
          <input type="number" className="form-input" name="EstimatedSalary" value={formData.EstimatedSalary} onChange={handleChange} required min="0" />
        </div>

        <div className="form-group">
          <label className="form-label">Has Credit Card?</label>
          <select className="form-select" name="HasCrCard" value={formData.HasCrCard} onChange={handleChange}>
            <option value={1}>Yes</option>
            <option value={0}>No</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Active Member?</label>
          <select className="form-select" name="IsActiveMember" value={formData.IsActiveMember} onChange={handleChange}>
            <option value={1}>Yes</option>
            <option value={0}>No</option>
          </select>
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? <div className="loader"></div> : <><Send size={20} /> Predict Churn</>}
        </button>

      </form>
    </div>
  );
};

export default CustomerForm;
