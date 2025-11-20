/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-02-27 13:34:18
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-10-15 19:45:00
 * @FilePath: /trade-web/src/trade4.0/components/RiskTip/index.js
 * @Description: 合规税费提示||风险提示; 合规优先
 */
import React, { useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'dva';
import { _t, _tHTML, addLangToPath } from 'utils/lang';
import storage from 'utils/storage.js';
import Alert from '@mui/Alert';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { AlertBoxTip } from './style.js';
import { isSpotTypeSymbol } from 'src/trade4.0/hooks/common/useIsSpotSymbol.js';
import { SPOT, MARGIN, ISOLATED } from '@/meta/const';
import { siteCfg } from 'config';
import { floadToPercent } from '@/utils/format';

const RiskTip = () => {
  const riskTipMap = useSelector((state) => state.symbols.riskTipMap);
  const complianceTaxInfo = useSelector((state) => state.app.complianceTaxInfo);
  const complianceTaxText = useSelector((state) => state.app.complianceTaxText);
  const currentSymbol = useGetCurrentSymbol();
  const isSpotSymbol = isSpotTypeSymbol(currentSymbol);
  const dispatch = useDispatch();
  const currentTradeType = useSelector((state) => state.trade.tradeType);
  const isComplianceTaxTradeType = [SPOT, MARGIN, ISOLATED].includes(currentTradeType); // 只在现货，杠杆交易类型下展示

  useEffect(() => {
    // 合约融合，合约交易对查不出来，这里做个判断 clyne
    if (currentSymbol && isSpotSymbol) {
      // 切换交易对时调用获取交易对风险提示的接口
      dispatch({
        type: 'symbols/pullSymbolsTip',
        payload: {
          currentSymbol,
        },
      });
    }
  }, [currentSymbol, dispatch, isSpotSymbol]);

  const saveStorage = () => {
    try {
      const riskLocalTipMap = storage.getItem('RISK_TIP') || {};
      riskLocalTipMap[currentSymbol] = 'CLOSE';
      storage.setItem('RISK_TIP', riskLocalTipMap);
    } catch (e) {
      console.error(e, 'saveRiskTip-error');
      if (currentSymbol) {
        const obj = {
          [currentSymbol]: 'CLOSE',
        };
        storage.setItem('RISK_TIP', obj);
      }
    }
  };

  if (complianceTaxInfo?.needPayTax && isComplianceTaxTradeType && complianceTaxText) {
    return (
      <AlertBoxTip data-testid="risk-tip">
        {
          <Alert
            type="warning"
            title={complianceTaxText}
            showIcon
            closable
          />
        }
      </AlertBoxTip>
    );
  }

  const riskTip = riskTipMap?.[currentSymbol] || '';
  const riskLocalTipMap = storage.getItem('RISK_TIP');
  const showRiskTip = riskLocalTipMap?.[currentSymbol] || 'OPEN';

  if (!(riskTip && showRiskTip !== 'CLOSE')) return null;

  return (
    <AlertBoxTip data-testid="risk-tip">
      {<Alert type="warning" title={riskTip} showIcon closable onClose={saveStorage} />}
    </AlertBoxTip>
  );
};

export default memo(RiskTip);
