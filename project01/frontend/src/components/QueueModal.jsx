import { useState, useEffect } from 'react';

const QueueModal = ({ restaurant, closeQueueModal, queueSize = 0 }) => {
    const [sliderValue, setSliderValue] = useState(1);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [estimatedTime, setEstimatedTime] = useState(0);

    // Function to calculate estimated time based on the queue size and number of guests
    const calculateEstimatedTime = () => {
        if (typeof queueSize !== 'number' || typeof sliderValue !== 'number') {
            setEstimatedTime(0); // fallback value if invalid input
            return;
        }

        // Assuming each guest takes 5 minutes to process
        const timePerGuest = 5;
        const totalGuests = queueSize + sliderValue;
        const estimatedTimeInMinutes = totalGuests * timePerGuest;

        setEstimatedTime(estimatedTimeInMinutes);
    };

    const addToQueue = async () => {
        // Add console logs for debugging
        console.log("Adding to queue with:", {
            restaurantId: restaurant?._id,
            guests: sliderValue
        });

        // Check both restaurant ID and slider value
        if (!restaurant?._id) {
            alert("Restaurant information is missing.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/restaurants/update-queue`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    restaurantID: restaurant._id,
                    guests: sliderValue  // Use sliderValue directly from state
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to add to queue");
            }

            alert("Successfully joined the queue!");
            closeQueueModal();
        } catch (error) {
            console.error("Error details:", error);
            alert("Failed to join the queue. Please try again.");
        }
    };

    const handleConfirm = () => {
        // When the user confirms, call the function to add guests to the queue
        addToQueue();
        setIsConfirmModalOpen(false); // Close the confirmation modal
    };

    // Trigger calculation whenever slider value or queue size changes
    useEffect(() => {
        calculateEstimatedTime();
    }, [sliderValue, queueSize]); // Recalculate when these values change

    const onSliderChange = (e) => {
        setSliderValue(parseInt(e.target.value));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-96">
                <h2 className="text-xl font-semibold mb-4">Select the number of Guests</h2>
                <input
                    type="range"
                    min="1"
                    max="8"
                    value={sliderValue}
                    onChange={onSliderChange}
                    className="w-full"
                />
                <p className="text-center mt-2">Selected Size: {sliderValue}</p>

                {/* Estimated Time Display */}
                <div className="mt-4 text-center">
                    <p>Estimated wait time: {estimatedTime ? `${estimatedTime} minutes` : 'Calculating...'}</p>
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        onClick={closeQueueModal}
                        className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => setIsConfirmModalOpen(true)}  // Open the confirmation modal
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Join Queue
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-96">
                        <h2 className="text-xl font-semibold mb-4">Confirm Joining the Queue</h2>
                        <p className="text-center mb-4">You are about to join the queue with {sliderValue} guests.</p>
                        <p className="text-center mb-4">Estimated wait time: {estimatedTime} minutes</p>

                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleConfirm}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setIsConfirmModalOpen(false)} // Close the confirmation modal
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QueueModal;
