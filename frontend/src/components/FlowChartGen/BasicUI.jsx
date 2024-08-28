import { useState } from 'react';

function BasicUI() {
  const [codeSnippet, setCodeSnippet] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Using fake api call just to test ;/
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <section className="text-gray-600 body-font relative">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-12">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Code to Flow chart</h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Submit your code snippet below.</p>
        </div>
        <div className="lg:w-1/2 md:w-2/3 mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-wrap -m-2">
            <div className="p-2 w-full">
              <div className="relative">
                <label htmlFor="codeSnippet" className="leading-7 text-sm text-gray-600">Code Snippet</label>
                <textarea
                  id="codeSnippet"
                  name="codeSnippet"
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div className="p-2 w-full">
              <button
                type="submit"
                className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
              >
                Submit
              </button>
            </div>
            {loading && (
              <div className="p-2 w-full text-center">
                <p className="text-gray-500">Submitting your code snippet...</p>
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
