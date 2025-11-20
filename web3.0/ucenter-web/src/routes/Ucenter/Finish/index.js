/**
 * Owner: lori@kupotech.com
 */
import { Button, useTheme } from '@kux/mui';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import failImg from 'static/account/fail.svg';
import processingImgDark from 'static/account/processing-new-dark.svg';
import processingImg from 'static/account/processing-new.svg';
import successImg from 'static/account/success.svg';
import { addLangToPath, _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import { CenterText, FinishWrapper, StatusTitle, Warning, WarnWrapper } from './styled';

const Finish = (props) => {
  const { isPhone } = props;
  const theme = useTheme();
  const { status } = useSelector((state) => (isPhone ? state.rebind_phone : state.reset_g2fa));
  const resetUrl = addLangToPath('/account/security/g2fa');

  useEffect(() => {
    const blockId = status === 10 ? 'CheckClose2' : 'CheckClose1';
    trackClick([blockId, '1']);
  }, [status]);

  // 点击联系客服
  const handleToSupport = () => {
    window.location.href = addLangToPath('/support');
  };

  // 自动审核通过
  if (status === 10) {
    return (
      <FinishWrapper data-inspector="finish_auto_adoption">
        <img src={successImg} alt="tipImg" />
        <StatusTitle>
          {isPhone ? _t('selfService2.result.successPhone') : _t('selfService2.result.successG2fa')}
        </StatusTitle>
        <Warning>{_t('security.24h.limit')}</Warning>
        {!isPhone && <a href={resetUrl}>{_t('selfService2.result.setG2fa')}</a>}
      </FinishWrapper>
    );
  }

  // 身份验证失败导致的申请失败-admin增加一条系统驳回记录
  if (status === 11) {
    return (
      <FinishWrapper data-inspector="finish_failed">
        <img src={failImg} alt="tipImg" />
        <StatusTitle>{_t('selfService.applyFail.title')}</StatusTitle>
        <CenterText>{_t('selfService.applyFail.des')}</CenterText>
        <Button onClick={handleToSupport} fullWidth={true}>
          {_t('conflict.contact')}
        </Button>
      </FinishWrapper>
    );
  }

  // 等待人工审核
  return (
    <FinishWrapper data-inspector="finish_wait">
      <img src={theme.currentTheme === 'light' ? processingImg : processingImgDark} alt="tipImg" />
      <StatusTitle>{_t('selfService2.result.wait')}</StatusTitle>
      <WarnWrapper>
        <Warning>
          1.{_t('application.submited.desc')}
          <br />
          2.{_t('security.24h.limit')}
        </Warning>
      </WarnWrapper>
    </FinishWrapper>
  );
};

export default Finish;
