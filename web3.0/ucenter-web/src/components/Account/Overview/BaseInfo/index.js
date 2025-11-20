/**
 * Owner: willen@kupote.com
 */
import { useMultiSiteConfig } from '@kucoin-gbiz-next/hooks';
import {
  ICArrowRightOutlined,
  ICCopyOutlined,
  ICEdit2Outlined,
  ICEyeCloseOutlined,
  ICEyeOpenOutlined,
  ICInfoOutlined,
  ICSecurityOutlined,
} from '@kux/icons';
import { Avatar, Divider, styled, useResponsive, useSnackbar, useTheme } from '@kux/mui';
import ModifyNicknameModal from 'components/Account/Overview/BaseInfo/ModifyNicknameModal';
import ModifyTimeZoneModal from 'components/Account/Overview/BaseInfo/ModifyTimeZoneModal';
import DateTimeFormat from 'components/common/DateTimeFormat';
import { Link } from 'components/Router';
import { debounce } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { searchToJson } from 'src/helper';
import useSecurityGuard from 'src/hooks/security/useSecurityGuard';
import ModalBindHostedToken from 'src/routes/AccountPage/SubAccount/modalBindHostedToken';
import { ReactComponent as InfoIcon } from 'static/account/icon_info.svg';
import { addLangToPath, _t } from 'tools/i18n';
import { OES_BOUND_TYPE } from 'utils/constants';
import { trackClick } from 'utils/ga';
import ResidenceDialog from '../../Kyc/ResidenceDialog';
import ExternalAccount from './ExternalAccount';
import SecurityTooltips from './SecurityTooltips';
import {
  BaseInfoDivider,
  BaseInfoTopWrapper,
  BaseInfoWrapper,
  BottomItem,
  ItemDesc,
  ItemTitle,
  NoLinkItemTitle,
} from './styled';

const getDisplayName = (user) => {
  const { nickname = '', email = '', phone = '', subAccount = '' } = user || {};
  return nickname || subAccount || email || phone || '--';
};
const getUserFlag = (user) => {
  const { nickname = '', email = '', phone = '', subAccount = '', isSub } = user || {};
  let userFlag = '';
  if (nickname) {
    const nicknameStr = `${nickname}`;
    userFlag += nicknameStr[0];
    if (
      nicknameStr[1] &&
      nicknameStr[0].charCodeAt() <= 255 &&
      nicknameStr[1].charCodeAt() <= 255
    ) {
      userFlag += nicknameStr[1];
    }
  } else if (isSub) {
    userFlag = subAccount?.substring(0, 2) || '';
  } else if (email) {
    userFlag = email.substring(0, 2);
  } else if (phone) {
    userFlag = phone.substring(phone.length - 2);
  }
  return userFlag.toUpperCase() ?? '--';
};

const AvatarBox = styled.div`
  margin-right: 16px;

  & .KuxAvatar-root {
    background-color: #d9d9d9;
    border: none;
  }
`;

const ExtendAvatar = styled.span`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border-radius: 50%;
  position: relative;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  /* color: ${({ theme }) => theme.colors.textEmphasis}; */
  color: #fff;
  font-weight: 600;
  font-size: 18px;
  line-height: 100%;
  flex-shrink: 0;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`;

const WelcomeText = styled.h1`
  font-weight: 600;
  font-size: 24px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    font-size: 20px;
  }
`;

const EditIconBox = styled.div`
  min-width: 40px;
  white-space: nowrap;
`;
const EditIcon = styled(ICEdit2Outlined)`
  font-size: 16px;
  margin-top: 12px;
  cursor: pointer;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    margin-top: 4px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 2px;
    margin-right: 12px;
    font-size: 16px;
  }
  [dir='rtl'] & {
    transform: scaleX(-1);
  }
`;
const EditTimeZoneIcon = styled(ICEdit2Outlined)`
  font-size: 16px;
  cursor: pointer;
  margin-left: 5px;
  flex-shrink: 0;
  [dir='rtl'] & {
    transform: scaleX(-1);
  }
`;

const RightWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
const HideButton = styled.span`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.cover4};
  border-radius: 38px;
  font-weight: 600;
  font-size: 12px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  padding: 6px 16px;
  cursor: pointer;
  user-select: none;
`;

