
import React from 'react';

const RestaurantCard = ({ restaurant }) => {
  if (!restaurant) return <div>No restaurant data available</div>;

  const handleClick = (action) => {
    if (action === "menu" && restaurant.menu) {
      window.location.href = restaurant.menu; // Redirects to the menu URL
    } else {
      alert("Action not available");
    }
  };

  return (
    <>
    <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96 hover:bg-slate-100 hover:shadow-lg hover:border-slate-300 hover:scale-105 transition-all">
      <div className="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
        <img 
          src={restaurant.thumbnail || "https://plus.unsplash.com/premium_vector-1713796081005-8332940118f9?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} 
          alt="restaurant-image" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center mb-2">
          <h6 className="text-slate-800 text-xl font-semibold">
            {restaurant.name}, {restaurant.country}
          </h6>
                 <div class="flex items-center gap-0 5 ml-auto">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
          class="w-5 h-5 text-yellow-600">
          <path fill-rule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clip-rule="evenodd"></path>
        </svg>
        <span class="text-slate-600 ml-1.5">{restaurant.rating}</span>
      </div>
    </div>
    <button
        onClick={() => handleClick("menu")}
        className="ml-auto w-12 h-12 rounded-full bg-slate-800 text-white flex justify-center items-center transition-all hover:bg-slate-700 focus:bg-slate-700"
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M6.62 10.79c.47-.47.47-1.23 0-1.7l-1.41-1.41c-.47-.47-1.23-.47-1.7 0l-3 3c-.47.47-.47 1.23 0 1.7l1.41 1.41c.47.47 1.23.47 1.7 0l3-3zM15 3H9C8.45 3 8 3.45 8 4v4H4C3.45 8 3 8.45 3 9v12c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1h-4V4c0-.55-.45-1-1-1z"/>
        </svg>
      </button>
          <ol>
            <li>{restaurant.cuisines.join('\t')}</li>
          </ol>
  </div>
 
  <div class="group my-3 inline-flex flex-wrap justify-center items-center gap-2">
  </div>
  
  <div class="px-4 pb-4 pt-0 mt-2">
    <button class="w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
      Reserve
    </button>
  </div>
</div>  
    </>
  )
};

export default RestaurantCard;





