import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';

const FilterProducts = ({ setProducts }) => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        // Add 'All Categories' option
        setCategories([{ label: 'All Categories', value: '' }, ...response.data.map(cat => ({ label: cat.name, value: cat.name }))]);
      } catch (error) {
        console.error('There was an error fetching the categories!', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products', {
        params: { search, category: selectedCategory ? selectedCategory.value : '' }
      });

      if (response.data.length === 0) {
        toast.error('No such product found!');
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } else {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('There was an error fetching the products!', error);
    }
  };

  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search by name or description"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Select
        options={categories}
        placeholder="Filter by category"
        value={selectedCategory}
        onChange={setSelectedCategory}
      />
      <button onClick={handleSearch}>Search</button>
      <ToastContainer />
    </div>
  );
};

export default FilterProducts;