const EyeOpen = styled(ICEyeOpenOutlined)`
  font-size: 16px;
  margin-right: 5px;
  cursor: pointer;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-right: 5px !important;
    margin-left: unset !important;
  }
`;

const EyeClose = styled(ICEyeCloseOutlined)`
  font-size: 16px;
  margin-right: 5px;
  cursor: pointer;
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-right: 5px !important;
    margin-left: unset !important;
  }
`;

const BaseInfoBottomWrapper = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    display: block;
    margin-bottom: -16px;
    & > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 0 !important;
      margin-bottom: 10px;
      margin-left: 0 !important;
    }
  }
`;

const LastLoginWrapper = styled(Link)`
  font-weight: 400;
  font-size: 13px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text40};
  display: flex;
  align-items: center;
  cursor: pointer;
  white-space: normal;
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const BorderTitle = styled.span`
  border-bottom: 1px dashed ${({ theme }) => theme.colors.text40};
`;

const ItemTitleArrow = styled(ICArrowRightOutlined)`
  font-size: 12px;
  margin-left: 2px;
  color: ${({ theme }) => theme.colors.icon60};
  [dir='rtl'] & {
    transform: scaleX(-1);
  }
`;

const ColorfulItemDesc = styled(ItemDesc)`
  color: ${({ theme, status }) =>
    status === 'high'
      ? theme.colors.primary
      : status === 'medium'
      ? theme.colors.complementary
      : theme.colors.secondary};
`;

const SecurityIcon = styled(ICSecurityOutlined)`
  margin-right: 5px;
  margin-bottom: -1px;
  flex-shrink: 0;
`;

const CopyIcon = styled(ICCopyOutlined)`
  margin-left: 4px;
  cursor: pointer;
  flex-shrink: 0;
  [dir='rtl'] & {
    transform: scaleX(-1);
  }
`;

const NotHostedIcon = styled(ICInfoOutlined)`
  color: ${(props) => props.theme.colors.complementary};
  margin-right: 2px;
  width: 16px;
  height: 16px;
`;
const NotHostedItem = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: flex-start;
  color: ${({ theme, hasBound }) => (hasBound ? theme.colors.text100 : theme.colors.complementary)};
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: 'PingFang SC';
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
`;

const KycStatusWrapper = styled.div`
  color: ${({ theme, type }) =>
    type === 'SUCCESS'
      ? theme.colors.primary
      : type === 'ERROR'
      ? theme.colors.secondary
      : type === 'WARN'
      ? theme.colors.complementary
      : theme.colors.text};
  display: flex;
  align-items: center;
  gap: 2px;
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
`;

const ExInfoIcon = styled(InfoIcon)`
  margin: 1px;
  color: inherit;
`;

const TopItem = styled.div`
  margin-top: 8px;
`;

const RowBox = styled.div`
  display: flex;
  &.vertical {
    align-items: center;
  }
`;

const ColBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const KcsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme, level }) => {
    switch (level) {
      case 0:
        return theme.colors.text30;
      default:
        return theme.colors.text40;
    }
  }};
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  min-height: calc(14px * 1.3);

  img {
    width: 16px;
    height: 16px;
  }
`;

const levelMap = {
  1: { key: 'low', label: _t('6pR7Q32rXoCQKtb9odfc7S') },
  2: { key: 'medium', label: _t('guCiWzEn9N7umMzBffK3nb') },
  3: { key: 'high', label: _t('oB72b7FFV3QMascVPEsy4M') },
};

