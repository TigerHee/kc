/**
 * Owner: tiger@kupotech.com
 * 补充信息相关
 */
import JsBridge from '@knb/native-bridge';
import { ICArrowRight2Outlined, ICWarningOutlined } from '@kux/icons';
import { useSnackbar } from '@kux/mui';
import { useSelector } from 'react-redux';
import { addLangToPath, _t } from 'src/tools/i18n';
import getSiteName from 'src/utils/getSiteName';
import { Container, ListBox, ListItem } from '../CusTable';
import {
  CommonTableText,
  Section,
  SectionDesc,
  SectionTitle,
  SectionWrapper,
  StyledATag,
} from '../StyleComponents';

export default ({ replenishInfo }) => {
  const { kycBlockingInfo, userBindInfo } = replenishInfo || {};
  const { message } = useSnackbar();
  const isApp = JsBridge.isApp();
  const userTransferInfo = useSelector((state) => state.userTransfer?.userTransferInfo);

  const targetSiteName = getSiteName(userTransferInfo?.targetSiteType);
  // 是否需要补充KYC
  const isShowKYC = kycBlockingInfo?.needCompletionKycInfo;
  const isKYB = kycBlockingInfo?.kycType === 'kyb';
  // 是否需要绑定
  const isShowBind = userBindInfo?.needBindEmail || userBindInfo?.needBindPhoneNo;

  // 补充 KYC
  const onHandleKYC = (e) => {
    e.preventDefault();
    if (isApp) {
      if (isKYB) {
        message.info(_t('uCQNHSVrZKcrqS71dULWqJ'));
        return;
      }
      JsBridge.open({
        type: 'jump',
        params: {
          // url: kycBlockingInfo?.appUrl,
          url: `/flutter?route=${encodeURIComponent(
            `/kyc/redirect?isMigrate=true&targetSiteType=${userTransferInfo?.targetSiteType}`,
          )}`,
        },
      });
      return;
    }

    // window.open(addLangToPath(kycBlockingInfo?.webUrl));
    window.open(
      addLangToPath(
        kycBlockingInfo?.kycType === 'kyb' ? '/account/kyb/migrate' : '/account/kyc/migrate',
      ),
    );
  };

  // 跳绑定
  const onHandleBind = (e) => {
    e.preventDefault();
    if (isApp) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: `/user/safe/check?type=${userBindInfo?.needBindEmail ? 'BIND_EMAIL' : 'BIND_PHONE'}`,
        },
      });
      return;
    }

    window.open(
      addLangToPath(
        userBindInfo?.needBindEmail ? '/account/security/email' : '/account/security/phone',
      ),
    );
  };

  return isShowKYC || isShowBind ? (
    <Section>
      <SectionTitle>
        <ICWarningOutlined />
        <span>{_t('98e504d397444000a431')}</span>
      </SectionTitle>
      <SectionDesc>{_t('60b1ccc17e574000a849', { targetSiteName })}</SectionDesc>
      <SectionWrapper>
        <Container>
          <ListBox>
            {isShowKYC && (
              <ListItem>
                <CommonTableText>
                  {isKYB ? _t('baf8eb8ec5794800ad5b') : _t('a4309b989d0e4000a18c')}
                </CommonTableText>
                <StyledATag onClick={onHandleKYC} target="_blank">
                  <span style={{ width: 'max-content' }}>{_t('8804669415ba4800aa9b')}</span>
                  <ICArrowRight2Outlined size={16} />
                </StyledATag>
              </ListItem>
            )}
            {isShowBind && (
              <ListItem>
                <CommonTableText>
                  {userBindInfo?.needBindEmail
                    ? _t('18dd57304e5b4000a9ce')
                    : _t('cceebda51af24000a3c5')}
                </CommonTableText>
                <StyledATag onClick={onHandleBind} target="_blank">
                  <span style={{ width: 'max-content' }}>{_t('2077a795878f4000a98a')}</span>
                  <ICArrowRight2Outlined size={16} />
                </StyledATag>
              </ListItem>
            )}
          </ListBox>
        </Container>
      </SectionWrapper>
    </Section>
  ) : null;
};
