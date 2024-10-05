import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import * as BabelParser from '@babel/parser';
import Header from '../Home/Header';
import ShaderCanvas from './ShaderCanvas';

const CheckSyntaxError = () => {
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState([]);
  const [language, setLanguage] = useState('javascript');
  const [pyodide, setPyodide] = useState(null);

  useEffect(() => {
    // Initialize Pyodide for Python syntax checking
    const loadPyodide = async () => {
      if (language === 'python') {
        const pyodideInstance = await window.loadPyodide();
        setPyodide(pyodideInstance);
      }
    };
    loadPyodide();
  }, [language]);

  const handleEditorChange = (value) => {
    setCode(value);
    checkSyntax(value, language);
  };

  const checkSyntax = async (code, language) => {
    try {
      let errors = [];
      if (language === 'javascript' || language === 'typescript') {
        // JavaScript/TypeScript syntax checking
        const parserOptions = {
          sourceType: 'module',
          plugins: [
            'jsx',
            language === 'typescript' && 'typescript',
          ].filter(Boolean),
        };
  
        try {
          // Attempt to parse the code
          BabelParser.parse(code, parserOptions);
          setErrors([]); // No syntax errors
        } catch (error) {
          // Capture detailed error information
          if (error.loc) {
            const { line, column } = error.loc;
            const message = error.message.replace(/\([0-9]+:[0-9]+\)$/, ''); // Remove location from the message
            errors.push({
              line,
              column,
              message: `Syntax Error: ${message.trim()} (Line ${line}, Column ${column})`,
              suggestion: getFixSuggestion(message),
            });
          } else {
            // Handle cases where loc is not available
            errors.push({
              line: 0,
              column: 0,
              message: `Unknown Syntax Error: ${error.message}`,
              suggestion: 'Check the syntax again.',
            });
          }
          setErrors(errors);
        }
      } else if (language === 'python' && pyodide) {
        // Python syntax checking
        try {
          pyodide.runPython(code);
          setErrors([]); // No syntax errors
        } catch (error) {
          const message = error.message.includes(':') ? error.message.split(':').slice(1).join(':') : error.message;
          const line = error.traceback ? error.traceback[0].split(':')[1] : 0; // Get the line number from the traceback if available
          errors.push({ line, message: `Python Error: ${message}` });
          setErrors(errors);
        }
      } else if (language === 'java') {
        // Java syntax checking using Jdoodle API
        const response = await axios.post('https://api.jdoodle.com/v1/execute', {
          script: code,
          language: 'java',
          versionIndex: '0',
          clientId: 'your-client-id',
          clientSecret: 'your-client-secret'
        });
        if (response.data.output.includes('error')) {
          setErrors([{ line: 0, message: `Java Error: ${response.data.output}` }]);
        } else {
          setErrors([]); // No syntax errors
        }
      }
    } catch (error) {
      setErrors([{ line: 0, message: `Error during syntax checking: ${error.message}` }]);
    }
  };
  
  const getFixSuggestion = (message) => {
    // Return basic suggestions based on common error messages
    if (message.includes('Unexpected token')) {
      return 'Check for missing or extra characters like brackets, commas, or parentheses.';
    }
    if (message.includes('Unexpected end of input')) {
      return 'Make sure all code blocks are properly closed with braces or parentheses.';
    }
    return 'Refer to the code syntax and ensure it follows JavaScript/TypeScript standards.';
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setCode('');
    setErrors([]);
  };

  return (
    <div className="min-h-screen text-gray-100 flex flex-col">
      <ShaderCanvas/>
      <Header />
      {/* Main Content */}
      <main className="flex-grow p-6 flex flex-col">
        <h1 className="text-4xl font-extrabold text-gray-100 mb-6">Check Syntax Error Page</h1>

        <div className="mb-4">
          <label htmlFor="language" className="mr-2 text-lg font-semibold">Choose Language:</label>
          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}
            className="p-2 border border-gray-600 rounded-lg shadow-md bg-gray-800 text-gray-100"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>

        <div className="w-full max-w-5xl bg-gray-900 p-6 rounded-lg shadow-xl border border-gray-700">
          <Editor
            height="400px"
            defaultLanguage={language}
            defaultValue="// Paste your code here"
            value={code}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              fontSize: 16,
              lineNumbers: 'on',
              renderWhitespace: 'all',
              overviewRulerLanes: 2,
              tabSize: 4,
            }}
          />
        </div>

        {errors.length > 0 && (
          <div className="mt-6 p-4 bg-red-800 text-red-100 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold">Syntax Error</h2>
            {errors.map((error, index) => (
              <div key={index} className="mb-2">
                <p>
                  <strong>Line {error.line}, Column {error.column}:</strong> {error.message}
                </p>
                <p>
                  <em>Suggestion: {error.suggestion}</em>
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CheckSyntaxError;
