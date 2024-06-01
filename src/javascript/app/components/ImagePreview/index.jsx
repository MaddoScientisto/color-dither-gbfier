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
      case 'RGBResult':
        // TODO: Change
        return imgData.imageData;
      default:

        return imgData.imageData;
    }
  };


  useEffect(() => {
    if (canvas.current && originalCanvas.current) {
      if (channel !== 'Result' && channel !== 'RGBResult') {
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

  const handleDownload = (scale = 1) => {
    let downloadCanvas = canvas.current;

    if (scale !== 1) {
      // Create a new canvas only if magnification is needed
      downloadCanvas = document.createElement('canvas');
      const context = downloadCanvas.getContext('2d');

      // Set the dimensions of the new canvas
      downloadCanvas.width = canvas.current.width * scale;
      downloadCanvas.height = canvas.current.height * scale;

      context.imageSmoothingEnabled = false; // Disabling smoothing
      context.mozImageSmoothingEnabled = false; // For Firefox
      context.webkitImageSmoothingEnabled = false; // For Safari/Chrome
      context.msImageSmoothingEnabled = false; // For IE

      // Scale and draw the original canvas onto the new canvas
      context.scale(scale, scale);
      context.drawImage(canvas.current, 0, 0);
    }

    const link = document.createElement('a');
    link.download = appendToFilename(imageData.fileName, `_${channel}${scale !== 1 ? `_x${scale}` : ''}`);
    link.href = downloadCanvas.toDataURL();
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
          onClick={() => handleDownload(1)}
        >
          ⬇️
        </button>
        <button
          type="button"
          className="canvas-container__download-btn"
          style={{ right: '38px' }} // Adjust position to avoid overlap with the original download button
          onClick={() => handleDownload(4)}
          title="Download 4x Magnified"
        >
          x4
        </button>
      </div>
    </div>
  );
}

ImagePreview.propTypes = {
  baseValues: PropTypes.any.isRequired, // .array.isRequired,
  channel: PropTypes.string.isRequired,
};

ImagePreview.defaultProps = {};

export default ImagePreview;
