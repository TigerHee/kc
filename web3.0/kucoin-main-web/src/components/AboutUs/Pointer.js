/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import LeftArrowImg from 'static/about-us/arrow_left.png';
import RightArrowImg from 'static/about-us/arrow_right.png';
import { styled } from '@kufox/mui';

const PointerBox = styled.div`
  display: flex;
  height: 17px;
  line-height: 17px;
  img {
    width: 17px;
    cursor: pointer;
  }
  [dir='rtl'] & {
    flex-direction: row-reverse;
  }
`;

const PointerCur = styled.div`
  margin: 0 3px 0 6px;
  color: #fff;
  font-weight: 400;
  font-size: 16px;
  [dir='rtl'] & {
    margin: 0 6px 0 3px;
  }
`;

const PointerTotal = styled.span`
  margin-right: 6px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  font-size: 16px;
  [dir='rtl'] & {
    margin: 0 3px 0 6px;
  }
`;
const PointerDivider = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  font-size: 16px;
`;

const Pointer = ({
  total = 0,
  current = 0,
  className,
  curClassName,
  totalClassName = '',
  onNext = () => {},
  onPre = () => {},
}) => {
  return (
    <PointerBox className={className}>
      <img src={LeftArrowImg} alt="" onClick={onPre} />
      <PointerCur className={curClassName}>{current}</PointerCur>
      <PointerDivider className={totalClassName}>/</PointerDivider>
      <PointerTotal className={totalClassName}>{total}</PointerTotal>
      <img src={RightArrowImg} alt="" onClick={onNext} />
    </PointerBox>
  );
};

export default Pointer;
