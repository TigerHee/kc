/**
 * Owner: terry@kupotech.com
 */
import { currentLang } from '@kucoin-base/i18n';
import numberFormat from '@kux/mui/utils/numberFormat';
import clxs from 'classnames';
import isNil from 'lodash/isNil';
import { _t, _tHTML } from 'src/tools/i18n';
import Tooltip from '../../../ActivityCommon/Tooltip';
import { AprWrapper } from './styledComponents';


export function Apr({
  apr,
  presetStatus,
  isEnd,
  inline = true,
  className = '',
  ...rest
}) {
  if (isNil(apr)) return null;
  const isPreset = presetStatus === 1;
  const label = isPreset ? _t('4d7803e704254800ad90') : _t('908ebc584b974800a05e');
  return (
    <AprWrapper
      className={clxs('aprWrapper', {
        inline,
      }, className)}
      {...rest}
    >
      <Tooltip
        title={isEnd ? _tHTML('6df2f17f5d6a4800afd2') : _tHTML('eb08fca794ef4000a526')}
        header={label}
        showCloseX
        maskClosable={false}
        maskProps={{
          onClick: (e) => {
            if (e) e.stopPropagation();
          }
        }}
        rootProps={{
          onClick: (e) => {
            if (e) e.stopPropagation();
          }
        }}
      >
        <div className='label'>
          {label}
        </div>
      </Tooltip>
      <div className='value'>
        {numberFormat({
          number: apr || 0,
          lang: currentLang,
          options: {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
            roundingMode: 'floor',
          },
        })}
      </div>
    </AprWrapper>
  )
}