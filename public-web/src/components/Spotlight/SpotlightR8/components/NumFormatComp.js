/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { NumberFormat } from '@kux/mui';
import isNaN from 'lodash/isNaN';
import isNil from 'lodash/isNil';
import { memo } from 'react';
import { PlaceholderWrapper } from './styledComponents';

const NumFormatComp = memo(
  ({ value, placeholder = '--', options = {}, placeholderClassName, className }) => {
    const { currentLang } = useLocale();
    // 数字不合法或空返回 --
    if (isNil(value) || isNaN(+value)) {
      return (
        <PlaceholderWrapper className={placeholderClassName}>{placeholder}</PlaceholderWrapper>
      );
    }

    if (+value) {
      return (
        <NumberFormat lang={currentLang} options={options} className={className}>
          {value}
        </NumberFormat>
      );
    } else {
      return <PlaceholderWrapper className={placeholderClassName}>{value}</PlaceholderWrapper>;
    }
  },
);

export default NumFormatComp;
