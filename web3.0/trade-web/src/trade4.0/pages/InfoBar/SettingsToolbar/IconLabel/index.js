/**
 * Owner: Ray.Lee@kupotech.com
 */
import styled from '@emotion/styled';
import React, { memo, Fragment } from 'react';
import SvgComponent from '@/components/SvgComponent';
import TooltipWrapper from '@/components/TooltipWrapper';
import { useResponsive } from '@kux/mui';

export const Wrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  margin: 0 8px;
  height: ${(props) => (props.sm ? '32px' : '48px')};

  svg {
    color: ${(props) =>
      (props.showText ? props.theme.colors.icon60 : props.theme.colors.icon)};
  }

  &:hover {
    span {
      color: ${(props) => props.theme.colors.text};
    }
    svg {
      color: ${(props) => props.theme.colors.icon};
    }
  }
`;

export const Text = styled.span`
  color: ${(props) => props.theme.colors.text60};
  font-size: 12px;
  margin-left: 6px;
  white-space: nowrap;
`;

/**
 * IconLabel
 * label with icon
 */
const IconLabel = (props) => {
  const {
    icon,
    text,
    showText = true,
    disabledOnMobile,
    ...restProps
  } = props;
  const px = showText ? '16px' : '20px';
  const screens = useResponsive();

  const { sm } = screens;

  const iconComp = <SvgComponent fileName="toolbar" type={icon} width={px} height={px} />;
  return (
    <Wrapper
      {...restProps}
      showText={showText}
      sm={!sm}
    >
      {text && !showText ? (
        <TooltipWrapper
          title={text}
          placement="bottom"
          disabledOnMobile={disabledOnMobile}
        >{iconComp}</TooltipWrapper>
      ) : (
        <Fragment>
          {iconComp}
          {showText && <Text>{text}</Text>}
        </Fragment>
      )}
    </Wrapper>
  );
};

export default memo(IconLabel);
