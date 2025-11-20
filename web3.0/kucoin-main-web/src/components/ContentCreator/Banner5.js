/**
 * Owner: willen@kupotech.com
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { map } from 'lodash';
import { px2rem } from '@kufox/mui';
import { Box, Button } from '@kufox/mui';
import { STEPS } from './config';
import { _t } from 'tools/i18n';
import { styled } from '@kufox/mui';
import CoinsImgSrc from 'static/content-creator/coins.png';

const Wrapper = styled(Box)`
  margin: 0 auto;
  width: 83.3%;
  max-width: ${px2rem(1200)};
  padding: ${px2rem(72)} 0;
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 93.75%;
    padding: ${px2rem(60)} 0;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    width: 93.6%;
    padding: ${px2rem(40)} 0;
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
`;

const CoinsImg = styled.img`
  margin-left: 4.86%;
  width: 28.33%;
  ${(props) => props.theme.breakpoints.down('lg')} {
    display: none;
  }
`;

const ContentWrapper = styled(Box)`
  margin-top: ${px2rem(8)};
  width: 49%;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    margin-top: 0;
  }
`;

const Title = styled.h2`
  margin-bottom: ${px2rem(50)};
  font-size: ${px2rem(36)};
  line-height: ${px2rem(44)};
  color: #091133;
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('lg')} {
    color: #00142a;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-bottom: ${px2rem(40)};
    font-size: ${px2rem(24)};
    line-height: ${px2rem(38)};
  }
`;

const StepPointerContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StepPointer = styled(Box)`
  width: ${px2rem(48)};
  height: ${px2rem(48)};
  font-weight: normal;
  font-size: ${px2rem(18)};
  line-height: ${px2rem(48)};
  text-align: center;
  cursor: pointer;
  border-radius: 50%;
  background: ${(props) => (props.isActive ? '#2dbd96' : '#fff')};
  border: ${(props) => (props.isActive ? 'none' : `${px2rem(1)} solid rgba(0, 20, 42, 0.12)`)};
  color: ${(props) => (props.isActive ? '#ffffff' : 'rgba(0, 20, 42, 0.6)}')};
`;

const StepLine = styled.div`
  flex-grow: 1;
  height: ${px2rem(1)};
  background: rgba(0, 20, 42, 0.12);
  ${(props) => props.theme.breakpoints.down('md')} {
    flex-grow: ${(props) => (props.isActive ? 4 : 1)};
  }
`;

const StepTitle = styled.h3`
  margin: ${px2rem(30)} 0 ${px2rem(12)};
  font-size: ${px2rem(20)};
  line-height: ${px2rem(32)};
  color: #00142a;
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('md')} {
    margin: ${px2rem(24)} 0 ${px2rem(12)};
    font-size: ${px2rem(16)};
    line-height: ${px2rem(26)};
  }
`;

const StepDescribe = styled.p`
  margin: 0;
  font-weight: normal;
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

const SubmitButton = styled(Button)`
  margin-top: ${px2rem(24)};
  height: auto;
  padding: ${px2rem(9)} ${px2rem(18)};
  line-height: ${px2rem(30)};
  font-weight: normal;
  font-size: 18px;
  color: #ffffff;
  background: #2dbd96;
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: ${px2rem(5)} ${px2rem(14)};
    font-size: ${px2rem(14)};
    line-height: ${px2rem(22)};
  }
`;

const Banner5 = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = STEPS[activeIndex];
  const { title, describe } = activeItem;
  const desRef = useRef(null);

  useEffect(() => {
    if (
      activeIndex === 1 &&
      desRef.current &&
      desRef.current.firstElementChild &&
      desRef.current.firstElementChild.firstElementChild
    ) {
      desRef.current.firstElementChild.firstElementChild.onclick = () => {
        const newWindow = window.open(
          'https://assets.staticimg.com/cms/media/2MG9HWTnK4e1LvloMOtB1n15YsVhBlZQYNuUEKT8D.pdf',
        );
        newWindow.opener = null;
      };
    }
  }, [activeIndex, desRef.current]);

  // 切换
  const handleToggle = useCallback((_index) => {
    setActiveIndex(_index);
  }, []);

  const goLink = () => {
    const newWindow = window.open(
      'https://docs.google.com/forms/d/1_MVBNjOlMOAVW3c55Q7YcGw0thGqj1dgFeYXERnY4Gs/edit',
    );
    newWindow.opener = null;
  };

  return (
    <Wrapper>
      <CoinsImg src={CoinsImgSrc} alt="coins-icon" />
      <ContentWrapper>
        <Title>{_t('creator.fifth.title')}</Title>
        <StepPointerContainer>
          {map(STEPS, (step, index, arr) => (
            <React.Fragment key={`step_${index}`}>
              <StepPointer isActive={index === activeIndex} onClick={() => handleToggle(index)}>
                {index + 1}
              </StepPointer>
              {index < arr.length - 1 ? (
                <StepLine
                  isActive={
                    index === activeIndex ||
                    (activeIndex === arr.length - 1 && index === arr.length - 2)
                  }
                />
              ) : null}
            </React.Fragment>
          ))}
        </StepPointerContainer>
        <StepTitle>{title}</StepTitle>
        {map(describe, (item, index) => (
          <StepDescribe key={`describe_${index}`} ref={index === 1 ? desRef : null}>
            {item}
          </StepDescribe>
        ))}
        <SubmitButton onClick={goLink}>{_t('creator.second.btn')}</SubmitButton>
      </ContentWrapper>
    </Wrapper>
  );
};

export default Banner5;
