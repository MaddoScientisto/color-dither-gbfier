/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Collapsible(props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div className="collapsible">
        <div
          className="collapsible-header"
          onClick={handleToggle}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <span className="collapsible-icon">{isOpen ? '▼' : '►'}</span>
          {props.title}
        </div>
        {isOpen && <div className="collapsible-content">{props.children}</div>}
      </div>
    </div>
  );
}

Collapsible.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Collapsible;
