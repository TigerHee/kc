/**
 * Owner: willen@kupotech.com
 */
import { useResponsive } from '@kux/mui';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLangToPath, _t } from 'tools/i18n';
import { saTrackForBiz } from 'utils/ga';
import { getSecurityList } from './config';
import { SecurityItem } from './item';
import { ContentWrapper, Subtitle, Title, TitleWrapper, Wrapper } from './styled';

const SecurityCard = (props) => {
  const { multiSiteConfig } = props;
  const { securtyStatus = {}, user: { isSub = false, email, phone } = {} } = useSelector(
    (state) => state.user,
  );
  const { loginSafeWord, mailSafeWord, withdrawalSafeWord, externalBindings } = useSelector(
    (state) => state.account_security,
  );
  const prevSecurtyStatus = useRef(securtyStatus);
  const [isExternalOpen, setIsExternalOpen] = useState(false);

  const dispatch = useDispatch();
  const { sm } = useResponsive();

  const updateLoginIp = (checked) => {
    dispatch({
      type: 'account_security/updateLoginIp',
      payload: {
        value: checked,
      },
    });
  };

  const freezeSelf = async () => {
    const result = await dispatch({
      type: 'account_security/freezeSelf',
    });
    if (result && result.code === '200' && result.data) {
      window.location.href = addLangToPath(`${window.location.origin}${result.data}`);
    }
  };

  const [SecFirst, SecSecond, SecThird] = getSecurityList({
    multiSiteConfig,
    sm,
    isSub,
    securtyStatus,
    externalBindings,
    phone,
    email,
    loginSafeWord,
    mailSafeWord,
    withdrawalSafeWord,
    freezeSelf,
    updateLoginIp,
    isExternalOpen,
    setIsExternalOpen,
  });

  useEffect(() => {
    if (securtyStatus && JSON.stringify(securtyStatus) !== '{}') {
      if (securtyStatus?.GOOGLE2FA) {
        saTrackForBiz({}, ['Modify2FA', '1']);
      } else {
        saTrackForBiz({}, ['Bind2FA', '1']);
      }
      if (securtyStatus?.SMS) {
        saTrackForBiz({}, ['ModifyPhone', '1']);
        saTrackForBiz({}, ['UnbindPhone', '1']);
      } else {
        saTrackForBiz({}, ['BindPhone', '1']);
      }
      if (securtyStatus?.EMAIL) {
        saTrackForBiz({}, ['ModifyEmail', '1']);
        saTrackForBiz({}, ['UnbindEmail', '1']);
      } else {
        saTrackForBiz({}, ['BindEmail', '1']);
      }
      // Passkey一直都会有设置按钮入口，直接曝光上报
      saTrackForBiz({}, ['Passkey', '1']);
    }
  }, [securtyStatus]);

  useEffect(() => {
    if (!prevSecurtyStatus.current?.GOOGLE2FA && securtyStatus?.GOOGLE2FA) {
      saTrackForBiz({}, ['Modify2FA', '1']);
    }
    if (prevSecurtyStatus.current?.GOOGLE2FA && !securtyStatus?.GOOGLE2FA) {
      saTrackForBiz({}, ['Bind2FA', '1']);
    }
    if (!prevSecurtyStatus.current?.SMS && securtyStatus?.SMS) {
      saTrackForBiz({}, ['ModifyPhone', '1']);
      saTrackForBiz({}, ['UnbindPhone', '1']);
    }
    if (prevSecurtyStatus.current?.SMS && !securtyStatus?.SMS) {
      saTrackForBiz({}, ['BindPhone', '1']);
    }
    if (!prevSecurtyStatus.current?.EMAIL && securtyStatus?.EMAIL) {
      saTrackForBiz({}, ['ModifyEmail', '1']);
      saTrackForBiz({}, ['UnbindEmail', '1']);
    }
    if (prevSecurtyStatus.current?.EMAIL && !securtyStatus?.EMAIL) {
      saTrackForBiz({}, ['BindEmail', '1']);
    }
  }, [securtyStatus]);

  return (
    <Wrapper>
      <TitleWrapper>
        <Title>{_t('knbnLVVzQqsjrPZcdTZ8ai')}</Title>
        <Subtitle>{_t('security.top.tip')}</Subtitle>
      </TitleWrapper>
      <ContentWrapper>
        {SecFirst.map((SecOpt) => {
          return <SecurityItem key={SecOpt.id} dispatch={dispatch} {...SecOpt} />;
        })}
      </ContentWrapper>

      <TitleWrapper>
        <Title>{_t('xhjeAvH1h3Pts5WMEZ6CLn')}</Title>
      </TitleWrapper>
      <ContentWrapper>
        {SecSecond.map((SecOpt) => {
          return <SecurityItem key={SecOpt.id} dispatch={dispatch} {...SecOpt} />;
        })}
      </ContentWrapper>

      <TitleWrapper>
        <Title>{_t('tvsSHUhppKN6PbxrCmqSu3')}</Title>
      </TitleWrapper>
      <ContentWrapper>
        {SecThird.map((SecOpt) => {
          return <SecurityItem key={SecOpt.id} dispatch={dispatch} {...SecOpt} />;
        })}
      </ContentWrapper>
    </Wrapper>
  );
};
export default SecurityCard;
