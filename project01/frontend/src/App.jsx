import { useState, useEffect } from 'react';
import Header from './components/Header';
import RestaurantCard from './components/RestaurantCard';
import Map from './components/Map';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Filter from './components/Filter';
function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/restaurants/restaurants');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRestaurants(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) return <div className="p-4">Loading restaurants...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!restaurants.length) return <div className="p-4">No restaurants available</div>;

  return (
    <Router>
      <Header />
      <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/book-table' element={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 ml-20">
      
      {restaurants.map((restaurant, index) => (
        <RestaurantCard key={index} restaurant={restaurant} />
      ))}
    </div>}/>
    <Route path='/map' element={<Map/>}/>
      </Routes>
      </Router>
  );
}

export default App;
