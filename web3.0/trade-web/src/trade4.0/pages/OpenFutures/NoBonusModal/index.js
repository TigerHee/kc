/**
 * Owner: charles.yang@kupotech.com
 */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, useSnackbar } from '@kux/mui';
import AdaptiveModal from '@/components/AdaptiveModal';
import { styled } from '@kux/mui/emotion';
import { _t, _tHTML } from 'utils/lang';
import { getUtmLink } from 'utils/getUtm';
import { siteCfg } from 'config';
import useOpenFuturesIsBonus from '../hooks/useOpenFuturesIsBonus';

import Content from './Content';
import OpenSuccessDialog from './OpenSuccessDialog';

const ContentBox = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text60};
  margin-bottom: 32px;
`;

const UserAgree = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  .agreeInfo {
    margin-left: 8px;
  }
  a {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const FuturesModal = () => {
  const dispatch = useDispatch();
  const visible = useSelector((state) => state.openFutures.openFuturesVisible);
  const openContract = useSelector((state) => state.openFutures.openContract);
  const loading = useSelector((state) => state.loading.effects['openFutures/openContract']);
  const { currentLang } = useSelector((state) => state.app);

  const successRef = React.useRef(null);

  const { message } = useSnackbar();

  const openSuccess = (data) => {
    if (successRef && successRef.current) {
      successRef.current.open(data);
    }
  };

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
      type: 'openFutures/openContract',
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
      type: 'openFutures/update',
      payload: { openFuturesVisible: false },
    });
  };

  const handleChangeAgreeUser = () => {
    setAgreeUser(!agreeUser);
  };

  return (
    <>
      <AdaptiveModal
        open={visible}
        title={_t('open.futures')}
        okText={_t('open.futures')}
        cancelText={_t('open.futures.cancel')}
        onOk={handleOpenFutures}
        onCancel={handleCancelFutures}
        okButtonProps={{ loading, size: 'large' }}
        cancelButtonProps={{ size: 'large' }}
      >
        <ContentBox>
          <Content isBonus={isBonus} />
        </ContentBox>
        <UserAgree>
          <Checkbox onChange={handleChangeAgreeUser} checked={agreeUser} />
          <span className="agreeInfo">
            {_tHTML('open.futures.intro', {
              href: getUtmLink(
                `${siteCfg.MAINSITE_HOST}${
                  isCn ? '/news/futures-terms-of-use-list' : '/news/en-futures-terms-of-use-list'
                }`,
              ),
            })}
          </span>
        </UserAgree>
      </AdaptiveModal>
      <OpenSuccessDialog ref={successRef} />
    </>
  );
};

export default React.memo(FuturesModal);
