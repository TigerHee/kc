/**
 * Owner: clyne@kupotech.com
 */
import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUtmLink } from 'utils/getUtm';
import { _t, _tHTML } from 'utils/lang';
import { siteCfg } from 'config';
import useOpenFuturesIsBonus from '../hooks/useOpenFuturesIsBonus';
import imgBg from '@/assets/openFutures/bonus.svg';
import { CloseOutlined } from '@kux/icons';
import { Button } from '@kux/mui';
import Dialog from '@/components/AdaptiveModal';
import { styled } from '@kux/mui/emotion';
import SafeLink from 'components/SafeLink';
import OpenBonusDialog from './OpenBonusDialog';

const CloseOutlinedIcon = styled(CloseOutlined)`
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  top: 16px;
  right: 16px;
  color: ${(props) => props.theme.colors.icon};
`;

const BgImg = styled.img`
  width: 100%;
`;

const DialogContent = styled(Dialog)`
  .KuxDialog-content {
    padding: 0;
    overflow: hidden;
    border-radius: 20px;
  }
`;

const ContentWrapper = styled.div`
  padding: 32px;
`;

const BonusTitle = styled.div`
  font-weight: 700;
  font-size: 24px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 12px;
`;

const SubTitle = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text60};
  margin-bottom: 32px;
`;

const ButtonGroup = styled.div`
  margin-bottom: 12px;
`;

const FooterContent = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text60};
`;

const OpenFuturesBonusDialog = ({ type }) => {
  const dispatch = useDispatch();

  const bonusRef = useRef(null);

  const openBonus = (data) => {
    if (bonusRef && bonusRef.current) {
      bonusRef.current.open(data);
    }
  };

  const open = useSelector((state) => state.openFutures.openFuturesBonusVisible);
  const openContract = useSelector((state) => state.openFutures.openContract);
  const loading = useSelector((state) => state.loading.effects['openFutures/openContract']);
  const currentLang = useSelector((state) => state.app.currentLang);

  const isCn = currentLang === 'zh-CN';

  const isBonus = useOpenFuturesIsBonus(open);

  const handleOpenFutures = async () => {
    if (!openContract) return;
    // 触发弹框的状态
    // event.emit('OPEN_BONUS_DIALOG_STATUS', true);

    const bonusData = await dispatch({
      type: 'openFutures/openContract',
      payload: {
        isBonus,
      },
    });

    let activityType = null;
    const bonusContentMap = {
      TRIAL_FUNDS: 'fund',
      DEDUCTION_COUPON: 'activity',
      DEFAULT: null,
    };
    if (bonusData && bonusData.rewards) {
      activityType = bonusContentMap[bonusData.rewardType || 'DEDUCTION_COUPON'];
    }
    openBonus(bonusData);
  };

  const handleClose = () => {
    dispatch({
      type: 'openFutures/update',
      payload: { kumexOpenDialogVisible: false },
    });
  };

  return (
    <>
      <DialogContent
        open={open}
        footer={null}
        header={null}
        disableBackdropClick
        onClose={handleClose}
        showClose
        closeNode={<CloseOutlined />}
      >
        <BgImg src={imgBg} alt="bg" />
        <CloseOutlinedIcon onClick={handleClose} />
        <ContentWrapper>
          <BonusTitle>{_t('futures.bonus.title')}</BonusTitle>
          <SubTitle>
            {_tHTML('futures.bonus.title.sub')}
            {_t('futures.bonus.title.sub.extra')}
          </SubTitle>
          <ButtonGroup>
            <Button
              variant="contained"
              size="large"
              fullWidth
              loading={loading}
              onClick={handleOpenFutures}
            >
              {_t('open.futures.bonus.btn')}
            </Button>
          </ButtonGroup>
          <FooterContent>
            <span>{_t('open.futures.btn.risk.tip')}</span>
            <SafeLink
              href={getUtmLink(
                `${siteCfg.MAINSITE_HOST}${
                  isCn ? '/news/futures-terms-of-use-list' : '/news/en-futures-terms-of-use-list'
                }`,
              )}
              className="ml-4"
            >
              {_t('open.step3')}
            </SafeLink>
          </FooterContent>
        </ContentWrapper>
      </DialogContent>
      <OpenBonusDialog ref={bonusRef} type={type} />
    </>
  );
};

export default React.memo(OpenFuturesBonusDialog);
