/**
 * Owner: larvide.peng@kupotech.com
 */
import { ICArrowDownOutlined, ICArrowUpOutlined } from '@kux/icons';
import { Link } from 'react-scroll';
import clsx from 'classnames';
import { styled, useMediaQuery, useTheme, Tooltip } from '@kux/mui';
import { _t } from 'tools/i18n';
import { useRestrictNotice } from 'src/hooks/useRestrictNotice';

const Content = styled.div`
  cursor: pointer;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  > span {
    width: calc(100% - 32px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
const MenuItem = ({ isOpen, isCategoryActive, isArticleActive, item, onClick, onSelect }) => {
  const theme = useTheme();
  const { isShowRestrictNotice, restrictNoticeHeight } = useRestrictNotice();
  const { id, title, type } = item;
  const isSm = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  // 锚点导航列表吸顶距离
  const offset = -((isShowRestrictNotice ? restrictNoticeHeight : 0) + (isSm ? 84 : 100));

  if (type === 'category') {
    return (
      <Tooltip title={_t(title)} trigger="hover" placement="right" maxWidth={280}>
        <Content
          key={id}
          className={clsx(
            `${item.type}-title`,
            isCategoryActive && item.type === 'category' ? 'parent-active' : '',
            'title',
          )}
          onClick={() => onSelect(item)}
        >
          <span>{_t(title)}</span>
          {isOpen ? <ICArrowUpOutlined /> : <ICArrowDownOutlined />}
        </Content>
      </Tooltip>
    );
  }
  if (type === 'article') {
    return (
      <Link
        key={id}
        spy={true}
        spyThrottle={0}
        offset={offset}
        smooth={false}
        to={id}
        onClick={() => onClick(item)}
        onSetActive={() => onClick(item)}
        className={clsx(`article-title`, 'title')}
        style={isArticleActive ? { color: theme.colors.primary } : null}
      >
        <span>{_t(title)}</span>
      </Link>
    );
  }
  return null;
};

export default MenuItem;
