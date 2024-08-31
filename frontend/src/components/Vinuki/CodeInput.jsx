
import React from 'react';
import { useState } from 'react';


function CodeInput({ onAnalyze }) {

  const [code, setCode] = useState('');

  const handleAnalyze = () => {
    onAnalyze(code);
  };
  
  return (
    <div className="card shadow-sm">

      <div className="card-header bg-primary text-white">Code Input Area</div>
      
      <div className="card-body">
        
        <textarea
          className="form-control"
          rows="15"
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        ></textarea>

        <button className="btn btn-primary mt-2" onClick={handleAnalyze}>
          Analyze Code
        </button>

      </div>
    </div>
  );
}

export default CodeInput;
