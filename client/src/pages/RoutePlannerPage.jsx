import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';
import { addDailyRecord } from '../utils/api';
import './RoutePlannerPage.css';

window.L = L;

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const EMISSION_FACTORS = {
    car: 0.23,
    bus: 0.05,
    bike: 0.11,
    bicycle: 0,
    walking: 0,
    ev: 0.05
};

const MODE_POINTS_MULTIPLIER = {
    car: 0.5,
    bus: 2.5,
    bike: 1.8,
    bicycle: 3.0,
    walking: 3.0,
    ev: 2.5
};

// Helper component to fix map rendering issues when container size changes
const InvalidateSize = () => {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);
        return () => clearTimeout(timer);
    }, [map]);
    return null;
};

// Routing Component to manage Leaflet-Routing-Machine
const RoutingLayer = ({ start, end, mode, onRouteFound }) => {
    const map = useMap();
    const routingControlRef = useRef(null);
    const labelMarkersRef = useRef([]);

    const formatTime = (seconds, mode) => {
        let factor = 1;
        if (mode === 'bus') factor = 1.3;
        if (mode === 'bike') factor = 3;
        if (mode === 'bicycle') factor = 4;
        if (mode === 'walking') factor = 12;
        if (mode === 'ev') factor = 1;

        const totalSeconds = seconds * factor;
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);

        if (hrs > 0) return `${hrs} hr ${mins} min`;
        return `${mins} min`;
    };

    useEffect(() => {
        if (!map || !start || !end) return;

        // Cleanup function for internal use
        const safeCleanup = () => {
            if (labelMarkersRef.current && map) {
                labelMarkersRef.current.forEach(m => {
                    try { if (map.hasLayer(m)) map.removeLayer(m); } catch (e) { }
                });
                labelMarkersRef.current = [];
            }

            if (routingControlRef.current && map) {
                try {
                    // Forcefully stop any internal timers or requests
                    routingControlRef.current.getPlan().setWaypoints([]);
                    map.removeControl(routingControlRef.current);
                } catch (e) {
                    console.warn("Soft cleanup error:", e);
                }
                routingControlRef.current = null;
            }
        };

        safeCleanup();

        if (!L.Routing || !L.Routing.control) {
            console.error("L.Routing.control is not defined.");
            return;
        }

        routingControlRef.current = L.Routing.control({
            waypoints: [L.latLng(start.lat, start.lng), L.latLng(end.lat, end.lng)],
            lineOptions: {
                styles: [{ color: '#1a73e8', weight: 6, opacity: 0.8 }],
                extendToWaypoints: true,
                missingRouteTolerance: 100
            },
            altLineOptions: {
                styles: [{ color: '#9aa0a6', weight: 5, opacity: 0.6 }]
            },
            router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1',
                profile: 'driving',
            }),
            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: true
        }).on('routesfound', (e) => {
            const routes = e.routes;
            if (!routes || routes.length === 0) return;

            onRouteFound(routes[0].summary.totalDistance / 1000);


            // Clear old markers
            if (labelMarkersRef.current && map) {
                labelMarkersRef.current.forEach(m => {
                    try { if (map.hasLayer(m)) map.removeLayer(m); } catch (e) { }
                });
                labelMarkersRef.current = [];
            }

            routes.forEach((route, idx) => {
                const dist = (route.summary.totalDistance / 1000).toFixed(1);
                const timeStr = formatTime(route.summary.totalTime, mode);
                const coords = route.coordinates;
                const midpoint = coords[Math.floor(coords.length / 2)];

                if (midpoint) {
                    const labelContent = `<div class="route-label-pin ${idx === 0 ? 'active' : ''}">
                        <span class="time">${timeStr}</span>
                        <span class="dist">${dist} km</span>
                    </div>`;

                    const marker = L.marker([midpoint.lat, midpoint.lng], {
                        icon: L.divIcon({
                            className: 'custom-route-label',
                            html: labelContent,
                            iconSize: [100, 40],
                            iconAnchor: [50, 20]
                        }),
                        interactive: false
                    }).addTo(map);

                    labelMarkersRef.current.push(marker);
                }
            });
        }).addTo(map);

        return () => {
            // Use a slight delay for final unmount cleanup to allow LRM to finish any atomic ops
            const ctrl = routingControlRef.current;
            const currentMap = map;
            const markers = [...labelMarkersRef.current];

            setTimeout(() => {
                if (ctrl && currentMap) {
                    try { currentMap.removeControl(ctrl); } catch (e) { }
                }
                markers.forEach(m => {
                    try { if (currentMap.hasLayer(m)) currentMap.removeLayer(m); } catch (e) { }
                });
            }, 50);
        };
    }, [map, start, end, mode, onRouteFound]);

    return null;
};

