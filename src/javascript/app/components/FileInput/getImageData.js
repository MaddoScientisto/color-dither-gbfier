import readFileAs from '../../../../tools/readFileAs';

/* eslint-disable no-param-reassign */
const prepareContext = (context) => {
  context.fillStyle = '#000';
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  context.filter = 'grayscale(1)';
  context.imageSmoothingEnabled = false;
};
/* eslint-enable no-param-reassign */

const splitRGBChannels = (imgData, ratio, img) => {
  const channelsData = {
    red: {}, green: {}, blue: {},
  };

  const data = imgData.data;
  ['red', 'green', 'blue'].forEach((color, index) => {
    const channelCanvas = document.createElement('canvas');
    channelCanvas.width = imgData.width;
    channelCanvas.height = imgData.height;
    const ctx = channelCanvas.getContext('2d');
    const channelData = new ImageData(imgData.width, imgData.height);

    for (let i = 0; i < imgData.data.length; i += 4) {
      const value = data[i + index]; // Get the value of the current channel
      channelData.data[i] = value; // Red
      channelData.data[i + 1] = value; // Green
      channelData.data[i + 2] = value; // Blue
      channelData.data[i + 3] = data[i + 3]; // Alpha
    }

    ctx.putImageData(channelData, 0, 0);

    const srcWidth = img.naturalWidth;
    const srcHeight = img.naturalHeight;
    if (ratio === 112 / 128) {
      channelCanvas.height = 144;
      // prepareContext(context);
      ctx.drawImage(img, 0, 0, srcWidth, srcHeight, 16, 16, channelCanvas.width - 32, channelCanvas.height - 32);
    } else {
      channelCanvas.height = channelCanvas.width * srcHeight / srcWidth;
      // prepareContext(context);
      ctx.drawImage(img, 0, 0, srcWidth, srcHeight, 0, 0, channelCanvas.width, channelCanvas.height);
    }

    channelsData[color] = ctx.getImageData(0, 0, imgData.width, imgData.height);

  });

  return channelsData;
};

const getImageData = (file) => (
  new Promise((resolve, reject) => {
    const img = document.createElement('img');

    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = 160;

    const context = srcCanvas.getContext('2d');

    img.onerror = reject;

    img.onload = () => {
      let scaleFactor;
      const srcWidth = img.naturalWidth;
      const srcHeight = img.naturalHeight;
      const ratio = srcHeight / srcWidth;

      // let channelsData = {};
      const channelsData = splitRGBChannels(context.getImageData(0, 0, srcCanvas.width, srcCanvas.height), ratio, img);

      // if an image has the ratio of the "sensor" resolution of 128x112, import it inside of a frame
      if (ratio === 112 / 128) {
        srcCanvas.height = 144;
        scaleFactor = img.naturalWidth / 128;
        prepareContext(context);
        context.drawImage(img, 0, 0, srcWidth, srcHeight, 16, 16, srcCanvas.width - 32, srcCanvas.height - 32);
      } else {
        srcCanvas.height = srcCanvas.width * srcHeight / srcWidth;
        scaleFactor = srcWidth / 160;
        prepareContext(context);
        context.drawImage(img, 0, 0, srcWidth, srcHeight, 0, 0, srcCanvas.width, srcCanvas.height);
      }

      const imageData = context.getImageData(0, 0, srcCanvas.width, srcCanvas.height);

      resolve({
        imageData,
        channelsData,
        scaleFactor,
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
