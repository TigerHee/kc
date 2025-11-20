/**
 * Owner: willen@kupotech.com
 */
import { useMktVisible } from '@kucoin-biz/hooks';
import { Button, Dialog, styled, useResponsive } from '@kux/mui';
import NoSSG from 'components/NoSSG';
import { useCallback, useEffect, useState } from 'react';
import BeginnerBg from 'static/account/overview/beginner.svg';
import { _t, _tHTML } from 'tools/i18n';
import { kcsensorsManualExpose, trackClick } from 'utils/ga';
import { push } from 'utils/router';
import storage from 'utils/storage';

const StyledDialog = styled(Dialog)`
  .KuxDialog-content {
    padding: 0;
  }
  .KuxDialog-body {
    border-radius: 8px;
  }
`;

const Top = styled.div`
  margin: 0px;
  display: flex;
  width: 100%;
  justify-content: center;
  overflow: hidden;
  border-radius: 4px 4px 0 0;
`;

const Bottom = styled.div`
  padding: 24px;
`;

const Title = styled.h2`
  font-size: 18px;
  line-height: 30px;
  color: ${(props) => props.theme.colors.text};
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: 16px;
    font-weight: 400;
    font-size: 16px;
    line-height: 26px;
  }
`;

const Intro = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 22px;
  color: ${(props) => props.theme.colors.text60};
  & span span {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const GiftImg = styled.img`
  display: block;
  width: 100%;
`;

const FooterNode = styled.div`
  display: flex;
  padding: 24px;
  padding-top: 0;
  flex-direction: row-reverse;
  align-items: center;
  ${(props) => props.theme.breakpoints.down('md')} {
    display: block;
  }
`;

const CancelButton = styled(Button)`
  flex: 1;
  line-height: 14px;
  ${(props) => props.theme.breakpoints.down('md')} {
    margin: 5px 0 -7px;
  }
`;

const OkButton = styled(Button)`
  margin-left: 12px;
  flex: 1;
  line-height: 14px;
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-left: 0;
  }
`;

const BeginnerDialog = () => {
  const [visible, setVisible] = useState(false);
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  const { showMktContent } = useMktVisible();

  // 去新手专区
  const goBeginnerZone = useCallback(() => {
    trackClick(['SignUpOKPopUp', '1']);
    storage.removeItem('showRegisterBeginnerGuide');
    push('/beginner-zone');
  }, []);

  const onCancel = () => {
    setVisible(false);
    storage.removeItem('showRegisterBeginnerGuide');
    trackClick(['SignUpOKPopUp', '2']);
  };

  useEffect(() => {
    const nextVisible = !!storage.getItem('showRegisterBeginnerGuide');
    if (nextVisible && showMktContent) {
      // 接入展业中台根据规则不展示注册成功后的营销弹窗
      // 曝光埋点
      kcsensorsManualExpose(['SignUpOKPopUp', '3']);
      setVisible(true);
    }
  }, [showMktContent]);

  return (
    <NoSSG>
      <StyledDialog
        open={visible}
        header={null}
        size="basic"
        footer={
          <FooterNode>
            <OkButton fullWidth={!!isH5} onClick={goBeginnerZone}>
              {_t('resgiter.success.go')}
            </OkButton>
            <CancelButton
              type="default"
              variant={isH5 ? 'text' : 'contained'}
              fullWidth={!!isH5}
              onClick={onCancel}
            >
              {_t('resgiter.success.stay')}
            </CancelButton>
          </FooterNode>
        }
      >
        <Top>
          <GiftImg src={BeginnerBg} alt="gift-image" />
        </Top>
        <Bottom>
          <Title data-inspector="inspector_signup_success_guide">
            {_t('resgiter.success.title')}
          </Title>
          <Intro>{_tHTML('resgiter.success.welfare', { num: 500 })}</Intro>
        </Bottom>
      </StyledDialog>
    </NoSSG>
  );
};

export default BeginnerDialog;
