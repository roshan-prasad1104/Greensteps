/**
 * Automatic Tracking Utility
 * Uses Geolocation API to detect speed and classify transport mode.
 */

const MODE_SPEED_THRESHOLDS = {
    WALKING: { max: 6, mode: 'walking' },
    BICYCLE: { max: 25, mode: 'bicycle' },
    VEHICLE: { max: Infinity, mode: 'car' } // 'car' is default vehicle, can be overridden
};

export const classifyMode = (speedKmH, overrideVehicle = null) => {
    if (speedKmH <= MODE_SPEED_THRESHOLDS.WALKING.max) return 'walking';
    if (speedKmH <= MODE_SPEED_THRESHOLDS.BICYCLE.max) return 'bicycle';
    return overrideVehicle || 'car';
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

export class GeoTracker {
    constructor(onUpdate, onError) {
        this.onUpdate = onUpdate;
        this.onError = onError;
        this.watchId = null;
        this.lastPosition = null;
        this.currentOverride = null;
    }

    setOverride(mode) {
        this.currentOverride = mode;
    }

    start() {
        if (!navigator.geolocation) {
            this.onError('Geolocation is not supported by your browser');
            return;
        }

        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, speed } = position.coords;
                let speedKmH = speed ? speed * 3.6 : 0; // m/s to km/h

                // If speed is not provided by GPS, calculate it from distance and time
                if (speed === null && this.lastPosition) {
                    const distance = calculateDistance(
                        this.lastPosition.lat,
                        this.lastPosition.lon,
                        latitude,
                        longitude
                    );
                    const timeElapsed = (position.timestamp - this.lastPosition.timestamp) / 1000 / 3600; // in hours
                    if (timeElapsed > 0) {
                        speedKmH = distance / timeElapsed;
                    }
                }

                const mode = classifyMode(speedKmH, this.currentOverride);

                this.onUpdate({
                    latitude,
                    longitude,
                    speed: speedKmH,
                    mode,
                    timestamp: position.timestamp
                });

                this.lastPosition = { lat: latitude, lon: longitude, timestamp: position.timestamp };
            },
            (error) => {
                this.onError(error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    }

    stop() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }
}
