/**
 * Owner: tiger@kupotech.com
 * pan码提示弹窗
 */
import { Dialog, styled } from '@kux/mui';
import RootContainer from 'packages/kyc/src/common/components/RootContainer';
import useLang from 'packages/kyc/src/hookTool/useLang';
import illustrationIcon from './img/illustration.svg';

const StyledDialog = styled(Dialog)`
  z-index: 2000;
  & .KuxDialog-body {
    margin: 16px;
  }
  .KuxModalFooter-buttonWrapper {
    display: flex;
    flex-direction: column-reverse;
  }
  .KuxButton-text {
    margin-right: 0;
    margin-top: 16px;
    height: fit-content;
  }
`;
const Wrapper = styled.section`
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 140px;
    height: 140px;
    margin-bottom: 16px;
  }
  .title {
    font-size: 24px;
    font-weight: 700;
    line-height: 130%;
    text-align: center;
    margin-bottom: 8px;
    color: var(--color-text);
  }
  .desc {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    text-align: center;
    color: var(--color-text60);
  }
`;

export default (props) => {
  const { _t } = useLang();

  return (
    <RootContainer {...props}>
      <StyledDialog
        okText={_t('00f86832354b4000a5b4')}
        cancelText={_t('712bf6694d014000a50b')}
        okButtonProps={{ fullWidth: true }}
        cancelButtonProps={{ fullWidth: true, variant: 'text' }}
        showCloseX={false}
        header={null}
        {...props}
      >
        <Wrapper>
          <img src={illustrationIcon} alt="illustration" />
          <div className="title">{_t('fd31949c586c4000a30f')}</div>
          <div className="desc">{_t('6bed4c56f5774000ad19')}</div>
        </Wrapper>
      </StyledDialog>
    </RootContainer>
  );
};
