import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Wizard from "../../assets/wizard.png";
import PropTypes from "prop-types";

const Header = ({ p }) => {
  const navigate = useNavigate(); // Create a navigate function
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status

  // Check for JWT token in localStorage when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token"); // Assuming your JWT is stored under 'token'
    if (token) {
      setIsLoggedIn(true); // If token exists, user is logged in
    } else {
      setIsLoggedIn(false); // If no token, user is not logged in
    }
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setIsLoggedIn(false); // Update state to reflect logged-out status
    navigate("/home"); // Optionally redirect to login page
  };

  // Function to handle Problem navigation
  const handleProblemClick = () => {
    if (isLoggedIn) {
      navigate("/problemHome"); // If logged in, navigate to problem page
    } else {
      navigate("/login"); // If not logged in, navigate to login page
    }
  };

  return (
    <header
      className={`text-gray-600 body-font backdrop-blur-sm shadow-lg ${
        p ? "bg-black" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center glass-effect">
        <a className="flex title-font font-medium items-center text-gray-200 mb-4 md:mb-0">
          <img src={Wizard} alt="wizard" className="w-10 h-10" />
          <span className="ml-3 text-xl">
            <a href="/">CodeWizard</a>
          </span>
        </a>
        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <a
            className="mr-5 text-gray-200 hover:text-blue-600 cursor-pointer"
            onClick={() => {
              navigate("/taskmanagement");
            }}
          >
            Task Board
          </a>
          <a
            className="mr-5 text-gray-200 hover:text-blue-600 cursor-pointer"
            href="/gen2"
          >
            Python Code Analyzer
          </a>
          <a
            className="mr-5 text-gray-200 hover:text-blue-600 cursor-pointer"
            onClick={() => {
              navigate("/generate");
            }}
          >
            FlowChart Generator
          </a>
          <a
            className="mr-5 text-gray-200 hover:text-blue-600 cursor-pointer"
            onClick={() => {
              navigate("/syntax-error");
            }}
          >
            Check Syntax
          </a>
          <a
            className="mr-5 text-gray-200 hover:text-blue-600 cursor-pointer"
            onClick={handleProblemClick}
          >
            Problem
          </a>
        </nav>
        <div className="flex space-x-4">
          {!isLoggedIn ? (
            <>
              {/* Show Login and Signup when not logged in */}
              <button
                className="inline-flex items-center text-white bg-purple-500 border-0 py-1 px-3 focus:outline-none hover:bg-purple-600 rounded text-base mt-4 md:mt-0"
                onClick={() => {
                  navigate("/login"); // Navigate to /login on click
                }}
              >
                Login
              </button>
              <button
                className="inline-flex items-center text-white bg-green-500 border-0 py-1 px-3 focus:outline-none hover:bg-green-600 rounded text-base mt-4 md:mt-0"
                onClick={() => {
                  navigate("/signup"); // Navigate to /signup on click
                }}
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              className="inline-flex items-center text-white bg-red-500 border-0 py-1 px-3 focus:outline-none hover:bg-red-600 rounded text-base mt-4 md:mt-0"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  p: PropTypes.bool,
};

export default Header;
