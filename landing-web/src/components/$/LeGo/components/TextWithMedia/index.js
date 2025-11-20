/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { Fragment } from 'react';
import CommonText from 'components/$/LeGo/components/CommonText';
import CommonImg from 'components/$/LeGo/components/CommonImg';

const TextWithMedia = ({ content }) => {
  return (
    <Fragment>
      <CommonText content={{ title: content.title, text: content.text }} />
      <CommonImg content={{ imgUrl: content.imgUrl }} />
    </Fragment>
  );
};

export default React.memo(TextWithMedia);
