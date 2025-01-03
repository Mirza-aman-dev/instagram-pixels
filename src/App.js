import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { db } from './firebase'; // Import firestore instance
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { ClipLoader } from 'react-spinners';

function App() {
  const [buttonLoad, setButtonLoad] = useState('Pay (1) rupee');
  const [pixels, setPixels] = useState([]); // Initially an empty array
  const [loading, setLoading] = useState(true); // Initially, set loading to true
  const [showForm, setShowForm] = useState(false); // To toggle the input form visibility
  const [selectedPixel, setSelectedPixel] = useState(null); // To store the selected pixel for purchase
  const [name, setName] = useState('');
  const [instagramLink, setInstagramLink] = useState('');

  // Generate 20000 pixel objects
  const generateSampleData = () => {
    const data = [];
    for (let i = 1; i <= 20000; i++) {
      data.push({
        id: i,
        instagramLink: `https://instagram.com/user${i}`,
        purchased: false,
        profilePic: 'https://isttime.com/wp-content/uploads/2024/08/hidden-face-dp-for-girls-9-1-1143x1200.webp',
        name: '',
      }); 
    }
    return data;
  };

  // Fetch the purchased data from Firestore
  const fetchPurchasedData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'purchases'));
      const fetchedData = querySnapshot.docs.map((doc) => doc.data());
      const updatedPixels = generateSampleData().map((pixel) => {
        const purchasedPixel = fetchedData.find((item) => item.id === pixel.id);
        if (purchasedPixel) {
          return { ...pixel, purchased: true, ...purchasedPixel };
        }
        return pixel;
      });
      setPixels(updatedPixels);
    } catch (error) {
      console.error('Error fetching purchased data:', error);
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };

  useEffect(() => {
    fetchPurchasedData(); // Fetch purchased data when component mounts
  }, []);

  const handlePayment = async (pixelId) => {
    setButtonLoad('Processing...');
    setLoading(true);

    // Setup Razorpay payment options
    const options = {
      key: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay Key
      amount: 1 * 100, // Amount in paise (10 INR)
      currency: 'INR',
      name: 'Instagram Pixel Purchase',
      description: 'Purchase a pixel to promote your Instagram profile',
      handler: async function (response) {
        setButtonLoad('Wait...');
        // Mark the pixel as purchased and update the details
        const updatedPixel = {
          id: pixelId,
          purchased: true,
          name: name,
          instagramLink: instagramLink,
          profilePic: 'https://www.w3schools.com/w3images/avatar2.png', // New profile picture after purchase
        };

        // Add the purchase to Firestore
        await addDoc(collection(db, 'purchases'), updatedPixel);

        setPixels((prevPixels) =>
          prevPixels.map((pixel) =>
            pixel.id === pixelId
              ? { ...pixel, purchased: true, ...updatedPixel } // Update pixel with new details
              : pixel
          )
        );
        setShowForm(false); // Hide the form after successful purchase
        setName(''); // Reset the form fields
        setInstagramLink('');
      },
      prefill: {
        name: 'Buyer Name',
        email: 'buyer@example.com',
      },
      theme: {
        color: '#F37254',
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
    setLoading(false);
  };

  const handlePixelClick = (pixel) => {
    if (!pixel.purchased) {
      setShowForm(true); // Show the input form
      setSelectedPixel(pixel.id); // Set the selected pixel for purchase
    } else {
      window.open(pixel.instagramLink, '_blank');
    }
  };

  return (
    <div className="App flex flex-col items-center p-4 sm:p-8">
      <h1 className="text-2xl sm:text-4xl font-semibold text-blue-600 mb-4 sm:mb-8 text-center">
        Instagram Pixels
      </h1>
      
      {/* Loader and fetching message */}
      {loading ? (
        <>
          <ClipLoader color="#3B82F6" loading={loading} size={50} />
          <p className="mt-4 text-xl text-center">Fetching data...</p>
        </>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {pixels.map((pixel) => (
            <div
              key={pixel.id}
              className={`relative p-4 sm:p-6 w-20 sm:w-24 h-20 sm:h-24 rounded-lg cursor-pointer flex justify-center items-center transition-all ease-in-out ${
                pixel.purchased ? 'bg-green-500' : 'bg-blue-400 hover:bg-blue-500'
              }`}
              onClick={() => handlePixelClick(pixel)} // Using the handler
            >
              <span
                className={`font-bold text-white text-center line-clamp-2 ${
                  pixel.purchased ? 'text-xs sm:text-sm md:text-base' : 'text-xs sm:text-sm md:text-base'
                }`}
                style={{
                  fontSize: 'calc(0.5rem + 0.5vw)', // Responsive font size based on box width
                  lineHeight: '1.2', // Control the line height to prevent excessive wrapping
                }}
              >
                {pixel.purchased ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={pixel.profilePic}
                      alt="Instagram Profile"
                      className="rounded-full w-16 h-16 object-cover"
                    />
                  </div>
                ) : (
                  <FaShoppingCart className="text-white text-lg sm:text-xl md:text-2xl" />
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Modal (Popup) Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold text-center mb-4">Enter Details for Pixel Purchase ({selectedPixel})</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="instagramLink" className="block text-sm font-medium text-gray-700">Instagram Profile Link</label>
              <input
                type="url"
                id="instagramLink"
                value={instagramLink}
                onChange={(e) => setInstagramLink(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
              />
            </div>
            <button
              onClick={() => handlePayment(selectedPixel)}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              {buttonLoad}
            </button>
            <button
              onClick={() => setShowForm(false)} // Close the modal
              className="w-full mt-4 bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;