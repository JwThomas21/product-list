import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';

function App() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortByPrice, setSortByPrice] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortByPrice, pagination, searchTerm]);

  const fetchProducts = () => {
    let url = 'http://localhost:8000/products';
    const params = {
      ...pagination,
      category: selectedCategory,
      price: sortByPrice,
      q: searchTerm 
    };
  
    axios.get(url, { params })
      .then(response => {
        // Update products and total pages
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  };
  

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (sortBy) => {
    setSortByPrice(sortBy);
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    setPagination({ page: 1, limit: 10 }); // Reset pagination when searching
  };

  const handleNextPage = () => {
    if (pagination.page < totalPages) {
      setPagination(prevPagination => ({
        ...prevPagination,
        page: prevPagination.page + 1
      }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPagination(prevPagination => ({
        ...prevPagination,
        page: prevPagination.page - 1
      }));
    }
  };

  return (
    <div className="container">
      <h1 className="text-center mt-3 mb-5">Products</h1>
      <SearchBar 
        onSearch={handleSearch} 
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
      />
      <div className="row">
        {products.map(product => (
          <div key={product._id} className="col-md-4 mb-4">
            <div className="card">
              <img src={product.image} className="card-img-top" alt={product.name} />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">Price: ${product.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination mt-4">
        <button className="btn btn-primary me-2" onClick={handlePrevPage}>Previous</button>
        <span>Page {pagination.page} of {totalPages}</span>
        <button className="btn btn-primary ms-2" onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
}

export default App;
