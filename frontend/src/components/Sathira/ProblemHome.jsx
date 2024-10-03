import React, { useEffect, useState } from 'react';
import axios from 'axios';
import parse from 'html-react-parser';
import { useNavigate } from 'react-router-dom';

const ProblemHome = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [newReply, setNewReply] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/problems', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProblems(response.data);
        setFilteredProblems(response.data); // Set initial filtered problems to all problems

        const commentsPromises = response.data.map(problem =>
          axios.get(`http://localhost:8000/api/problems/${problem._id}/comments`, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(err => {
            console.error(`Failed to fetch comments for problem ${problem._id}:`, err);
            return { data: [] };
          })
        );

        const commentsResponses = await Promise.all(commentsPromises);
        const commentsData = commentsResponses.reduce((acc, cur, idx) => {
          acc[response.data[idx]._id] = cur.data;
          return acc;
        }, {});
        setComments(commentsData);

      } catch (err) {
        console.error('Failed to fetch problems:', err);
        setError('Failed to fetch problems');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  useEffect(() => {
    const filtered = problems.filter(problem => 
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      problem.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProblems(filtered);
  }, [searchQuery, problems]);

  const handleAddComment = async (problemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8000/api/problems/${problemId}/comments`, { text: newComment[problemId] }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments(prev => ({
        ...prev,
        [problemId]: [...(prev[problemId] || []), { text: newComment[problemId] }]
      }));

      setNewComment(prev => ({ ...prev, [problemId]: '' }));
    } catch (err) {
      console.error('Failed to add comment:', err);
      setError('Failed to add comment');
    }
  };

  const handleAddReply = async (commentId, problemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8000/api/comments/${commentId}/replies`, { text: newReply[commentId] }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments(prev => ({
        ...prev,
        [problemId]: prev[problemId].map(comment =>
          comment._id === commentId
            ? { ...comment, replies: [...(comment.replies || []), { text: newReply[commentId] }] }
            : comment
        )
      }));

      setNewReply(prev => ({ ...prev, [commentId]: '' }));
    } catch (err) {
      console.error('Failed to add reply:', err);
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

  const handleCommentChange = (problemId, e) => {
    setNewComment(prev => ({ ...prev, [problemId]: e.target.value }));
  };

  const handleReplyChange = (commentId, e) => {
    setNewReply(prev => ({ ...prev, [commentId]: e.target.value }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token or user data from local storage
    navigate('/'); // Redirect to the login page
  };

  if (loading) return <p className="text-center text-lg text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6 shadow-lg">
        <nav className="container mx-auto flex items-center justify-between">
          <div className="text-2xl font-extrabold">
            <a href="/home">MyApp</a>
          </div>
          <div className="space-x-6 flex items-center">
            <a href="/home" className="flex items-center space-x-1 hover:bg-blue-700 p-3 rounded-lg transition-colors">
              Home
            </a>
            <a href="/syntax" className="flex items-center space-x-1 hover:bg-blue-700 p-3 rounded-lg transition-colors">
            Check Syntax Error Page
            </a>
            <a href="/profile" className="flex items-center space-x-1 hover:bg-blue-700 p-3 rounded-lg transition-colors">
              Profile
            </a>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      <main className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-5xl font-extrabold mb-6 text-gray-900">Problems</h1>

        {/* Search Bar */}
        <div className="mb-6 w-full max-w-3xl">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search problems by title or description..."
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-500 shadow-md"
          />
        </div>

        <div className="mb-6">
          <a href="/add-problem" className="bg-teal-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-teal-600 transition-colors">
            Add Problem
          </a>
        </div>
        
        {filteredProblems.length === 0 ? (
          <p className="text-gray-600">No problems available</p>
        ) : (
          <ul className="space-y-8 w-full max-w-3xl">
            {filteredProblems.map(problem => (
              <li key={problem._id} className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">{problem.title}</h2>
                <div className="mb-4">{renderContent(problem.description)}</div>

                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Comments:</h3>
                <ul className="space-y-4">
                  {(comments[problem._id] || []).map(comment => (
                    <li key={comment._id} className="border border-gray-300 p-6 rounded-lg bg-gray-50 shadow-md">
                      <p className="text-gray-800 mb-4">{comment.text}</p>
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-800">Replies:</h4>
                        <ul className="space-y-2 mt-2">
                          {(comment.replies || []).map(reply => (
                            <li key={reply._id} className="border border-gray-200 p-4 rounded-lg bg-gray-100 shadow-sm">
                              <p className="text-gray-700">{reply.text}</p>
                            </li>
                          ))}
                        </ul>
                        <textarea
                          value={newReply[comment._id] || ''}
                          onChange={(e) => handleReplyChange(comment._id, e)}
                          className="w-full p-3 border border-gray-300 rounded-lg mt-4 mb-2 text-gray-700 placeholder-gray-500"
                          rows="3"
                          placeholder="Add a reply..."
                        />
                        <button
                          onClick={() => handleAddReply(comment._id, problem._id)}
                          className="bg-teal-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-600 transition-colors text-sm"
                        >
                          Reply
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <textarea
                  value={newComment[problem._id] || ''}
                  onChange={(e) => handleCommentChange(problem._id, e)}
                  className="w-full p-3 border border-gray-300 rounded-lg mt-6 mb-4 text-gray-700 placeholder-gray-500"
                  rows="4"
                  placeholder="Add a comment..."
                />
                <button
                  onClick={() => handleAddComment(problem._id)}
                  className="bg-teal-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-teal-600 transition-colors"
                >
                  Comment
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default ProblemHome;
