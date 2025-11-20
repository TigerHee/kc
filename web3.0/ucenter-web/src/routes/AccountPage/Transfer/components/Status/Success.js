/**
 * Owner: jacky@kupotech.com
 */

import JsBridge from '@knb/native-bridge';
import { styled } from '@kux/mui';
import { useEffect, useRef } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { writeDisplayed } from 'src/services/user_transfer';
import { addLangToPath, _t, _tHTML } from 'src/tools/i18n';
import { kcsensorsManualExpose, trackClick } from 'src/utils/ga';
import getSiteName from 'src/utils/getSiteName';
import siteCfg from 'src/utils/siteConfig';
import firIcon from 'static/account/transfer/1th.svg';
import { resetAppHeader } from '../../utils/app';
import { handleATagClick } from '../../utils/element';
import { useMessageErr } from '../../utils/message';
import { getTargetSiteType } from '../../utils/site';
import Benefits from './BenefitsItem';
import { CustomButton, LottieIcon, Title, Wrapper } from './style';

/**
 * 后端判断逻辑: tradeType, 需按二进制位判断逻辑，从右往左的第二位数字=1，即"x1x"，说明用户开通过 【合约】，需要显示合约链接入口。
 * 对tradeType 进行&计算获取. 即 userInfo.tradeType&2===2
 * @param {*} tradeType
 * @returns
 */
const checkIsShowProtocolLink = (tradeType = 0) => {
  return (tradeType & 2) === 2;
};

/**
 * `targetSiteType`: 可能的枚举值如下:
 * global, australia, europe
 *
 * 迁往 australia 站的链接为: https://www.kucoin.com/en-au/support/47497300093921
 * 迁往 europe 站的链接为: https://www.kucoin.com/en-eu/support/47497300094070
 * 迁往 global 站的链接为: https://www.kucoin.com/support/47497300094068
 */
const getContractLink = (targetSiteType) => {
  if (!targetSiteType) {
    return '';
  }
  const target = targetSiteType?.toLowerCase?.();
  const australia = addLangToPath('/support/47497300093921');
  const europe = addLangToPath('/support/47497300094070');
  const global = addLangToPath('/support/47497300094068');
  const map = {
    global,
    australia,
    europe,
  };
  return map[target] || australia;
};

/**
 * 迁移成功
 */
export default function RemoteSuccess() {
  const errMessage = useMessageErr();
  const ref = useRef(null);
  const { KUCOIN_HOST } = siteCfg || {};
  const targetSiteType = useSelector((state) =>
    getTargetSiteType(state.userTransfer?.userTransferInfo, state.userTransfer?.userTransferStatus),
  );
  const userInfo = useSelector((state) => state.user?.user);
  const targetSiteName = getSiteName(targetSiteType);
  const isApp = JsBridge.isApp();

  const handleKycClick = () => {
    const link = addLangToPath(`${KUCOIN_HOST}/account/kyc`);
    trackClick(['buttonSupplyInformation', 'supplyInformation'], {
      user_target_siteType: targetSiteType,
    });
    if (isApp) {
      resetAppHeader();
      window.location.href = link;
    } else {
      window.open(link);
    }
  };

  const handleEnter = (e) => {
    if (isApp) {
      e?.preventDefault();
      resetAppHeader();
      JsBridge.open({
        type: 'jump',
        params: { url: `/home` },
      });
    } else {
      const link = addLangToPath(`/`);
      location.href = link;
    }
  };

  const updateStatus = async () => {
    try {
      const res = await writeDisplayed();
    } catch (error) {
      errMessage(error);
    }
  };

  useEffect(() => {
    updateStatus();

    // App 跳转兼容处理
    const isApp = JsBridge.isApp();

    let elements = [];
    try {
      if (isApp) {
        elements = ref.current?.querySelectorAll('a');
        elements?.forEach?.((elem) => {
          elem?.addEventListener?.('click', handleATagClick);
        });
      }
    } catch (error) {
      console.error('show transfer click error:', error);
    }

    kcsensorsManualExpose(
      ['intoSuccessfulPage', '1'],
      {
        user_target_siteType: targetSiteType,
      },
      'account_transfer_result',
    );

    return () => {
      if (isApp) {
        elements?.forEach?.((elem) => {
          elem?.removeEventListener?.('click', handleATagClick);
        });
      }
    };
  }, []);

  return (
    <Wrapper isApp={isApp}>
      <LottieIcon iconName="success" />
      <Title>{_t('fc30ea36f93b4000a775')}</Title>
      {/* <SubTitle>{_t('187ff9b25b684000ae50', { targetSiteName })}</SubTitle> */}
      <Benefits
        status={1}
        title={
          <>
            <span style={{ width: 14 }}>🎉</span> {_t('6eaf12bd9d9e4800af1a')}
          </>
        }
        items={[
          _t('245fe538e1994800ab4b'),
          _t('d6eb578f5c204000ac1b'),
          _t('8122a85779d94800ac17'),
          _t('417c257e08fa4000af55', { targetSiteName }),
        ]}
        footer={
          <Footer>
            <img src={firIcon} alt="1th" style={{ marginTop: 1 }} />
            {_t('b84a757a81b44800a48a')}
          </Footer>
        }
      />

      {checkIsShowProtocolLink(userInfo?.tradeType) && (
        <ProtocolLink ref={ref}>
          <img src={firIcon} alt="1th" style={{ marginTop: 1 }} />
          {_tHTML('8346d83602c54000a1f5', {
            targetSiteName,
            link: getContractLink(targetSiteType),
          })}
        </ProtocolLink>
      )}
      <Button onClick={handleKycClick}>{_t('d1126a3d684d4800a3dd')}</Button>
      <Link
        href={addLangToPath(`/`)}
        onClick={(e) => {
          handleEnter(e);
          trackClick(['buttonIntoHomepage', 'intoHompage'], {
            user_target_siteType: targetSiteType,
          });
        }}
      >
        {_t('db2f6ea94acf4800a868', { targetSiteName })}
      </Link>
    </Wrapper>
  );
}

const Footer = styled.section`
  display: flex;
  align-items: flex-start;
  gap: 4px;
  border-radius: 8px;
  font-weight: 400;
  font-size: 13px;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text40};
`;

const Link = styled.a`
  font-weight: 700;
  font-size: 14px;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text};
`;

const Button = styled(CustomButton)`
  margin: 40px 0 24px;
  padding: 24px 0;
`;

const ProtocolLink = styled.div`
  margin-top: 40px;
  color: ${({ theme }) => theme.colors.text60};
  font-size: 16px;
  gap: 4px;
  display: flex;
  align-items: center;
  span {
    line-height: 140%;
    a {
      color: ${({ theme }) => theme.colors.text};
      font-weight: 500;
      text-decoration-line: underline;
      text-decoration-style: solid;
      text-decoration-skip-ink: auto;
      text-decoration-thickness: auto;
      text-underline-offset: 1px;
      text-underline-position: from-font;
    }
  }
`;
