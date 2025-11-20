import { Dialog, styled } from '@kux/mui';
import { ICArrowRight2Outlined } from '@kux/icons';
import { useTranslation } from '@tools/i18n';
import g2faIcon from './img/g2fa.svg';
import smsIcon from './img/sms.svg';
import emailIcon from './img/email.svg';

const CustomDialog = styled(Dialog)`
  & .KuxModalFooter-root {
    border-top: 1px solid ${(props) => props.theme.colors.divider8};
  }
`;
const Content = styled.section`
  padding-bottom: 48px;
`;
const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid ${(props) => props.theme.colors.divider8};
`;
const TypeInfoBox = styled.div`
  display: flex;
  align-items: center;
`;
const TypeImg = styled.img`
  width: 48px;
  height: 48px;
  margin-right: 16px;
`;
const TypeName = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
`;
const ArrowIcon = styled(ICArrowRight2Outlined)`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text};
`;

const config = {
  google_2fa: {
    name: (_t) => _t('g2fa.code'),
    icon: g2faIcon,
  },
  my_sms: {
    name: (_t) => _t('sQWHYNwfMXUanwNvN72djq'),
    icon: smsIcon,
  },
  my_email: {
    name: (_t) => _t('17YNCBHndz3qnRkgirKhm7'),
    icon: emailIcon,
  },
};

export default ({ open, onCancel, otherValidations, onOk }) => {
  const { t } = useTranslation('entrance');

  const handleOk = (v) => {
    onOk(v);
    onCancel();
  };

  return (
    <CustomDialog
      title={t('pAqyaWwQUk1rafMSbFBKZk')}
      size="medium"
      cancelText={null}
      footer={null}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Content>
        {otherValidations.map((item) => {
          const key = item[0];
          const info = config[key];

          return (
            <Item key={key} onClick={() => handleOk(key)}>
              <TypeInfoBox>
                <TypeImg src={info.icon} alt="" />
                <TypeName>{info.name(t)}</TypeName>
              </TypeInfoBox>

              <ArrowIcon />
            </Item>
          );
        })}
      </Content>
    </CustomDialog>
  );
};
