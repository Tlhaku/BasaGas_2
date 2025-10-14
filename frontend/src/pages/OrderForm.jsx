import { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from '../hooks/useGoogleMaps.js';
import { GOOGLE_MAPS_API_KEY } from '../config.js';

const BASE_PRICES = { 2: 70, 3: 104, 5: 184, 7: 250 };
const DELIVERY_FEE = 45;

export default function OrderForm() {
  const [form, setForm] = useState({
    pickupAddress: '',
    dropoffAddress: '',
    cylinderSize: 2,
    quantity: 1,
    returnTime: '',
    paymentType: 'pay-per-refill',
  });
  const [price, setPrice] = useState(() => calculatePrice({
    pickupAddress: '',
    dropoffAddress: '',
    cylinderSize: 2,
    quantity: 1,
    returnTime: '',
    paymentType: 'pay-per-refill',
  }));
  const [message, setMessage] = useState('');
  const [locatingField, setLocatingField] = useState('');
  const [locationError, setLocationError] = useState('');
  const googleMaps = useGoogleMaps();
  const pickupInputRef = useRef(null);
  const dropoffInputRef = useRef(null);
  const pickupAutocomplete = useRef(null);
  const dropoffAutocomplete = useRef(null);

  function calculatePrice(f) {
    const base = BASE_PRICES[f.cylinderSize] * f.quantity + DELIVERY_FEE;
    return f.paymentType === 'subscription' ? base * 0.9 : base;
  }

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    setLocationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      setMessage(`Order created with ID ${data.id} and price R${data.price}`);
    } else {
      setMessage('Failed to create order');
    }
  };

  useEffect(() => {
    setPrice(calculatePrice(form));
  }, [form]);

  useEffect(() => {
    if (!googleMaps) return;

    const attachAutocomplete = (inputRef, field, storeRef) => {
      if (!inputRef.current) return null;

      const autocomplete = new googleMaps.maps.places.Autocomplete(inputRef.current, {
        fields: ['formatted_address', 'geometry', 'place_id'],
        types: ['geocode'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place?.formatted_address) {
          setForm((prev) => ({ ...prev, [field]: place.formatted_address }));
        }
      });

      storeRef.current = autocomplete;
      return autocomplete;
    };

    const pickup = attachAutocomplete(pickupInputRef, 'pickupAddress', pickupAutocomplete);
    const dropoff = attachAutocomplete(dropoffInputRef, 'dropoffAddress', dropoffAutocomplete);

    return () => {
      if (pickup) {
        googleMaps.maps.event.clearInstanceListeners(pickup);
      }
      if (dropoff) {
        googleMaps.maps.event.clearInstanceListeners(dropoff);
      }
    };
  }, [googleMaps]);

  const snapToNearestRoad = async (location) => {
    try {
      const response = await fetch(
        `https://roads.googleapis.com/v1/nearestRoads?points=${location.lat},${location.lng}&key=${GOOGLE_MAPS_API_KEY}`,
      );
      if (response.ok) {
        const data = await response.json();
        const snappedPoint = data?.snappedPoints?.[0];
        if (snappedPoint?.location) {
          return {
            lat: snappedPoint.location.latitude,
            lng: snappedPoint.location.longitude,
          };
        }
      }
    } catch (error) {
      console.warn('Failed to snap to nearest road', error);
    }
    return location;
  };

  const resolveAddressFromLocation = async (location) => {
    if (!googleMaps) return '';

    let placeId = '';
    try {
      const directionsService = new googleMaps.maps.DirectionsService();
      const directions = await directionsService.route({
        origin: location,
        destination: { lat: location.lat + 0.0001, lng: location.lng },
        travelMode: googleMaps.maps.TravelMode.DRIVING,
      });
      placeId = directions?.geocoded_waypoints?.[0]?.place_id ?? '';
    } catch (error) {
      console.warn('Routes API lookup failed', error);
    }

    if (placeId) {
      try {
        const service = new googleMaps.maps.places.PlacesService(document.createElement('div'));
        const details = await new Promise((resolve, reject) => {
          service.getDetails(
            { placeId, fields: ['formatted_address'] },
            (result, status) => {
              if (status === googleMaps.maps.places.PlacesServiceStatus.OK) {
                resolve(result?.formatted_address ?? '');
              } else {
                reject(status);
              }
            },
          );
        });

        if (details) {
          return details;
        }
      } catch (error) {
        console.warn('Places lookup failed', error);
      }
    }

    return `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`;
  };

  const handleUseLocation = async (field) => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this device.');
      return;
    }
    if (!googleMaps) {
      setLocationError('Google Maps is still loading. Please try again in a moment.');
      return;
    }

    setLocatingField(field);
    setLocationError('');

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const rawLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const roadAligned = await snapToNearestRoad(rawLocation);
      const resolvedAddress = await resolveAddressFromLocation(roadAligned);

      setForm((prev) => ({ ...prev, [field]: resolvedAddress }));
    } catch (error) {
      console.warn('Unable to read current location', error);
      setLocationError('We could not determine your location. Please allow location access and try again.');
    } finally {
      setLocatingField('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-md">
      <h1 className="text-2xl font-semibold text-gray-900">Order Refill</h1>

      <div className="mt-6 space-y-6">
        <div>
          <label className="flex flex-col text-left text-sm font-semibold text-gray-700">
            <span className="flex flex-wrap items-baseline gap-2">
              Pick-up Address
              <span className="text-xs font-normal text-gray-500">
                Where should we pick up your empty cylinders?
              </span>
            </span>
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              ref={pickupInputRef}
              className="w-full flex-1 rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              name="pickupAddress"
              placeholder="e.g. 12 Main Road, Cape Town"
              value={form.pickupAddress}
              onChange={handleChange}
              autoComplete="street-address"
            />
            <button
              type="button"
              className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
              onClick={() => handleUseLocation('pickupAddress')}
              disabled={locatingField === 'pickupAddress'}
            >
              {locatingField === 'pickupAddress' ? 'Locating…' : 'Use My Location'}
            </button>
          </div>
        </div>

        <div className="mt-8">
          <label className="flex flex-col text-left text-sm font-semibold text-gray-700">
            <span className="flex flex-wrap items-baseline gap-2">
              Drop-off Address
              <span className="text-xs font-normal text-gray-500">
                Where should we drop off your refilled cylinders?
              </span>
            </span>
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              ref={dropoffInputRef}
              className="w-full flex-1 rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              name="dropoffAddress"
              placeholder="e.g. 45 Market Street, Johannesburg"
              value={form.dropoffAddress}
              onChange={handleChange}
              autoComplete="address-line2"
            />
            <button
              type="button"
              className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
              onClick={() => handleUseLocation('dropoffAddress')}
              disabled={locatingField === 'dropoffAddress'}
            >
              {locatingField === 'dropoffAddress' ? 'Locating…' : 'Use My Location'}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-left text-sm font-semibold text-gray-700">Cylinder Size</label>
          <select
            className="mt-2 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            name="cylinderSize"
            value={form.cylinderSize}
            onChange={handleChange}
          >
            {[2, 3, 5, 7].map((size) => (
              <option key={size} value={size}>
                {size}kg
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-left text-sm font-semibold text-gray-700" htmlFor="quantity">
            Quantity
          </label>
          <input
            id="quantity"
            className="mt-2 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            type="number"
            name="quantity"
            min="1"
            value={form.quantity}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-left text-sm font-semibold text-gray-700" htmlFor="returnTime">
            Preferred Return Time
          </label>
          <input
            id="returnTime"
            className="mt-2 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            type="datetime-local"
            name="returnTime"
            value={form.returnTime}
            onChange={handleChange}
          />
        </div>

        <fieldset>
          <legend className="text-left text-sm font-semibold text-gray-700">Payment Type</legend>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="paymentType"
                value="subscription"
                checked={form.paymentType === 'subscription'}
                onChange={handleChange}
              />
              Subscription (10% discount)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="paymentType"
                value="pay-per-refill"
                checked={form.paymentType === 'pay-per-refill'}
                onChange={handleChange}
              />
              Pay-per-refill
            </label>
          </div>
        </fieldset>

        {locationError && <p className="text-sm text-red-600">{locationError}</p>}

        <div className="text-left text-lg font-semibold text-gray-900">Price: R{price.toFixed(2)}</div>

        <button
          className="w-full rounded bg-orange-500 px-4 py-3 text-white transition hover:bg-orange-600"
          type="submit"
        >
          Submit Order
        </button>

        {message && <p className="text-sm text-green-700">{message}</p>}
      </div>
    </form>
  );
}
