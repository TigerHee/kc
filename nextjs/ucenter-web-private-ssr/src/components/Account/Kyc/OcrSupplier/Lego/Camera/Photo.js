/**
 * Owner: Lena@kupotech.com
 */
import { Alert, styled } from '@kux/mui';
import { map } from 'lodash-es';
import { _t } from 'src/tools/i18n';
import Btn from '../Button';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const TopWrapper = styled.div`
  flex: 1;
`;
const Title = styled.h2`
  font-weight: 700;
  font-size: 24px;
  line-height: 130%;
  margin-bottom: 24px;
  color: ${(props) => props.theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;
const PhototImg = styled.div`
  display: flex;
  justify-content: center;
  background: ${(props) => props.theme.colors.cover4};
  margin-bottom: 24px;
  & > img {
    width: auto;
    height: 240px;
    object-fit: cover;
    ${(props) => props.theme.breakpoints.down('sm')} {
      height: 142px;
    }
  }
`;
const TipsItem = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  margin-bottom: 8px;
  margin-left: 18px;
  position: relative;
  color: ${(props) => props.theme.colors.text60};
  &::before {
    position: absolute;
    top: 6px;
    left: -18px;
    display: inline-block;
    width: 6px;
    height: 6px;
    background: #d9d9d9;
    border-radius: 50%;
    content: '';
  }
`;
const AlertCustom = styled(Alert)`
  margin-bottom: 24px;
`;

const Photo = ({
  contentWidth,
  photo,
  handleContinue,
  photoType,
  isH5,
  loading,
  error,
  retry,
  ...otherProps
}) => {
  const list = [
    _t('5uAkxDbquCwN5hAhPaAyCf'),
    _t('gavXFvuu5BXfFPJre3rC9g'),
    _t('mMN4CSU3eB9WL43NnSf7ww'),
  ];

  return (
    <Wrapper>
      <TopWrapper>
        <Title>
          {photoType === 'front' ? _t('hzBpgJnyWSy6GAJ57tfcF3') : _t('mn9Yk3WMoJPtbsQGYoYJYp')}
        </Title>
        <PhototImg contentWidth={contentWidth}>
          <img src={photo} alt="img" />
        </PhototImg>
        {error ? <AlertCustom showIcon type="error" title={error} /> : null}

        {map(list, (item) => {
          return <TipsItem key={item}>{item}</TipsItem>;
        })}
      </TopWrapper>
      <Btn
        {...otherProps}
        disabled={error}
        btnText={_t('1uQj2nEFstsPBLTJqNQRV9')}
        onClick={handleContinue}
        loading={loading}
        onCancel={retry}
        cancelText={_t('kyc_step2_photocheck')}
      />
    </Wrapper>
  );
};

export default Photo;
