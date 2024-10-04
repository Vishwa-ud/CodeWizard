import React, { useEffect, useState } from 'react';
import axios from 'axios';
import parse from 'html-react-parser';
import { useNavigate } from 'react-router-dom';
import Header from '../Home/Header';

const ProblemHome = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [newReply, setNewReply] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
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

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Set the appropriate class for dark or light mode
  const themeClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900'; // Define text color based on theme
  const commentBgColor = isDarkMode ? 'bg-gray-800' : 'bg-gray-50'; // Background color for comments
  const commentTextColor = isDarkMode ? 'text-gray-200' : 'text-gray-800'; // Text color for comments
  const replyBgColor = isDarkMode ? 'bg-gray-700' : 'bg-gray-50'; // Background color for replies
  const replyTextColor = isDarkMode ? 'text-gray-300' : 'text-gray-800'; // Text color for replies

  if (loading) return <p className="text-center text-lg text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className={`min-h-screen ${themeClass}`}>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className={`text-5xl font-extrabold mb-6 ${textColor}`}>Problems</h1>

        {/* Dark Mode Toggle Switch */}
        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <span className={`mr-2 ${textColor}`}>Light Mode</span>
            <div className="relative">
              <input 
                type="checkbox" 
                checked={isDarkMode} 
                onChange={toggleDarkMode} 
                className="hidden"
              />
              <div className="toggle-bg bg-gray-300 w-14 h-8 rounded-full shadow-inner"></div>
              <div className={`toggle-dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
            <span className={`ml-2 ${textColor}`}>Dark Mode</span>
          </label>
        </div>

        {/* Search Bar */}
        <div className="mb-6 w-full max-w-3xl">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search problems by title or description..."
            className={`w-full p-3 border border-gray-300 rounded-lg ${textColor} placeholder-gray-500 shadow-md`}
          />
        </div>

        <div className="mb-6">
          <a href="/add-problem" className="bg-teal-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-teal-600 transition-colors">
            Add Problem
          </a>
        </div>
        
        {filteredProblems.length === 0 ? (
          <p className={`text-gray-600 ${textColor}`}>No problems available</p>
        ) : (
          <ul className="space-y-8 w-full max-w-3xl">
            {filteredProblems.map(problem => (
              <li key={problem._id} className={`p-8 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-3xl font-bold mb-4 ${textColor}`}>{problem.title}</h2>
                <div className={`mb-4 ${textColor}`}>{renderContent(problem.description)}</div>

                <h3 className={`text-2xl font-semibold mb-4 ${textColor}`}>Comments:</h3>
                <ul className="space-y-4">
                  {comments[problem._id]?.map(comment => (
                    <li key={comment._id} className={`p-4 rounded-lg shadow-md ${commentBgColor}`}>
                      <span className={`${commentTextColor}`}>{comment.text}</span>
                      <div className="mt-2">
                        <h4 className={`text-lg font-semibold ${textColor}`}>Replies:</h4>
                        <ul className="space-y-2">
                          {comment.replies?.map(reply => (
                            <li key={reply._id} className={`p-2 rounded-lg ${replyBgColor}`}>
                              <span className={`${replyTextColor}`}>{reply.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <input
                        type="text"
                        value={newReply[comment._id] || ''}
                        onChange={(e) => handleReplyChange(comment._id, e)}
                        placeholder="Write a reply..."
                        className={`mt-2 w-full p-2 border border-gray-300 rounded-lg ${textColor} placeholder-gray-500 shadow-md`}
                      />
                      <button
                        onClick={() => handleAddReply(comment._id, problem._id)}
                        className="bg-teal-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-600 transition-colors mt-2"
                      >
                        Reply
                      </button>
                    </li>
                  ))}
                </ul>

                <input
                  type="text"
                  value={newComment[problem._id] || ''}
                  onChange={(e) => handleCommentChange(problem._id, e)}
                  placeholder="Write a comment..."
                  className={`mt-4 w-full p-2 border border-gray-300 rounded-lg ${textColor} placeholder-gray-500 shadow-md`}
                />
                <button
                  onClick={() => handleAddComment(problem._id)}
                  className="bg-teal-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-600 transition-colors mt-2"
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
