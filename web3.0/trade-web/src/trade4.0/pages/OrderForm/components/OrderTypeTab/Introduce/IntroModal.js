/**
 * Owner: jessie@kupotech.com
 */
import React, { useState, useMemo } from 'react';
import { map, find } from 'lodash';
import { Tabs } from '@mui/Tabs';
import { useResponsive } from '@kux/mui';
import { _t } from 'utils/lang';
import { ModalWrapper, TabsBar, Content } from './style';
import { ORDER_TYPE_INTROS } from './config';
import InfoContent from './InfoContent';

const { Tab } = Tabs;

const IntroModal = ({ visible, onCancel, defaultKey = 'customPrise' }) => {
  const { sm } = useResponsive();
  const [activeKey, setActiveKey] = useState(defaultKey);

  const changeTabs = (e, v) => {
    setActiveKey(v);
    e.stopPropagation();
  };

  const orderTypeIntros = useMemo(() => {
    return ORDER_TYPE_INTROS(!sm);
  }, [sm]);

  const contentItem = useMemo(() => {
    return find(orderTypeIntros, { value: activeKey });
  }, [activeKey]);

  return (
    <ModalWrapper
      title={_t('uRTwhTVDwDn1eZSe4vXomS')}
      open={visible}
      okText={_t('gDLG47ArM8z3fThnNgnE6j')}
      cancelText={null}
      onCancel={onCancel}
      onOk={onCancel}
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
      <Content>{contentItem ? <InfoContent key={activeKey} {...contentItem.content} /> : null}</Content>
    </ModalWrapper>
  );
};
export default IntroModal;
