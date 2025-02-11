import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import RateUs from './RateUs';
import QueueModal from './QueueModal'; // Import the new QueueModal 

const Card = () => {
    const location = useLocation();
    const [restaurant, setRestaurant] = useState(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [counter, setCounter] = useState(30);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
    const [queueSize, setQueueSize] = useState(0);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const openQueueModal = () => setIsQueueModalOpen(true);
    const closeQueueModal = () => setIsQueueModalOpen(false);

    useEffect(() => {
        if (location.state?.restaurant?._id) {
            const restaurantId = location.state.restaurant._id;
            // Get stored restaurant data specific to this restaurant ID
            const storedRestaurant = localStorage.getItem(`restaurant_${restaurantId}`);
            
            if (storedRestaurant) {
                const parsedRestaurant = JSON.parse(storedRestaurant);
                setRestaurant(parsedRestaurant);
                setQueueSize(parsedRestaurant.queue_size || 0);
            } else {
                // If no stored data, use the data from location state
                setRestaurant(location.state.restaurant);
                setQueueSize(location.state.restaurant.queue_size || 0);
                // Store initial data
                localStorage.setItem(`restaurant_${restaurantId}`, 
                    JSON.stringify(location.state.restaurant)
                );
            }
        }
    }, [location.state]);

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
                // Update both state and localStorage with restaurant-specific key
                setRestaurant(data.restaurant);
                setQueueSize(data.restaurant.queue_size || 0);
                localStorage.setItem(`restaurant_${data.restaurant._id}`, 
                    JSON.stringify(data.restaurant)
                );
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

    const handleRatingSuccess = () => {
        fetchUpdatedRestaurant();
    };

    useEffect(() => {
        // Retrieve the stored rating from localStorage
        const storedRating = localStorage.getItem(`rating-${restaurant?._id}`);
        if (storedRating && restaurant) {
            setRestaurant((prev) => ({ ...prev, rating: parseFloat(storedRating) }));
        }
    }, [restaurant?._id]);

    // Set interval for photo sliding
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % (restaurant.photos?.length || 1));
        }, 3000);

        return () => clearInterval(interval);
    }, [restaurant?.photos]);

    useEffect(() => {
        const savedCounter = localStorage.getItem("counter");
        if (savedCounter) {
            setCounter(parseInt(savedCounter, 10));
        }

        const timer = setInterval(() => {
            setCounter((prevCounter) => {
                const newCounter = prevCounter === 0 ? 30 : prevCounter - 1;
                localStorage.setItem("counter", newCounter);

                // Fetch updated restaurant data when counter reaches 0
                if (newCounter === 0) {
                    fetchUpdatedRestaurant();
                }

                return newCounter;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [restaurant?._id]); // Add restaurant._id as dependency

    if (!restaurant) return <div>No restaurant data available</div>;

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="bg-white grid sm:grid-cols-2 items-center shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-full max-w-4xl max-sm:max-w-md rounded-lg font-[sans-serif] overflow-hidden mx-auto mt-4">

                <div
                    className="relative overflow-hidden"
                    style={{
                        width: "100%",
                        height: "500px",
                    }}
                >
                    <img
                        src={restaurant.photos ? restaurant.photos[currentPhotoIndex] : restaurant.thumbnail}
                        alt={restaurant.name}
                        className="w-full h-full object-cover transition-all duration-500"
                    />
                </div>

                <div className="p-8">
                    <h3 className="text-2xl font-semibold">{restaurant.name}, {restaurant.country}</h3>
                    <p className="mt-4 text-sm text-gray-500 leading-relaxed">
                        {/* {restaurant.description || 'No description available'} */}
                    </p>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed font-bold">
                        Cuisines: {restaurant.cuisines.join(', ')}
                    </p>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed font-bold">
                        Telephone: {restaurant.telephone}
                    </p>
                    <a
                        href={restaurant.menu}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-sm text-gray-500 leading-relaxed font-bold hover:underline"
                    >
                        Menu: {restaurant.menu}
                    </a>

                    <div className="flex items-center mt-4">
                        {[...Array(5)].map((_, index) => {
                            const isFullStar = index < Math.floor(restaurant.rating);
                            const isHalfStar =
                                index === Math.floor(restaurant.rating) &&
                                restaurant.rating % 1 >= 0.5;

                            return (
                                <svg
                                    key={index}
                                    className="w-4 h-4 me-1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill={isFullStar ? "#FBBF24" : isHalfStar ? "url(#half)" : "#D1D5DB"}
                                    aria-hidden="true"
                                >
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
                        <p className="ms-2 text-sm font-bold text-gray-900 dark:text-black">
                            {restaurant.rating.toFixed(2)}
                        </p>
                        <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                        <div
                            href="#"
                            className="text-sm font-medium text-gray-900 hover:no-underline dark:text-black font-bold text-decoration-line: underline"
                        >
                            {restaurant.reviewsCount} reviews
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        <div className="text-xl font-bold text-gray-700">
                            Current Queue Size: {loading ? "Updating..." : queueSize} people
                        </div>
                        <div className="countdown text-xl font-bold text-gray-700">
                            <span style={{ "--value": counter }}>
                                Queue size refresh in {counter} seconds
                            </span>
                        </div>
                        {error && (
                            <div className="text-red-500 text-sm">
                                Failed to update queue size. Please try again later.
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col items-center space-y-4">
                            <button onClick={openQueueModal} className="mt-8 text-blue hover:before:bg-redborder-blue-500 relative h-[50px] w-40 overflow-hidden border border-blue-500 bg-white px-3 text-blue-500 shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-blue-500 before:transition-all before:duration-500 hover:text-white hover:shadow-blue-500 hover:before:left-0 hover:before:w-full">
                                <span className="relative z-10">Join Queue 🎉</span>
                            </button>
                            <button onClick={() => openModal(restaurant._id)} className="text-yellow hover:before:bg-redborder-yellow-500 relative h-[50px] w-40 overflow-hidden border border-yellow-500 bg-white px-3 text-yellow-500 shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-yellow-500 before:transition-all before:duration-500 hover:text-white hover:shadow-yellow-500 hover:before:left-0 hover:before:w-full">
                                <span className="relative z-10">Rate Us ⭐</span>
                            </button>
                        </div>
                    </div>

                </div>

                {isModalOpen && (
                    <RateUs
                        closeModal={closeModal}
                        restaurantID={restaurant._id}
                        onRatingSuccess={handleRatingSuccess}
                    />
                )}
                {isQueueModalOpen && (
                    <QueueModal
                        restaurant={restaurant}
                        closeQueueModal={closeQueueModal}
                        onQueueSuccess={() => {
                            closeQueueModal();
                            // Optionally refresh restaurant data here if needed
                            fetchUpdatedRestaurant();
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default Card;
