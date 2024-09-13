// Analyzer.js
import { useState, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import ShaderCanvas from './ShaderCanvas';
import ResultAnalysis from './ResultAnalysis';

function Analyzer() {
  const [codeSnippet, setCodeSnippet] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const resultRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAnalysisResult(null);

    if (!codeSnippet.trim()) {
      setError('Please paste a code snippet before submitting.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:5000/detect-functions', {
        code: codeSnippet,
      });

      const data = response.data;

      setTimeout(() => {
        setLoading(false);
        if (data.functions || data.imports || data.errors) {
          setAnalysisResult(data);
          resultRef.current.scrollIntoView({ behavior: 'smooth' });
        } else {
          setError('Invalid analysis data received from the server.');
        }
      }, 2000); // Simulating 2-second loading
    } catch (err) {
      setLoading(false);
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  const handleGenerateFlowchart = (functionName) => {
    console.log(`Generating flowchart for function: ${functionName}`);
    // Implement the flowchart generation logic here
  };

  return (
    <>
      <ShaderCanvas urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=0.7&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=80&cameraZoom=9.1&color1=%23606080&color2=%238d7dca&color3=%23212121&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.15&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.5&uFrequency=0&uSpeed=0.3&uStrength=1.5&uTime=8&wireframe=false" />

      <section className="text-gray-400 bg-transparent body-font relative h-screen">
        <div className="container px-5 py-8 mx-auto flex flex-col h-full">
          <div className="flex flex-col text-center w-full mb-6">
            <h1 className="sm:text-4xl text-3xl font-medium title-font mb-4 text-white">Code Analyzer</h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Paste your code snippet below to analyze it for functions, imports, and errors.
            </p>
          </div>

          <div className="flex flex-grow flex-col lg:w-2/3 mx-auto mb-4">
            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              <div className="relative">
                <label htmlFor="codeSnippet" className="leading-7 text-sm text-gray-400">
                  Code Snippet
                </label>
                <motion.textarea
                  id="codeSnippet"
                  name="codeSnippet"
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  className="w-full bg-gray-800 bg-opacity-50 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-white py-2 px-4 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  style={{ minHeight: '50vh' }}
                />
              </div>

              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className={`${
                    !codeSnippet.trim() ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-400'
                  } text-white py-3 px-6 rounded-lg focus:outline-none transition ease-in-out duration-300`}
                  disabled={!codeSnippet.trim()}
                >
                  {loading ? 'Analyzing...' : 'Analyze Code'}
                </button>
              </div>

              {error && (
                <motion.div className="bg-red-800 text-white mt-4 py-2 px-4 rounded-lg" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  {error}
                </motion.div>
              )}
            </form>

            {loading && (
              <div className="animate-pulse flex flex-col items-center gap-4 w-60 mx-auto mt-8">
                <div className="w-48 h-6 bg-slate-400 rounded-md"></div>
                <div className="w-28 h-4 bg-slate-400 mx-auto mt-3 rounded-md"></div>
                <div className="h-7 bg-slate-400 w-full rounded-md"></div>
                <div className="h-7 bg-slate-400 w-full rounded-md"></div>
                <div className="h-7 bg-slate-400 w-1/2 rounded-md"></div>
              </div>
            )}

            {analysisResult && (
              <ResultAnalysis analysisResult={analysisResult} onGenerateFlowchart={handleGenerateFlowchart} ref={resultRef} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Analyzer;
