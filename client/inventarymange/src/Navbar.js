import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="nav">
      <Link to="/">Home</Link>
      <Link to="/create">Add New Product</Link>
      <Link to="/add-category">Add Category</Link> {/* Add this link */}
    </nav>
  );
}

export default Navbar;
