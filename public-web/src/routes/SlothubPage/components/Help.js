/*
 * owner: borden@kupotech.com
 */
import { ICInfoOutlined } from '@kux/icons';
import { styled, useColor, useResponsive } from '@kux/mui';
import React from 'react';
import Tooltip from './mui/Tooltip';

export const HelpContainer = styled.div`
  counter-reset: chapter;
`;
export const HelpTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
`;
export const HelpContent = styled.div`
  font-size: 16px;
  margin-top: 12px;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text60};
  ${({ theme }) => theme.breakpoints.up('sm')} {
    &:first-of-type {
      margin-top: 0px;
    }
  }
  &::before {
    content: counter(chapter) '.';
    counter-increment: chapter;
  }
`;

const Help = ({ containerProps, children, isUseH5, ...otherProps }) => {
  const colors = useColor();
  const { sm } = useResponsive();
  const { style, ...otherContainerProps } = containerProps || {};
  return (
    <Tooltip isUseH5={isUseH5} {...otherProps}>
      {children || (
        <ICInfoOutlined
          color={colors.icon}
          className={sm ? 'ml-8' : 'ml-4'}
          style={{ ...style, cursor: isUseH5 ? 'pointer' : 'help' }}
          {...otherContainerProps}
        />
      )}
    </Tooltip>
  );
};

export default React.memo(Help);
