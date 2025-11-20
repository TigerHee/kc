/**
 * Owner: ella@kupotech.com
 */
import React from 'react';
import { Wrapper } from './index.style';

const Video = ({ video }) => {
  return (
    <Wrapper>
      <iframe
        src={video}
        frameBorder="0"
        width="100%"
        height="100%"
        allowFullScreen="allowFullScreen"
        title="media iframe"
      />
    </Wrapper>
  );
};

export default Video;
