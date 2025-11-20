/**
 * Owner: borden@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { styled } from '@kux/mui';
import { map } from 'lodash';
import { memo, useCallback } from 'react';
import { toPercent, transformRtlNum } from 'src/helper';

const Wrapper = styled.div`
  display: flex;
`;

const Button = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 0 4px;
  font-weight: 500;
  font-size: 12px;
  /* line-height: 130%; */
  border-radius: 4px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text40};
  border: 1px solid ${(props) => props.theme.colors.cover12};
  height: ${(props) => {
    switch (props.size) {
      case 'large':
        return '24px';
      default:
        return '20px';
    }
  }};
  &:not(:first-of-type) {
    margin-left: 5px;
  }
  &:hover {
    background-color: rgba(1, 188, 141, 0.08);
    border-color: rgba(1, 188, 141, 0.08);
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    border-width: 0.5px;
  }
`;

const FastButtonGroup = (props) => {
  const { currentLang } = useLocale();
  const { multis, onChange, size, showMinButton, ...restProps } = props;

  const handleClick = useCallback(
    (multi) => {
      if (onChange) onChange(multi);
    },
    [onChange],
  );

  return (
    <Wrapper {...restProps}>
      {showMinButton && (
        <Button key="min" size={size} onClick={() => handleClick('min')}>
          {'Min'}
        </Button>
      )}
      {map(multis, (item, index) => {
        return (
          <Button key={index} size={size} onClick={() => handleClick(item)}>
            {item === 1 && showMinButton
              ? 'Max'
              : transformRtlNum({ lang: currentLang, value: toPercent(item, '') })}
          </Button>
        );
      })}
    </Wrapper>
  );
};

FastButtonGroup.defaultProps = {
  multis: [0.25, 0.5, 0.75, 1],
  size: 'basic',
  showMinButton: false,
};

export default memo(FastButtonGroup);
