
import React from 'react';
import { useState } from 'react';
import axios from 'axios';

import CodeInput from './CodeInput';
import RightPanel from './RightPanel.jsx';
import ResultWindow from './ResultWindow.jsx';

//import MetricsReport from './MetricsReport'; 

function CodeAnalysisPage() {
  const [metrics, setMetrics] = useState(null); // state to store analysis results
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to handle analysis
  const handleAnalyze = async (code) => {
    setLoading(true);
    setError('');
    
    try {
      // Call backend API to analyze the code
      const response = await axios.post('http://localhost:5000/analyze', { code });
      setMetrics(response.data);

    } catch (err) {
      setError('Failed to fetch analysis results. Please try again.');
    
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        
        {/* input area */}
        <div className="col-md-8 p-3">
          <CodeInput onAnalyze={handleAnalyze} />
        </div>

        {/* side Panel for options */}
        <div className="col-md-4 p-3">
          <RightPanel
            onGenerateReport={() => handleAnalyze()} // Trigger analysis
          />
        
        </div>
      </div>

      {/* display Metrics Report */}
      {metrics && (
        <div className="row mt-3">
          <div className="col-12 p-3">
            <MetricsReport metrics={metrics} />
          </div>
        </div>
      )}

      {/* display Loading or Error */}
      <ResultWindow loading={loading} error={error} />
    </div>
  );
}

export default CodeAnalysisPage;
