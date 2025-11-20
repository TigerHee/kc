/**
 * Owner: willen@kupotech.com
 */
import { Drawer, styled } from '@kufox/mui';
import { useEffect } from 'react';
import { _t } from 'src/tools/i18n';
import { saTrackForBiz } from 'src/utils/ga';
import close from 'static/root/deposit/close.svg';
import DepositWay from './DepositWay';
import StaticBannerOfDrawer from './StaticBannerOfDrawer';

const Wrapper = styled.div`
  padding: 0 16px 24px;
`;

const StyledDrawer = styled(Drawer)`
  padding: 0 !important;
  min-height: auto !important;
  border-radius: 16px 16px 0px 0px;
`;

const Title = styled.div`
  font-weight: 500;
  font-size: 18px;
  height: 56px;
  line-height: 56px;
  text-align: center;
  color: #00142a;
`;

const CloseBtn = styled.img`
  width: 24px;
  height: 24px;
  position: absolute;
  left: 16px;
  top: 16px;
`;

const Desc = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  margin: 12px 0;
`;

export default ({ show, onCloseDrawer }) => {
  useEffect(() => {
    if (show) {
      try {
        saTrackForBiz({}, ['depositGuideChoose', '1'], {});
      } catch (error) {}
    }
  }, [show]);
  return (
    <StyledDrawer show={show} onClose={onCloseDrawer} anchor="bottom">
      <Wrapper>
        <Title>{_t('qWdrvNLiKoya1kqNWZ984D')}</Title>
        <StaticBannerOfDrawer />
        <Desc>{_t('c9PPUBFA7Uwf5bafjZsxzT')}</Desc>
        <DepositWay inDrawer onCloseDrawer={onCloseDrawer} />
        <CloseBtn src={close} onClick={onCloseDrawer} />
      </Wrapper>
    </StyledDrawer>
  );
};
