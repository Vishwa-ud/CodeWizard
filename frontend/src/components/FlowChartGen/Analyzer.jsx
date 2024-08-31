import { useState } from 'react';
import axios from 'axios';

function Analyzer() {
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

      if (data.analysis_report_html !== undefined && data.analysis_report_txt !== undefined) {
        setAnalysisResult(data);
      } else {
        setError('Invalid analysis data received from the server.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="text-gray-400 bg-gray-900 body-font relative">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-12">
          <h1 className="sm:text-4xl text-3xl font-medium title-font mb-4 text-white">Code Analyzer</h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Submit your code snippet below to get insights about the code.</p>
        </div>
        <div className="lg:w-1/2 md:w-2/3 mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-wrap -m-2">
            <div className="p-2 w-full">
              <div className="relative">
                <label htmlFor="codeSnippet" className="leading-7 text-sm text-gray-400">Code Snippet</label>
                <textarea
                  id="codeSnippet"
                  name="codeSnippet"
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  className="w-full bg-gray-800 bg-opacity-50 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 h-32 text-base outline-none text-white py-2 px-4 resize-none leading-6 transition-colors duration-200 ease-in-out"
                />
              </div>
              <button
                type="button"
                className="mt-2 text-indigo-500 hover:text-indigo-300 text-sm"
                onClick={() => setCodeSnippet(`def example():\n  if True:\n    print("This is a quick-paste example!")\n  else:\n    print("Alternative path")`)}
              >
                Quick Paste Example
              </button>
            </div>
            <div className="p-2 w-full">
              <button
                type="submit"
                className="flex mx-auto text-white bg-indigo-600 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-500 rounded text-lg"
              >
                Submit
              </button>
            </div>
            {loading && (
              <div className="p-2 w-full text-center">
                <p className="text-gray-500">Submitting your code snippet...</p>
              </div>
            )}
            {error && (
              <div className="p-2 w-full text-center">
                <p className="text-red-500">{error}</p>
              </div>
            )}
          </form>
          {analysisResult && (
            <div className="p-2 w-full mt-12">
              <h2 className="text-2xl font-medium text-white mb-4">Analysis Results</h2>
              <div className="bg-gray-800 p-4 rounded">
                <p className="text-white"><strong>Number of Functions:</strong> {analysisResult.analysis_report_txt}</p>
                <p className="text-white"><strong>Number of Lines:</strong> {analysisResult.analysis_report_html}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Analyzer;