const OverviewBaseInfo = () => {
  const user = useSelector((s) => s.user.user);
  const baseInfo = useSelector((s) => s.accountOverview.baseInfo);
  const hideBalanceAmount = useSelector((s) => s.accountOverview.hideBalanceAmount);
  const kycStatusDisplayInfo = useSelector((s) => s.accountOverview.kycStatusDisplayInfo);
  const timeZones = useSelector((s) => s.user.timeZones);
  const [modifyNicknameModal, setModifyNicknameModal] = useState(false);
  const [modifyTimeZoneModal, setModifyTimeZoneModal] = useState(false);
  const [bindHostedTokenModal, setBindHostedTokenModal] = useState(false);
  const dispatch = useDispatch();
  // oesBound 值含义 1:oes已绑定；0：oes待绑定；其它值(包括-1)：无法绑定oes；默认值-1
  const { isSub = false, oesBound, uid } = useSelector((state) => state.user.user) || {};
  // 是 oes 子账号
  const isOESSub = oesBound !== OES_BOUND_TYPE.unableToBound;
  // oes 已经绑定状态
  const isOESSubBound = oesBound === OES_BOUND_TYPE.alreadyBound;
  const { message } = useSnackbar();
  const theme = useTheme();
  const rv = useResponsive();
  const downSmall = !rv?.sm;
  const downLarge = !rv?.lg;
  const securityGuard = useSecurityGuard();

  useEffect(() => {
    dispatch({ type: 'accountOverview/getUserOverviewInfo' });
    dispatch({ type: 'accountOverview/getKycStatusDisplayInfo' });
    dispatch({ type: 'user/pullTimeZones' });
    dispatch({ type: 'accountOverview/pullModifyPermissions' });
    dispatch({ type: 'kyc/pullResidenceConfig' });
  }, []);

  const renderLastLogin = useMemo(
    () => () => {
      return hideBalanceAmount ? (
        '**'
      ) : baseInfo?.ipRecordResponse ? (
        <>
          {baseInfo?.ipRecordResponse?.time ? (
            <DateTimeFormat>{baseInfo.ipRecordResponse.time}</DateTimeFormat>
          ) : (
            ''
          )}{' '}
          {baseInfo?.ipRecordResponse?.area}
          {baseInfo?.ipRecordResponse?.ip ? `(${baseInfo.ipRecordResponse.ip})` : ''}
        </>
      ) : (
        '--'
      );
    },
    [hideBalanceAmount, baseInfo],
  );

  const { multiSiteConfig } = useMultiSiteConfig();
  const { supportKcsRight } = multiSiteConfig?.myConfig?.overviewConfig ?? {};
  const { kcsLevel, kcsLevelDesc, kcsLevelIcon } = useSelector(
    (state) => state['$header_header']?.KCSRights?.data ?? {},
  );

  useEffect(() => {
    supportKcsRight && dispatch({ type: '$header_header/pullKCSRights' });
  }, [supportKcsRight]);

  const [showLevelIcon, setShowLevelIcon] = useState(false);
  useEffect(() => {
    setShowLevelIcon(!!kcsLevelIcon);
  }, [kcsLevelIcon]);

  const canModifyNickname = useSelector(
    (state) => state.accountOverview?.modifyPermissions?.nickname,
  );
  const avatarSize = downSmall ? 32 : downLarge ? 44 : 48;
  const query = searchToJson();
  const [residenceOpen, setResidenceOpen] = useState(query.residenceUpdate === '1');
  const { isDisplay: residenceIsShow, residenceRegionName: residenceName } = useSelector(
    (state) => state.kyc?.residenceConfig ?? {},
  );
  const parentRef = useRef();
  const [dividerHidden, setDividerHidden] = useState(false);

  useEffect(() => {
    if (downLarge) {
      return;
    }
    const calc = debounce(() => {
      calc.cancel();
      if (parentRef.current) {
        const firstChild = parentRef.current.children[0];
        const lastChild = parentRef.current.children[2];
        const firstChildRect = firstChild.getBoundingClientRect();
        const lastChildRect = lastChild.getBoundingClientRect();
        if (firstChildRect.top !== lastChildRect.top) {
          // 第一个节点和最后一个节点的 top 不相等时，代表这里有换行
          // 换行时隐藏分割线
          setDividerHidden(true);
          return;
        }
      }
      setDividerHidden(false);
    }, 16);

    calc();

    const observer = new MutationObserver(calc);

    observer.observe(parentRef.current, {
      childList: true,
      subtree: true,
    });

    window.addEventListener('resize', calc);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', calc);
    };
  }, [downLarge]);

  return (
    <BaseInfoWrapper ref={parentRef}>
      <BaseInfoTopWrapper>
        <AvatarBox>
          {user.avatar ? (
            <Avatar src={user.avatar} size={avatarSize} />
          ) : (
            <ExtendAvatar size={avatarSize}>{getUserFlag(user)}</ExtendAvatar>
          )}
        </AvatarBox>
        <ColBox>
          <RowBox className="vertical">
            <WelcomeText>
              {_t('vRVfUULDpUxebYptwMrPB1', {
                nickname: hideBalanceAmount ? '**' : getDisplayName(user),
              })}
            </WelcomeText>
            <EditIconBox>
              {canModifyNickname ? (
                <EditIcon
                  color={theme.colors.text}
                  onClick={() => {
                    trackClick(['ModifyNickname', '1']);
                    setModifyNicknameModal(true);
                  }}
                />
              ) : null}
              {downSmall ? (
                hideBalanceAmount ? (
                  <EyeClose
                    onClick={() =>
                      dispatch({
                        type: 'accountOverview/update',
                        payload: { hideBalanceAmount: !hideBalanceAmount },
                      })
                    }
                  />
                ) : (
                  <EyeOpen
                    onClick={() =>
                      dispatch({
                        type: 'accountOverview/update',
                        payload: { hideBalanceAmount: !hideBalanceAmount },
                      })
                    }
                  />
                )
              ) : null}
            </EditIconBox>
            {downSmall ? null : (
              <RightWrapper>
                <HideButton
                  onClick={() =>
                    dispatch({
                      type: 'accountOverview/update',
                      payload: { hideBalanceAmount: !hideBalanceAmount },
                    })
                  }
                >
                  {hideBalanceAmount ? <EyeClose /> : <EyeOpen />}
                  {hideBalanceAmount ? _t('4gEGrFyfNapXCTGpm7RRvK') : _t('5NR6prgWmk64UUaA3rgNEu')}
                </HideButton>
              </RightWrapper>
            )}
          </RowBox>
          {!downLarge ? (
            <TopItem>
              <LastLoginWrapper
                to="/account/security?showLoginRecord=1"
                onClick={() => trackClick(['LastLogin', '1'])}
              >
                {_t('cKzNUKKmqE3xkyx6Hofv2E')}:&nbsp;
                {renderLastLogin()}
                <ItemTitleArrow />
              </LastLoginWrapper>
            </TopItem>
          ) : null}
        </ColBox>
      </BaseInfoTopWrapper>
      <BaseInfoDivider>
        <Divider
          type="vertical"
          style={{ opacity: dividerHidden ? 0 : 1, height: dividerHidden ? 0 : 60 }}
        />
      </BaseInfoDivider>
      <BaseInfoBottomWrapper>
        <BottomItem>
          <NoLinkItemTitle>UID</NoLinkItemTitle>
          <ItemDesc>
            <span>{hideBalanceAmount ? '**' : user?.uid || '--'}</span>
            <CopyToClipboard text={user?.uid} onCopy={() => message.success(_t('copy.succeed'))}>
              <CopyIcon />
            </CopyToClipboard>
          </ItemDesc>
        </BottomItem>
        {isSub ? null : (
          <BottomItem style={{ flexShrink: 1 }}>
            <ItemTitle
              to="/account/kyc?app_line=KYC&soure=DEFAULT"
              onClick={() => trackClick(['ViewKYC', '1'])}
            >
              {_t('boY1yJPzUUkc2smTVg7rkj')}
              <ItemTitleArrow />
            </ItemTitle>
            {hideBalanceAmount ? (
              <ItemDesc>**</ItemDesc>
            ) : (
              <KycStatusWrapper type={kycStatusDisplayInfo?.displayType}>
                {kycStatusDisplayInfo?.displayType === 'SUCCESS' ? null : <ExInfoIcon />}
                <span>{kycStatusDisplayInfo?.displayText || '--'}</span>
              </KycStatusWrapper>
            )}
          </BottomItem>
        )}
        {residenceIsShow ? (
          <BottomItem style={{ flexShrink: 1 }}>
            <ItemTitle dontGoWithHref onClick={() => setResidenceOpen(true)}>
              {_t('0728a4046a164800ac87')}
              <ItemTitleArrow />
            </ItemTitle>
            {hideBalanceAmount ? (
              <ItemDesc>**</ItemDesc>
            ) : (
              <ItemDesc>{residenceName || '--'}</ItemDesc>
            )}
            <ResidenceDialog open={residenceOpen} onCancel={() => setResidenceOpen(false)} />
          </BottomItem>
        ) : null}
        {/* 安全等級 */}
        {securityGuard.enable ? (
          <BottomItem>
            <ItemTitle to="/account/security/score" onClick={() => trackClick(['security_score'])}>
              <span>{_t('securityGuard')}</span>
              <ItemTitleArrow />
            </ItemTitle>
            {hideBalanceAmount ? (
              <ItemDesc>**</ItemDesc>
            ) : (
              <ItemDesc style={{ gap: 4 }}>{securityGuard.textNode}</ItemDesc>
            )}
          </BottomItem>
        ) : (
          <BottomItem>
            <SecurityTooltips>
              <ItemTitle
                to="/account/security"
                hasBorder
                onClick={() => trackClick(['ViewSecuritySetting', '1'])}
              >
                <BorderTitle>{_t('r8jkS7WaAEf68VgKHNWKVA')}</BorderTitle>
                <ItemTitleArrow />
              </ItemTitle>
            </SecurityTooltips>
            {hideBalanceAmount ? (
              <ItemDesc>**</ItemDesc>
            ) : (
              <ColorfulItemDesc
                status={levelMap[baseInfo?.userOverviewResponse?.securityLevel]?.key}
                style={{ whiteSpace: 'nowrap' }}
              >
                <SecurityIcon />
                <span>
                  {levelMap[baseInfo?.userOverviewResponse?.securityLevel]?.label || '--'}
                </span>
              </ColorfulItemDesc>
            )}
          </BottomItem>
        )}
        {isOESSub && (
          <BottomItem style={{ flexShrink: 1 }}>
            {isOESSubBound ? (
              <>
                <NoLinkItemTitle>
                  {_t('ea3f5e838b224800a5bd')}
                  <ItemTitleArrow />
                </NoLinkItemTitle>
                <NotHostedItem hasBound>
                  <span className="not-hosted-text">{_t('f195517c2e144000a871')}</span>
                </NotHostedItem>
              </>
            ) : (
              <>
                <ItemTitle dontGoWithHref onClick={() => setBindHostedTokenModal(true)}>
                  {_t('ea3f5e838b224800a5bd')}
                  <ItemTitleArrow />
                </ItemTitle>
                <NotHostedItem>
                  <NotHostedIcon />
                  <span className="not-hosted-text">{_t('2cb8884911314800a64a')}</span>
                </NotHostedItem>
              </>
            )}
          </BottomItem>
        )}
        {supportKcsRight ? (
          <BottomItem>
            <ItemTitle
              to={addLangToPath('/kcs')}
              onClick={() => {
                trackClick(['account', 'KCS_level', '1']);
              }}
            >
              {_t('e05cf245c9f14000a8a5')}
              <ItemTitleArrow />
            </ItemTitle>
            <KcsWrapper level={kcsLevel}>
              {showLevelIcon ? (
                <img
                  src={kcsLevelIcon}
                  alt="kcs_level_icon"
                  onError={() => setShowLevelIcon(false)}
                />
              ) : null}
              {kcsLevelDesc}
            </KcsWrapper>
          </BottomItem>
        ) : null}
        {/* 第三方账号 */}
        <ExternalAccount hideBalanceAmount={hideBalanceAmount} />
        {/* 账户时区 */}
        <BottomItem>
          <NoLinkItemTitle>{_t('nhzvg3cJUrETJa4E4RN5F4')}</NoLinkItemTitle>
          <ItemDesc>
            <span>
              {hideBalanceAmount
                ? '**'
                : timeZones.find((i) => i[0] === user.timeZone)?.[1] || '--'}
            </span>
            <EditTimeZoneIcon
              onClick={() => {
                trackClick(['ModifyTimezone', '1']);
                setModifyTimeZoneModal(true);
              }}
            />
          </ItemDesc>
        </BottomItem>
        {downLarge ? (
          <BottomItem style={{ flexShrink: 1 }}>
            <ItemTitle
              to="/account/security?showLoginRecord=1"
              onClick={() => trackClick(['LastLogin', '1'])}
            >
              {_t('cKzNUKKmqE3xkyx6Hofv2E')}
              <ItemTitleArrow />
            </ItemTitle>
            <ItemDesc>{renderLastLogin()}</ItemDesc>
          </BottomItem>
        ) : null}
      </BaseInfoBottomWrapper>
      <ModifyNicknameModal
        open={modifyNicknameModal}
        onCancel={() => setModifyNicknameModal(false)}
      />
      <ModifyTimeZoneModal
        open={modifyTimeZoneModal}
        onCancel={() => setModifyTimeZoneModal(false)}
      />
      <ModalBindHostedToken
        open={bindHostedTokenModal}
        onCancel={() => setBindHostedTokenModal(false)}
        uid={uid}
      />
    </BaseInfoWrapper>
  );
};
export default OverviewBaseInfo;
