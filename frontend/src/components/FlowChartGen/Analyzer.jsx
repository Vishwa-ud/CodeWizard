// Analyzer.jsx
import { useState } from 'react';
import axios from 'axios';
import Header from '../Home/Header';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';
import * as reactSpring from '@react-spring/three';
import * as drei from '@react-three/drei';
import * as fiber from '@react-three/fiber';
import { useScroll, useTransform } from 'framer-motion';

function Analyzer() {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 500], [1, 3]); // Adjust the scale range if needed

  const [codeSnippet, setCodeSnippet] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

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
      const response = await axios.post('http://127.0.0.1:5000/analyze-code', {
        code: codeSnippet,
      });

      const data = response.data;

      if (data.analysis_report_html) {
        setAnalysisResult(data);
      } else {
        setError('Invalid analysis data received from the server.');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response?.data?.error || 'Server error occurred. Please try again later.');
      } else if (err.request) {
        setError('Network error: Failed to make the request. Please check your connection.');
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header p={true} />

      <ShaderGradientCanvas
        importedFiber={{ ...fiber, ...drei, ...reactSpring }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <ShaderGradient
          control="query"
          urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=0.9&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=80&cameraZoom=9.1&color1=%23606080&color2=%238d7dca&color3=%23212121&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.15&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.5&uFrequency=0&uSpeed=0.3&uStrength=1.5&uTime=8&wireframe=false"
        />
      </ShaderGradientCanvas>

      <section className="text-gray-400 bg-transparent body-font relative">
        <div className="container px-5 py-24 mx-auto">
          {/* Header Section */}
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-4xl text-3xl font-medium title-font mb-4 text-white">Code Analyzer</h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Submit your code snippet below to get insights about the code.
            </p>
          </div>

          {/* Form Section */}
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-wrap -m-2">
              {/* Code Snippet Input */}
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="codeSnippet" className="leading-7 text-sm text-gray-400">
                    Code Snippet
                  </label>
                  <textarea
                    id="codeSnippet"
                    name="codeSnippet"
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    className="w-full bg-gray-800 bg-opacity-50 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 h-40 text-base outline-none text-white py-2 px-4 resize-none leading-6 transition-colors duration-200 ease-in-out"
                    placeholder="Paste your code here..."
                  />
                </div>
                <button
                  type="button"
                  className="mt-2 text-indigo-500 hover:text-indigo-300 text-sm"
                  onClick={() =>
                    setCodeSnippet(
                      `def example():\n  if True:\n    print("This is a quick-paste example!")\n  else:\n    print("Alternative path")`
                    )
                  }
                >
                  Quick Paste Example
                </button>
              </div>

              {/* Submit Button */}
              <div className="p-2 w-full">
                <button
                  type="submit"
                  className="flex mx-auto text-white bg-indigo-600 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-500 rounded text-lg"
                >
                  Submit
                </button>
              </div>

              {/* Loading Indicator */}
              {loading && (
                <div className="p-2 w-full text-center">
                  <p className="text-gray-500">Submitting your code snippet...</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-2 w-full text-center">
                  <p className="text-red-500">{error}</p>
                </div>
              )}
            </form>

            {/* Analysis Result Section */}
            {analysisResult && (
              <div className="p-2 w-full mt-12">
                <h2 className="text-2xl font-medium text-white mb-4">Analysis Results</h2>
                <div
                  className="bg-gray-800 p-6 rounded overflow-auto max-h-[90vh] prose prose-invert break-words"
                  style={{ whiteSpace: 'pre-wrap', maxWidth: '100%' }}
                  dangerouslySetInnerHTML={{ __html: analysisResult.analysis_report_html }}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Analyzer;
