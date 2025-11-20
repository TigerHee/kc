/**
 * Owner: sean.shi@kupotech.com
 * 只给清退站使用
 */
import { useTheme } from '@emotion/react';
import { Button, styled } from '@kux/mui';
import storage from '@utils/storage';
import addLangToPath from '@tools/addLangToPath';
import siteConfig from '../common/siteConfig';
import warningSrc from '../../static/warning.svg';
import warningDarkSrc from '../../static/warning.dark.svg';
import useLang from '../hooks/useLang';

const ERROR_SRC = {
  light: warningSrc,
  dark: warningDarkSrc,
};

const ErrorContainer = styled.div`
  padding-top: 40px;

  text-align: center;
  line-height: 0;
  img {
    margin-bottom: 8px;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 0;
  }
`;

const ErrorTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
`;

const ErrorContent = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text60};
  margin-bottom: 24px;
`;

const ButtonWrap = styled.div`
  display: flex;
  flex-flow: column;
  align-item: center;

  .KuxButton-containedSizeBasic {
    margin-bottom: 12px;
  }
`;

export default ({ onCancel }) => {
  const { currentTheme } = useTheme();
  const { _t } = useLang();

  const gotoCustomerService = () => {
    // 跳转到客服链接
    window.open(
      // 申领站没有部署客服系统，仍然用主站域名
      addLangToPath(
        `${siteConfig?.KC_SITE_HOST}/support/requests?ticket_form_id=3`,
        storage.getItem('kucoinv2_lang'),
      ),
      '_blank',
    );
  };

  return (
    <>
      <ErrorContainer>
        <img src={ERROR_SRC[currentTheme] || ERROR_SRC.light} alt="icon" />
        <ErrorTitle>{_t('353cf88720354000a604')}</ErrorTitle>
        <ErrorContent>{_t('2eff54f6d6ef4000af03')}</ErrorContent>
      </ErrorContainer>
      <ButtonWrap>
        <Button data-testid="error-dialog-confirm" fullWidth onClick={gotoCustomerService}>
          {_t('0f6b1e7dedc54000a647')}
        </Button>
        <Button variant="outlined" data-testid="error-dialog-cancel" fullWidth onClick={onCancel}>
          {_t('1ffb610866f64000ae3d')}
        </Button>
      </ButtonWrap>
    </>
  );
};
