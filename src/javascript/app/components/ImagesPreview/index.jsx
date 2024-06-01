import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import ImagePreview from '../ImagePreview';
import Collapsible from '../Collapsible';


function ImagesPreview({
  baseValues,
}) {
  const [activePatternIndex, setActivePatternIndex] = useState(Math.floor(baseValues.length / 2));

  return (
    <div className="images-preview">
      <ImagePreview
        baseValues={baseValues[activePatternIndex]}
        channel="All"
      />
      <Collapsible title="Color Channels">
        <p>Red</p>
        <ImagePreview
          baseValues={baseValues[activePatternIndex]}
          channel="R"
        />
        <p>Green</p>
        <ImagePreview
          baseValues={baseValues[activePatternIndex]}
          channel="G"
        />
        <p>Blue</p>
        <ImagePreview
          baseValues={baseValues[activePatternIndex]}
          channel="B"
        />
      </Collapsible>

      <p>Merged</p>
      <ImagePreview
        baseValues={baseValues[activePatternIndex]}
        channel="Result"
      />
      <div className="images-preview__buttons">
        { baseValues?.map((_, index) => (
          <button
            type="button"
            className={`images-preview__button ${index === activePatternIndex ? 'images-preview__button--active' : ''}`}
            key={index}
            onMouseEnter={() => setActivePatternIndex(index)}
            onClick={() => setActivePatternIndex(index)}
          >
            { index }
          </button>
        ))}
      </div>
    </div>
  );
}

ImagesPreview.propTypes = {
  baseValues: PropTypes.array.isRequired,
};

ImagesPreview.defaultProps = {};

export default ImagesPreview;
