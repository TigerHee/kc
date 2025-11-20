/**
 * Owner: clyne@kupotech.com
 */
import React, { useState, useEffect, useCallback, memo } from 'react';

import { find } from 'lodash';

import { useResponsive } from '@kux/mui';

import KuxDialog from '@mui/Dialog';

import Footer from './Footer';
import Step1 from './Step1';

import Step2 from './Step2';

import { MARGIN_MODE_CROSS, _t, _tHTML, fx, storage, styled } from '../builtinCommon';
import { useCrossGrayScale } from '../builtinHooks';
import { useGetSymbolInfo } from '../hooks/useGetData';
import { BIClick, BIExpose } from 'src/trade4.0/meta/futuresSensors/list';
import { GUIDE } from '@/meta/futuresSensors/cross';

const CROSS_GUIDE_KEY = 'CROSS_GUIDE_KEY';

const Dialog = styled(KuxDialog)`
  .KuxDialog-body {
    max-width: 520px;
    max-height: 560px;
  }
  img {
    width: 100%;
  }
  .desc {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    ${(props) => fx.color(props, 'text60')}
    margin-bottom: 16px;
  }
  .title2 {
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
    margin-top: 24px;
    ${(props) => fx.color(props, 'text')}
  }
  .desc2 {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    margin-top: 6px;
  }
  a {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 130%;
    text-decoration-line: underline;
    ${(props) => fx.color(props, 'text')}
  }
`;

const CrossGuide = () => {
  const { sm } = useResponsive();
  const isMobile = !sm;
  const hasBeenShow = storage.getItem(CROSS_GUIDE_KEY);
  const { symbol } = useGetSymbolInfo();
  const { crossGrayScaleForSymbol } = useCrossGrayScale();

  const grayValue = crossGrayScaleForSymbol(symbol);

  const isCross = find(grayValue, (v) => MARGIN_MODE_CROSS === v);
  const [step, setStep] = useState(1);
  const [state, setState] = useState(false);
  const isShow = hasBeenShow || isMobile ? false : isCross && state;

  const desc1 = step === 1 ? _t('cross.guide.step1.desc.1') : _t('cross.guide.step2.desc.1');
  const title2 = step === 1 ? _t('cross.guide.step1.title.2') : _t('cross.guide.step2.title.2');
  const desc2 =
    step === 1
      ? _t('cross.guide.step1.desc.2')
      : _tHTML('cross.guide.step2.desc.2', {
          url: '/support',
        });

  useEffect(() => {
    setTimeout(() => {
      setState(true);
    }, 5000);
  }, []);

  useEffect(() => {
    if (isShow) {
      BIExpose([GUIDE.BLOCK_ID, '1']);
    }
  }, [isShow]);

  const onClose = useCallback((type) => {
    if (type !== 'toTrade') {
      BIClick([GUIDE.BLOCK_ID, GUIDE.CLOSE]);
    }
    setState(false);
    storage.setItem(CROSS_GUIDE_KEY, true);
  }, []);

  // 上一步
  const onPrev = useCallback(() => {
    BIClick([GUIDE.BLOCK_ID, GUIDE.PREV]);
    setStep(1);
  }, []);

  const onOk = useCallback(() => {
    // 最后一步
    if (step === 2) {
      BIClick([GUIDE.BLOCK_ID, GUIDE.TO_TRADE]);
      onClose('toTrade');
      // 下一步
    } else {
      BIClick([GUIDE.BLOCK_ID, GUIDE.NEXT]);
      setStep(2);
    }
  }, [onClose, step]);

  const onHelp = useCallback((e) => {
    console.log('====bi', e.target);
    if (e.target.nodeName === 'A') {
      BIClick([GUIDE.BLOCK_ID, GUIDE.TO_HELPER]);
    }
  }, []);

  return (
    <Dialog
      open={isShow}
      title={_t('cross.guide.title.1')}
      onCancel={onClose}
      onOk={onOk}
      footer={<Footer step={step} onOk={onOk} onPrev={onPrev} />}
    >
      <div className="desc">{desc1}</div>
      <div className="content">
        {step === 1 ? <Step1 /> : <Step2 />}
        <div className="title2">{title2}</div>
        <div className="desc2" onClick={onHelp}>
          {desc2}
        </div>
      </div>
    </Dialog>
  );
};

export default memo(CrossGuide);
