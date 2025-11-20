/**
 * Owner: lori@kupotech.com
 */
import { Button, useTheme } from '@kux/mui';
import SpanForA from 'components/common/SpanForA';
import { getIsInApp } from 'helper';
import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import failImg from 'static/account/fail.svg';
import processingImgDark from 'static/account/processing-new-dark.svg';
import processingImg from 'static/account/processing-new.svg';
import successImg from 'static/account/success.svg';
import { addLangToPath, _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import { CenterText, FinishWrapper, StatusTitle, Warning } from './styled';

const Finish = React.memo(() => {
  const { status } = useSelector((state) => state.forget_withdraw_password);
  const isInApp = getIsInApp();
  const theme = useTheme();

  // 神策埋点
  useEffect(() => {
    const blockId = status === 10 ? 'CheckClose2' : 'CheckClose1';
    trackClick([blockId, '1']);
  }, [status]);

  const handleClick = useCallback(() => {
    window.location.href = addLangToPath('/account/security/protect');
  }, [isInApp]);

  // 点击联系客服
  const handleToSupport = useCallback(() => {
    window.location.href = addLangToPath('/support');
  }, []);

  // 自动审核通过
  if (status === 10) {
    return (
      <FinishWrapper>
        <img src={successImg} alt="tipImg" />
        <StatusTitle>{_t('selfService2.resetTradePW.success')}</StatusTitle>
        <Warning>{_t('security.24h.limit')}</Warning>
        <SpanForA className="link_for_a" onClick={handleClick}>
          {_t('selfService2.resetTradePW.toSet')}
        </SpanForA>
      </FinishWrapper>
    );
  }

  // 身份验证失败导致的申请失败-admin增加一条系统驳回记录
  if (status === 11) {
    return (
      <FinishWrapper>
        <img src={failImg} alt="tipImg" />
        <StatusTitle>{_t('forgetPW.fail.title')}</StatusTitle>
        <CenterText>{_t('forgetPW.fail.des')}</CenterText>
        <Button onClick={handleToSupport} fullWidth={true}>
          {_t('selfService.contactUs')}
        </Button>
      </FinishWrapper>
    );
  }

  // 等待人工审核
  return (
    <FinishWrapper data-inspector="sec_form_finish_wait">
      <img src={theme.currentTheme === 'light' ? processingImg : processingImgDark} alt="tipImg" />
      <StatusTitle>{_t('selfService2.result.wait')}</StatusTitle>
      <Warning>
        1.{_t('application.submited.desc')}
        <br />
        2.{_t('security.24h.limit')}
      </Warning>
    </FinishWrapper>
  );
});

export default Finish;
