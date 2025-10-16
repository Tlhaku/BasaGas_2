import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGoogleMaps } from '../hooks/useGoogleMaps.js';

const DEFAULT_CENTER = { lat: -26.2041, lng: 28.0473 };

export default function Track() {
  const googleMaps = useGoogleMaps();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeView = searchParams.get('view') || 'order';
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const pathRef = useRef(null);
  const historyRef = useRef([]);
  const [status, setStatus] = useState('Initialising location services…');

  useEffect(() => {
    if (!googleMaps || !mapRef.current || mapInstance.current) return;

    mapInstance.current = new googleMaps.maps.Map(mapRef.current, {
      center: DEFAULT_CENTER,
      zoom: 13,
      disableDefaultUI: true,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#1d2939' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#f8fafc' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#1d2939' }] },
      ],
    });
  }, [googleMaps]);

  useEffect(() => {
    if (!googleMaps || !mapInstance.current) return;
    if (!navigator.geolocation) {
      setStatus('Live tracking is unavailable on this device.');
      return;
    }

    setStatus('Waiting for your device to broadcast its position…');

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const nextLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        historyRef.current = [...historyRef.current, nextLocation].slice(-50);

        if (!markerRef.current) {
          markerRef.current = new googleMaps.maps.Marker({
            map: mapInstance.current,
            position: nextLocation,
            title: 'Live device position',
          });
        } else {
          markerRef.current.setPosition(nextLocation);
        }

        if (!pathRef.current) {
          pathRef.current = new googleMaps.maps.Polyline({
            map: mapInstance.current,
            strokeColor: '#f97316',
            strokeOpacity: 0.85,
            strokeWeight: 4,
          });
        }

        pathRef.current.setPath(historyRef.current);
        mapInstance.current.setCenter(nextLocation);
        setStatus(`Last update received at ${new Date().toLocaleTimeString()}`);
      },
      (error) => {
        setStatus(error.message || 'We could not read your live location.');
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [googleMaps]);

  const handleViewChange = (view) => {
    setSearchParams({ view });
  };

  return (
    <div className="relative min-h-[70vh] overflow-hidden rounded-xl shadow-lg">
      <div ref={mapRef} className="absolute inset-0" aria-hidden="true" />
      <div className="relative z-10 flex min-h-[70vh] flex-col justify-between bg-slate-900/60 p-6 text-slate-100 backdrop-blur">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold">Track your delivery</h1>
          <p className="max-w-xl text-sm text-slate-200">{status}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleViewChange('order')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeView === 'order'
                  ? 'bg-orange-500 text-white shadow'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Track My Order
            </button>
            <button
              type="button"
              onClick={() => handleViewChange('link')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeView === 'link'
                  ? 'bg-orange-500 text-white shadow'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Link My Phone
            </button>
          </div>
        </div>

        <section className="grid gap-3 rounded-lg bg-white/10 p-4 text-sm leading-relaxed text-slate-100">
          {activeView === 'order' ? (
            <>
              <h2 className="text-lg font-semibold text-white">Live order summary</h2>
              <p>
                We keep this map running even when you leave the page so that your family or office team can see the latest
                updates. The highlighted route shows the path your driver has taken so far.
              </p>
              <ul className="grid gap-1 text-xs text-slate-200 sm:grid-cols-2">
                <li>
                  <span className="font-semibold text-white">Driver:</span> Assigned once your order is confirmed.
                </li>
                <li>
                  <span className="font-semibold text-white">ETA:</span> Updated automatically based on traffic conditions.
                </li>
                <li>
                  <span className="font-semibold text-white">Vehicle:</span> Registered vehicle will appear here when linked.
                </li>
                <li>
                  <span className="font-semibold text-white">Last signal:</span> {status}
                </li>
              </ul>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-white">Link your phone</h2>
              <p>
                Keep this page open on the device that will travel with the cylinders. We continuously listen for location
                updates and broadcast them securely to the rest of your team.
              </p>
              <ol className="list-decimal space-y-1 pl-5 text-xs text-slate-200">
                <li>Allow location sharing when prompted by your browser.</li>
                <li>Keep your phone unlocked or disable battery optimisations for uninterrupted tracking.</li>
                <li>Share the Track My Order link with customers so they can monitor progress in real time.</li>
              </ol>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
