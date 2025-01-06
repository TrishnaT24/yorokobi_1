import { useState, useEffect } from "react";

const RateUs = ({ closeModal, restaurantID, onRatingSuccess }) => {
    const [rating, setRating] = useState(0); // User's rating
    const [showSuccess, setShowSuccess] = useState(false); // Toggle success modal
    const [loading, setLoading] = useState(false); // Track loading state
    const [validRestaurant, setValidRestaurant] = useState(false); // Validate restaurantID

    useEffect(() => {
        if (restaurantID) {
            setValidRestaurant(true);
        }
    }, [restaurantID]);

    const handleSubmit = async () => {
        if (!validRestaurant) {
            alert("Invalid Restaurant ID.");
            return;
        }
    
        if (rating > 0) {
            setLoading(true);
    
            try {
                console.log('Submitting rating:', { restaurantID, rating });
    
                const response = await fetch('http://localhost:3000/api/restaurants/submit-rating', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        restaurantID,
                        rating: Number(rating), // Ensure rating is a number
                    }),
                });
    
                const result = await response.json();
                console.log('API Response:', result);
    
                if (!response.ok) {
                    throw new Error(result.message || 'Server error');
                }
    
                if (result.success) {
                    setShowSuccess(true);
                    if (onRatingSuccess) {
                        onRatingSuccess(); // Trigger the parent component to update
                    }
                } else {
                    alert(result.message || 'Something went wrong, please try again!');
                }
            } catch (error) {
                console.error('Error submitting rating:', error);
                alert(error.message || 'Error submitting rating, please try again!');
            } finally {
                setLoading(false);
            }
        } else {
            alert("Please select a rating before submitting!");
        }
    };
    

    const closeSuccessModal = () => {
        setShowSuccess(false); // Close the success modal
        closeModal(); // Also close the parent modal
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            {!showSuccess && (
                <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                    <h2 className="text-xl font-semibold text-center mb-4">Rate Us</h2>
                    <p className="text-gray-600 text-center mb-4">
                        How would you rate your experience?
                    </p>
                    <div className="flex justify-center mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill={star <= rating ? "#FBBF24" : "#D1D5DB"}
                                className="w-8 h-8 cursor-pointer"
                                onClick={() => setRating(star)}
                            >
                                <path d="M12 .587l3.668 7.429 8.2 1.192-5.934 5.777 1.401 8.172L12 18.897l-7.334 3.86 1.401-8.172L.133 9.208l8.2-1.192z" />
                            </svg>
                        ))}
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !validRestaurant}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {loading ? 'Submitting...' : 'Submit Rating'}
                    </button>
                    <button
                        onClick={closeModal}
                        className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg mt-2 hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
            )}

            {showSuccess && (
                <div className="relative p-4 w-full max-w-md h-auto">
                    <div className="relative p-4 text-center bg-white rounded-lg shadow-lg">
                        <button
                            type="button"
                            className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                            onClick={closeSuccessModal}
                        >
                            <svg
                                aria-hidden="true"
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="w-12 h-12 rounded-full bg-green-100 p-2 flex items-center justify-center mx-auto mb-3.5">
                            <svg
                                aria-hidden="true"
                                className="w-8 h-8 text-green-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            <span className="sr-only">Success</span>
                        </div>
                        <p className="mb-4 text-lg font-semibold text-gray-900">
                            Thank you for your feedback!
                        </p>
                        <button
                            onClick={closeSuccessModal}
                            className="py-2 px-3 text-sm font-medium text-center text-white rounded-lg bg-blue-500 hover:bg-blue-600"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RateUs;
