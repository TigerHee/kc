/**
 * Owner: Ray.Lee@kupotech.com
 */

import React from 'react';
import { isNil } from 'lodash';

import { _t, _tHTML } from 'utils/lang';
import Drawer from '@mui/Drawer';
import Button from '@mui/Button';

import { DrawerContentWrapper } from '../style';
import { useInformationDrawer } from './useInformationProps';

function bool2Status(bool) {
  if (isNil(bool)) return '--';
  return bool ? _t('dYqaxeVSHUas2TnuPoafCY') : _t('vJRyX3LozgU5YqnxRrRRSQ');
}
/**
 * 交易信息模块drawer
 */
const InformationDrawer = () => {
  const {
    basicInformationDrawerVisible,
    setBasicInformationDrawerVisible,
    dialogResponsiveProp,
    sm,
    coin,
    pair,
    tradeBasicInfo,
  } = useInformationDrawer();

  return (
    <>
      <Drawer
        show={basicInformationDrawerVisible}
        onClose={() => setBasicInformationDrawerVisible(false)}
        title={_t('ngfWUjYqpQH7ZkK3jiHwCw')}
        back={false}
        {...dialogResponsiveProp}
      >
        <DrawerContentWrapper isSm={!sm}>
          <div className="grid">
            <div className="row">
              <div className="col">
                {/* 当前交易对 */}
                {_t('1ggSfSGDgZb138xmnT3NBC')}
              </div>
              <div className="col">{`${coin}/${pair}`}</div>
            </div>
            <div className="row">
              <div className="col">
                {/* 价格精度 */}
                {_t('tJy4DKrrYJG4MqPwws5iSc')}
              </div>
              <div className="col">{tradeBasicInfo.priceIncrement ?? '--'}</div>
            </div>
            <div className="row">
              <div className="col">
                {/* 数量精度 */}
                {_t('i99ZHjwqJ9mi2oQTaGMLWL')}
              </div>
              <div className="col">{tradeBasicInfo.quoteIncrement ?? '--'}</div>
            </div>
            <div className="row">
              <div className="col">
                {/* 最小交易数量 */}
                {/* base币种*/}
                {_t('eu2SamGRgfJJrngnvf1kDe')}
              </div>
              <div className="col">{`${tradeBasicInfo.baseMinSize ?? '--'} ${coin}`}</div>
            </div>
            <div className="row">
              <div className="col">
                {/* 单笔委托最小交易金额 */}
                {/* quote币种 */}
                {_t('dxnHUVaqY95yVqRnnxYVix')}
              </div>
              <div className="col">{`${tradeBasicInfo.minimalFunds ?? '--'} ${pair}`}</div>
            </div>
            <div className="row">
              <div className="col">
                {/* 是否可下冰山单 */}
                {_t('uGAfPi67vZeMkXS2meK6SJ')}
              </div>
              <div className="col">{bool2Status(tradeBasicInfo.icebergEnable)}</div>
            </div>
            <div className="row">
              <div className="col">
                {/* 是否可下隐藏单 */}
                {_t('bbaDDLhPweDX7p1w8zUgQy')}
              </div>
              <div className="col">{bool2Status(tradeBasicInfo.hiddenEnable)}</div>
            </div>
          </div>
          {tradeBasicInfo.restrictedCountry && <div className="divider" />}
          {tradeBasicInfo.restrictedCountry && (
            <div className="region-restricted">
              <div className="title">{_t('4ALwKbmyUmficEUpEnw5sT')}</div>
              <div className="content">{tradeBasicInfo.restrictedCountry ?? '--'}</div>
            </div>
          )}
          <Button
            type="primary"
            className="confirm-button"
            onClick={() => {
              setBasicInformationDrawerVisible(false);
            }}
          >
            {_t('confirm')}
          </Button>
        </DrawerContentWrapper>
      </Drawer>
    </>
  );
};

export default React.memo(InformationDrawer);
