import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const CreateProduct = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data.map(cat => ({ label: cat.name, value: cat.name })));
      } catch (error) {
        console.error('There was an error fetching the categories!', error);
      }
    };

    fetchCategories();
  }, []);

  const handleNameChange = async (e) => {
    const value = e.target.value;
    setName(value);
    if (value) {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/search?query=${value}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error('There was an error fetching the product suggestions!', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (suggestions.some(suggestion => suggestion.name === name)) {
      setError('Product name already exists!');
      toast.error('Product name already exists!');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/products', {
        name,
        quantity,
        price,
        description,
        category: category.value
      });
      toast.success('Product added successfully!');
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      console.error('There was an error adding the product!', err);
      setError('There was an error adding the product!');
      toast.error('There was an error adding the product!');
    }
  };

  return (
    <>
      <div>
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Product Name"
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
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ resize: 'vertical' }} // Inline style to restrict resizing
          />
          <Select
            options={categories}
            placeholder="Select Category"
            value={category}
            onChange={setCategory}
            required
          /><br/>
          <button type="submit">Add Product</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ToastContainer />
      </div>
    </>
  );
};

export default CreateProduct;
