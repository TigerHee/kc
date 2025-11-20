/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useState } from 'react';
import { ImgPreview, styled } from '@kux/mui';
import Wrapper from './wrapper';

const ImgWrapper = styled.div`
  width: 260px;
  height: 140px;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  img {
    width: 100%; 
    height: 100%;
    transition: all .3s;
    transition-timing-function: ease-out;
    &:hover {
      transform: scale(1.1);
    }
  }
`;

function Demo1() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <img
        style={{ borderRadius: 4, width: 60, height: 60, cursor: 'pointer' }}
        onClick={() => setShow(true)}
        src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
      />
      <ImgPreview title="预览" show={show} url='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' onClose={() => setShow(false)} />
    </div>
  );
}

function Demo2() {
  return (
    <ImgWrapper>
      <img
        src='https://picsum.photos/260/140?t=09874444'
      />
    </ImgWrapper>
  );
}

export default () => {
  return (
    <Wrapper>
      <Demo1 />
      <Demo2 />
    </Wrapper>
  );
};
