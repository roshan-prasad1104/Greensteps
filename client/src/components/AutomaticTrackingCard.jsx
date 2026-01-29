import React, { useState, useEffect, useRef } from 'react';
import { GeoTracker } from '../utils/tracking';
import { addDailyRecord } from '../utils/api';
import { calculateDistance } from '../utils/tracking'; // Import at top level
import '../pages/DashboardPage.css';

const AutomaticTrackingCard = ({ userId, onRecordAdded }) => {
    const [isTracking, setIsTracking] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(null);
    const [overrideVehicle, setOverrideVehicle] = useState('car');
    const [totalSessionDistance, setTotalSessionDistance] = useState(0);
    const [error, setError] = useState(null);
    const [syncing, setSyncing] = useState(false);

    const trackerRef = useRef(null);
    const lastUpdateRef = useRef(null);

    useEffect(() => {
        return () => {
            if (trackerRef.current) trackerRef.current.stop();
        };
    }, []);

    const handleUpdate = async (data) => {
        setCurrentStatus(data);

        // If we have a previous position, calculate incremental distance
        if (lastUpdateRef.current) {
            const dist = calculateDistance(
                lastUpdateRef.current.latitude,
                lastUpdateRef.current.longitude,
                data.latitude,
                data.longitude
            );

            // Only update if we've moved significantly (e.g., > 10 meters) to avoid GPS jitter
            if (dist > 0.01) {
                setTotalSessionDistance(prev => prev + dist);

                // Periodic sync to backend (every 100 meters or significant mode change)
                if (dist > 0.1 || data.mode !== lastUpdateRef.current.mode) {
                    setSyncing(true);
                    try {
                        await addDailyRecord({
                            mode: data.mode,
                            distance: dist,
                            trips: 0 // Incremental update
                        });
                        onRecordAdded();
                    } catch (err) {
                        console.error('Failed to sync tracking data:', err);
                    } finally {
                        setSyncing(false);
                    }
                }
            }
        }
        lastUpdateRef.current = data;
    };

    const toggleTracking = () => {
        if (isTracking) {
            trackerRef.current.stop();
            setIsTracking(false);
            lastUpdateRef.current = null;
            setCurrentStatus(null);
        } else {
            setError(null);
            trackerRef.current = new GeoTracker(handleUpdate, (err) => {
                setError(err);
                setIsTracking(false);
            });
            trackerRef.current.setOverride(overrideVehicle);
            trackerRef.current.start();
            setIsTracking(true);
        }
    };

    const handleVehicleChange = (newVehicle) => {
        setOverrideVehicle(newVehicle);
        if (trackerRef.current) {
            trackerRef.current.setOverride(newVehicle);
        }
    };

    return (
        <div className="dashboard-card auto-tracking-card">
            <h3>🛰️ Automatic Tracking</h3>
            <div className="tracking-controls">
                <button
                    onClick={toggleTracking}
                    className={`tracking-toggle ${isTracking ? 'stop' : 'start'}`}
                >
                    {isTracking ? 'Stop Tracking' : 'Start Automatic Tracking'}
                </button>

                {isTracking && (
                    <div className="vehicle-override">
                        <p>Vehicle Type:</p>
                        <div className="vehicle-buttons">
                            {['car', 'ev', 'bus', 'bike'].map(mode => (
                                <button
                                    key={mode}
                                    className={overrideVehicle === mode ? 'active' : ''}
                                    onClick={() => handleVehicleChange(mode)}
                                >
                                    {mode.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {isTracking && currentStatus && (
                <div className="tracking-status">
                    <div className="status-item">
                        <span>Detected Mode:</span>
                        <strong>{currentStatus.mode.toUpperCase()}</strong>
                    </div>
                    <div className="status-item">
                        <span>Speed:</span>
                        <strong>{Math.round(currentStatus.speed)} km/h</strong>
                    </div>
                    <div className="status-item">
                        <span>Recent Distance:</span>
                        <strong>{totalSessionDistance.toFixed(2)} km</strong>
                    </div>
                </div>
            )}

            {isTracking && !currentStatus && (
                <div className="tracking-status" style={{ background: '#fef3c7', borderColor: '#f59e0b', marginBottom: '10px' }}>
                    <p style={{ color: '#92400e', textAlign: 'center', margin: 0, fontSize: '13px' }}>
                        ⏳ Initializing GPS... Please ensure location is enabled.
                    </p>
                </div>
            )}

            {/* Map removed from card as per request. Use 'Plan Route' button for full map. */}

            {syncing && (
                <div className="sync-indicator">
                    <span className="sync-dot"></span> Saving progress...
                </div>
            )}

            {error && <p className="error-text">❌ {error}</p>}

            {!isTracking && (
                <p className="card-hint">
                    Enable GPS to automatically track your movement and earn points without manual entry.
                </p>
            )}
        </div>
    );
};

export default AutomaticTrackingCard;
