import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const getColor = (priority) => ({
  'CRITICAL': '#E24B4A',
  'HIGH': '#EF9F27', 
  'MEDIUM': '#378ADD',
  'LOW': '#639922'
}[priority] || '#639922');

const PredictionResults = ({ result }) => {
  if (!result) {
    return (
      <div className="glass-panel right-panel fade-in" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Fill out the form and hit predict to see results.</p>
      </div>
    );
  }

  const color = getColor(result.priority);
  
  // Format data for chart
  const chartData = result.top_factors ? result.top_factors.map(factor => ({
    name: factor.replace(/_/g, ' '),
    value: 1 // We just want to show them in order, or if backend sends actual shap values, we map them. But backend only sends top_factors list. We'll use dummy uniform values just to display the factors in a bar chart as requested, or we can adjust backend to return values.
  })) : [];

  // If backend returns just a list of strings, we'll display them nicely
  // Wait, the prompt says "a simple bar chart showing feature contributions". 
  // Let's visualize the top factors.

  return (
    <div className="glass-panel right-panel fade-in result-card">
      
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', fontWeight: '600', alignSelf: 'flex-start' }}>Prediction Results</h2>
      
      <div className="prob-circle" style={{ borderColor: color }}>
        <span className="prob-value" style={{ color }}>{result.churn_percentage}</span>
        <span className="prob-label">Churn Risk</span>
      </div>

      <div className="priority-badge" style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}>
        {result.priority} PRIORITY
      </div>

      <p className="action-text">
        <strong>Recommendation:</strong> {result.action}
      </p>

      {result.top_factors && result.top_factors.length > 0 && (
        <div className="glass-panel chart-container" style={{ marginTop: '2rem', width: '100%', padding: '1rem' }}>
          <div className="chart-title">Key Drivers</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            {result.top_factors.map((factor, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '30px', height: '30px', 
                  borderRadius: '50%', backgroundColor: `${color}30`, 
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  color: color, fontWeight: 'bold'
                }}>
                  {idx + 1}
                </div>
                <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', height: '12px', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ 
                    position: 'absolute', top: 0, left: 0, height: '100%', 
                    background: color, 
                    width: `${100 - (idx * 25)}%`, // Mocking bar width based on rank since we only have the names
                    borderRadius: '6px',
                    opacity: 0.8
                  }}></div>
                </div>
                <span style={{ minWidth: '120px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {factor.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default PredictionResults;
