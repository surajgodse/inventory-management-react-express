import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer';
import Select from 'react-select';

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        const prod = response.data;
        setProduct(prod);
        setName(prod.name);
        setQuantity(prod.quantity);
        setPrice(prod.price);
        setDescription(prod.description);
        setCategory({ label: prod.category, value: prod.category });
      } catch (error) {
        console.error('There was an error fetching the product!', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data.map(cat => ({ label: cat.name, value: cat.name })));
      } catch (error) {
        console.error('There was an error fetching the categories!', error);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id]);

  const handleNameChange = async (e) => {
    const newName = e.target.value;
    setName(newName);

    if (newName.length > 0) {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/search?query=${newName}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error('There was an error fetching product suggestions!', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingProduct = suggestions.find((prod) => prod.name === name && prod.id !== id);
    if (existingProduct) {
      setError('A product with this name already exists!');
      toast.error('A product with this name already exists!');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, {
        name,
        quantity,
        price,
        description,
        category: category.value
      });
      toast.success('Product updated successfully!');
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      console.error('There was an error updating the product!', err);
      setError('There was an error updating the product!');
      toast.error('There was an error updating the product!');
    }
  };

  return (
    <>
      <div>
        <h2>Update Product</h2>
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
              {suggestions.map((suggestion) => (
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
          />
          <Select
            options={categories}
            placeholder="Select Category"
            value={category}
            onChange={setCategory}
            required
          />
          <button type="submit">Update Product</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ToastContainer />
      </div>
      
    </>
  );
};

export default Update;
