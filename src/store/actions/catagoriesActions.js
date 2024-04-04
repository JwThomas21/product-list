
export const fetchCategories = () => async (dispatch) => {
    try {
      const response = await fetch('http://localhost:8000/categories');
      const categories = await response.json();
      dispatch({ type: 'FETCH_CATEGORIES_SUCCESS', payload: categories });
    } catch (error) {
      dispatch({ type: 'FETCH_CATEGORIES_FAILURE', payload: error.message });
    }
  };
  
  const initialState = {
    categories: [],
    error: null,
  };
  
  const categoriesReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_CATEGORIES_SUCCESS':
        return { ...state, categories: action.payload, error: null };
      case 'FETCH_CATEGORIES_FAILURE':
        return { ...state, categories: [], error: action.payload };
      default:
        return state;
    }
  };
  
  export default categoriesReducer;
  
 
  