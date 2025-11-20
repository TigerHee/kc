/**
 * Owner: corki.bai@kupotech.com
 * @description: SwitchMultiTypeModal component,目前仅支持三种验证方式的切换，Email，SMS，Google 2FA，不包含交易密码的场景
 */

import { ICArrowRightOutlined, ICPlusOutlined } from '@kux/icons';
import { Dialog, MDialog, styled, ThemeProvider, useResponsive } from '@kux/mui';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from '@tools/i18n';
import { kcsensorsClick } from '../../common/tools';
import emailIconDark from './img/email-dark.svg';
import emailIcon from './img/email.svg';
import g2faIconDark from './img/g2fa-dark.svg';
import g2faIcon from './img/g2fa.svg';
import smsIconDark from './img/sms-dark.svg';
import smsIcon from './img/sms.svg';

const CustomDialog = styled(Dialog)`
  & .KuxModalHeader-root {
    min-height: 90px;
    height: auto !important;
    padding: 32px 32px 24px;
  }
  & .KuxModalFooter-root {
    border-top: 1px solid ${(props) => props.theme.colors.divider8};
  }
`;
const Content = styled.section`
  padding-bottom: 48px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 24px 16px;
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 16px;
  height: 80px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid ${(props) => props.theme.colors.cover12};
  ${(props) => props.theme.breakpoints.down('sm')} {
    height: 72px;
    width: 100%;
  }
`;

const PlusIcon = styled(ICPlusOutlined)`
  margin: 0 0 0 16px;
  height: 24px;
  width: 24px;
  color: ${(props) => props.theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 0 0 0 12px;
    width: 18px;
    height: 18px;
  }
`;

const TypeName = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  margin-left: 8px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-left: 0px;
  }
`;

const ValidateItemWithIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: auto;
`;

const ValidateItem = styled.div`
  height: 48px;
  width: auto;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
`;

const TypeIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.cover2};
  img {
    width: 32px;
    height: 32px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 32px;
    height: 32px;
    img {
      width: 32px;
      height: 32px;
    }
  }
`;

const IconWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const ArrowIcon = styled(ICArrowRightOutlined)`
  justify-self: flex-end;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.cover12};
`;

const config = {
  google_2fa: {
    name: (_t) => _t('mBDd5m2KVc4w4zJVn66tU2'),
    shortName: (_t) => _t('mBDd5m2KVc4w4zJVn66tU2'),
    icon: g2faIcon,
    darkIcon: g2faIconDark,
  },
  my_sms: {
    name: (_t) => _t('38b2a7b980124000a04a'),
    shortName: (_t) => _t('38b2a7b980124000a04a'),
    icon: smsIcon,
    darkIcon: smsIconDark,
  },
  my_email: {
    name: (_t) => _t('5e072c122d574000a8ba'),
    shortName: (_t) => _t('5e072c122d574000a8ba'),
    icon: emailIcon,
    darkIcon: emailIconDark,
  },
};

export const SwitchMultiTypeModal = ({
  open,
  withDrawer,
  tabKey,
  onCancel,
  validations = [],
  currentType = 0,
  onOk,
}) => {
  const { t } = useTranslation('entrance');
  const responsive = useResponsive();
  const isH5 = !responsive.sm;

  const sensorsRef = useRef(null);

  useEffect(() => {
    if (sensorsRef.current) {
      kcsensorsClick(['switch_login_verify', '1'], {
        type: tabKey,
        source: validations?.join('-'),
        mode: 'v2',
      });
    }
  }, [tabKey, validations]);

  const handleOk = (nth) => {
    sensorsRef.current = 1;
    kcsensorsClick([withDrawer ? 'sideswitch' : 'switch', '1']);
    onOk(nth);
    onCancel();
  };

  const renderTypeList = (typeList, key) => {
    if (key === currentType) {
      return null;
    }
    return (
      <Item
        key={key}
        style={{ marginBottom: key + 1 !== validations.length ? (isH5 ? '16px' : '24px') : '0px' }}
        onClick={() => handleOk(key)}
      >
        {typeList.map((type, index) => {
          const info = config[type];
          return (
            <ValidateItemWithIcon
              key={type}
              style={{
                marginRight: index + 1 !== typeList.length ? '16px' : '0px',
              }}
            >
              <ValidateItem>
                <TypeIcon>{info?.icon && <img src={info.icon} alt="type-icon" />}</TypeIcon>
                <TypeName>{isH5 ? info?.shortName(t) : info?.name(t)}</TypeName>
              </ValidateItem>
              {index + 1 !== typeList.length && <PlusIcon />}
            </ValidateItemWithIcon>
          );
        })}

        {isH5 && (
          <IconWrapper>
            <ArrowIcon />
          </IconWrapper>
        )}
      </Item>
      // {key + 1 !== validations?.length && <Box style={{ height: isH5 ? '16px' : '24px' }} />}
    );
  };

  if (isH5) {
    return (
      <MDialog
        back={false}
        title={t('pAqyaWwQUk1rafMSbFBKZk')}
        show={open}
        onClose={onCancel}
        onOk={onCancel}
        onCancel={onCancel}
        maskClosable
        centeredFooterButt
        footer={null}
        height="auto"
      >
        <Content>
          {validations?.map((item, index) => {
            return renderTypeList(item, index);
          })}
        </Content>
      </MDialog>
    );
  }

  if (validations.length === 0) {
    return null;
  }

  return (
    <CustomDialog
      title={t('pAqyaWwQUk1rafMSbFBKZk')}
      size="medium"
      cancelText={null}
      footer={null}
      open={open}
      onCancel={onCancel}
      style={{ maxWidth: '520px' }}
      onOk={handleOk}
    >
      <Content>
        {validations?.map((item, index) => {
          return renderTypeList(item, index);
        })}
      </Content>
    </CustomDialog>
  );
};

export default (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <SwitchMultiTypeModal {...props} />
    </ThemeProvider>
  );
};
