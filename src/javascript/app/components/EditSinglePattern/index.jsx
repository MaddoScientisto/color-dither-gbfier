import React, { useState } from 'react';
import ImagePreview from '../ImagePreview';
import './index.scss';
import BaseValues from '../BaseValues';
import OrderValuesSet from '../OrderValuesSet';
import generateBaseValues from '../../../../generateBaseValues.mjs';
import SingleCodePreview from '../SingleCodePreview';

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
      <ImagePreview
        baseValues={generateBaseValues(baseValues)}
        channel="R"
      />
      <ImagePreview
        baseValues={generateBaseValues(baseValues)}
        channel="G"
      />
      <ImagePreview
        baseValues={generateBaseValues(baseValues)}
        channel="B"
      />
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
