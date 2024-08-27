import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import CreateProduct from './CreateProduct';
import Update from './Update';
import AddCategory from './AddCategory';
import Footer from './Footer';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateProduct />} />
            <Route path="/update/:id" element={<Update />} />
            <Route path="/add-category" element={<AddCategory />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
