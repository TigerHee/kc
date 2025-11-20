/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { styled, Dialog, useTheme } from '@kux/mui';
import { Trans } from '@tools/i18n';
import { useMultiSiteConfig } from '@hooks/useMultiSiteConfig';
import { getTermId, getTermUrl } from '@tools/term';
import addLangToPath from '@tools/addLangToPath';
// todo: 优化icon
import logo from '../../asset/userRestricted.svg';
import logoDark from '../../asset/userRestrictedDark.svg';
import { composeUrl } from '../../utils';

const ExtendDialog = styled(Dialog)`
  .KuxDialog-body {
    max-height: 66.6vh;
    ${(props) => props.theme.breakpoints.down('sm')} {
      margin: 4px !important;
    }
    .KuxModalHeader-root{
      position: absolute;
    }
    .KuxDialog-content {
      display: flex;
      padding: 0 32px;
      ${(props) => props.theme.breakpoints.down('sm')} {
        padding: 0 24px;
      }
    }
  }
  .KuxModalFooter-root {
    word-break: break-word;
    padding: 0 32px 32px;
    .KuxButton-root{
        margin-right: unset;
        margin-left: unset;
    }
    .KuxButton-root:nth-of-type(2){
        margin-left: 12px;
        [dir='rtl'] & {
          margin-left: unset;
          margin-right: 12px;
        }
      }
    }
    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 0 24px 24px;
      .KuxModalFooter-buttonWrapper {
        display: flex;
        flex-wrap: wrap-reverse;
        gap: 12px;
        & > button {
          flex: auto;
          width: 100%;
        }
        & > button:nth-of-type(2) {
          margin-left: unset !important;
          margin-right: unset !important;
        }
      }
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${({ closable }) => (closable ? '45px' : '32px')} 0 0;
  flex: 1;
  img {
    width: 120px;
    height: 120px;
    margin-bottom: 16px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      width: 100px;
      height: 100px;
      margin-bottom: 12px;
    }
  }
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 24px;
  line-height: 130%;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;

const Content = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text60};
  margin-bottom: 24px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 4px;
    background: transparent;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #cccccc;
    border-radius: 2px;
  }
`;

const Tips = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  text-align: left;
  margin-bottom: 14px;
  color: ${({ theme }) => theme.colors.text60};
  width: 100%;
  [dir='rtl'] & {
    text-align: right;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 12px;
  }
  span {
    color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }
`;

const PrivacyLink = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text60};
  margin-bottom: 24px;
  margin-top: -8px;
  width: 100%;
`;

const LinkText = styled.span`
  text-decoration: ${({ hasLink }) => (hasLink ? 'underline' : 'none')};
  cursor: ${({ hasLink }) => (hasLink ? 'pointer' : 'default')};
`;

const BaseDialog = ({
  visible,
  title,
  content,
  buttonRefuse,
  onCancel,
  buttonAgree,
  onOk,
  showDefaultPolicy,
  privacy,
  privacyUrl,
  currentLang,
  closable,
  icon,
}) => {
  const jumpPage = (url) => {
    const newWindow = window.open(addLangToPath(composeUrl(url), currentLang));
    if (newWindow) newWindow.opener = null;
  };

  const theme = useTheme();
  const { multiSiteConfig } = useMultiSiteConfig();

  let iconSource = icon;
  if (!iconSource) {
    iconSource = theme.currentTheme === 'dark' ? logoDark : logo;
  }

  return (
    <ExtendDialog
      open={visible}
      title=""
      onOk={onOk}
      onCancel={onCancel}
      cancelText={buttonRefuse || null}
      okText={buttonAgree || null}
      style={{ margin: 28 }}
      centeredFooterButton
      {...(closable ? { showCloseX: true } : { showCloseX: false, header: null })}
      rootProps={{ 'data-nosnippet': true }}
    >
      <Wrapper closable={closable}>
        {/* todo: 替换为动效Icon */}
        <img src={iconSource} alt="logo" />
        <Title>{title}</Title>
        <Content>{content}</Content>
        {showDefaultPolicy ? (
          <Tips>
            <Trans i18nKey="wtvAa6fsU5APWF5H3bEqQN" ns="userRestricted">
              _
              <span
                onClick={() =>
                  jumpPage(getTermUrl(getTermId('privacyUserTerm', multiSiteConfig?.termConfig)))
                }
              >
                _
              </span>
              _
              <span
                onClick={() =>
                  jumpPage(getTermUrl(getTermId('agreementTerm', multiSiteConfig?.termConfig)))
                }
              >
                _
              </span>
            </Trans>
          </Tips>
        ) : privacy ? (
          <PrivacyLink>
            <LinkText hasLink={privacyUrl} onClick={() => privacyUrl && jumpPage(privacyUrl)}>
              {privacy}
            </LinkText>
          </PrivacyLink>
        ) : null}
      </Wrapper>
    </ExtendDialog>
  );
};
export default BaseDialog;
