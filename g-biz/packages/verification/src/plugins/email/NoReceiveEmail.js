/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Button, styled } from '@kux/mui';
import { useSelector } from 'react-redux';
import useLang from '../../hooks/useLang';
import CommonModal from '../../components/CommonModal';

// --- 样式 start ---
const Content = styled.div``;

const Text = styled.div`
  color: ${(props) => props.theme.colors.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
`;

const List = styled.div`
  margin-top: 20px;
  margin-bottom: 24px;
`;

const Item = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 15px;
  font-weight: 400;
  line-height: 21px;
  & + & {
    margin-top: 6px;
  }
`;
// --- 样式 end ---

export default ({ open, onCancel }) => {
  const { _t } = useLang();
  const { user } = useSelector((state) => state.user);
  return (
    <CommonModal open={open} title={_t('5Xmd9sxGFHek2H3xSGzfkp')} size="medium" onCancel={onCancel}>
      <Content>
        <Text>{_t('tdYmBiSoE7mAVgjrty9ovX')}</Text>
        <List>
          <Item>{_t('ojH8XuwXEmki8gjBmxs6da', { a: user?.email })}</Item>
          <Item>{_t('ny2HrGRoLgDtaa1aeWD486')}</Item>
          <Item>{_t('wQwtUp6oF7TyMaGqmxx3Ck')}</Item>
        </List>
        <Button fullWidth onClick={onCancel}>
          {_t('5fd04bcb45934000ae1a')}
        </Button>
      </Content>
    </CommonModal>
  );
};
