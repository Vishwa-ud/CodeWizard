import { useState } from 'react';

function BasicUI() {
  const [codeSnippet, setCodeSnippet] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!codeSnippet.trim()) {
      setError('Please paste a code snippet before submitting.');
      return;
    }

    if (!isValidCodeSnippet(codeSnippet)) {
      setError('Invalid code snippet. Please check your code and try again.');
      return;
    }

    setLoading(true);

    // Simulating an API call with a delay
    setTimeout(() => {
      setLoading(false);

      // Simulate random server error
      if (Math.random() > 0.8) {
        setError('Server error occurred. Please try again later.');
      } else {
        setSuccess(true);
      }
    }, 2000);
  };

  const isValidCodeSnippet = (code) => {
    // Basic validation to check if the snippet is a valid code (e.g., contains at least a few non-whitespace characters and common code syntax characters)
    return /\S/.test(code) && /[\{\}\(\);=]/.test(code);
  };

  const handleQuickPaste = () => {
    setCodeSnippet(`function example() {
  console.log('This is a quick-paste example!');
}`);
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
            {success && (
              <div className="p-2 w-full text-center">
                <p className="text-green-500">Code snippet submitted successfully!</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default BasicUI;
