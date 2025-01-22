import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-teal-500 to-blue-700 text-white py-4 px-6 flex items-center justify-between shadow-md z-50">
      <h2 className="text-2xl font-bold tracking-wide">Chat Application</h2>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full text-sm font-medium transition-all focus:outline-none"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
