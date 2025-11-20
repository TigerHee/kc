import { styled, Button, useTheme } from '@kux/mui';
import useLang from '@packages/kyc/src/hookTool/useLang';
import lightIcon from './img/light-icon.svg';
import darkIcon from './img/dark-icon.svg';

const IMG_CONFIG = {
  light: lightIcon,
  dark: darkIcon,
};

const Wrapper = styled.div`
  padding-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .icon {
    width: 136px;
    height: 112px;
  }
  .desc {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 130%;
    margin-top: 8px;
    margin-bottom: 40px;
    color: ${({ theme }) => theme.colors.text40};
  }
  .KuxButton-root {
    min-width: 200px;
  }
`;

export default ({ onRetry }) => {
  const { currentTheme } = useTheme();
  const { _t } = useLang();

  return (
    <Wrapper>
      <img className="icon" src={IMG_CONFIG?.[currentTheme]} alt="errImg" />
      <div className="desc">{_t('a4dcc8670f604000a3e2')}</div>
      <Button onClick={onRetry}>{_t('e7a6a8b69b204000ac07')}</Button>
    </Wrapper>
  );
};
