import React, { useState } from 'react';
import logo from '../../assets/Logo/loggo.png';
import { IoMdArrowDropdown } from 'react-icons/io';
import { FiSearch, FiBell, FiShoppingCart } from 'react-icons/fi';

const Navbar = () => {
  const [showCategories, setShowCategories] = useState(false);

  const categories = [
    'Mobiles',
    'Electronics',
    'Vehicles',
    'Home & Living',
    'Essentials',
    'Furniture',
    'Properties',
    'Home Appliance'
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <img src={logo} alt="Logo" className="xlogo" />

        {/* Categories Dropdown */}
        <div className="categories-dropdown">
          <button 
            className="categories-btn text-gray-700"
            onClick={() => setShowCategories(!showCategories)}
          >
            <span>Categories</span>
            <IoMdArrowDropdown className="text-lg" />
          </button>
          {showCategories && (
            <div className="dropdown-content">
              {categories.map((category, index) => (
                <a key={index} href="#" className="flex items-center">
                  {category}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search items..."
            className="search-input"
          />
          <button className="search-button">
            <FiSearch className="text-xl" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">Explore</a>
          <a href="#">Ads</a>
        </div>

        {/* Right Section */}
        <div className="nav-right">
          <div className="notifications">
            <FiBell className="text-2xl text-white" />
            <span className="notification-badge">3</span>
          </div>
          <div className="cart-wrapper">
            <FiShoppingCart className="text-2xl text-white" />
          </div>
          <a href="#" className="post-ad-btn">
            Post Ad
          </a>
          <a href="/login" className="signin-btn">
            Sign In
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 