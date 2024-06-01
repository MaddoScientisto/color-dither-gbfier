import React, { useState } from 'react';
import ImagePreview from '../ImagePreview';
import './index.scss';
import BaseValues from '../BaseValues';
import OrderValuesSet from '../OrderValuesSet';
import generateBaseValues from '../../../../generateBaseValues.mjs';
import SingleCodePreview from '../SingleCodePreview';
import Collapsible from '../Collapsible';

function EditSinglePattern() {
  const [baseValues, setBaseValues] = useState([0x01, 0x55, 0xAA, 0xFF]);
  const [redBaseValues, setRedBaseValues] = useState([0x01, 0x55, 0xAA, 0xFF]);
  const [greenBaseValues, setGreenBaseValues] = useState([0x01, 0x55, 0xAA, 0xFF]);
  const [blueBaseValues, setBlueBaseValues] = useState([0x01, 0x55, 0xAA, 0xFF]);

  return (
    <div
      className="edit-single-pattern"
    >
      <p>Monochrome</p>
      <ImagePreview
        baseValues={generateBaseValues(baseValues)}
        channel="All"
      />

      <p>Merged Color channels</p>
      <ImagePreview
        baseValues={generateBaseValues(baseValues)}
        channel="Result"
      />

      <BaseValues
        baseValues={baseValues}
        onBaseValuesUpdate={setBaseValues}
      />

      <Collapsible title="Color Channels finetuning">
        <Collapsible title="Red">
          <ImagePreview
            baseValues={generateBaseValues(redBaseValues)}
            channel="R"
          />
          <BaseValues
            baseValues={redBaseValues}
            onBaseValuesUpdate={setRedBaseValues}
          />
        </Collapsible>
        <Collapsible title="Green">
          <p>Green</p>
          <ImagePreview
            baseValues={generateBaseValues(greenBaseValues)}
            channel="G"
          />
          <BaseValues
            baseValues={greenBaseValues}
            onBaseValuesUpdate={setGreenBaseValues}
          />
        </Collapsible>
        <Collapsible title="Blue">
          <p>Blue</p>
          <ImagePreview
            baseValues={generateBaseValues(blueBaseValues)}
            channel="B"
          />
          <BaseValues
            baseValues={blueBaseValues}
            onBaseValuesUpdate={setBlueBaseValues}
          />
        </Collapsible>

        <p>Merged Color channels</p>
        <ImagePreview
          baseValues={{
            red: generateBaseValues(redBaseValues),
            green: generateBaseValues(greenBaseValues),
            blue: generateBaseValues(blueBaseValues),
          }}
          channel="RGBResult"
        />

      </Collapsible>

      <Collapsible title="Extra Settings">
        <OrderValuesSet />
        <SingleCodePreview baseValues={baseValues} />
      </Collapsible>

    </div>
  );
}


EditSinglePattern.propTypes = {
};

EditSinglePattern.defaultProps = {
  imageData: null,
};

export default EditSinglePattern;
