/**
 * Owner: garuda@kupotech.com
 */
import React, { useEffect, useMemo, memo } from 'react';
import { useDispatch } from 'react-redux';

import { map } from 'lodash';

import { ICArrowDownOutlined, ICArrowRightOutlined } from '@kux/icons';

import clsx from 'clsx';

import Accordion from '@mui/Accordion';
import Divider from '@mui/Divider';

import { Drawer } from './commonStyle';

import {
  _t,
  addLangToPath,
  thousandPointed,
  formatCurrency,
  intlFormatDate,
} from '../../builtinCommon';
import { Link, SymbolText } from '../../builtinComponents';
import { useTrialRuleDialog, useTrialRuleInfo } from '../../builtinHooks';

const { AccordionPanel } = Accordion;

const formatData = (data, defaultValue) => {
  if (data === '' || data === undefined || data === null) {
    return defaultValue;
  }
  return thousandPointed(data);
};

const Content = memo(() => {
  const {
    detailData: {
      faceValue,
      maxLeverage,
      contractList,
      ruleText,
      ruleUrl,
      minTotalAmount,
      minTradeNum,
      maxValue,
      minValue,
      validPeriod,
      activateValidPeriod,
      minCloseRealisedPnl,
      currency: infoCurrency,
    },
  } = useTrialRuleInfo();

  const ruleTextArr = useMemo(() => {
    if (ruleText) {
      const arr = ruleText.split('\n');
      return arr;
    }
    return null;
  }, [ruleText]);

  const currency = formatCurrency(infoCurrency);
  const minTotalAmountTxt = `${formatData(minTotalAmount, '--')} ${currency || '--'}`;
  const minValueTxt = `${formatData(minValue, '--')} ${currency || '--'}`;
  const minTradeNumTxt = `≥ ${formatData(minTradeNum, '--')}`;
  const minPNLTxt = `${formatData(minCloseRealisedPnl, '--')} ${currency || '--'}`;
  const maxValueText = `${formatData(maxValue, '--')} ${currency || '--'}`;

  return (
    <>
      <div className={'drawerContent'}>
        <div className={'topArea'}>
          <div className={'value'}>
            {faceValue || '--'}
            <span className={'unit'}>{` ${currency}`}</span>
          </div>
        </div>
        <Divider />
        <div className={'extraInfo'}>
          <div className={'item'}>
            <div className={'label'}>{_t('trial2.rulemodal.trial.lerverage')}</div>
            <div className={'amount'}>
              {_t('trial2.rulemodal.trial.lerverage.value', { num: `${maxLeverage || 0}` })}
            </div>
          </div>
          <div className={'item accord'} style={{ marginBottom: 0 }}>
            <Accordion
              accordion
              expandIcon={(active) => (
                <ICArrowDownOutlined className={clsx('icon', { iconActive: active })} />
              )}
            >
              <AccordionPanel
                header={
                  <div className={'flexBox'}>
                    <div className={'label'}>{_t('trial2.rulemodal.trial.support.contract')}</div>
                    <div className={'contracts'}>
                      <span>
                        {_t('trial2.rulemodal.trial.support.contract.num', {
                          num: `${contractList?.length || 0}`,
                        })}
                      </span>
                    </div>
                  </div>
                }
              >
                <div className={'contractListWrapper'}>
                  {map(contractList, (contract, index) => {
                    return (
                      <>
                        <SymbolText symbol={contract} key={contract} />
                        {index === contractList?.length - 1 ? (
                          ''
                        ) : (
                          <span className={'split'} key={index}>
                            {','}
                          </span>
                        )}
                      </>
                    );
                  })}
                </div>
              </AccordionPanel>
            </Accordion>
          </div>
        </div>
        <Divider />
        <div>
          <div className={'itemTitle'}>{_t('trial2.rulemodal.trial.withdraw.condition')}</div>
          <div className={'item'}>
            <div className={'label'}>{_t('trial2.rulemodal.trial.condition.label1')}</div>
            <div className={'amount'}>{minTotalAmountTxt}</div>
          </div>
          <div className={'item'}>
            <div className={'label'}>{_t('trial2.rulemodal.withdrawRule2')}</div>
            <div className={'amount'}>{minPNLTxt}</div>
          </div>
          <div className={'item'}>
            <div className={'label'}>{_t('trial2.rulemodal.trial.condition.label3')}</div>
            <div className={'amount'}>{minTradeNumTxt}</div>
          </div>
        </div>
        <Divider />
        <div>
          <div className={'item'}>
            <div className={'label'}>{_t('trial2.rulemodal.trial.condition.label2')}</div>
            <div className={'amount'}>{minValueTxt}</div>
          </div>
          <div className={'item'}>
            <div className={'label'}>{_t('trial2.rulemodal.trial.condition.label4')}</div>
            <div className={'amount'}>{maxValueText}</div>
          </div>
          <div className={'item'}>
            <div className={'label'}>{_t('trial2.rulemodal.trial.condition.label5')}</div>
            <div className={'amount'}>
              {intlFormatDate({ date: activateValidPeriod, format: 'YYYY/MM/DD HH:mm' })}
            </div>
          </div>
          <div className={'item'}>
            <div className={'label'}>{_t('trial2.rulemodal.trial.condition.label6')}</div>
            <div className={'amount'}>
              {intlFormatDate({ date: validPeriod, format: 'YYYY/MM/DD HH:mm' })}
            </div>
          </div>
        </div>
        <Divider />
        <div className={'rules'}>
          <div className={'itemTitle'}>{_t('trial2.rulemodal.trial.rule.title')}</div>
          {map(ruleTextArr, (item, i) => (
            <p key={i}>{item}</p>
          ))}
          {ruleUrl ? (
            <Link href={addLangToPath(ruleUrl)} target="_blank">
              {_t('trial2.rulemodal.coupon.detailUrl')}
              <ICArrowRightOutlined />
            </Link>
          ) : null}
        </div>
      </div>
    </>
  );
});

const TrialRuleDrawer = () => {
  const dispatch = useDispatch();
  const { closeModal, getTrialFundDetailById } = useTrialRuleDialog();

  const { trialId, modalState } = useTrialRuleInfo();

  useEffect(() => {
    if (modalState && trialId) {
      getTrialFundDetailById(trialId);
    }
  }, [modalState, trialId, dispatch, getTrialFundDetailById]);

  return (
    <Drawer
      back={false}
      show={modalState}
      title={_t('welfare.gift.trial')}
      onClose={closeModal}
      onOk={closeModal}
      okText={_t('security.form.btn')}
      size="medium"
      anchor="right"
      height="100vh"
      cancelText={null}
      centeredFooterButton
    >
      <Content />
    </Drawer>
  );
};

export default memo(TrialRuleDrawer);
