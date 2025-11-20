/**
 * Owner: borden@kupotech.com
 */
import { ClickAwayListener, Spin, styled, useSnackbar } from '@kux/mui';
import { map, replace } from 'lodash';
import { Fragment, memo, useCallback } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import siteConfig from 'utils/siteConfig';
import { windowOpen } from '../config';

// 替换后端返回的url中， 两个$中间的HOST
const replaceHost = (url) => {
  return replace(url, /\$.*\$/g, (key) => {
    const hostKey = replace(key, /\$/g, '');
    if (siteConfig[hostKey]) return siteConfig[hostKey];
    return key;
  });
};

// --- 样式 start ---
const Wrapper = styled.section`
  width: 400px;
  position: absolute;
  right: 0;
  top: calc(100% + 12px);
  border-radius: 4px;
  z-index: 999;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 60px;
  color: ${(props) => props.theme.colors.text};
  background: ${(props) => props.theme.colors.backgroundMajor};
  cursor: default;
`;
const Header = styled.header`
  padding: 24px;
  padding-bottom: 12px;
  font-weight: 500;
  font-size: 14px;
  text-align: left;
  [dir='rtl'] & {
    text-align: right;
  }
`;
const List = styled.section`
  display: flex;
  flex-wrap: wrap;
`;
const Item = styled.div`
  padding: 12px 24px;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
  :hover {
    background: ${(props) => props.theme.colors.cover4};
  }
`;
const DebtItem = styled(Item)`
  width: 100%;
  line-height: 18px;
`;
const PositionItem = styled(Item)`
  display: flex;
  align-items: center;
  width: 50%;
  line-height: 22px;
`;
const Amount = styled.div`
  font-size: 12px;
  line-height: 20px;
  color: ${(props) => props.theme.colors.text60};
`;
// --- 样式 end ---

const PANEL_TYPES = {
  position: {
    type: 'position',
    listKey: 'activeBizList',
    title: 'wPAyEVLeny4GYudCJ1TtjL',
    ItemComp: (props) => <PositionItem {...props} />,
    renderDesc: ({ desc }) => desc,
  },
  debt: {
    type: 'debt',
    listKey: 'debtList',
    title: 'mFgVnjUP2AY4zwiNgxaGfR',
    ItemComp: (props) => <DebtItem {...props} />,
    renderDesc: ({ desc, amount }) => (
      <Fragment>
        {desc}
        <Amount>≈{amount} USD</Amount>
      </Fragment>
    ),
  },
};

export default memo(({ type, onClose }) => {
  const { message } = useSnackbar();
  const { title, listKey, renderDesc, ItemComp } = PANEL_TYPES[type] || PANEL_TYPES.position;
  const { cancellationOverview } = useSelector((state) => state.account_security);

  const { [listKey]: list } = cancellationOverview;

  const handleClickItem = useCallback((e, item) => {
    e.stopPropagation();
    const { parentActive, subActive, url, spms, tips } = item;
    if (!url && tips) {
      message.info(tips);
      if (spms) trackClick(spms);
      return;
    }
    if (!parentActive && subActive) {
      windowOpen('/account/sub');
      return;
    }
    windowOpen(replaceHost(url), spms);
  }, []);

  return (
    <ClickAwayListener onClickAway={onClose}>
      <Wrapper>
        <Header>{_t(title)}</Header>
        <Spin spinning={false}>
          <List>
            {map(list, (item) => {
              return (
                <ItemComp key={item.code} onClick={(e) => handleClickItem(e, item)}>
                  {renderDesc(item)}
                </ItemComp>
              );
            })}
          </List>
        </Spin>
      </Wrapper>
    </ClickAwayListener>
  );
});
