/**
 * Owner: jacky@kupotech.com
 */

import JsBridge from '@knb/native-bridge';
import { Button, styled } from '@kux/mui';
import { addLangToPath, _t } from 'src/tools/i18n';
import blockIcon from 'static/account/transfer/block.svg';
import { StatusIcon, Wrapper } from './LayoutComponent';

/**
 * 区域访问限制
 */
export default function RegionRestriction() {
  return (
    <CustomWrapper>
      <Icon src={blockIcon} alt="region restriction" />
      <Title>{_t('4e34428473d84800a69f')}</Title>
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
        {_t('88e7f39666664000a41f')}
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

export const Title = styled.h1`
  margin-bottom: 48px;
  font-size: 36px;
  font-weight: 700;
  line-height: 140%;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 24px;
    font-size: 20px;
  }
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
