/**
 * Owner: ella.wang@kupotech.com
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ICTradeAddOutlined, ICSubFilled } from '@kux/icons';
import { useResponsive } from '@kux/mui';
import minus from 'static/bitcoin-halving/minus.svg';
import {
  Wrapper,
  TitleWrapper,
  Title,
  Divider,
  Description,
  AnimationContent,
} from './index.style';

export default ({ title, description, bgTheme }) => {
  const responsive = useResponsive();
  const desRef = useRef();
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);

  const setClientHeight = useCallback(() => {
    if (desRef.current) {
      const dividerHeight = responsive.sm ? 49 : 33;
      setHeight(desRef.current.clientHeight + dividerHeight);
    }
  }, [responsive.sm]);

  const handleOpen = useCallback(() => {
    setClientHeight();
    setOpen(!open);
  }, [open, setClientHeight]);

  useEffect(() => {
    setClientHeight();
  }, [setClientHeight]);

  const renderImg = useCallback(
    (open) => {
      if (!bgTheme) {
        if (open) {
          return <ICSubFilled size={20} />;
        }
        return <ICTradeAddOutlined size={20} color="#1D1D1D" />;
      } else {
        if (open) {
          return <img src={minus} alt="icon" />;
        }
        return <ICTradeAddOutlined size={responsive.sm ? 32 : 20} color="#F3F3F3" />;
      }
    },
    [bgTheme, responsive.sm],
  );

  return (
    <Wrapper onClick={handleOpen} bgTheme={bgTheme}>
      <TitleWrapper bgTheme={bgTheme}>
        <Title bgTheme={bgTheme}>{title}</Title>
        {renderImg(open)}
      </TitleWrapper>
      <AnimationContent open={open} contentHeight={height}>
        <Divider bgTheme={bgTheme} />
        <Description ref={desRef} bgTheme={bgTheme}>
          {description.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </Description>
      </AnimationContent>
    </Wrapper>
  );
};
