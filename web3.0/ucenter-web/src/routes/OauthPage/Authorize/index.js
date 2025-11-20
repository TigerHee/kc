/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { goVerifyLegacy } from '@kucoin-gbiz-next/verification';
import { Button, Checkbox, px2rem, styled, useSnackbar } from '@kux/mui';
import { searchToJson } from 'helper';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { addLangToPath, getCurrentLangFromPath, _t, _tHTML } from 'tools/i18n';
import memStorage from 'tools/memStorage';
import storage from 'utils/storage';
import ConfirmModal from './ConfirmModal';
import { SiteTypeNotMatchModal } from './SiteTypeNotMatchModal';
import UserFlag from './UserFlag';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  // min-height: 810px;
  padding: 0 24px;
  min-width: 375px;
`;

const CustomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 480px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
  }
`;

const CustomTitle = styled.div`
  font-size: ${px2rem(34)};
  margin-bottom: ${px2rem(20)};
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;
const CustomSubTitle = styled.div`
  font-size: 14px;
  line-height: 24px;
  color: ${(props) => props.theme.colors.text60};
  & span > span {
    color: ${(props) => props.theme.colors.primary};
  }
`;
const CheckBoxText = styled.span`
  font-weight: 400;
  font-size: 14px;
  vertical-align: middle;
  color: ${(props) => props.theme.colors.text60};
`;
const SubmitBtn = styled(Button)`
  margin-top: 41px;
`;
const BottomWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: ${px2rem(48)};
`;
const LineSpan = styled.div`
  width: ${px2rem(1)};
  height: ${px2rem(16)};
  background: rgba(0, 20, 42, 0.08);
  margin: 0 ${px2rem(13)};
`;
const BottomSpan = styled.span`
  font-weight: 400;
  font-size: ${px2rem(16)};
  cursor: pointer;
  color: ${(props) => props.theme.colors.text};
  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const bizType = 'RV_OAUTH_GRANT';

const Authorize = (props) => {
  useLocale();
  const { message } = useSnackbar();
  const { userInfo } = props;
  const [agree, setAgree] = useState(false);
  const [visible, setVisible] = useState(false);
  const [userSiteType, setUserSiteType] = useState('');
  const [content, setContent] = useState('');
  const dispatch = useDispatch();
  const invitationCode = useSelector((state) => state.oauth.invitationCode);
  const authCheckLoading = useSelector((state) => state.loading.effects['oauth/authCheck']);
  const authCodeLoading = useSelector((state) => state.loading.effects['oauth/authCode']);
  const query = searchToJson();
  const { client_id, scope, state, response_type, redirect_uri } = query;

  const formateParams = useCallback((payload) => {
    const params = { ...payload };
    const langByPath = getCurrentLangFromPath();
    params.c = memStorage.getItem('csrf') || undefined;
    params.lang = params.lang || langByPath || storage.getItem('lang');
    return params;
  }, []);

  const checkIsSub = useCallback((obj = {}) => {
    const { isSub = false, type = 1 } = obj || {};
    return isSub || type === 3;
  }, []);
  const onChangeAgree = useCallback((e) => {
    setAgree(e.target.checked);
  }, []);

  const ReLogin = useCallback(() => {
    const { pathname, search } = window.location;
    dispatch({
      type: 'app/logout',
      payload: {
        to: `${pathname}${search}`,
      },
    });
  }, [dispatch]);
  const goSignUp = useCallback(() => {
    const href = window.location.href;
    const backUrl = encodeURIComponent(href);
    const url = `/ucenter/signup?backUrl=${backUrl}${
      invitationCode ? `&rcode=${invitationCode}` : ''
    }`;
    dispatch({
      type: 'app/logout',
      payload: {
        to: url,
      },
    });
  }, [dispatch, invitationCode]);

  const handleSubmit = useCallback(async () => {
    const payload = formateParams({
      client_id,
      scope,
      state,
      response_type,
      redirect_uri,
    });

    // 兼容后端302 http状态码，后续去掉此处逻辑
    const onJumpAuthCode = () => {
      dispatch({
        type: 'oauth/authCodeJump',
        payload: payload,
      });
    };
    try {
      const verifyRes = await goVerifyLegacy({
        bizType,
        businessData: {
          thirdPartyLink: encodeURIComponent(window.location.href),
        },
      });
      if (verifyRes) {
        const res = await dispatch({
          type: 'oauth/authCode',
          payload: {
            ...payload,
            headers: verifyRes.headers,
          },
        });
        if (res?.success && res?.data) {
          if (res?.data?.location) {
            // 有location字段时，前端重定向
            window.location.href = addLangToPath(res.data.location);
            return;
          }
        }

        onJumpAuthCode();
      }
    } catch (err) {
      if (err?.msg) {
        message.error(err?.msg);
        return;
      }
      onJumpAuthCode();
    }
  }, [client_id, dispatch, formateParams, message, redirect_uri, response_type, scope, state]);

  const confirm = useCallback(() => {
    const payload = formateParams({ scope, client_id });
    dispatch({
      type: 'oauth/authCheck',
      payload: payload,
    }).then((res) => {
      const {
        success,
        data: {
          show_notice: showNotice,
          notice_list: noticeList,
          site_type_match: siteTypeMatch, // 用户站点与 client_id 所属站点是否匹配
          user_site_type: userSiteType, // client_id 所属的站点名称
        },
      } = res;
      if (success) {
        if (!siteTypeMatch) {
          setUserSiteType(userSiteType);
        } else if (showNotice) {
          setVisible(true);
          setContent(noticeList ? noticeList[0] : '');
        } else {
          handleSubmit();
        }
      }
    });
  }, [client_id, dispatch, formateParams, handleSubmit, scope]);

  return (
    <Wrapper>
      <CustomWrapper>
        <CustomTitle>{_t('pkGhP4z3CsKczkJejUJ1RU')}</CustomTitle>
        <CustomSubTitle>{_tHTML('3568xM5Xxp8mrcGSvfHMpQ')}</CustomSubTitle>
        <UserFlag userInfo={userInfo} isSub={checkIsSub(userInfo)} />
        <Checkbox className="oauth_authorize_agree" checked={agree} onChange={onChangeAgree}>
          <CheckBoxText>{_t('4DKofv2eZrUxFLoPrLXwoq')}</CheckBoxText>
        </Checkbox>
        <SubmitBtn
          className="oauth_authorize_submit"
          fullWidth
          size="large"
          loading={authCheckLoading}
          disabled={!agree}
          onClick={confirm}
        >
          {_t('6pyGA8UUt9Zdtskyg3FF7n')}
        </SubmitBtn>
        <BottomWrapper>
          <BottomSpan onClick={ReLogin}>{_t('wn2KhfMbdo6p3veVsc5Gki')}</BottomSpan>
          <LineSpan />
          <BottomSpan onClick={goSignUp}>{_t('qHy6XJWBFKKigXS3GZ7LXG')}</BottomSpan>
        </BottomWrapper>
      </CustomWrapper>
      <ConfirmModal
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        onOK={handleSubmit}
        loading={authCodeLoading}
        content={content}
      />
      <SiteTypeNotMatchModal
        userSiteType={userSiteType}
        visible={!!userSiteType}
        onOK={() => {
          setUserSiteType('');
        }}
      />
    </Wrapper>
  );
};

export default Authorize;
