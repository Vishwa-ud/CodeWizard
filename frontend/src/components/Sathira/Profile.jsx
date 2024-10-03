import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Modal from 'react-modal';
import parse from 'html-react-parser';
import { getToken } from '../utils/auth';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import hljs from 'highlight.js';

// Modal settings
Modal.setAppElement('#root');

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

const Profile = () => {
  const [user, setUser] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ title: '', description: '' });
  const [selectedComment, setSelectedComment] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const fetchUserAndProblems = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error('No token found');

        const decoded = jwtDecode(token);
        const email = encodeURIComponent(decoded.email);

        const userResponse = await axios.get(`http://localhost:8000/api/user/${email}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userResponse.data);

        const problemsResponse = await axios.get(`http://localhost:8000/api/problems/email/${email}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Fetch comments for each problem
        const commentsPromises = problemsResponse.data.map(problem =>
          axios.get(`http://localhost:8000/api/problems/${problem._id}/comments`, {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => ({ data: [] })) // Handle errors with empty comments
        );

        const commentsResponses = await Promise.all(commentsPromises);
        const problemsWithComments = problemsResponse.data.map((problem, index) => ({
          ...problem,
          comments: commentsResponses[index].data || [] // Ensure comments are always an array
        }));

        setProblems(problemsWithComments);

      } catch (err) {
        console.error(err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndProblems();
  }, []);

  const openUpdateModal = (problem) => {
    setSelectedProblem(problem);
    setFormValues({ title: problem.title, description: problem.description });
    setIsModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsModalOpen(false);
    setSelectedProblem(null);
  };

  const openConfirmModal = (problem) => {
    setSelectedProblem(problem);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedProblem(null);
  };

  const openReplyModal = (comment) => {
    setSelectedComment(comment);
    setReplyText('');
  };

  const closeReplyModal = () => {
    setSelectedComment(null);
    setReplyText('');
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const token = getToken();
      if (!token) throw new Error('No token found');

      await axios.put(`http://localhost:8000/api/problems/${selectedProblem._id}`, formValues, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProblems(problems.map(p => p._id === selectedProblem._id ? { ...p, ...formValues } : p));
      closeUpdateModal();
    } catch (err) {
      console.error(err);
      setError('Failed to update problem');
    }
  };

  const handleDelete = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error('No token found');

      await axios.delete(`http://localhost:8000/api/problems/${selectedProblem._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProblems(problems.filter(p => p._id !== selectedProblem._id));
      closeConfirmModal();
    } catch (err) {
      console.error(err);
      setError('Failed to delete problem');
    }
  };

  const handleChange = (value) => {
    setFormValues({ ...formValues, description: value });
  };

  const handleReplyChange = (e) => {
    setReplyText(e.target.value);
  };

  const handleAddReply = async (commentId) => {
    try {
      const token = getToken();
      if (!token) throw new Error('No token found');

      await axios.post(`http://localhost:8000/api/comments/${commentId}/replies`, { text: replyText }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update comments with new reply
      setProblems(problems.map(problem => ({
        ...problem,
        comments: problem.comments.map(comment => 
          comment._id === commentId
            ? { ...comment, replies: [...(comment.replies || []), { text: replyText }] }
            : comment
        )
      })));
      closeReplyModal();
    } catch (err) {
      console.error(err);
      setError('Failed to add reply');
    }
  };

  const renderContent = (html) => {
    return parse(html, {
      replace: (domNode) => {
        if (domNode.name === 'code') {
          return (
            <pre className="bg-gray-200 p-4 rounded-lg">
              <code>{domNode.children[0]?.data || ''}</code>
            </pre>
          );
        }
        // Add other replacements as needed
      }
    });
  };

  if (loading) return <p className="text-center py-6">Loading...</p>;
  if (error) return <p className="text-center py-6 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6 shadow-lg mb-6 rounded-lg">
        <nav className="container mx-auto flex items-center justify-between">
          <div className="text-2xl font-extrabold">
            <a href="/home">MyApp</a>
          </div>
          <div className="space-x-6 flex items-center">
            <a href="/home" className="flex items-center space-x-1 hover:bg-blue-700 p-3 rounded-lg transition-colors">
              Home
            </a>
            <a href="/profile" className="flex items-center space-x-1 hover:bg-blue-700 p-3 rounded-lg transition-colors">
              Profile
            </a>
          </div>
        </nav>
      </header>

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md mb-8">
        <div className="flex items-center mb-6">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile Avatar"
            className="w-24 h-24 rounded-full border-4 border-teal-500 mr-6"
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">{user ? user.username : 'Loading...'}</h1>
            <p className="text-lg text-gray-600">{user ? user.email : ''}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Job Position</h2>
          <p className="text-lg text-gray-700">{user ? user.jobPosition : ''}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Technologies</h2>
          <p className="text-lg text-gray-700">{user ? (Array.isArray(user.technologies) ? user.technologies.join(', ') : 'No technologies listed') : ''}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Problems Added</h2>
        {problems.length === 0 ? (
          <p className="text-lg text-gray-600">No problems added yet.</p>
        ) : (
          <ul className="space-y-4">
            {problems.map(problem => (
              <li key={problem._id} className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                <div className="mb-4">{renderContent(problem.description)}</div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-600"
                  onClick={() => openUpdateModal(problem)}
                >
                  Update
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={() => openConfirmModal(problem)}
                >
                  Delete
                </button>
                <div className="mt-4">
                  <h4 className="text-lg font-semibold">Comments</h4>
                  {problem.comments.length === 0 ? (
                    <p className="text-gray-600">No comments yet.</p>
                  ) : (
                    <ul className="space-y-2 mt-2">
                      {problem.comments.map(comment => (
                        <li key={comment._id} className="bg-gray-50 p-4 rounded-lg shadow-md">
                          <p className="text-gray-700">{comment.text}</p>
                          <button
                            className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-green-600"
                            onClick={() => openReplyModal(comment)}
                          >
                            Reply
                          </button>
                          {comment.replies && comment.replies.length > 0 && (
                            <ul className="mt-2 space-y-2">
                              {comment.replies.map((reply, index) => (
                                <li key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                  <p className="text-gray-600">{reply.text}</p>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Update Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeUpdateModal}
        contentLabel="Update Problem"
        className="fixed inset-0 flex items-center justify-center p-4 bg-gray-800 bg-opacity-50"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
          <h2 className="text-2xl font-semibold mb-4">Update Problem</h2>
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formValues.title}
                onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2" htmlFor="description">
                Description
              </label>
              <ReactQuill
                value={formValues.description}
                onChange={handleChange}
                modules={modules}
                className="border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeUpdateModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onRequestClose={closeConfirmModal}
        contentLabel="Confirm Delete"
        className="fixed inset-0 flex items-center justify-center p-4 bg-gray-800 bg-opacity-50"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-semibold mb-4">Confirm Delete</h2>
          <p className="mb-4">Are you sure you want to delete this problem?</p>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeConfirmModal}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Reply Modal */}
      <Modal
        isOpen={!!selectedComment}
        onRequestClose={closeReplyModal}
        contentLabel="Reply to Comment"
        className="fixed inset-0 flex items-center justify-center p-4 bg-gray-800 bg-opacity-50"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
          <h2 className="text-2xl font-semibold mb-4">Reply to Comment</h2>
          <textarea
            value={replyText}
            onChange={handleReplyChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            placeholder="Write your reply here..."
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeReplyModal}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => selectedComment && handleAddReply(selectedComment._id)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Reply
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
