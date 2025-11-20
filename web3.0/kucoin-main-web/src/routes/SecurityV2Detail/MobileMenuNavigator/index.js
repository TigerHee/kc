/**
 * Owner: larvide.peng@kupotech.com
 */
import { memo, useMemo, useState } from 'react';
import { scroller } from 'react-scroll';
import { map } from 'lodash';
import { ICEduceOutlined } from '@kux/icons';
import { Select, styled, useTheme, Button, useResponsive } from '@kux/mui';
import { _t } from 'tools/i18n';
import DrawerTree from 'components/SecurityMenu/DrawerTree';

const Container = styled.div`
  position: sticky;
  top: 64px;
  display: flex;
  padding: 16px 0px 0px 0px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background-color: ${({ theme }) => theme.colors.overlay};
`;
const SelectBox = styled(Select)`
  border-radius: 8px;
`;
const MobileMenuNavigator = ({
  activeAnchorKey,
  anchorList,
  onClickItem,
  clearSearchContent,
  onChangeArticleAnchor,
  onSerch,
}) => {
  const { sm } = useResponsive();
  const theme = useTheme();
  const [drawerTreeShow, setDrawerTreeShow] = useState(false);

  const Options = useMemo(
    () =>
      map(
        anchorList.filter((item) => !!item.title),
        (item) => ({
          label: _t(item.title),
          value: item.id,
        }),
      ),
    [anchorList],
  );
  const onCloseHandle = () => {
    setDrawerTreeShow(false);
  };

  const onSelectHandle = (e) => {
    clearSearchContent();
    onClickItem(e);
    scroller.scrollTo(e, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset: -120, // 可选，如果需要偏移
    });
  };

  return (
    <>
      <Container data-inspector="security_mobile_menu">
        <SelectBox
          emptyContent
          value={activeAnchorKey}
          options={Options}
          size={!sm ? 'small' : 'medium'}
          onChange={onSelectHandle}
        />
        <Button
          size={!sm ? 'small' : 'basic'}
          endIcon={<ICEduceOutlined />}
          onClick={() => setDrawerTreeShow(true)}
          style={theme.currentTheme === 'light' ? {} : { color: '#fff' }}
        >
          {_t('f3b1d516d30b4000abd0')}
        </Button>
      </Container>
      <DrawerTree
        show={drawerTreeShow}
        onClose={onCloseHandle}
        onChangeArticleAnchor={onChangeArticleAnchor}
        onSerch={onSerch}
      />
    </>
  );
};

export default memo(MobileMenuNavigator);
