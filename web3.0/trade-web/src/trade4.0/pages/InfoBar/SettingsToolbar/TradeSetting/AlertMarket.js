/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useState, useCallback, Fragment } from 'react';
import { Tabs } from '@mui/Tabs';
import AlertMonitoring from './AlertMonitoring';
import AlertLogs from './AlertLogs';
import {
  DrawerWrapper,
  DrawerFooter,
  DrawerContent,
  BoxWrapper,
} from './style';
import Button from '@mui/Button';
import WranDialog from './WranDialog';
import { _t } from 'utils/lang';
import PrivateButton from 'src/trade4.0/components/PrivateButton';

const { Tab } = Tabs;

const CONTENT_ENUM = {
  0: <AlertMonitoring />,
  1: <AlertLogs />,
};

const renderContent = (v) => CONTENT_ENUM[v || 0];

/**
 * AlertMarket
 */
const AlertMarket = (props) => {
  const { onCancel, ...restProps } = props;
  const [value, setValue] = useState(0);
  const [visible, setVisible] = useState(false);

  const handleChange = useCallback((_, v) => {
    setValue(v);
  }, []);

  const handleAdd = useCallback(() => {
    setVisible(true);
  }, []);

  return (
    <Fragment>
      <DrawerWrapper>
        <BoxWrapper>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="line"
            size="medium"
          >
            <Tab label={_t('pricewarn.watch')} value={0} />
            <Tab label={_t('pricewarn.log')} value={1} />
          </Tabs>
        </BoxWrapper>
        <DrawerContent>{renderContent(value)}</DrawerContent>
        <DrawerFooter>
          <Button variant="outlined" mr={20} onClick={onCancel}>
            {_t('cancel')}
          </Button>
          <PrivateButton variant="contained" onClick={handleAdd}>
            {_t('n.trade.price_warn.new')}
          </PrivateButton>
        </DrawerFooter>
      </DrawerWrapper>
      <WranDialog
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={() => setVisible(false)}
      />
    </Fragment>
  );
};

export default memo(AlertMarket);
