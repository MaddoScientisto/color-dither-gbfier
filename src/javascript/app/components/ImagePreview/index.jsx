import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import './index.scss';
import applyBitmapFilter from '../../../../tools/applyBitmapFilter';
import applyRGBMerge from '../../../../tools/applyRGBMerge';

function ImagePreview({
  baseValues,
  channel,
}) {
  const canvas = useRef(null);
  const originalCanvas = useRef(null);

  const [imageData, orderPatterns] = useSelector((state) => [state.imageData, state.orderPatterns]);

  const getChannel = (imgData, chnl) => {
    const { red, green, blue } = imgData.channelsData;

    switch (chnl) {
      case 'R':

        return red;

      case 'G':

        return green;

      case 'B':

        return blue;

      case 'All':

        return imgData.imageData;

      case 'Result':
        // TODO: Change
        return imgData.imageData;
      default:

        return imgData.imageData;
    }
  };


  useEffect(() => {
    if (canvas.current && originalCanvas.current) {
      if (channel !== 'Result') {
        applyBitmapFilter({
          targetCanvas: canvas.current,
          originalCanvas: originalCanvas.current,
          imageData: getChannel(imageData, channel),
          orderPatterns,
          baseValues,
        });
      } else {
        applyRGBMerge({
          targetCanvas: canvas.current,
          originalCanvas: originalCanvas.current,
          imageData: imageData.imageData,
          channelsData: imageData.channelsData,
          orderPatterns,
          baseValues,
        });
      }
    }
  });

  /**
 * Appends a string to the filename before its extension.
 *
 * @param {string} filename - The original filename.
 * @param {string} suffix - The string to append to the filename.
 * @returns {string} - The modified filename.
 */
  function appendToFilename(filename, suffix) {
  // Find the last dot to determine where the extension starts
    const dotIndex = filename.lastIndexOf('.');
    // Check if there's a valid extension
    if (dotIndex !== -1) {
      // Insert the suffix before the dot (extension)
      return filename.substring(0, dotIndex) + suffix + filename.substring(dotIndex);
    }

    // No extension found, append the suffix to the end
    return filename + suffix;

  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = appendToFilename(imageData.fileName, `_${channel}`);
    link.href = canvas.current.toDataURL();
    link.click();
  };

  if (!orderPatterns?.length || !imageData?.width || !imageData?.height) {
    return null;
  }

  const { width, height } = imageData;

  return (
    <div className="image-preview">
      <canvas
        className="image-preview__canvas"
        width={width}
        height={height}
        ref={originalCanvas}
      />
      <span
        className="image-preview__arrow"
      >
        →
      </span>
      <div className="canvas-container">
        <canvas
          className="image-preview__canvas"
          width={width}
          height={height}
          ref={canvas}
        />
        <button
          type="button"
          className="canvas-container__download-btn"
          onClick={handleDownload}
        >
          ⬇️
        </button>
      </div>
    </div>
  );
}

ImagePreview.propTypes = {
  baseValues: PropTypes.array.isRequired,
  channel: PropTypes.string.isRequired,
};

ImagePreview.defaultProps = {};

export default ImagePreview;
