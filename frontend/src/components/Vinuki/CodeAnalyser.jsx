import React, { useState } from 'react';
import CodeInput from '../../../../services/Code-Optimiser/src/components/CodeInput';
import OptimizedCode from './OptimizedCode';
import MetricsChart from '../../../../services/Code-Optimiser/src/components/MetricsChart';
import { analyzeCode } from '../../../../services/Code-Optimiser/src/utils/codeAnalysis';
import { formatCode, analyzeCodeStructure } from '../codeProcessing/codeFormatter';

const CodeAnalyzer = () => {
  const [code, setCode] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [optimizedCode, setOptimizedCode] = useState('');
  const [showOptimizedCode, setShowOptimizedCode] = useState(false);

  const handleAnalyze = async () => {
    try {
      const formattedCode = formatCode(code);
      setCode(formattedCode);

      const structureMetrics = analyzeCodeStructure(formattedCode);
      const result = await analyzeCode(formattedCode);
      setMetrics({ ...result.metrics, ...structureMetrics });
      setError(null);

      setOptimizedCode(formattedCode);
    } catch (err) {
      setError('Error analyzing code. Please try again.');
      setMetrics(null);
      setOptimizedCode('');
    }
  };

  const toggleOptimizedCode = () => setShowOptimizedCode(!showOptimizedCode);

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <CodeInput
          code={code}
          setCode={setCode}
          onAnalyze={handleAnalyze}
          showOptimizedCode={showOptimizedCode}
          optimizedCode={optimizedCode}
          toggleOptimizedCode={toggleOptimizedCode}
        />
        {showOptimizedCode && (
          <OptimizedCode
            optimizedCode={optimizedCode}
            onClose={toggleOptimizedCode}
          />
        )}
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {metrics && <MetricsChart metrics={metrics} />}
    </div>
  );
};

export default CodeAnalyzer;