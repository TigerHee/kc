/**
 * Owner: willen@kupotech.com
 */
import { Dialog, styled } from '@kux/mui';
import { useSelector } from 'react-redux';
import { _t, _tHTML } from 'tools/i18n';

// --- 样式 start ---

const StyledDialog = styled(Dialog)`
  border-radius: 20px;

  .KuxDialog-body {
    max-width: 520px;
  }
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0px;
`;

const Text = styled.div`
  color: ${(props) => props.theme.colors.text60};
`;
// --- 样式 end ---

export default ({ ...props }) => {
  const { user } = useSelector((state) => state.user);
  return (
    <StyledDialog
      cancelText={null}
      showCloseX={true}
      title={_t('5Xmd9sxGFHek2H3xSGzfkp')}
      okText={_t('margin.mylend.title.close')}
      centeredFooterButton={true}
      okButtonProps={{ color: 'text' }}
      {...props}
    >
      <Content>
        <Text>{_t('tdYmBiSoE7mAVgjrty9ovX')}</Text>
        <Text>
          1.{_tHTML('ojH8XuwXEmki8gjBmxs6da', { a: user?.email || props?.inputEmail || '' })}
        </Text>
        <Text>2.{_t('ny2HrGRoLgDtaa1aeWD486')}</Text>
        <Text>3.{_t('wQwtUp6oF7TyMaGqmxx3Ck')}</Text>
      </Content>
    </StyledDialog>
  );
};
