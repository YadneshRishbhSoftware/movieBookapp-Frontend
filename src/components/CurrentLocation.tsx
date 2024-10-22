import React, { useState, useEffect } from 'react';

const CurrentLocation: React.FC = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  const successCallback = (position: GeolocationPosition) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    setLatitude(lat);
    setLongitude(lng);

    fetchLocationName(lat, lng);
  };

  const errorCallback = (error: GeolocationPositionError) => {
    setError(`Error Code = ${error.code} - ${error.message}`);
  };

  const fetchLocationName = async (lat: number, lng: number) => {
    const apiKey = ''; // Replace with your API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        const addressComponents = data.results[0].address_components;
        const cityComponent = addressComponents.find((component: any) =>
          component.types.includes('locality')
        );

        if (cityComponent) {
          setLocationName(cityComponent.long_name);
        } else {
          console.error('City not found in address components');
        }
      } else {
        console.error('Geocoding API error:', data.status);
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  return (
    <div>
      <h1>Current Location</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <p>{locationName ? `City: ${locationName}` : 'Fetching location...'}</p>
      )}
    </div>
  );
};

export default CurrentLocation;