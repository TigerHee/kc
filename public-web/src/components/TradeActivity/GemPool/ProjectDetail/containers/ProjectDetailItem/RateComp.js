/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { NumberFormat, styled } from '@kux/mui';
import { memo } from 'react';
import { ReactComponent as DoubleArrowIcon } from 'static/gempool/doubleArrow.svg';

const RateWarpper = styled.div`
  display: flex;
  align-items: center;
  border-radius: 80px;
  padding: 0px 4px;
  background: ${(props) => props.theme.colors.primary};
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  margin-left: 6px;
  color: ${(props) => props.theme.colors.textEmphasis};

  svg {
    width: 12px;
    height: 12px;
    margin-right: 3px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 2px 8px;
  }
`;

const RateComp = memo(({ value }) => {
  const { currentLang } = useLocale();
  return (
    <RateWarpper>
      <DoubleArrowIcon />
      <NumberFormat
        options={{
          style: 'percent',
          maximumFractionDigits: 2,
        }}
        lang={currentLang}
      >
        {value}
      </NumberFormat>
    </RateWarpper>
  );
});

export default RateComp;
