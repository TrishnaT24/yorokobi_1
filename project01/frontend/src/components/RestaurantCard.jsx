import React from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  if (!restaurant) return <div>No restaurant data available</div>;

  const handleClick = (action) => {
      if (action === 'menu' && restaurant.menu) {
          window.location.href = restaurant.menu;
      } else {
          alert('Action not available');
      }
  };
  const handleReserveClick = () => {
    // Clear previous restaurant data if it exists
    const previousRestaurantId = localStorage.getItem('currentRestaurantId');
    if (previousRestaurantId) {
        localStorage.removeItem(`restaurant_${previousRestaurantId}`);
    }
    
    // Store the current restaurant ID
    localStorage.setItem('currentRestaurantId', restaurant._id);
    
    navigate('/card', { state: { restaurant } });
};

  return (
    <>
      <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96 hover:bg-slate-100 hover:shadow-lg hover:border-slate-300 hover:scale-105 transition-all">
        <div className="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
          <img
            src={restaurant.thumbnail || 'https://plus.unsplash.com/premium_vector-1713796081005-8332940118f9?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
            alt="restaurant-image"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center mb-2">
            <h6 className="text-slate-800 text-xl font-semibold">
              {restaurant.name}, {restaurant.country}
            </h6>
            <div className="flex items-center gap-0 5 ml-auto">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-600">
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-slate-600 ml-1.5">{restaurant.rating.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => handleClick('menu')}
            className="ml-auto w-28 h-12 rounded bg-slate-800 text-white flex justify-center items-center transition-all hover:bg-slate-700 focus:bg-slate-700"
          >
            View Menu
          </button>
          <ol>
            <li>{restaurant.cuisines.join('\t')}</li>
          </ol>
        </div>
        <div className="group my-3 inline-flex flex-wrap justify-center items-center gap-2"></div>
        <div className="px-4 pb-4 pt-0 mt-2">
        <button
            className="w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            onClick={handleReserveClick}
        >
            Reserve
        </button>
        </div>
      </div>
    </>
  );
};

export default RestaurantCard;
