/**
 * @author: sheldon.ye@kupotech.com
 * @description: WEB3 入口切换组件
 * @since: 2025/02/19
 */
import { styled } from '@kux/mui';

const TabContainer = styled.section`
  display: inline-flex;
  align-items: center;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.cover4};
  cursor: pointer;
  ${(props) => {
    const { inDrawer, theme } = props;
    const { currentTheme, colors } = theme;
    return inDrawer && currentTheme === 'dark'
      ? {
          border: `1px solid ${colors.divider8}`,
          background: 'transparent',
        }
      : '';
  }}
`;

const TabItem = styled.span`
  display: inline-block;
  font-size: 14px;
  line-height: 18.2px;
  height: 100%;
  display: inline-flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text60};
  padding: 4px 8px;
  white-space: nowrap;
  ${(props) => {
    const { active, inDrawer, theme } = props;
    const { currentTheme, colors } = theme;
    if (active) {
      return {
        display: 'flex',
        padding: `4px 8px`,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        border: `1px solid ${inDrawer && currentTheme === 'dark' ? 'transparent' : colors.text}`,
        backgroundColor: inDrawer && currentTheme === 'dark' ? colors.cover8 : colors.overlay,
        color: colors.text,
      };
    }
    return '';
  }}
`;

const TabItemBox = styled.div`
  height: 34px;
  display: inline-block;
  padding: ${(props) => props.padding};
`;

export { TabContainer, TabItem, TabItemBox };
