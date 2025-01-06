import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import RateUs from './RateUs';

const Card = () => {
    const location = useLocation();
    const [restaurant, setRestaurant] = useState(location.state?.restaurant);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [counter, setCounter] = useState(30);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
    const [sliderValue, setSliderValue] = useState(1);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const openQueueModal = () => setIsQueueModalOpen(true);
    const closeQueueModal = () => setIsQueueModalOpen(false);
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
                // Store the updated rating in localStorage
                localStorage.setItem(`rating-${restaurant._id}`, data.restaurant.rating);
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
                return newCounter;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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
                    <div className="countdown mt-4 text-xl font-bold text-gray-700">
                        <span style={{ "--value": counter }}>
                            Queue size refresh in {counter} seconds
                        </span>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-center space-x-4">
                            <button onClick={openQueueModal} className="text-blue hover:before:bg-redborder-blue-500 relative h-[50px] w-40 overflow-hidden border border-blue-500 bg-white px-3 text-blue-500 shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-blue-500 before:transition-all before:duration-500 hover:text-white hover:shadow-blue-500 hover:before:left-0 hover:before:w-full">
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-96">
            <h2 className="text-xl font-semibold mb-4">Select the number of Guests</h2>
            <input
                type="range"
                min="1"
                max="8"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full"
            />
            <p className="text-center mt-2">Selected Size: {sliderValue}</p>
            <div className="flex justify-end mt-4">
                <button
                    onClick={closeQueueModal}
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                >
                    Close
                </button>
                <button
                    onClick={closeQueueModal}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Confirm
                </button>
            </div>
        </div>
    </div>
)}

            </div>
        </div>
    );
};

export default Card;
