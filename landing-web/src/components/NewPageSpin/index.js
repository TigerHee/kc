/**
 * Owner: melon@kupotech.com
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { styled, keyframes } from '@kufox/mui/emotion';

const circle = keyframes`
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const NewSpin = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  .Ku_new_mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    background-color: ${(props) => props.theme.colors.cover4};
  }
`;
const KuNewSpinContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1000;
  transform: translate(-50%, -50%);
  display: ${(props) => (props.hidden ? 'none' : 'flex')};
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .Ku_new_loading_text {
    color: ${(props) => props.theme.colors.primary};
    font-size: 14px;
    line-height: 22px;
  }
`;

export const Loading = styled.div`
  display: block;
  width: 22px;
  height: 22px;
  border-style: solid;
  border-width: 2px;
  border-top-color: ${(props) => props.theme.colors.primary};
  border-right-color: ${(props) => props.theme.colors.primary};
  border-bottom-color: ${(props) => props.theme.colors.primary};
  border-left-color: ${(props) => props.theme.colors.primary40};
  border-radius: 100%;
  animation: ${circle} 0.5s linear infinite;
`;

const Spin = ({ spinning, children, needMask = true, tip }) => {
  const [visible, setVisible] = useState(spinning);
  useEffect(() => {
    setVisible(spinning);
  }, [spinning]);

  return (
    <NewSpin className={'Ku_new_spin'}>
      {children}
      <KuNewSpinContent hidden={!visible} className={'Ku_new_spin_content'}>
        <Loading className="Ku_new_loading" />
        {tip ? <div className="Ku_new_loading_text">{tip}</div> : ''}
      </KuNewSpinContent>
      {visible && needMask ? <div className={'Ku_new_mask'} /> : ''}
    </NewSpin>
  );
};

Spin.propTypes = {
  children: PropTypes.any,
  spinning: PropTypes.bool, // 是否Loading
  needMask: PropTypes.bool, // 是否需要遮照
  tip: PropTypes.any, // 加载描述
};
Spin.defaultProps = {
  children: null,
  spinning: false,
  needMask: true,
  tip: null, // 加载描述
};

export default Spin;
