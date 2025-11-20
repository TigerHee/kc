/**
 * Owner: larvide.peng@kupotech.com
 */
import { styled, useTheme, useMediaQuery } from '@kux/mui';
import { _t } from 'tools/i18n';
import { memo } from 'react';
import { useRestrictNotice } from 'src/hooks/useRestrictNotice';
import Menu from './Components/Menu';
import SearchInput from 'components/SecurityMenu/SearchInput';

const SideMenuWrapper = styled.div`
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
  padding: 20px 16px;
  border-right: 1px solid ${({ theme }) => theme.colors.divider8};

  .KuxMenu-root {
    background: unset;
    border-right: unset;

    ${(props) => props.theme.breakpoints.down('lg')} {
      width: 72px;
      padding: 20px 4px;
    }
  }

  .KuxMenuItem-root {
    ${(props) => props.theme.breakpoints.down('lg')} {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-left: unset;
      background: unset;
    }
  }

  .KuxMenuItem-icon {
    ${(props) => props.theme.breakpoints.down('lg')} {
      margin-right: 0;
    }
  }

  .KuxMenuItem-text {
    ${(props) => props.theme.breakpoints.down('lg')} {
      display: inline-block;
      width: 100%;
      margin-top: 2px;
      overflow: hidden;
      font-size: 10px;
      line-height: 130%;
      white-space: nowrap;
      text-align: center;
      text-overflow: ellipsis;
    }
  }
  .KuxDivider-root {
    margin: 0 8px 0 0;
  }
`;
const SearchInputStyled = styled(SearchInput)`
  height: 40px;
  font-size: 16px;
`;
const SlideContent = styled.div`
  position: sticky;
  height: max-content;
`;

const SideMenu = ({ activeArticleKey, onChangeArticleAnchor, onSerch, onClearSearch }) => {
  const theme = useTheme();
  const { isShowRestrictNotice, restrictNoticeHeight } = useRestrictNotice();
  const isSm = useMediaQuery((theme) => theme.breakpoints.down('xl'));
  // 侧边栏吸顶距离
  const stickyTop = (isShowRestrictNotice ? restrictNoticeHeight : 0) + (isSm ? 84 : 100);

  const onEnterHandler = (c, k) => {
    onSerch(c, k);
    window.scrollTo?.(0, 0);
  };

  return (
    <SideMenuWrapper theme={theme} data-inspector="security_side_menu">
      <SlideContent style={{ top: stickyTop }}>
        <SearchInputStyled
          isSm={isSm}
          inputProps={{
            size: 'medium',
            width: 'inherit',
          }}
          iconSize="20px"
          allowClear={true}
          onChangeArticleAnchor={onChangeArticleAnchor}
          onEnterHandler={onEnterHandler}
          onClearSearch={onClearSearch}
        />
        <Menu
          activeArticleKey={activeArticleKey}
          onChangeArticleAnchor={onChangeArticleAnchor}
          onClearSearch={onClearSearch}
        />
      </SlideContent>
    </SideMenuWrapper>
  );
};

export default memo(SideMenu);
