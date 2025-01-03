import React, { useState } from 'react';
import axios from 'axios';

const HotelSearch = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHotels = async () => {
    const apiKey = '098671b1b2733963143f876777cce53fdda6fb6461b1e066e1d91b333b466c60';
    // const url = `https://serpapi.com/search.json?engine=google_hotels&q=cochi+hotels&check_in_date=2025-01-04&check_out_date=2025-01-05&adults=2&currency=INR&gl=us&hl=en&api_key=${apiKey}`;
    const url = "https://serpapi.com/search.json?engine=google_hotels&q=Bali+Resorts&check_in_date=2025-01-04&check_out_date=2025-01-05&adults=2&currency=INR&gl=us&hl=en&api_key=098671b1b2733963143f876777cce53fdda6fb6461b1e066e1d91b333b466c60";


    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(url);
      if (response.data && response.data.hotels_results) {
        setHotels(response.data.hotels_results);
        console.log(response.data.hotels_results);
      }
    } catch (err) {
      setError('Error fetching hotels data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Hotel Search</h1>
      <button onClick={fetchHotels} disabled={loading}>
        {loading ? 'Loading...' : 'Search Hotels'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        {hotels.length > 0 ? (
          <ul>
            {hotels.map((hotel, index) => (
              <li key={index}>
                <h3>{hotel.name}</h3>
                <p>Price: {hotel.price}</p>
                <p>Rating: {hotel.rating}</p>
                <p>Reviews: {hotel.reviews_count}</p>
                <p>Address: {hotel.address}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hotels found.</p>
        )}
      </div>
    </div>
  );
};

export default HotelSearch;
