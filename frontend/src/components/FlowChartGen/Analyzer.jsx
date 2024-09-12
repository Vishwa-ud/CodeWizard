import { useState } from 'react';
import axios from 'axios';
import Header from '../Home/Header';
import { motion } from 'framer-motion';
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import * as reactSpring from "@react-spring/three";
import * as drei from "@react-three/drei";
import * as fiber from "@react-three/fiber";

function Analyzer() {
  const [codeSnippet, setCodeSnippet] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAnalysisResult(null);
    setShowResults(false);

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

      if (data.functions || data.imports) {
        setTimeout(() => {
          setAnalysisResult(data);
          setLoading(false);
          setShowResults(true);
        }, 2000); // 2-second delay for loading screen
      } else {
        setError('Invalid analysis data received from the server.');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred.');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <>
      <ShaderGradientCanvas
        importedFiber={{ ...fiber, ...drei, ...reactSpring }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
      >
        <ShaderGradient control="query" urlString="https://www.shadergradient.co/" />
      </ShaderGradientCanvas>
      <Header p={true} />

      <section className="text-gray-400 bg-transparent body-font relative h-screen">
        <div className="container px-5 py-8 mx-auto flex flex-col h-full">
          <div className="flex flex-col text-center w-full mb-6">
            <h1 className="sm:text-4xl text-3xl font-medium title-font mb-4 text-white">
              Code Analyzer
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Paste your code snippet below to analyze it for functions and imports.
            </p>
          </div>

          {/* Code Input Section */}
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
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className={`${!codeSnippet.trim() ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-400'} text-white py-3 px-6 rounded-lg focus:outline-none transition ease-in-out duration-300`}
                  disabled={!codeSnippet.trim()}
                >
                  {loading ? 'Analyzing...' : 'Analyze Code'}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  className="bg-red-800 text-white mt-4 py-2 px-4 rounded-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {error}
                </motion.div>
              )}
            </form>

            {/* Loading Screen */}
            {loading && (
              <div className="flex justify-center mt-12">
                <motion.div className="animate-pulse flex flex-col items-center gap-4 w-60">
                  <div>
                    <div className="w-48 h-6 bg-slate-400 rounded-md"></div>
                    <div className="w-28 h-4 bg-slate-400 mx-auto mt-3 rounded-md"></div>
                  </div>
                  <div className="h-7 bg-slate-400 w-full rounded-md"></div>
                  <div className="h-7 bg-slate-400 w-full rounded-md"></div>
                  <div className="h-7 bg-slate-400 w-full rounded-md"></div>
                  <div className="h-7 bg-slate-400 w-1/2 rounded-md"></div>
                </motion.div>
              </div>
            )}

            {/* Analysis Result Grid */}
            {showResults && analysisResult && (
              <div className="grid grid-cols-3 gap-6 mt-12 mb-8">
                {/* Map through the results and create cards for each function */}
                {Object.entries(analysisResult.functions).map(([name, code], index) => (
                  <motion.div
                    key={index}
                    className="h-[16em] w-[18em] border-2 border-[rgba(75,30,133,0.5)] rounded-[1.5em] bg-gradient-to-br from-[rgba(75,30,133,1)] to-[rgba(75,30,133,0.01)] text-white font-nunito p-[1em] flex justify-center items-left flex-col gap-[0.75em] backdrop-blur-[12px]"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }} // Load each card one by one
                  >
                    <div>
                      <h1 className="text-[2em] font-medium">{name}</h1>
                      <p className="text-[0.85em]">{code}</p>
                    </div>
                    <button className="h-fit w-fit px-[1em] py-[0.25em] border-[1px] rounded-full flex justify-center items-center gap-[0.5em] overflow-hidden group hover:translate-y-[0.125em] duration-200 backdrop-blur-[12px]">
                      <p>Generate Flowchart</p>
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Analyzer;
