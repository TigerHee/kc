/**
 * Owner: willen@kupotech.com
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { styled } from '@kufox/mui';
import { px2rem } from '@kufox/mui';
import { Box } from '@kufox/mui';
import ArrowImg from 'static/content-creator/arrow-down.svg';

const Wrapper = styled(Box)`
  padding: ${px2rem(24)} 0;
  border-bottom: ${px2rem(1)} solid rgba(0, 20, 42, 0.12);
`;

const ItemQustion = styled.h3`
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${px2rem(20)};
  line-height: ${px2rem(32)};
  color: #00142a;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: ${px2rem(16)};
    line-height: ${px2rem(26)};
  }
`;

const ArrowIcon = styled.img`
  width: ${px2rem(24)};
  transition: transform 0.2s;
  cursor: pointer;
`;

const ItemAnswer = styled.p`
  margin: ${px2rem(12)} 0 0;
  font-size: ${px2rem(14)};
  line-height: ${px2rem(22)};
  color: rgba(0, 20, 42, 0.6);
  transition: all 0.3s ease-in-out;
  & span {
    span {
      color: #2dbd96;
      border-bottom: 1px solid #2dbd96;
      cursor: pointer;
    }
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: ${px2rem(12)};
    line-height: ${px2rem(20)};
  }
`;

export default ({ question = '', answer = '' }) => {
  const [rotateDeg, setRotateDeg] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const ansRef = useRef(null);

  useEffect(() => {
    if (
      showAnswer &&
      ansRef.current &&
      ansRef.current.firstElementChild &&
      ansRef.current.firstElementChild.firstElementChild
    ) {
      ansRef.current.firstElementChild.firstElementChild.onclick = () => {
        const newWindow = window.open(
          'https://assets.staticimg.com/cms/media/2MG9HWTnK4e1LvloMOtB1n15YsVhBlZQYNuUEKT8D.pdf',
        );
        newWindow.opener = null;
      };
    }
  }, [showAnswer]);

  // answer隐藏、显示切换
  const handleToggleAnswer = useCallback(() => {
    setShowAnswer(!showAnswer);
    if (rotateDeg < 0) {
      setRotateDeg(0);
    } else {
      setRotateDeg(-180);
    }
  }, [showAnswer, rotateDeg]);

  return (
    <Wrapper>
      <ItemQustion onClick={handleToggleAnswer}>
        {question}
        <ArrowIcon
          src={ArrowImg}
          alt="arrow-icon"
          style={{ transform: `rotate(${rotateDeg}deg)` }}
        />
      </ItemQustion>
      {showAnswer ? <ItemAnswer ref={ansRef}>{answer}</ItemAnswer> : null}
    </Wrapper>
  );
};
