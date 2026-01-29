import React from 'react';
import './FullscreenModal.css';

const FullscreenModal = ({ isOpen, onClose, title, children }) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fullscreen-overlay" onClick={onClose}>
      <div className="fullscreen-container" onClick={(e) => e.stopPropagation()}>
        <div className="fullscreen-header">
          <h2>{title}</h2>
          <button 
            className="fullscreen-close"
            onClick={onClose}
            title="Close fullscreen"
          >
            ✕
          </button>
        </div>
        <div className="fullscreen-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FullscreenModal;
