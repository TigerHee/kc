/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICHookOutlined } from '@kux/icons';
import { styled } from '@kux/mui';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { _t, _tHTML } from 'src/tools/i18n';
import characterReferenceIcon from 'static/account/kyc/kyb/character_reference.svg';
import noteReferenceIcon from 'static/account/kyc/kyb/note_reference.svg';

const ExampleContainer = styled.div`
  display: flex;
  width: 404px;
  padding: 16px 24px;
  flex-direction: column;
  border-radius: 8px;
  background: rgba(248, 178, 0, 0.04);
  height: fit-content;
  gap: 16px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    flex-direction: row;
    gap: 24px;
    width: 100%;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
    gap: 24px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 16px;
    padding: 16px 12px;
  }
`;
const ExampleImages = styled.div`
  display: flex;
  gap: 12px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
    gap: 16px;
  }
`;
const ExampleImage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  img {
    width: 174px;
    ${({ theme }) => theme.breakpoints.down('lg')} {
      width: 246px;
    }
  }
`;
const ExampleImageTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  font-weight: 500;
  line-height: 130%;
`;
const ExampleList = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  font-weight: 400;
  line-height: 130%;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
const ExampleItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  .ICHook_svg__icon {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const HandheldAttachmentExample = () => {
  const kycCode = useSelector((state) => state.kyc?.kycCode);
  return (
    <ExampleContainer>
      <ExampleImages>
        <ExampleImage>
          <ExampleImageTitle>{_t('06fb216ee1a54000afc5')}</ExampleImageTitle>
          <img src={characterReferenceIcon} alt="example" />
        </ExampleImage>
        <ExampleImage>
          <ExampleImageTitle>{_t('135f25d61dd94800a20d')}</ExampleImageTitle>
          <img src={noteReferenceIcon} alt="example" />
        </ExampleImage>
      </ExampleImages>
      <ExampleList>
        <ExampleItem>
          <ICHookOutlined size={16} />
          {_t('4828d7668b9e4800a782')}
        </ExampleItem>
        <ExampleItem>
          <ICHookOutlined size={16} />
          {_t('141dfa858f5a4000a87d')}
        </ExampleItem>
        <ExampleItem>
          <ICHookOutlined size={16} />
          {_tHTML('09fa3d6c586e4800a64a', { code: kycCode })}
        </ExampleItem>
        <ExampleItem>
          <ICHookOutlined size={16} />
          {_tHTML('e6a219af78534000a143', { date: moment().format('YYYY-MM-DD') })}
        </ExampleItem>
        <ExampleItem>
          <ICHookOutlined size={16} />
          {_tHTML('8dcac30dda024800a832')}
        </ExampleItem>
      </ExampleList>
    </ExampleContainer>
  );
};

export default HandheldAttachmentExample;
