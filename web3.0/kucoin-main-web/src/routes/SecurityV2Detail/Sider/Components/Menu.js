/**
 * Owner: larvide.peng@kupotech.com
 */
import { useState, memo, useEffect } from 'react';
import { styled } from '@kux/mui';
import { articles } from 'src/components/SecurityMenu/config';
import MenuItem from './MenuItem';

const MenuWrapper = styled.ul`
  user-select: none;

  .ul-1 {
    overflow-y: scroll;
  }
`;
const MenuItemWrapper = styled.li`
  margin: 8px 0;
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 240px;
    padding: 14px 20px 13px 20px;
    overflow: hidden;
    line-height: 130%;
    border-radius: 42px;
  }
  .category-title {
    color: ${(props) => props.theme.colors.text};
    font-size: 16px;

    &:hover {
      background-color: ${(props) => props.theme.colors.cover2};
    }
  }
  .article-title {
    max-width: 230px;
    padding: 11px 20px 11px 28px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 400;
    font-size: 14px;

    > span {
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &:hover {
      background-color: ${(props) => props.theme.colors.cover2};
    }
  }
  .parent-active {
    color: ${(props) => props.theme.colors.textPrimary};
    background-color: ${(props) => props.theme.colors.primary4};
  }
`;

const Menu = ({ activeArticleKey, onChangeArticleAnchor, onClearSearch }) => {
  const [openIds, setOpenIds] = useState([]);

  const handleSelect = (item) => {
    setOpenIds(
      openIds.includes(item.id) ? openIds.filter((id) => id !== item.id) : [...openIds, item.id],
    );
  };

  const onClick = (item) => {
    if (activeArticleKey !== item.id) {
      onChangeArticleAnchor(item);
      onClearSearch();
    }
  };

  const renderTree = (data, level) => {
    return data.map((item) => {
      const isOpen = openIds.includes(item.id);
      const isCategoryActive = activeArticleKey.startsWith(item.id);
      const isArticleActive = activeArticleKey === item.id;

      return (
        <MenuItemWrapper key={item.id}>
          <MenuItem
            isCategoryActive={isCategoryActive}
            isArticleActive={isArticleActive}
            isOpen={isOpen}
            item={item}
            activeArticleKey={activeArticleKey}
            onClick={onClick}
            onSelect={handleSelect}
          />
          {item.type === 'category' && isOpen && (
            <MenuWrapper className={`ul-${level + 1}`}>
              {renderTree(item.children, level + 1)}
            </MenuWrapper>
          )}
        </MenuItemWrapper>
      );
    });
  };

  useEffect(() => {
    setOpenIds(openIds.concat(activeArticleKey.replace(/(\-\d)*/g, '')));
  }, []);

  return <MenuWrapper className="ul-1">{renderTree(articles, 1)}</MenuWrapper>;
};

export default memo(Menu);
