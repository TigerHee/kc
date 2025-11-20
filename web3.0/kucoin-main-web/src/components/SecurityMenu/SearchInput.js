/* eslint-disable kupo-lint/no-dangerously-html */
/**
 * Owner: brick.fan@kupotech.com
 */
import { useState, useMemo, memo } from 'react';
import { ICSearchOutlined } from '@kux/icons';
import { _t } from 'tools/i18n';
import history from '@kucoin-base/history';
import { Dropdown, Input, styled, useTheme, useMediaQuery } from '@kux/mui';
import { canSearchArticles, articles } from './config';

const Container = styled.div`
  position: relative;
  width: 100%;
  .KuxDropDown-container,
  .KuxDropDown-trigger {
    width: 100%;
  }
  .KuxDivider-root {
    margin: 0 4px;
  }

  .ICSearch_svg__icon {
    [dir='rtl'] & {
      transform: rotate(90deg);
    }
  }
`;

const CusDropdown = styled(Dropdown)`
  .customDropdown {
    width: 100%;
    transform: translate(0px, 38px) !important;
  }
`;

const Overlay = styled.div`
  position: absolute;
  border-radius: 8px;
  left: 0;
  width: 100%;
  height: unset;
  background: ${({ theme }) => theme.colors.layer};
  box-shadow: rgba(0, 0, 0, 0.06) 0px 4px 40px;
  top: ${(props) => (props.isHomePage ? '20px' : '5px')};
  ${(props) => props.theme.breakpoints.down('lg')} {
    top: 20px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    top: 3px;
  }
`;

const List = styled.div`
  max-height: 360px;
  overflow: auto;
  margin: 0px;
  flex: 1;
  padding-bottom: unset;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    width: 100%;
    height: auto;
    background: ${({ theme }) => theme.colors.text20};
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.text60};
  }
`;

const ListItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  .text-highlight {
    color: ${({ theme }) => theme.colors.primary};
  }
  &:hover {
    background: ${({ theme }) => theme.colors.cover2};
  }
`;

export function fuzzyHighlight(text, search) {
  // 创建一个正则表达式，用于在文本中查找搜索字符串
  // 'gi' 参数表示全局搜索（g）和忽略大小写（i）
  var regex = new RegExp(search, 'gi');
  // 使用正则表达式替换匹配的字符串，将其包裹在高亮标签中
  var highlighted = text.replace(regex, function (match) {
    return '<span class="text-highlight">' + match + '</span>';
  });
  return highlighted;
}

const SearchInput = ({
  isHomePage = false,
  inputProps = {},
  iconSize,
  onChangeArticleAnchor,
  onEnterHandler,
  onClearSearch,
  updateInputValue,
  onClose,
}) => {
  const theme = useTheme();
  const isSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [value, setValue] = useState('');
  const [visible, setVisible] = useState(false);

  const filteredList = useMemo(() => {
    if (!value) return [];
    const result = [];
    canSearchArticles.forEach((item) => {
      if (_t(item.title).toLowerCase().includes(value.toLowerCase())) {
        const highlighted = fuzzyHighlight(_t(item.title), value);
        result.push({ ...item, highlighted });
      }
    });
    return result;
  }, [value]);

  const onClick = (item) => {
    setValue(_t(item.title));
    setVisible(false);
    onClearSearch?.();
    onChangeArticleAnchor?.(item);
    onClose?.();
    isHomePage && history.push(item.path);
  };

  const onEnter = (e) => {
    if (e.key === 'Enter') {
      onClearSearch?.();
      onEnterHandler?.(filteredList, value);
      setVisible(false);
      if (isHomePage) {
        history.push(filteredList.length ? `${filteredList[0].path}` : `${articles[0].path}`, {
          filteredList: filteredList,
          value: value,
        });
      }
    }
  };

  return (
    <Container>
      <CusDropdown
        visible={visible}
        overlay={
          filteredList.length > 0 && (
            <Overlay isHomePage={isHomePage}>
              <List>
                {filteredList.map((item) => (
                  <ListItem
                    data-testid="security_search_item"
                    key={item.id}
                    onClick={() => onClick(item)}
                  >
                    <span dangerouslySetInnerHTML={{ __html: item.highlighted }} />
                  </ListItem>
                ))}
              </List>
            </Overlay>
          )
        }
        popperClassName="customDropdown"
        placement="bottom-start"
        onVisibleChange={(v) => setVisible(v)}
        trigger="click"
      >
        <Input
          size={isSm ? 'xsmall' : 'small'}
          addonBefore={
            <ICSearchOutlined size={iconSize ?? isSm ? 20 : 24} color={theme.colors.icon} />
          }
          placeholder={_t('86fd144a90fa4000a7e5')}
          allowClear={true}
          onChange={(e) => {
            setVisible(true);
            setValue(e.target.value);
            updateInputValue?.(e.target.value);
          }}
          value={value}
          onKeyPress={onEnter}
          {...inputProps}
        />
      </CusDropdown>
    </Container>
  );
};

export default memo(SearchInput);
