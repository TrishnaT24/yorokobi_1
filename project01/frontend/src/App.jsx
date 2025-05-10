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
  // Initialize login state with localStorage
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  const [isLoggedIn, setIsLoggedIn] = useState(!!parsedUser);
  const [username, setUsername] = useState(parsedUser?.username || "");
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

  // Keep localStorage and state in sync
  useEffect(() => {
    if (isLoggedIn && username) {
      localStorage.setItem("user", JSON.stringify({ username }));
    }
  }, [isLoggedIn, username]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUsername("");
    // Redirect to home page after logout
    window.location.href = "/";
  };

  // useEffect(() => {
  //   const applyFilters = () => {
  //     let filtered = [...restaurants];

  //     if (filters.cuisines.length > 0) {
  //       filtered = filtered.filter((restaurant) =>
  //         restaurant.cuisines.some((cuisine) =>
  //           filters.cuisines.includes(cuisine)
  //         )
  //       );
  //     }

  //     if (filters.rating.length > 0) {
  //       filtered = filtered.filter((restaurant) =>
  //         filters.rating.includes(`${restaurant.rating} Stars`)
  //       );
  //     }

  //     setFilteredRestaurants(filtered);
  //   };

  //   applyFilters();
  // }, [filters, restaurants]);
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
        filtered = filtered.filter((restaurant) => {
          const rating = parseFloat(restaurant.rating);
          return filters.rating.some((filter) => {
            if (filter === "5 Stars") return rating >= 5;
            if (filter === "4 Stars") return rating >= 4 && rating < 5;
            if (filter === "3 Stars") return rating >= 3 && rating < 4;
            if (filter === "2 Stars") return rating >= 2 && rating < 3;
            return false;
          });
        });
      }
  
      setFilteredRestaurants(filtered);
    };
  
    applyFilters();
  }, [filters, restaurants]);
  



  const handleFilterChange = (category, value) => {
    setFilters((prevFilters) => {
      const currentFilters = [...prevFilters[category]];
      const valueIndex = currentFilters.indexOf(value);

      if (valueIndex === -1) {
        currentFilters.push(value);
      } else {
        currentFilters.splice(valueIndex, 1);
      }

      return {
        ...prevFilters,
        [category]: currentFilters,
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
      <Header
        isLoggedIn={isLoggedIn}
        username={username}
        handleLogout={handleLogout}
      />
      <Routes>
        <Route
          path="/login"
          element={
            <Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />
          }
        />
        <Route
          path="/signup"
          element={
            <Signup setUsername={setUsername} setIsLoggedIn={setIsLoggedIn} />
          }
        />
        <Route
          path="/"
          element={<Home isLoggedIn={isLoggedIn} username={username} />}
        />
        <Route
          path="/book-table"
          element={
            <div className="p-4">
              <div className="relative mb-4 flex justify-center items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={() => {
                      toggleCuisineDropdown();
                      setRatingDropdownOpen(false);
                    }}
                    className="bg-slate-800 text-white px-4 py-2 rounded"
                  >
                    Cuisine
                  </button>
                  {isCuisineDropdownOpen && (
                    <div className="absolute left-0 z-10 mt-2">
                      <FilterComponent
                        filterOptions={filterOptions}
                        onFilterChange={handleFilterChange}
                        category="cuisines"
                      />
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => {
                      toggleRatingDropdown();
                      setCuisineDropdownOpen(false);
                    }}
                    className="bg-slate-800 text-white px-4 py-2 rounded"
                  >
                    Rating
                  </button>
                  {isRatingDropdownOpen && (
                    <div className="absolute left-0 z-10 mt-2">
                      <FilterComponent
                        filterOptions={filterOptions}
                        onFilterChange={handleFilterChange}
                        category="rating"
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

// path="/book-table"
// element={
//   <div className="p-4">
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//       {restaurants.map((restaurant, index) => (
//         <RestaurantCard key={index} restaurant={restaurant} />
//       ))}
//     </div>
//   </div>
// }
