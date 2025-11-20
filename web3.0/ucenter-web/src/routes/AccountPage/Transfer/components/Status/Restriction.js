/**
 * Owner: jacky@kupotech.com
 */

import JsBridge from '@knb/native-bridge';
import { Button, styled } from '@kux/mui';
import { useSelector } from 'src/hooks/useSelector';
import { addLangToPath, _t } from 'src/tools/i18n';
import getSiteName from 'src/utils/getSiteName';
import blockIcon from 'static/account/transfer/block.svg';
import { StatusIcon, SubTitle, Title, Wrapper } from './style';

/**
 * 区域访问限制
 */
export default function RegionRestriction() {
  const userTransferInfo = useSelector((state) => state.userTransfer?.userTransferInfo);
  const targetSiteName = getSiteName(userTransferInfo?.targetSiteType);
  const originSiteName = getSiteName(window._BRAND_SITE_FULL_NAME_);

  return (
    <CustomWrapper>
      <Icon src={blockIcon} alt="region restriction" />
      <CustomTitle>{_t('f69b4c646c264000a6fe')}</CustomTitle>
      <CustomSubTitle>
        {_t('1a9bc1c5da404800a273', { originSiteName, targetSiteName })}
      </CustomSubTitle>
      <CustomButton
        onClick={() => {
          const isApp = JsBridge.isApp();
          if (isApp) {
            JsBridge.open(
              {
                type: 'jump',
                params: { url: `/home` },
              },
              () => {
                JsBridge.open({
                  type: 'func',
                  params: { name: 'exit' },
                });
              },
            );
          } else {
            window.location.href = addLangToPath('/');
          }
        }}
      >
        {_t('d8ed2b5d92a64000a036', { originSiteName })}
      </CustomButton>
    </CustomWrapper>
  );
}

const CustomWrapper = styled(Wrapper)`
  margin-top: 120px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 48px;
  }
`;

const CustomTitle = styled(Title)`
  font-size: 36px;
`;

const CustomSubTitle = styled(SubTitle)`
  margin-bottom: 32px;
  color: ${({ theme }) => theme.colors.text40};
`;

const Icon = styled(StatusIcon)`
  width: 182px;
  height: 182px;
`;

const CustomButton = styled(Button)`
  padding: 24px 28px;
  font-size: 16px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 16px 24px;
    font-size: 14px;
  }
`;
