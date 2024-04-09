import axios from 'axios';

export const fetchProducts = () => {
  return async dispatch => {
    try {
      const response = await axios.get('/products'); 
      dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_PRODUCTS_ERROR', payload: error.message });
    }
  };
};
