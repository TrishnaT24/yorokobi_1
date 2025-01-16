import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import RestaurantCard from "./components/RestaurantCard";
import Map from "./components/Map";
import Home from "./components/Home";
import Card from "./components/Card";
import FilterComponent from "./components/FilterComponent";
import Login from "./components/Login";
import Signup from "./components/Signup";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [filters, setFilters] = useState({
    cuisines: [],
    rating: [],
  });
  const [isCuisineDropdownOpen, setCuisineDropdownOpen] = useState(false);
  const [isRatingDropdownOpen, setRatingDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/restaurants");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRestaurants(data);
        setFilteredRestaurants(data);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchRestaurants();
  }, []);



  // Check if user data exists in localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    // console.log(userData);
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log("Parsed user data:", user);
        
        setIsLoggedIn(true);
        setUsername(user.username);
        
        // Verify state updates
        console.log("Setting username to:", user.username);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user"); // Clear invalid data
      }

    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUsername("");
    // Redirect to home page after logout
    window.location.href = "/";
  };

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...restaurants];

      if (filters.cuisines.length > 0) {
        filtered = filtered.filter((restaurant) =>
          restaurant.cuisines.some((cuisine) =>
            filters.cuisines.includes(cuisine)
          )
        );
      }

      if (filters.rating.length > 0) {
        filtered = filtered.filter((restaurant) =>
          filters.rating.includes(`${restaurant.rating} Stars`)
        );
      }

      setFilteredRestaurants(filtered);
    };

    applyFilters();
  }, [filters, restaurants]);

  const handleFilterChange = (category, value) => {
    setFilters((prevFilters) => {
      const updatedCategory = prevFilters[category].includes(value)
        ? prevFilters[category].filter((item) => item !== value)
        : [...prevFilters[category], value];

      return {
        ...prevFilters,
        [category]: updatedCategory,
      };
    });
  };

  const filterOptions = {
    cuisines: [
      ...new Set(restaurants.flatMap((restaurant) => restaurant.cuisines)),
    ],
    rating: ["5 Stars", "4 Stars", "3 Stars", "2 Stars"],
  };

  const toggleCuisineDropdown = () => {
    setCuisineDropdownOpen(!isCuisineDropdownOpen);
  };

  const toggleRatingDropdown = () => {
    setRatingDropdownOpen(!isRatingDropdownOpen);
  };

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} username={username} handleLogout={handleLogout}/>
      <Routes>
        <Route path="/login" element={<Login
        setIsLoggedIn={setIsLoggedIn}
        setUsername={setUsername} />} />
        <Route path="/signup" element={<Signup 
        setUsername={setUsername} 
        setIsLoggedIn={setIsLoggedIn} 
        />} />
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} username={username} />} />
        <Route
          path="/book-table"
          element={
            <div className="p-4">
              <div className="relative mb-4 flex  justify-center items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={toggleCuisineDropdown}
                    className="bg-slate-800 text-white px-4 py-2 rounded"
                  >
                    Cuisine
                  </button>
                  {isCuisineDropdownOpen && (
                    <div className="absolute z-10 mt-2 bg-white border rounded shadow-lg">
                      <FilterComponent
                        filterOptions={{ cuisines: filterOptions.cuisines }}
                        onFilterChange={(value) =>
                          handleFilterChange("cuisines", value)
                        }
                      />
                    </div>
                  )}
                </div>

                {/* Rating Filter Button */}
                <div className="relative ">
                  <button
                    onClick={toggleRatingDropdown}
                    className="bg-slate-800 text-white px-4 py-2 rounded ml-50"
                  >
                    Rating
                  </button>
                  {isRatingDropdownOpen && (
                    <div className="absolute z-10 mt-2 bg-white border rounded shadow-lg">
                      <FilterComponent
                        filterOptions={{ rating: filterOptions.rating }}
                        onFilterChange={(value) =>
                          handleFilterChange("rating", value)
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRestaurants.map((restaurant, index) => (
                  <RestaurantCard key={index} restaurant={restaurant} />
                ))}
              </div>
            </div>
          }
        />
        <Route path="/map" element={<Map />} />
        <Route path="/card" element={<Card />} />
      </Routes>
    </Router>
  );
}

export default App;
