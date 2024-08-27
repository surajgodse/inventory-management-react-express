import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Footer from './Footer';
import FilterProducts from './FilterProducts';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('There was an error fetching the products!', error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        setProducts(products.filter(product => product.id !== id));
        toast.success('Product deleted successfully!');
      } catch (error) {
        console.error('There was an error deleting the product!', error);
        toast.error('There was an error deleting the product!');
      }
    }
  };

  return (
    <>
      <div>
        <h2>Inventory Management System</h2>
        <FilterProducts setProducts={setProducts} /> {/* Use the FilterProducts component */}
        <div className="product-list">
          {products.map(product => (
            <div key={product.id} className="product">
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>
              <p>{product.description}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Category: {product.category}</p>
              <Link to={`/update/${product.id}`}>Update</Link>
              <button onClick={() => handleDelete(product.id)}>Delete</button>
            </div>
          ))}
        </div>
        <ToastContainer />
      </div>
      
    </>
  );
};

export default Home;
