/*
 * owner: borden@kupotech.com
 * desc: 邀请
 */
import { bridge } from '@kc/telegram-biz-sdk';
import { useResponsive, useSnackbar } from '@kux/mui';
import { useSelector } from 'hooks/useSelector';
import { pickBy } from 'lodash-es';
import { useMemo } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { INVITE_ORIGIN_APPEND_PARAM, SENSORS } from 'routes/SlothubPage/constant';
import useMainHost from 'routes/SlothubPage/hooks/useMainHost';
import { updateUrlWithParams } from 'src/utils/formatUrlWithLang';
import inviteIcon from 'static/slothub/invite.svg';
import { _t, _tHTML } from 'tools/i18n';
import Help from '../../components/Help';
import withAuth from '../../hocs/withAuth';
import mockData from './mockData';
import { Invite, InviteTitle, StyledButton } from './style';

const AuthButton = withAuth((props) => <StyledButton {...props} />);
const XKC_INITIATE = _DEV_
  ? 'https://t.me/xkucion_test_bot/kucoinminiapp'
  : 'https://t.me/xkucoinbot/kucoinminiapp';

const InviteTask = ({ guidePoints, ...otherProps }) => {
  const { sm } = useResponsive();
  const mainHost = useMainHost();
  const { message } = useSnackbar();
  const basicTasksInfo = useSelector((state) =>
    guidePoints ? mockData : state.slothub.basicTasksInfo,
  );
  const referralCode = useSelector((state) => state.user.referralCode);

  const inviteLink = useMemo(() => {
    if (bridge.isTMA()) {
      const route = encodeURIComponent(`/sign-up?rcode=${referralCode}&utm_source=gemslot`);
      const startapp = btoa(`route=${route}`);
      return `${XKC_INITIATE}?startapp=${startapp}`;
    }
    return updateUrlWithParams(
      `${mainHost}/ucenter/signup?${INVITE_ORIGIN_APPEND_PARAM}`,
      pickBy(
        {
          rcode: basicTasksInfo.invitationCode,
        },
        (value) => !!value,
      ),
    );
  }, [mainHost, basicTasksInfo.invitationCode, referralCode]);

  return (
    <Invite {...otherProps}>
      <InviteTitle>
        <img
          src={inviteIcon}
          alt="invite icon"
          width={sm ? 24 : 16}
          height={sm ? 24 : 16}
          className={sm ? 'mr-6' : 'mr-4'}
          style={{ transform: `translateY(${sm ? 5 : 4}px)` }}
        />
        {_tHTML('dfb460a7492d4000a087')}
        <span>
          {Boolean(basicTasksInfo?.invitationEffectiveTimes) && (
            <Help
              dialogTitle={_t('c2b8d38798994000a79e')}
              title={_t('607f067766c34000aa11', { a: basicTasksInfo.invitationEffectiveTimes })}
              containerProps={{
                size: sm ? 16 : 12,
                className: sm ? 'ml-6' : 'ml-4',
                style: { transform: `translateY(${sm ? 1 : 2}px)` },
              }}
            />
          )}
        </span>
      </InviteTitle>
      <CopyToClipboard
        data-testid="invite-copy"
        onCopy={() => message.success(_t('spea.share.toast'))}
        text={inviteLink}
      >
        <AuthButton
          variant="outlined"
          size={sm ? 'small' : 'mini'}
          className="ml-16"
          onClick={SENSORS.basicInvite}
        >
          {_t('8f95a3e947624000a677')}
          {guidePoints?.invite}
        </AuthButton>
      </CopyToClipboard>
    </Invite>
  );
};

export default InviteTask;
