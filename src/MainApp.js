import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import hamburger and close icons

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="bg-gradient-to-b from-[#F58529] via-[#DD2A7B] to-[#8134AF] min-h-screen flex flex-col justify-between">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 bg-white shadow-md relative">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#F58529]">Instagram Pixels</h1>
      </nav>

      {/* Mobile Menu - Smooth Animation */}
      <div
        className={`sm:hidden fixed inset-0 bg-[#F58529] bg-opacity-90 transition-transform transform ${menuOpen ? 'translate-x-0' : 'translate-x-full'} duration-500 ease-in-out`}
      >
        <div className="flex justify-end p-6">
          <button onClick={toggleMenu}>
            <FaTimes className="text-white text-2xl" />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-white text-xl">
          <Link to="/" onClick={toggleMenu} className="hover:text-[#DD2A7B] transition text-lg sm:text-xl">Home</Link>
          <Link to="/pixels" onClick={toggleMenu} className="hover:text-[#DD2A7B] transition text-lg sm:text-xl">Pixels</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-white text-center space-y-6 p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
          Welcome to Instagram Pixel Purchase
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl font-medium opacity-90">
          Buy a pixel and showcase your Instagram profile like never before!
        </p>
        <Link to="/pixels">
          <button className="bg-[#F58529] text-white py-3 px-8 rounded-full text-lg md:text-xl hover:bg-[#DD2A7B] transition duration-300 ease-in-out">
            Buy Pixels
          </button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-[#8134AF] text-white py-6 mt-16">
        <div className="text-center">
          <p className="text-sm sm:text-base md:text-lg">
            © 2025 Instagram Pixel Purchase | All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;