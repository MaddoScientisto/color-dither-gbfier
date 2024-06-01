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

  return (
    <div
      className="edit-single-pattern"
    >
      <ImagePreview
        baseValues={generateBaseValues(baseValues)}
        channel="All"
      />
      <Collapsible title="Color Channels">
        <p>Red</p>
        <ImagePreview
          baseValues={generateBaseValues(baseValues)}
          channel="R"
        />
        <p>Green</p>
        <ImagePreview
          baseValues={generateBaseValues(baseValues)}
          channel="G"
        />
        <p>Blue</p>
        <ImagePreview
          baseValues={generateBaseValues(baseValues)}
          channel="B"
        />
      </Collapsible>

      <p>Merged</p>
      <ImagePreview
        baseValues={generateBaseValues(baseValues)}
        channel="Result"
      />
      <BaseValues
        baseValues={baseValues}
        onBaseValuesUpdate={setBaseValues}
      />
      <OrderValuesSet />
      <SingleCodePreview baseValues={baseValues} />
    </div>
  );
}


EditSinglePattern.propTypes = {
};

EditSinglePattern.defaultProps = {
  imageData: null,
};

export default EditSinglePattern;