const RoutePlannerPage = ({ userId, onBack }) => {
    const [startQuery, setStartQuery] = useState('');
    const [endQuery, setEndQuery] = useState('');
    const [startSuggestions, setStartSuggestions] = useState([]);
    const [endSuggestions, setEndSuggestions] = useState([]);
    const [startLoc, setStartLoc] = useState(null);
    const [endLoc, setEndLoc] = useState(null);
    const [mode, setMode] = useState('car');
    const [distance, setDistance] = useState(0);
    const [emissions, setEmissions] = useState(0);
    const [credits, setCredits] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [logSuccess, setLogSuccess] = useState(false);

    const handleLogTrip = async () => {
        if (!userId || distance <= 0) return;
        setLoading(true);
        try {
            await addDailyRecord({
                userId,
                mode,
                distance: parseFloat(distance.toFixed(2)),
                date: new Date().toISOString().split('T')[0]
            });
            setLogSuccess(true);
            setTimeout(() => setLogSuccess(false), 3000);
        } catch (err) {
            setError('Failed to log trip. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // De-bounce search logic for autocomplete
    const fetchSuggestions = useCallback(async (query, setFunc) => {
        if (query.length < 3) {
            setFunc([]);
            return;
        }
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`);
            const data = await res.json();
            setFunc(data);
        } catch (e) {
            console.error(e);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => fetchSuggestions(startQuery, setStartSuggestions), 500);
        return () => clearTimeout(timer);
    }, [startQuery, fetchSuggestions]);

    useEffect(() => {
        const timer = setTimeout(() => fetchSuggestions(endQuery, setEndSuggestions), 500);
        return () => clearTimeout(timer);
    }, [endQuery, fetchSuggestions]);

    const selectLocation = (item, type) => {
        const loc = { lat: parseFloat(item.lat), lng: parseFloat(item.lon), name: item.display_name };
        if (type === 'start') {
            setStartLoc(loc);
            setStartQuery(item.display_name);
            setStartSuggestions([]);
        } else {
            setEndLoc(loc);
            setEndQuery(item.display_name);
            setEndSuggestions([]);
        }
        setError(null); // Clear error on selection
    };

    const handleRouteFound = useCallback((distKm) => {
        setDistance(distKm);
        const factor = EMISSION_FACTORS[mode] || 0;
        setEmissions(parseFloat((distKm * factor).toFixed(2)));
        const multiplier = MODE_POINTS_MULTIPLIER[mode] || 1;
        setCredits(Math.round(distKm * 0.5 * multiplier));
        setLoading(false); // Stop loading after route is found
        setError(null); // Clear any previous errors
    }, [mode]);

    const handleManualSearch = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true);
        setError(null);
        setDistance(0); // Reset distance to trigger new route calculation if locations are already set

        let resolvedStartLoc = startLoc;
        let resolvedEndLoc = endLoc;

        try {
            // If start location is not yet selected from suggestions, try to resolve it from startQuery
            if (!resolvedStartLoc && startQuery.length >= 3) {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(startQuery)}&limit=1&addressdetails=1`);
                const data = await res.json();
                if (data.length > 0) {
                    resolvedStartLoc = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), name: data[0].display_name };
                    setStartLoc(resolvedStartLoc);
                    setStartQuery(data[0].display_name);
                }
            }

            // If end location is not yet selected from suggestions, try to resolve it from endQuery
            if (!resolvedEndLoc && endQuery.length >= 3) {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endQuery)}&limit=1&addressdetails=1`);
                const data = await res.json();
                if (data.length > 0) {
                    resolvedEndLoc = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), name: data[0].display_name };
                    setEndLoc(resolvedEndLoc);
                    setEndQuery(data[0].display_name);
                }
            }

            if (!resolvedStartLoc || !resolvedEndLoc) {
                setError('Please enter and select valid start and end locations, or click "Search & Plan Route" after typing.');
                setLoading(false);
                return;
            }

            // If both are resolved, the RoutingLayer useEffect will pick them up and call handleRouteFound.
            // The loading state will be set to false by handleRouteFound.

        } catch (err) {
            console.error("Error during manual search:", err);
            setError('Failed to resolve locations. Please try again.');
            setLoading(false);
        }
    };

    useEffect(() => {
        // Recalculate emissions/credits if mode changes after a route is found
        if (distance > 0) {
            const factor = EMISSION_FACTORS[mode] || 0;
            setEmissions(parseFloat((distance * factor).toFixed(2)));
            const multiplier = MODE_POINTS_MULTIPLIER[mode] || 1;
            setCredits(Math.round(distance * 0.5 * multiplier));
        }
    }, [mode, distance]);

    // This useEffect ensures that when startLoc or endLoc are updated (either by selection or manual search resolution),
    // the RoutingLayer is triggered, and loading state is managed.
    useEffect(() => {
        if (startLoc && endLoc) {
            setLoading(true);
            setError(null);
            setDistance(0); // Reset distance until new route is found
        }
    }, [startLoc, endLoc]);

    return (
        <div className="planner-container">
            <header className="planner-header">
                <div className="planner-logo">
                    <h1><span>🌳</span> GreenSteps Journey Planner</h1>
                </div>
                <button onClick={onBack} className="back-btn">
                    ⬅ Back to Dashboard
                </button>
            </header>

            <div className="planner-content">
                <aside className="planner-sidebar">
                    <div className="planner-card">
                        <h3>Plan your low-carbon route</h3>

                        <form onSubmit={handleManualSearch}>
                            <div className="input-group">
                                <label>Origin</label>
                                <div className="search-container">
                                    <input
                                        type="text"
                                        value={startQuery}
                                        onChange={(e) => {
                                            setStartQuery(e.target.value);
                                            setStartLoc(null); // Clear selected location if query changes
                                        }}
                                        placeholder="Enter start location..."
                                    />
                                    {startSuggestions.length > 0 && (
                                        <div className="suggestions-dropdown">
                                            {startSuggestions.map(item => (
                                                <div key={item.place_id} className="suggestion-item" onClick={() => selectLocation(item, 'start')}>
                                                    {item.display_name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="input-group" style={{ marginTop: '15px' }}>
                                <label>Destination</label>
                                <div className="search-container">
                                    <input
                                        type="text"
                                        value={endQuery}
                                        onChange={(e) => {
                                            setEndQuery(e.target.value);
                                            setEndLoc(null); // Clear selected location if query changes
                                        }}
                                        placeholder="Enter destination..."
                                    />
                                    {endSuggestions.length > 0 && (
                                        <div className="suggestions-dropdown">
                                            {endSuggestions.map(item => (
                                                <div key={item.place_id} className="suggestion-item" onClick={() => selectLocation(item, 'end')}>
                                                    {item.display_name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <label style={{ display: 'block', marginTop: '20px', fontSize: '13px', fontWeight: '600', color: '#5f6368' }}>Transport Mode</label>
                            <div className="mode-selector">
                                {Object.keys(EMISSION_FACTORS).map(m => (
                                    <button
                                        type="button"
                                        key={m}
                                        className={`mode-btn ${mode === m ? 'active' : ''}`}
                                        onClick={() => setMode(m)}
                                    >
                                        <span className="mode-icon">
                                            {m === 'car' ? '🚗' : m === 'bus' ? '🚌' : m === 'bike' ? '🏍️' : m === 'ev' ? '⚡' : m === 'bicycle' ? '🚴' : '🚶'}
                                        </span>
                                        {m.charAt(0).toUpperCase() + m.slice(1)}
                                    </button>
                                ))}
                            </div>

                            <button type="submit" className="plan-btn" disabled={loading}>
                                {loading ? '🔍 Finding Route...' : '🔍 Search & Plan Route'}
                            </button>
                            {error && <p style={{ color: '#d93025', fontSize: '13px', marginTop: '10px' }}>❌ {error}</p>}
                        </form>

                        {distance > 0 && (
                            <div className="results-summary">
                                <h3>📊 Trip Summary</h3>
                                <div className="result-item">
                                    <span className="result-label">Total Distance</span>
                                    <span className="result-value">{distance.toFixed(1)} km</span>
                                </div>
                                <div className={`impact-badge ${emissions > 10 ? 'high' : 'low'}`}>
                                    {emissions > 10 ? '⚠️ High Impact' : '✅ Eco-Friendly'}
                                </div>

                                <button
                                    onClick={handleLogTrip}
                                    className={`log-trip-btn ${logSuccess ? 'success' : ''}`}
                                    disabled={loading || logSuccess}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        marginTop: '20px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: logSuccess ? '#166534' : '#15803d',
                                        color: 'white',
                                        fontWeight: '600',
                                        cursor: (loading || logSuccess) ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {loading ? '⏳ Logging...' : logSuccess ? '✅ Journey Logged!' : '💚 Log This Journey'}
                                </button>
                                {logSuccess && (
                                    <p style={{ color: '#166534', fontSize: '12px', marginTop: '8px', textAlign: 'center' }}>
                                        Added to your carbon footprint history!
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </aside>

                <main className="map-container-wrapper">
                    {/* Floating Stats Bar */}
                    {distance > 0 && (
                        <div className="map-stats-bar">
                            <div className="stat-group">
                                <span className="stat-label">Estimated Carbon</span>
                                <span className="stat-val carbon">{emissions} kg CO₂</span>
                            </div>
                            <div className="stat-group">
                                <span className="stat-label">Potential Credits</span>
                                <span className="stat-val credits">+{credits} GC</span>
                            </div>
                        </div>
                    )}

                    <MapContainer
                        center={[20.5937, 78.9629]}
                        zoom={5}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <InvalidateSize />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />
                        {startLoc && endLoc && (
                            <RoutingLayer
                                start={startLoc}
                                end={endLoc}
                                mode={mode}
                                onRouteFound={handleRouteFound}
                            />
                        )}
                    </MapContainer>
                </main>
            </div>
        </div>
    );
};

export default RoutePlannerPage;
