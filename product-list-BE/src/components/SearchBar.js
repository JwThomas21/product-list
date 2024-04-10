import React, { useState } from 'react';

function SearchBar({ onSearch, onCategoryChange, onSortChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortByPrice, setSortByPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  
// Hardcoded categories: Consider updating them to dynamic for improved scalability potential in the future.
  const categories = [
    "Health",
    "Shoes",
    "Outdoors",
    "Movies",
    "Grocery",
    "Computers",
    "Beauty",
    "Industrial",
    "Electronics",
    "Toys",
    "Music",
    "Games",
    "Clothing",
    "Automotive",
    "Jewelery"
  ];

  const handleSearch = () => {
    // Pass all search parameters to the onSearch function
    onSearch(searchTerm, sortByPrice, selectedCategory);
  };

  return (
    <div className="search-bar mb-4">
      <div className="row g-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={sortByPrice}
            onChange={(e) => {
              setSortByPrice(e.target.value);
              onSortChange(e.target.value);
            }}
          >
            <option value="">Sort by Price</option>
            <option value="lowest">Lowest to Highest</option>
            <option value="highest">Highest to Lowest</option>
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              onCategoryChange(e.target.value);
            }}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary" onClick={handleSearch}>Search</button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
