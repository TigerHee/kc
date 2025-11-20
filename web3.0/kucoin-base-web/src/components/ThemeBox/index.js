import { useCallback } from 'react';
import { styled, useTheme } from '@kux/mui';
import { ICDarkModeOutlined, ICLightModeOutlined } from '@kux/icons';

const Wrapper = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  background: ${props => props.theme.colors.overlay};
`;

export const NotificationWrapper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background: ${props => props.theme.colors.cover4};
  cursor: pointer;
`;

export default function ThemeBox() {
  const { currentTheme, setTheme, colors } = useTheme();

  const changeTheme = useCallback(() => {
    if (currentTheme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, [currentTheme, setTheme]);

  return (
    <Wrapper>
      <NotificationWrapper onClick={changeTheme}>
        {
          currentTheme === 'dark'
            ? <ICDarkModeOutlined
              size={20}
              color={colors.text}
            />
            : <ICLightModeOutlined
              size={20}
              color={colors.text}
            />
        }
      </NotificationWrapper>
      kucoin-base-web currentTheme: {currentTheme}
    </Wrapper>
  );
}
