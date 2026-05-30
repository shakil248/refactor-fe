import React from 'react';
import '../styles/DiffLegend.css';

/**
 * DiffLegend Component
 * Displays a legend explaining the color coding for refactoring changes.
 */
const DiffLegend = () => {
  return (
    <div className="diff-legend-container">
      <div className="legend-title">📌 Change Legend</div>
      <div className="legend-items">
        <div className="legend-item modified">
          <div className="legend-indicator"></div>
          <span>Modified - Line has been changed</span>
        </div>
        <div className="legend-item added">
          <div className="legend-indicator"></div>
          <span>Added - New line in refactored code</span>
        </div>
        <div className="legend-item removed">
          <div className="legend-indicator"></div>
          <span>Removed - Line deleted from original</span>
        </div>
      </div>
    </div>
  );
};

export default DiffLegend;

