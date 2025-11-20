/*
 * @owner: mike@kupotech.com
 */
import React, { useCallback, Fragment } from 'react';
import styled from '@emotion/styled';
import { debounce } from 'lodash';
import { useSelector } from 'dva';
import { _t, _tHTML } from 'Bot/utils/lang';
import Button from '@mui/Button';
import useLoginAndRegister from '@/hooks/useLoginAndRegister';
import { useYScreen } from '@/pages/OrderForm/config';
import { Div } from '../Widgets';

const TRADE_SIDE = {
  long: {
    value: 'long',
    color: 'primary',
    buttonType: 'brandGreen',
    label: () => _t('gridwidget11'),
  },
  short: {
    value: 'short',
    color: 'secondary',
    buttonType: 'secondary',
    label: () => _t('gridwidget11'),
  },
};

const SubmitButton = ({ direction = 'long', ...restProps }) => {
  const { label, buttonType } = TRADE_SIDE[direction] || {};

  return (
    <Button type={buttonType} mt={16} mb={16} {...restProps}>
      {direction ? label() : _t('gridwidget11')}
    </Button>
  );
};

/**
 * @description: 提交按钮
 * @param {*} React
 * @return {*}
 */
const SubmitButtonWrapper = React.memo((props) => {
  const yScreen = useYScreen();
  const { onClick, direction, ...otherProps } = props;
  // const screen = useContext(WrapperContext);
  const screen = 'mdx';
  const ucenterButtonProps = useLoginAndRegister();
  const isLogin = useSelector((state) => state.user.isLogin);

  const isMd = screen === 'md';
  const commonButtonProps = {
    fullWidth: true,
    size: yScreen === 'sm' ? 'small' : 'basic',
  };
  const onSubmit = useCallback(
    debounce((e) => {
      onClick(e);
    }, 200),
    [onClick],
  );

  if (isLogin) {
    return <SubmitButton onClick={onSubmit} {...commonButtonProps} {...otherProps} />;
  }
  if (isMd) {
    return <Button {...commonButtonProps} />;
  }
  return (
    <Div mt={16} mb={16}>
      <Button {...commonButtonProps} {...ucenterButtonProps.loginProps} />
      <Button
        {...commonButtonProps}
        {...ucenterButtonProps.registerProps}
        style={{ marginTop: 8 }}
      />
    </Div>
  );
});

export default SubmitButtonWrapper;
