/**
 * Owner: chris@kupotech.com
 */
import { Divider, styled } from '@kux/mui';
import { useContext } from 'react';
import { divide } from 'src/helper';
import { _t } from 'src/tools/i18n';
import { numberFormat, percentFormat } from '../../utils';
import Context from '../Context';
import Tooltip from '../Tooltip';

const Container = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 0px auto;
  display: flex;
  align-items: center;
  // text-align: right;
  .dashed {
    border-bottom: 1px dashed ${({ theme }) => theme.colors.text20};
    cursor: help;
  }
  .divider {
    display: none;
  }
  .field {
    margin-right: 40px;
    .label {
      margin-bottom: 2px;
      color: ${({ theme }) => theme.colors.text60};
      font-weight: 400;
      font-size: 14px;
      line-height: 150%;
      white-space: nowrap;
    }
    .value {
      color: ${({ theme }) => theme.colors.text60};
      font-weight: 400;
      font-size: 16px;
      line-height: 150%;
    }
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    display: block;
    box-sizing: border-box;
    padding: 0px 32px;
    .divider {
      display: block;
      margin: 24px 0px;
    }
    .field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 0px;
      .label {
        margin-bottom: 5px;
      }
      .value {
        font-size: 14px;
      }
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100vw;
    padding: 0px 16px;
    text-align: right;
    .divider {
      display: block;
      margin: 16px 0px;
    }
    .field {
      .label {
        font-size: 13px;
      }
      .value {
        font-size: 13px;
        text-align: right;
      }
    }
    .tipBtm {
      display: inline-block;
      margin-top: 4px;
      margin-left: auto;
      padding: 2px 4px;
      color: ${({ theme }) => theme.colors.text40};
      font-weight: 500;
      font-size: 10px;
      background: ${({ theme }) => theme.colors.cover8};
      border-radius: 4px;
    }
  }
`;

// 资产占比
const AssetsProportion = ({ className = '' }) => {
  const { isSm, overview } = useContext(Context);
  const { kcs_assets_ratio, lock_amount_hour } = overview || {};
  const _kcs_assets_ratio = divide(kcs_assets_ratio, 100);
  return (
    <Container className={className} data-inspector="assets-proportion">
      <Divider className="divider" />
      <div className="field">
        <div className="label">{_t('ebee8d20ab8a4000aad3')}</div>
        <div className="value">
          {isSm ? (
            <span>{lock_amount_hour ? numberFormat(lock_amount_hour) : '--'}</span>
          ) : (
            <Tooltip title={_t('b20d3f44ad774000ad11')}>
              <span className="dashed">
                {lock_amount_hour ? numberFormat(lock_amount_hour) : '--'}
              </span>
            </Tooltip>
          )}
        </div>
      </div>
      <div className="field">
        <div className="label">{_t('b5f02a6eaccb4000a5a0')}</div>
        <div className="value">
          {isSm ? (
            <span>{percentFormat(_kcs_assets_ratio)}</span>
          ) : (
            <Tooltip title={_t('b20d3f44ad774000ad11')}>
              <span className="dashed">{percentFormat(_kcs_assets_ratio)}</span>
            </Tooltip>
          )}
        </div>
      </div>
      {isSm && <div className="tipBtm">{_t('b20d3f44ad774000ad11')}</div>}
    </Container>
  );
};

export default AssetsProportion;
