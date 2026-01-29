import React from 'react';
import './ImpactVisualizer.css';

const ImpactVisualizer = ({ totalEmissions, totalPoints }) => {
    // Logic to determine "health" of the footprint
    // Higher points = more vibrant/growing footprint
    // Higher emissions = maybe a bit more muted or smaller? 
    // For now, let's keep it simple as requested: "tree picture"

    const impactScore = Math.max(0, 100 - (totalEmissions / 10) + (totalPoints / 100)); // Example score
    const scale = Math.min(1.2, 0.8 + (impactScore / 200));

    return (
        <div className="card impact-visualizer-card">
            <div className="card-title">🌱 Your Eco-Footprint</div>
            <div className="visualizer-content">
                <div className="image-container" style={{ transform: `scale(${scale})` }}>
                    <img
                        src="/assets/eco_footprint.png"
                        alt="Eco Footprint Tree"
                        className="impact-image"
                    />
                </div>
                <div className="impact-info">
                    <p className="impact-message">
                        {impactScore > 80 ? "Your footprint is flourishing!" :
                            impactScore > 50 ? "You're making a positive impact!" :
                                "Start your eco-journey today!"}
                    </p>
                    <div className="score-bar">
                        <div className="score-fill" style={{ width: `${Math.min(100, impactScore)}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImpactVisualizer;
