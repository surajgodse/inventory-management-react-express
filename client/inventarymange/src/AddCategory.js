import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNameChange = async (e) => {
    const value = e.target.value;
    setName(value);
    if (value) {
      try {
        const response = await axios.get(`http://localhost:5000/api/categories/search?query=${value}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error('There was an error fetching the category suggestions!', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (suggestions.some(suggestion => suggestion.name === name)) {
      setError('Category name already exists!');
      toast.error('Category name already exists!');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/categories', { name });
      toast.success('Category added successfully!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error('There was an error adding the category!', err);
      toast.error('There was an error adding the category!');
    }
  };

  return (
    <>
      <div>
        <h2>Add Category</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={handleNameChange}
            required
          />
          {suggestions.length > 0 && (
            <ul>
              {suggestions.map(suggestion => (
                <li key={suggestion.id}>{suggestion.name}</li>
              ))}
            </ul>
          )}
          <button type="submit">Add Category</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ToastContainer />
      </div>
      
    </>
  );
};

export default AddCategory;
