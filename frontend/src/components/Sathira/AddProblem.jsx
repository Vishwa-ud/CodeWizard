import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import 'prismjs/themes/prism-tomorrow.css'; // Import Prism styles
import 'highlight.js/styles/github.css'; // Import highlight.js styles
import hljs from 'highlight.js';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode to decode token
import Header from '../Home/Header';

// Ensure Quill uses highlight.js for code syntax highlighting
const modules = {
  syntax: {
    highlight: (text) => hljs.highlightAuto(text).value,
  },
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }],
    [{ 'font': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline'],
    ['link'],
    [{ 'align': [] }],
    ['code-block'],
  ],
};

const AddProblem = () => {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode(token); // Decoding token to get email
      const email = decoded.email; // Directly access the email field

      await axios.post('http://localhost:8000/api/problems', { 
        title: topic, 
        description, 
        email // Include email in the request payload
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/home');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Header />
      <main className="container mx-auto max-w-2xl bg-white p-8 mt-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Add a New Problem</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="topic">
              Problem Topic
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter problem topic"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="description">
              Problem Description
            </label>
            <ReactQuill
              value={description}
              onChange={handleDescriptionChange}
              theme="snow"
              modules={modules}
              className="h-64"
            />
          </div>
          <button
            type="submit"
            className="bg-teal-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-teal-600 transition-colors"
          >
            Submit
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddProblem;
