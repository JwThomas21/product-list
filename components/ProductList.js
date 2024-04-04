import React from 'react';

function ProductList({ products }) {
  return (
    <div className="product-list">
      {products.map(product => (
        <div key={product._id} className="product">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>Price: ${product.price}</p>
          <p>Category: {product.category}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
