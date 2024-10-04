import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const jobPositions = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Scientist',
  'UI/UX Designer'
];

const technologiesList = [
  'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js',
  'Python', 'Django', 'Flask', 'Ruby on Rails', 'Java', 'Spring Boot',
  'SQL', 'NoSQL', 'Docker', 'Kubernetes', 'AWS', 'Azure'
];

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/register', {
        username,
        email,
        jobPosition,
        technologies: selectedTechnologies,
        password
      });
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleTechnologyChange = (e) => {
    const { value, checked } = e.target;
    setSelectedTechnologies(prevState => 
      checked 
        ? [...prevState, value] 
        : prevState.filter(tech => tech !== value)
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-200 to-gray-300">

      <main className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="max-w-lg w-full p-8 bg-white shadow-lg rounded-lg border border-gray-300">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Register</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-5">
              <label htmlFor="username" className="block text-gray-700 text-sm font-semibold mb-2">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div className="mb-5">
              <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div className="mb-5">
              <label htmlFor="jobPosition" className="block text-gray-700 text-sm font-semibold mb-2">Job Position</label>
              <select
                id="jobPosition"
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="" disabled>Select your job position</option>
                {jobPositions.map((position, index) => (
                  <option key={index} value={position}>{position}</option>
                ))}
              </select>
            </div>
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Technologies</label>
              <div className="flex flex-wrap gap-4">
                {technologiesList.map((tech, index) => (
                  <label key={index} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={tech}
                      checked={selectedTechnologies.includes(tech)}
                      onChange={handleTechnologyChange}
                      className="form-checkbox h-5 w-5 text-purple-500"
                    />
                    <span className="ml-2 text-gray-700">{tech}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <button type="submit" className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-md hover:bg-gradient-to-l transition duration-300">
              Register
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Register;
