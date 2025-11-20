/**
 * Owner: garuda@kupotech.com
 * 合约的下单类型解释弹框
 */
import React, { useMemo, useState } from 'react';

import { find, map } from 'lodash';

import { useResponsive } from '@kux/mui';
import { Tabs } from '@mui/Tabs';

import { ORDER_TYPE_INTROS } from './config';
import InfoContent from './InfoContent';
import { Content, ModalWrapper, TabsBar } from './style';

import { FUTURES_ORDER_EXPLAIN, trackClick, _t } from '../../builtinCommon';
import { useIntroduceProps } from '../../hooks/useIntroduceProps';

const { Tab } = Tabs;

const IntroModal = ({ defaultKey = 'customPrise' }) => {
  const { sm } = useResponsive();
  const [activeKey, setActiveKey] = useState(defaultKey);

  const { introduceVisible, closeIntroduce } = useIntroduceProps();

  const changeTabs = (e, v) => {
    setActiveKey(v);
    e.stopPropagation();
    // 埋点
    trackClick([FUTURES_ORDER_EXPLAIN, '2'], { actionType: v });
  };

  const orderTypeIntros = useMemo(() => {
    return ORDER_TYPE_INTROS(!sm);
  }, [sm]);

  const contentItem = useMemo(() => {
    return find(orderTypeIntros, { value: activeKey });
  }, [activeKey, orderTypeIntros]);

  return (
    <ModalWrapper
      title={_t('uRTwhTVDwDn1eZSe4vXomS')}
      open={introduceVisible}
      okText={_t('gDLG47ArM8z3fThnNgnE6j')}
      cancelText={null}
      onCancel={closeIntroduce}
      onOk={closeIntroduce}
      size="medium"
      maskClosable={!0}
    >
      <TabsBar>
        <Tabs size="medium" value={activeKey} onChange={changeTabs} variant="line" bordered={!0}>
          {map(orderTypeIntros, (v) => {
            return <Tab label={v.label} value={v.value} key={v.value} />;
          })}
        </Tabs>
      </TabsBar>
      <Content>
        {contentItem ? <InfoContent key={activeKey} {...contentItem.content} /> : null}
      </Content>
    </ModalWrapper>
  );
};
export default React.memo(IntroModal);
