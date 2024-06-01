import readFileAs from '../../../../tools/readFileAs';

/* eslint-disable no-param-reassign */
const prepareContext = (context, applyFilter = true) => {
  context.fillStyle = '#000';
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  if (applyFilter) {
    context.filter = 'grayscale(1)';
  }

  context.imageSmoothingEnabled = false;
};
/* eslint-enable no-param-reassign */

const splitRGBChannels = (canvas, context) => {
  const width = canvas.width;
  const height = canvas.height;
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Create new ImageData objects for each color channel
  const redChannelData = new ImageData(width, height);
  const greenChannelData = new ImageData(width, height);
  const blueChannelData = new ImageData(width, height);

  for (let i = 0; i < data.length; i += 4) {
    const redIntensity = data[i];
    const greenIntensity = data[i + 1];
    const blueIntensity = data[i + 2];

    // Red channel in grayscale
    redChannelData.data[i] = redIntensity;
    redChannelData.data[i + 1] = redIntensity;
    redChannelData.data[i + 2] = redIntensity;
    redChannelData.data[i + 3] = 255;

    // Green channel in grayscale
    greenChannelData.data[i] = greenIntensity;
    greenChannelData.data[i + 1] = greenIntensity;
    greenChannelData.data[i + 2] = greenIntensity;
    greenChannelData.data[i + 3] = 255;

    // Blue channel in grayscale
    blueChannelData.data[i] = blueIntensity;
    blueChannelData.data[i + 1] = blueIntensity;
    blueChannelData.data[i + 2] = blueIntensity;
    blueChannelData.data[i + 3] = 255;
  }

  // Place each channel into an individual canvas to extract the ImageData
  const channelsCanvas = [document.createElement('canvas'), document.createElement('canvas'), document.createElement('canvas')].map((c) => {
    const nc = c;
    nc.width = width;
    nc.height = height;
    return nc;
  });

  const redCtx = channelsCanvas[0].getContext('2d');
  const greenCtx = channelsCanvas[1].getContext('2d');
  const blueCtx = channelsCanvas[2].getContext('2d');

  redCtx.putImageData(redChannelData, 0, 0);
  greenCtx.putImageData(greenChannelData, 0, 0);
  blueCtx.putImageData(blueChannelData, 0, 0);

  return {
    red: redCtx.getImageData(0, 0, width, height),
    green: greenCtx.getImageData(0, 0, width, height),
    blue: blueCtx.getImageData(0, 0, width, height),
  };
};

const scale = (img, canvas, context, applyFilter) => {
  let scaleFactor;
  const srcWidth = img.naturalWidth;
  const srcHeight = img.naturalHeight;
  const ratio = srcHeight / srcWidth;

  const newCanvas = canvas;
  const newContext = context;
  // if an image has the ratio of the "sensor" resolution of 128x112, import it inside of a frame
  if (ratio === 112 / 128) {
    newCanvas.height = 144;
    scaleFactor = img.naturalWidth / 128;
    prepareContext(newContext, applyFilter);
    newContext.drawImage(img, 0, 0, srcWidth, srcHeight, 16, 16, newCanvas.width - 32, newCanvas.height - 32);
  } else {
    newCanvas.height = newCanvas.width * srcHeight / srcWidth;
    scaleFactor = srcWidth / 160;
    prepareContext(newContext, applyFilter);
    newContext.drawImage(img, 0, 0, srcWidth, srcHeight, 0, 0, newCanvas.width, newCanvas.height);
  }

  const imageData = newContext.getImageData(0, 0, newCanvas.width, newCanvas.height);

  return {
    scaleFactor,
    canvas: newCanvas,
    context: newContext,
    imageData,
    ratio,
  };
};

const getImageData = (file) => (
  new Promise((resolve, reject) => {
    const img = document.createElement('img');

    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = 160;

    const context = srcCanvas.getContext('2d');

    img.onerror = reject;

    img.onload = () => {

      const scaledOriginalCanvas = scale(img, srcCanvas, context, true);

      const scaledOriginalCanvasColor = scale(img, srcCanvas, context, false);

      // let scaleFactor;
      // const srcWidth = img.naturalWidth;
      // const srcHeight = img.naturalHeight;
      // const ratio = srcHeight / srcWidth;

      // // let channelsData = {};
      // // const channelsData = splitRGBChannels(context.getImageData(0, 0, srcCanvas.width, srcCanvas.height), ratio, img);

      // // if an image has the ratio of the "sensor" resolution of 128x112, import it inside of a frame
      // if (ratio === 112 / 128) {
      //   srcCanvas.height = 144;
      //   scaleFactor = img.naturalWidth / 128;
      //   prepareContext(context);
      //   context.drawImage(img, 0, 0, srcWidth, srcHeight, 16, 16, srcCanvas.width - 32, srcCanvas.height - 32);
      // } else {
      //   srcCanvas.height = srcCanvas.width * srcHeight / srcWidth;
      //   scaleFactor = srcWidth / 160;
      //   prepareContext(context);
      //   context.drawImage(img, 0, 0, srcWidth, srcHeight, 0, 0, srcCanvas.width, srcCanvas.height);
      // }

      // const imageData = context.getImageData(0, 0, srcCanvas.width, srcCanvas.height);

      const imageData = scaledOriginalCanvas.imageData;

      const channelsData = splitRGBChannels(scaledOriginalCanvasColor.canvas, scaledOriginalCanvasColor.context);

      resolve({
        imageData,
        channelsData,
        scaleFactor: scaledOriginalCanvas.scaleFactor,
        width: srcCanvas.width,
        height: srcCanvas.height,
      });
    };

    readFileAs(file, 'dataURL')
      .then((data) => {
        img.src = data;
      });
  })
);

export default getImageData;
