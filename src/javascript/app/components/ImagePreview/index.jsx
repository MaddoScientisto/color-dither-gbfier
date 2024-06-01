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

  // const splitRGBChannels = (imgData) => {
  //   // const channelsData = {
  //   //   red: {}, green: {}, blue: {},
  //   // };

  //   const data = imgData.data;
  //   ['red', 'green', 'blue'].forEach((color, index) => {
  //     const channelCanvas = document.createElement('canvas');
  //     channelCanvas.width = imgData.width;
  //     channelCanvas.height = imgData.height;
  //     const ctx = channelCanvas.getContext('2d');
  //     const channelData = new ImageData(imgData.width, imgData.height);

  //     for (let i = 0; i < imgData.data.length; i += 4) {
  //       const value = data[i + index]; // Get the value of the current channel
  //       channelData.data[i] = value; // Red
  //       channelData.data[i + 1] = value; // Green
  //       channelData.data[i + 2] = value; // Blue
  //       channelData.data[i + 3] = data[i + 3]; // Alpha
  //     }

  //     ctx.putImageData(channelData, 0, 0);

  //     channelsData[color] = ctx.getImageData(0, 0, imgData.width, imgData.height);

  //   });

  //   return channelsData;
  // };

  const getChannel = (imgData, chnl) => {
    const { red, green, blue } = imgData.channelsData; // splitRGBChannels(imgData);

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
          imageData: getChannel(imageData, channel), // imageData.imageData,
          orderPatterns,
          baseValues,
        });
      } else {
        applyRGBMerge({
          targetCanvas: canvas.current,
          originalCanvas: originalCanvas.current,
          imageData: imageData.imageData, // imageData.imageData,
          channelsData: imageData.channelsData,
          orderPatterns,
          baseValues,
        });
      }
    }
  });

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
      <canvas
        className="image-preview__canvas"
        width={width}
        height={height}
        ref={canvas}
      />
    </div>
  );
}

ImagePreview.propTypes = {
  baseValues: PropTypes.array.isRequired,
  channel: PropTypes.string.isRequired,
};

ImagePreview.defaultProps = {};

export default ImagePreview;
