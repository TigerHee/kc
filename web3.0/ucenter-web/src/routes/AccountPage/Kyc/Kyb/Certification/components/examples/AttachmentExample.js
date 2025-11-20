/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICCloseOutlined, ICHookOutlined } from '@kux/icons';
import { styled } from '@kux/mui';
import { _t } from 'src/tools/i18n';
import blurDocumentsIcon from 'static/account/kyc/kyb/blur_documents_icon.svg';
import documentsIcon from 'static/account/kyc/kyb/documents_icon.svg';
import relectiveDocumentsIcon from 'static/account/kyc/kyb/relective_documents_icon.svg';

const ExampleContainer = styled.div`
  display: flex;
  padding: 16px 24px;
  flex-direction: column;
  gap: 16px;
  border-radius: 8px;
  background: rgba(248, 178, 0, 0.04);
  height: fit-content;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 8px;
    padding: 16px 12px;
  }
`;
const ExampleTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  font-weight: 500;
  line-height: 130%;
`;
const ExampleImages = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: repeat(2, 174px);
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    grid-gap: 12px;
    grid-template-columns: repeat(2, 134px);
  }
`;
const ExampleImage = styled.div`
  width: 174px;
  border: 1px solid ${({ theme }) => theme.colors.complementary20};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.complementary8};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 9px 0 7px;
  gap: 8px;
  overflow: hidden;
  img {
    width: 80px;
  }
  span {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 400;
    font-size: 12px;
    line-height: 130%;
  }
  .ICHook_svg__icon {
    color: ${({ theme }) => theme.colors.primary};
  }
  .ICClose_svg__icon {
    color: ${({ theme }) => theme.colors.secondary};
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: initial;
  }
`;

const AttachmentExample = () => {
  return (
    <ExampleContainer>
      <ExampleTitle>{_t('b1bf29daedda4000a2f0')}</ExampleTitle>
      <ExampleImages>
        <ExampleImage>
          <img src={documentsIcon} alt="document" />
          <span>
            <ICHookOutlined size={16} />
            {_t('account.kyc.kyc2.imgGuide1')}
          </span>
        </ExampleImage>
        <ExampleImage>
          <img src={documentsIcon} style={{ transform: 'translateX(77px)' }} alt="document" />
          <span>
            <ICCloseOutlined size={16} />
            {_t('account.kyc.kyc2.imgGuide2')}
          </span>
        </ExampleImage>
        <ExampleImage>
          <img src={blurDocumentsIcon} alt="document" />
          <span>
            <ICCloseOutlined size={16} />
            {_t('account.kyc.kyc2.imgGuide3')}
          </span>
        </ExampleImage>
        <ExampleImage>
          <img src={relectiveDocumentsIcon} alt="document" />
          <span>
            <ICCloseOutlined size={16} />
            {_t('account.kyc.kyc2.imgGuide4')}
          </span>
        </ExampleImage>
      </ExampleImages>
    </ExampleContainer>
  );
};

export default AttachmentExample;
