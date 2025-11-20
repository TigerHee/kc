/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import Form from '@mui/Form';
import Tooltip from '@mui/Tooltip';

import { LONG_TYPE, SHORT_TYPE } from './config';

import { _t, styled, withYScreen } from '../../builtinCommon';

import { BUY, useFuturesForm } from '../../config';

import useWrapperScreen from '../../hooks/useWrapperScreen';

import { CheckBoxItem, SpanUnderline } from '../commonStyle';

const CheckBoxWrapper = withYScreen(styled.div`
  display: flex;
  align-items: flex-start;
  margin: 0 0 10px;
  color: ${(props) => props.theme.colors.text40};
  > label {
    line-height: 1;
  }
  .KuxCheckbox-wrapper {
    &:not(:last-of-type) {
      margin-right: 16px;
    }
  }
  .KuxCheckbox-inner {
    width: 14px;
    height: 14px;
    border-width: 1px;
  }
  ${(props) => props.$useCss(['md', 'sm'])(`margin: 0 0 5px;`)}

  &.md-check-wrapper {
    .KuxCheckbox-wrapper {
      max-width: 100%;
      margin-right: unset;
    }
  }

  .KuxCheckbox-wrapper-checked {
    > span {
      &:last-of-type {
        color: ${(props) => props.theme.colors.text};
      }
    }
  }
`);

const { FormItem } = Form;

const CheckboxGroup = ({ value, onChange, closeOnly }) => {
  const { isMd } = useWrapperScreen();
  const futuresFormContext = useFuturesForm();

  if (isMd) {
    const checkSide = futuresFormContext?.side === BUY ? LONG_TYPE : SHORT_TYPE;

    return (
      <CheckBoxWrapper className="md-check-wrapper">
        <CheckBoxItem
          size="small"
          disabled={closeOnly}
          onChange={(e) => {
            const { checked } = e.target;
            onChange(checked ? checkSide : '');
          }}
          checked={value === checkSide}
        >
          <Tooltip title={_t('futures.tpsl.tips')}>
            <SpanUnderline>{_t('stopClose.profitLoss')}</SpanUnderline>
          </Tooltip>
        </CheckBoxItem>
      </CheckBoxWrapper>
    );
  }

  return (
    <CheckBoxWrapper>
      <CheckBoxItem
        size="small"
        disabled={closeOnly}
        onChange={(e) => {
          const { checked } = e.target;
          onChange(checked ? LONG_TYPE : '');
        }}
        checked={value === LONG_TYPE}
      >
        <Tooltip title={_t('futures.tpsl.tips')}>
          <SpanUnderline>{_t('pnl.long.title')}</SpanUnderline>
        </Tooltip>
      </CheckBoxItem>
      <CheckBoxItem
        disabled={closeOnly}
        onChange={(e) => {
          const { checked } = e.target;
          onChange(checked ? SHORT_TYPE : '');
        }}
        checked={value === SHORT_TYPE}
      >
        <Tooltip title={_t('futures.tpsl.tips')}>
          <SpanUnderline>{_t('pnl.short.title')}</SpanUnderline>
        </Tooltip>
      </CheckBoxItem>
    </CheckBoxWrapper>
  );
};

const PnlType = ({ name, closeOnly }) => {
  return (
    <FormItem name={name} noStyle>
      <CheckboxGroup closeOnly={closeOnly} />
    </FormItem>
  );
};

export default React.memo(PnlType);
