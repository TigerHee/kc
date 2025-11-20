/*
 * owner: borden@kupotech.com
 */
import loadable from '@loadable/component';
import { useTranslation } from '@tools/i18n';
import React, { useMemo, useState, useCallback } from 'react';
import { styled, Dropdown, useEventCallback } from '@kux/mui';
import {
  ICTradeAddOutlined,
  ICTransferOutlined,
  ICDepositOutlined,
  ICFinanceOutlined,
} from '@kux/icons';
import useContextSelector from '../hooks/common/useContextSelector';
import { NAMESPACE, ACCOUNT_TYPE_LIST_MAP } from '../config';
import { getInnerUrl } from '../utils/tools';
import { tenantConfig } from '../tenant';
import getStore from '../utils/getStore';
import pushTo from '../utils/pushRouter';
import withAuth from '../hocs/withAuth';

const TransferModal = loadable(() => import('../modules/TransferModal'));

const AddIcon = withAuth(styled(ICTradeAddOutlined)`
  cursor: pointer;
  color: ${(props) => props.theme.colors.primary};
`);
const Container = styled.span`
  display: flex;
  padding: 1px 0;
`;
const List = styled.div`
  position: absolute;
  border-radius: 12px;
  bottom: 0px;
  right: -28px;

  height: unset;
  box-shadow: 0px 4px 40px 0px rgba(0, 0, 0, 0.06);
  background: ${(props) => props.theme.colors.layer};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    right: -20px;
  }
`;
const Item = styled.a`
  padding: 0 16px;
  height: 40px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: ${(props) => props.theme.colors.text} !important;
  svg {
    margin-right: 8px;
  }
  &:first-of-type {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }
  &:last-of-type {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }
  &:hover {
    background: ${(props) => props.theme.colors.cover2};
  }
`;

const Overlay = ({ coin, handleOpenTransferModal }) => {
  const { t: _t } = useTranslation('convert');

  const handleClick = useEventCallback((e, url) => {
    e.preventDefault();
    if (url) pushTo(url);
  });

  const configs = useMemo(() => {
    return [
      {
        value: 'transfer',
        label: (
          <>
            <ICTransferOutlined />
            {_t('transfer.s')}
          </>
        ),
        getItemEventProps: () => ({
          onClick: handleOpenTransferModal,
        }),
      },
      {
        value: 'deposit',
        label: (
          <>
            <ICDepositOutlined size={16} />
            {_t('assets.deposit')}
          </>
        ),
        getItemEventProps: () => {
          const url = getInnerUrl(`/assets/coin/${coin}`);
          return {
            href: url,
            onClick: (e) => handleClick(e, url),
          };
        },
      },
      {
        value: 'buy_crypto',
        label: (
          <>
            <ICFinanceOutlined />
            {_t('hvEftTRoeReURjuutHWF3J')}
          </>
        ),
        getItemEventProps: () => {
          const url = getInnerUrl('/express');
          return {
            href: url,
            onClick: (e) => handleClick(e, url),
          };
        },
      },
    ];
  }, [coin, handleOpenTransferModal]);

  return (
    <List>
      {configs.map(({ value, label, getItemEventProps }) => {
        // 只有 kc 有买币
        if (!tenantConfig.showBuyCrypto && value === 'buy_crypto') return null;
        return (
          <Item key={value} {...getItemEventProps()}>
            {label}
          </Item>
        );
      })}
    </List>
  );
};

const AddButton = ({ coin, ...otherProps }) => {
  const isLogin = useContextSelector((state) => Boolean(state.user));
  const onTransfer = useContextSelector((state) => state.onTransfer);

  const [open, setOpen] = useState(false);
  const [showedOverlay, setShowedOverlay] = useState(false);

  const handleOpenTransferModal = useCallback(async () => {
    if (onTransfer) {
      const store = await getStore();
      const { fromCurrency, accountType } = store[NAMESPACE] || {};
      const { initDict } = ACCOUNT_TYPE_LIST_MAP[accountType] || {};
      onTransfer({
        initCurrency: fromCurrency,
        ...(initDict ? { initDict } : null),
      });
    } else {
      setOpen(true);
    }
  }, [onTransfer]);

  const onVisibleChange = useCallback((v) => {
    if (v) {
      setShowedOverlay((pre) => pre || true);
    }
  }, []);

  return (
    <>
      <Dropdown
        trigger="click"
        placement="top"
        popperStyle={{ zIndex: 1000 }}
        onVisibleChange={onVisibleChange}
        {...(!isLogin ? { visible: false } : null)}
        overlay={<Overlay coin={coin} handleOpenTransferModal={handleOpenTransferModal} />}
      >
        <Container {...otherProps}>
          <AddIcon size={16} />
        </Container>
      </Dropdown>
      {!onTransfer && showedOverlay && (
        <TransferModal visible={open} onClose={() => setOpen(false)} />
      )}
    </>
  );
};

export default React.memo(AddButton);
