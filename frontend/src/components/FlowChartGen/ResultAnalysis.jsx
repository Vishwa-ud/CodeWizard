// ResultAnalysis.jsx
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

function ResultAnalysis({ analysisResult, onGenerateFlowchart }) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-medium text-white mb-4 text-center">Analysis Results</h2>

      <motion.div className="grid grid-cols-1 gap-6">
        {/* Imports */}
        {analysisResult.imports.length > 0 && (
          <motion.div
            className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-md shadow-lg border border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-white mb-2">Imports</h3>
            <pre className="whitespace-pre-wrap text-white overflow-auto">{analysisResult.imports.join(', ')}</pre>
          </motion.div>
        )}

        {/* Functions */}
        {Object.keys(analysisResult.functions).map((name, index) => (
          <motion.div
            key={index}
            className="bg-blue-800 bg-opacity-20 p-6 rounded-lg backdrop-blur-md shadow-lg border border-blue-500 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-white mb-2">{name}</h3>
            <div className="flex">
              <pre className="whitespace-pre-wrap text-white overflow-auto flex-grow">
                {analysisResult.functions[name]}
              </pre>
              <button
                className="bg-indigo-600 hover:bg-indigo-400 text-white py-2 px-4 mt-4 rounded absolute right-6 bottom-6"
                onClick={() => onGenerateFlowchart(name)}
              >
                Generate Flowchart
              </button>
            </div>
          </motion.div>
        ))}

        {/* Errors */}
        {analysisResult.errors.length > 0 && (
          <motion.div
            className="bg-red-800 bg-opacity-20 p-6 rounded-lg backdrop-blur-md shadow-lg border border-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-white mb-2">Errors</h3>
            {analysisResult.errors.map((err, index) => (
              <pre key={index} className="whitespace-pre-wrap text-white overflow-auto">{err}</pre>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

ResultAnalysis.propTypes = {
  analysisResult: PropTypes.object.isRequired,
  onGenerateFlowchart: PropTypes.func.isRequired,
};

export default ResultAnalysis;
