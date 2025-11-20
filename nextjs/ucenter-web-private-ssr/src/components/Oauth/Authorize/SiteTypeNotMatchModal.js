/**
 * Owner: willen@kupotech.com
 */
import { Button, Dialog, styled } from '@kux/mui';
import useThemeImg from 'hooks/useThemeImg';
import { getSiteName } from 'src/constants';
import DialogWarnInfoDark from 'static/account/dialog-warn-info-dark.svg';
import DialogWarnInfo from 'static/account/dialog-warn-info.svg';
import { _t } from 'tools/i18n';

const DialogWrapper = styled.div`
  form {
    div:first-of-type {
      /* 覆盖 SecurityModule组件中min-height: 50vh */
      min-height: auto;
    }
  }
  padding-bottom: 32px;
  padding-top: 8px;
`;

const ConfirWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImgWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
  img {
    max-width: 148px;
    height: auto;
    pointer-events: none;
  }
`;

const Title = styled.div`
  margin-top: 8px;
  color: ${(props) => props.theme.colors.text}
  text-align: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 28px */
`;

const ConfirmTipContent = styled.div`
  font-size: 16px;
  text-align: center;
  color: ${(props) => props.theme.colors.text60};
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 22.4px */
`;

const Operate = styled.section`
  display: flex;
  align-self: stretch;
  justify-content: space-between;
  margin-top: 32px;
  button {
    flex: 1;
  }
`;

export const SiteTypeNotMatchModal = (props) => {
  const { visible, userSiteType, onOK } = props;
  const { getThemeImg } = useThemeImg();
  return (
    <Dialog open={visible} header={null} footer={null} styled={{ maxWidth: '400px' }}>
      <DialogWrapper>
        <ConfirWrapper>
          <ImgWrap>
            <img
              alt="passkey add tip"
              src={getThemeImg({ light: DialogWarnInfo, dark: DialogWarnInfoDark })}
            />
          </ImgWrap>
          <Title>{_t('0dba44df83df4000a372')}</Title>
          <ConfirmTipContent>
            {_t('1be12adbc9274000a288', { userSiteType: getSiteName(userSiteType, _t) })}
          </ConfirmTipContent>
          <Operate>
            <Button onClick={onOK}>{_t('i.know')}</Button>
          </Operate>
        </ConfirWrapper>
      </DialogWrapper>
    </Dialog>
  );
};
