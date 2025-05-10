import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import RateUs from './RateUs';
import QueueModal from './QueueModal';

const Card = () => {
    const location = useLocation();
    const [restaurant, setRestaurant] = useState(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
    const [queueSize, setQueueSize] = useState(0);
    const [queuePosition, setQueuePosition] = useState(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const openQueueModal = () => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            alert("User not found! Please log in.");
            return;
        }
        const user = JSON.parse(userData);
        // Check if the user is already in the queue
        if (restaurant?.names?.includes(user.username)) {
            alert("You are already in the queue!");
            return;
        }
    
        setIsQueueModalOpen(true);
    };
    const closeQueueModal = () => setIsQueueModalOpen(false);

    useEffect(() => {
        if (location.state?.restaurant?._id) {
            const restaurantId = location.state.restaurant._id;
            const storedRestaurant = localStorage.getItem(`restaurant_${restaurantId}`);
            
            if (storedRestaurant) {
                const parsedRestaurant = JSON.parse(storedRestaurant);
                setRestaurant(parsedRestaurant);
                setQueueSize(parsedRestaurant.queue_size || 0);
            } else {
                setRestaurant(location.state.restaurant);
                setQueueSize(location.state.restaurant.queue_size || 0);
                localStorage.setItem(`restaurant_${restaurantId}`, JSON.stringify(location.state.restaurant));
            }
        }
    }, [location.state]);

    // Function to fetch the updated restaurant details
    const fetchUpdatedRestaurant = async () => {
        if (!restaurant?._id) return;
    
        setLoading(true);
        setError(null);
    
        try {
            const response = await fetch(`http://localhost:3000/api/restaurants/${restaurant._id}`);
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch restaurant data');
            }
    
            if (data.success && data.restaurant) {
                setRestaurant(data.restaurant);
                setQueueSize(data.restaurant.queue_size || 0);
                localStorage.setItem(`restaurant_${data.restaurant._id}`, JSON.stringify(data.restaurant));
    
                // Get user's queue position - Fixed user data parsing
                const userData = localStorage.getItem('user');
                if (userData && Array.isArray(data.restaurant.names)) {
                    const user = JSON.parse(userData);
                    const position = data.restaurant.names.indexOf(user.username);
                    setQueuePosition(position !== -1 ? position + 1 : "Not in queue");
                } else {
                    setQueuePosition("Not in queue");
                }
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching updated restaurant data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % (restaurant?.photos?.length || 1));
        }, 3000);

        return () => clearInterval(interval);
    }, [restaurant?.photos]);

    if (!restaurant) return <div>No restaurant data available</div>;

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="bg-white grid sm:grid-cols-2 items-center shadow-lg w-full max-w-4xl rounded-lg overflow-hidden mx-auto mt-4">
                <div className="relative overflow-hidden" style={{ width: "100%", height: "500px" }}>
                    <img src={restaurant.photos ? restaurant.photos[currentPhotoIndex] : restaurant.thumbnail} alt={restaurant.name} className="w-full h-full object-cover transition-all duration-500" />
                </div>
                <div className="p-8">
                    <h3 className="text-2xl font-semibold">{restaurant.name}, {restaurant.country}</h3>
                    <p className="mt-2 text-sm font-bold">Cuisines: {restaurant.cuisines.join(', ')}</p>
                    <p className="mt-2 text-sm font-bold">Telephone: {restaurant.telephone}</p>
                    <a href={restaurant.menu} target="_blank" rel="noopener noreferrer" className="mt-2 text-sm font-bold hover:underline">Menu: {restaurant.menu}</a>

                    <div className="flex items-center mt-4">
                        {[...Array(5)].map((_, index) => {
                            const isFullStar = index < Math.floor(restaurant.rating);
                            const isHalfStar = index === Math.floor(restaurant.rating) && restaurant.rating % 1 >= 0.5;
                            return (
                                <svg key={index} className="w-4 h-4 me-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFullStar ? "#FBBF24" : isHalfStar ? "url(#half)" : "#D1D5DB"} aria-hidden="true">
                                    {isHalfStar && (
                                        <defs>
                                            <linearGradient id="half">
                                                <stop offset="50%" stopColor="#FBBF24" />
                                                <stop offset="50%" stopColor="#D1D5DB" />
                                            </linearGradient>
                                        </defs>
                                    )}
                                    <path d="M12 .587l3.668 7.429 8.2 1.192-5.934 5.777 1.401 8.172L12 18.897l-7.334 3.86 1.401-8.172L.133 9.208l8.2-1.192z" />
                                </svg>
                            );
                        })}
                        <p className="ms-2 text-sm font-bold">{restaurant.rating.toFixed(2)}</p>
                        <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full"></span>
                        <div className="text-sm font-medium font-bold underline">{restaurant.reviewsCount} reviews</div>
                    </div>

                    <div className="mt-4 text-xl font-bold text-gray-700">Current Queue Size: {loading ? "Updating..." : queueSize} people</div>
                    <div className="mt-4 text-xl font-bold text-gray-700">Your Queue Position: {queuePosition !== null ? queuePosition : "Fetching..."}</div>
                    
                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <div className="flex flex-col items-center space-y-4 mt-8">
                        <button onClick={openQueueModal} className="border border-blue-500 bg-white px-3 text-blue-500 hover:bg-blue-500 hover:text-white">Join Queue 🎉</button>
                        <button onClick={openModal} className="border border-yellow-500 bg-white px-3 text-yellow-500 hover:bg-yellow-500 hover:text-white">Rate Us ⭐</button>
                        <button onClick={fetchUpdatedRestaurant} className="border border-green-500 bg-white px-3 text-green-500 hover:bg-green-500 hover:text-blue">Refresh Data 🔄</button>
                    </div>
                </div>

                {isModalOpen && <RateUs closeModal={closeModal} restaurantID={restaurant._id} />}
                {isQueueModalOpen && <QueueModal restaurant={restaurant} closeQueueModal={closeQueueModal} />}
            </div>
        </div>
    );
};

export default Card;
