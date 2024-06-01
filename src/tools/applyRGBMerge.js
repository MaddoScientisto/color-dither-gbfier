import applyBitmapFilter from './applyBitmapFilter';

const mergeRGBChannels = ({ red, green, blue }) => {
  const width = red.width;
  const height = red.height;

  // Create new ImageData for the merged RGB
  const mergedImageData = new ImageData(width, height);

  for (let i = 0; i < red.data.length; i += 4) {
    // Extract the intensity from each color's ImageData and use it as the color value for that channel
    mergedImageData.data[i] = red.data[i]; // Red channel
    mergedImageData.data[i + 1] = green.data[i]; // Green channel
    mergedImageData.data[i + 2] = blue.data[i]; // Blue channel
    mergedImageData.data[i + 3] = 255; // Alpha channel, fully opaque
  }

  return mergedImageData;
};

const applyRGBMerge = ({
  targetCanvas,
  originalCanvas,
  imageData,
  channelsData,
  orderPatterns,
  baseValues,
}) => {
  const redCanvas = document.createElement('canvas');
  const greenCanvas = document.createElement('canvas');
  const blueCanvas = document.createElement('canvas');
  const tempCanvas = document.createElement('canvas'); // Temp canvas for original context in applyBitmapFilter

  redCanvas.width = originalCanvas.width;
  redCanvas.height = originalCanvas.height;
  greenCanvas.width = originalCanvas.width;
  greenCanvas.height = originalCanvas.height;
  blueCanvas.width = originalCanvas.width;
  blueCanvas.height = originalCanvas.height;
  tempCanvas.width = originalCanvas.width;
  tempCanvas.height = originalCanvas.height;

  applyBitmapFilter({
    targetCanvas: redCanvas,
    originalCanvas: tempCanvas,
    imageData: channelsData.red,
    orderPatterns,
    baseValues: baseValues.red ? baseValues.red : baseValues,
  });

  applyBitmapFilter({
    targetCanvas: greenCanvas,
    originalCanvas: tempCanvas,
    imageData: channelsData.green,
    orderPatterns,
    baseValues: baseValues.green ? baseValues.green : baseValues,
  });

  applyBitmapFilter({
    targetCanvas: blueCanvas,
    originalCanvas: tempCanvas,
    imageData: channelsData.blue,
    orderPatterns,
    baseValues: baseValues.blue ? baseValues.blue : baseValues,
  });

  const mergedImageData = mergeRGBChannels({
    red: redCanvas.getContext('2d').getImageData(0, 0, redCanvas.width, redCanvas.height),
    green: greenCanvas.getContext('2d').getImageData(0, 0, greenCanvas.width, greenCanvas.height),
    blue: blueCanvas.getContext('2d').getImageData(0, 0, blueCanvas.width, blueCanvas.height),
  });

  const context = targetCanvas.getContext('2d');
  context.putImageData(mergedImageData, 0, 0);
  const originalContext = originalCanvas.getContext('2d');
  originalContext.putImageData(imageData, 0, 0);
};

export default applyRGBMerge;
