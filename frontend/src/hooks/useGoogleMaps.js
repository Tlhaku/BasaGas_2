import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { GOOGLE_MAPS_API_KEY } from '../config.js';

const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places'],
});

let loaderPromise;

export function useGoogleMaps() {
  const [googleMaps, setGoogleMaps] = useState(null);

  useEffect(() => {
    if (!loaderPromise) {
      loaderPromise = loader.load();
    }

    loaderPromise
      .then((google) => {
        setGoogleMaps(google);
      })
      .catch((error) => {
        console.error('Failed to load Google Maps', error);
      });
  }, []);

  return googleMaps;
}
