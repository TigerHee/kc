/**
 * Owner: borden@kupotech.com
 */
import React, { useCallback, memo } from 'react';
import { map } from 'lodash';
import styled from '@emotion/styled';
import Button from '@mui/Button';
import { _t } from 'src/utils/lang';
import { floadToPercent } from 'src/helper';

export const Wrapper = styled.div`
  display: flex;
  & > button {
    flex: 1;
    border-radius: 6px;
    font-weight: 400;
    font-size: 12px;
    line-height: 130%;
    padding: 0 4px;
    color: ${(props) => props.theme.colors.text40};
    height: ${props => {
      switch (props.size) {
        case 'large':
          return '24px';
        default:
          return '20px';
      }
    }};
    &:hover {
      opacity: 1;
    }

    &:not(:first-of-type) {
      margin-left: 5px;
    }
  }
`;

const FastButtonGroup = (props) => {
  const { multis, onChange, size, ...restProps } = props;

  const handleClick = useCallback(
    (multi) => {
      if (onChange) onChange(multi);
    },
    [onChange],
  );

  return (
    <Wrapper size={size} {...restProps}>
      {map(multis, (item, index) => {
        return (
          <Button
            key={index}
            size="small"
            type="default"
            onClick={() => handleClick(isNaN(item) ? 0 : item)}
          >
            {isNaN(item) ? item : floadToPercent(item)}
          </Button>
        );
      })}
    </Wrapper>
  );
};

FastButtonGroup.defaultProps = {
  multis: [0.25, 0.5, 0.75, 1],
  size: 'basic',
};

export default memo(FastButtonGroup);
