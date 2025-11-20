/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import DialogRef from 'Bot/components/Common/DialogRef';
import { choice } from 'FutureMartingale/config';
import { _t, _tHTML } from 'Bot/utils/lang';
import { useTheme } from '@kux/mui';
import styled from '@emotion/styled';

const CycleOpenHintUL = styled.ul`
  padding-left: 0;
  .box-bk {
    background: rgba(225, 232, 245, 0.04);
    border-radius: 4px;
    padding: 6px 12px;
  }
  img {
    width: 100%;
  }
  li {
    position: relative;
    padding-left: 12px;
    &::before {
      content: '';
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: ${({ theme }) => theme.colors.primary};
      left: 0;
      top: 0;
      bottom: 0;
      margin: auto;
    }
  }
`;
const CycleOpenHintContent = ({ direction }) => {
  const { currentTheme } = useTheme();
  const meta = choice().find((el) => el.direction === direction);
  return (
    <CycleOpenHintUL>
      <div className="fs-20 text-color mb-20">{_t('rTsH2BV1bbEsPXqZxwNscA')}</div>
      <li className="text-color mb-8">{_t('startnow')}</li>
      <p className="fs-14 text-color-60">{_t('jynyDMW7D4dc2nPxziSzCo')}</p>
      <div className="Flex vc sb mb-14 mt-12">
        <li className="text-color">{meta.lang}</li>
        <span className="fs-14 text-color-60">{_t('76RRv418Q2eESJ2LGohsgo')}</span>
      </div>
      <div className="box-bk text-color-60 fs-14 mb-12">
        <div className="Flex vc sb mb-6">
          <span>{_t('eM6JLQ8ZKQFU8mVfNBe5Xy')}</span>
          <span>7</span>
        </div>
        <div className="Flex vc sb">
          <span>{_t('sbFCyvjXyrXUnJEFtLxAuJ')}</span>
          <span>1 H</span>
        </div>
      </div>
      <div className="fs-14 text-color-60 mb-8">{_t('qX2WbV5xvZqL2Jz4ZGY4wV')}</div>
      <p className="fs-14 text-color-60">{_t(meta.description)}</p>
      <div className="mt-4">
        <img src={meta[currentTheme]} alt="" />
      </div>
      <li className="text-color mb-8 mt-12">{_t('notCycle')}</li>
      <p className="fs-14 text-color-60">{_t('cMZ8YMiDxBirSA3xeW2357')}</p>
    </CycleOpenHintUL>
  );
};
/**
 * @description: 循环开仓解释文案弹窗
 * @param {*} actionSheetRef
 * @return {*}
 */
const CycleOpenHint = ({ actionSheetRef, direction = 'long' }) => {
  return (
    <DialogRef
      title={_t('rTsH2BV1bbEsPXqZxwNscA')}
      okText={_t('gridform24')}
      cancelText={null}
      onOk={() => actionSheetRef.current.toggle()}
      onCancel={() => actionSheetRef.current.toggle()}
      size="medium"
      ref={actionSheetRef}
    >
      <CycleOpenHintContent direction={direction} />
    </DialogRef>
  );
};

export default CycleOpenHint;
