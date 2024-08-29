import { useState } from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';

function BasicUI() {
  const [codeSnippet, setCodeSnippet] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [flowchartData, setFlowchartData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setFlowchartData(null);

    if (!codeSnippet.trim()) {
      setError('Please paste a code snippet before submitting.');
      return;
    }

    if (!isValidPythonCode(codeSnippet)) {
      setError('Invalid Python code snippet. Please ensure the code is correctly formatted.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/generate-flowchart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: codeSnippet, language: 'python' }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Validate response structure
      if (!Array.isArray(data.edges) || !Array.isArray(data.nodes)) {
        throw new Error('Invalid flowchart data received from the server.');
      }

      // Ensure each node has required properties
      data.nodes.forEach((node) => {
        if (!node.id || !node.data.label) {
          throw new Error('Each node must have an id and label.');
        }
      });

      // Ensure each edge has source and target
      data.edges.forEach((edge) => {
        if (!edge.source || !edge.target) {
          throw new Error('Each edge must have source and target.');
        }
      });

      setFlowchartData(data); // Set flowchart data
      setSuccess(true);
    } catch (error) {
      setError(error.message || 'Server error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const isValidPythonCode = (code) => {
    // Basic regex to validate Python code structure
    const regex = /^(def\s+\w+\(.*\):|^\s*if\s+.*:|^\s*else:|^\s*for\s+.*:|^\s*return\s+.*|^\s*print\(.*\))/m;
    return regex.test(code);
  };

  const handleQuickPaste = () => {
    setCodeSnippet(`def example():
  print("This is a quick-paste example!")`);
  };

  return (
    <section className="text-gray-400 bg-gray-900 body-font relative">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-12">
          <h1 className="sm:text-4xl text-3xl font-medium title-font mb-4 text-white">Code to Flowchart</h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Submit your code snippet below to convert it into a flowchart.</p>
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
                onClick={handleQuickPaste}
                className="mt-2 text-indigo-500 hover:text-indigo-300 text-sm"
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
            {success && !loading && (
              <div className="p-2 w-full text-center">
                <p className="text-green-500">Code snippet submitted successfully!</p>
              </div>
            )}
          </form>
          {flowchartData && (
            <div className="p-2 w-full mt-12">
              <h2 className="text-2xl font-medium text-white mb-4">Generated Flowchart</h2>
              <div style={{ height: '500px' }}>
                <ReactFlow
                  nodes={flowchartData.nodes.map((node) => ({
                    ...node,
                    position: node.position || { x: 0, y: 0 }, // Ensure position exists
                  }))}
                  edges={flowchartData.edges}
                  fitView
                >
                  <MiniMap />
                  <Controls />
                  <Background />
                </ReactFlow>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default BasicUI;
