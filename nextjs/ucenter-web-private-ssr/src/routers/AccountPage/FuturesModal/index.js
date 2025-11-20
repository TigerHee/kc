/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import { Checkbox, Dialog, styled } from '@kux/mui';
import { message } from 'components/Toast';
import useOpenFuturesIsBonus from 'hooks/useOpenFuturesIsBonus';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _t, _tHTML } from 'tools/i18n';
import { getUtmLink } from 'utils/getUtm';
import { getSiteConfig } from 'kc-next/boot';
import Content from './Content';
import OpenSuccessDialog from './OpenSuccessDialog';

const StyledDialog = styled(Dialog)`
  .KuxModalFooter-buttonWrapper {
    button + button {
      margin-left: 12px;
    }
  }
`;

const OpenBody = styled.div`
  margin: 0px;
`;

const AgreeBox = styled.div`
  display: flex;
  margin-top: 12px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  > label {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  .KuxCheckbox-checkbox {
    top: 0px !important;
  }
`;

const AgreeItem = styled.div`
  span {
    font-size: 14px;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 14px;
  }
`;

const FuturesModal = ({ onClose }) => {
  const siteCfg = getSiteConfig();
  const dispatch = useDispatch();

  const successRef = React.useRef(null);

  const openSuccess = (data) => {
    if (successRef && successRef.current) {
      successRef.current.open(data);
    }
  };

  const visible = useSelector((state) => state.open_futures.openFuturesVisible);
  const openContract = useSelector((state) => state.open_futures.openContract);
  const loading = useSelector((state) => state.loading.effects['open_futures/openContract']);

  const { currentLang } = useLocale();

  const isCn = currentLang.indexOf('zh_') > -1;

  const [agreeUser, setAgreeUser] = useState(true);

  const isBonus = useOpenFuturesIsBonus(visible);

  const handleOpenFutures = async () => {
    if (openContract) return;
    if (!agreeUser) {
      message.error(_t('check.required'));
      return;
    }
    const bonusData = await dispatch({
      type: 'open_futures/openContract',
      payload: {
        isBonus,
      },
    });
    if (!isBonus) {
      openSuccess(false);
      return;
    }
    if (isBonus && !bonusData) {
      openSuccess(true);
    }
  };

  const handleCancelFutures = () => {
    dispatch({
      type: 'open_futures/update',
      payload: { openFuturesVisible: false },
    });
    onClose && onClose();
  };

  const handleChangeAgreeUser = () => {
    setAgreeUser(!agreeUser);
  };

  return (
    <>
      <StyledDialog
        open={visible}
        title={_t('open.futures')}
        okText={_t('open.futures')}
        cancelText={_t('open.futures.cancel')}
        onOk={handleOpenFutures}
        onCancel={handleCancelFutures}
        showCloseX={!loading}
        okButtonProps={{ loading, size: 'basic' }}
        cancelButtonProps={{ variant: 'text', size: 'basic', disabled: loading }}
      >
        <div>
          <OpenBody>
            <Content isBonus={isBonus} />
          </OpenBody>
          <AgreeBox>
            <Checkbox onChange={handleChangeAgreeUser} checked={agreeUser}>
              <AgreeItem>
                {_tHTML('open.futures.intro', {
                  href: getUtmLink(
                    `${siteCfg.MAINSITE_HOST}${
                      isCn
                        ? '/announcement/futures-terms-of-use-list'
                        : '/announcement/en-futures-terms-of-use-list'
                    }`,
                  ),
                })}
              </AgreeItem>
            </Checkbox>
          </AgreeBox>
        </div>
      </StyledDialog>
      <OpenSuccessDialog ref={successRef} />
    </>
  );
};

export default React.memo(FuturesModal);
