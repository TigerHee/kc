/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useCallback, useMemo } from 'react';
import { Button, useNotification, useTheme, Divider, Notification, styled } from '@kux/mui';
import { withNotification, withTheme } from '@kux/mui/lib/hocs';
import { ICSecurityOutlined } from '@kux/icons';
import Wrapper from './wrapper';

const TimeWrapper = styled.div`
  color: ${props => props.theme.colors.text40};
  margin-top: 8px;
  font-size: 12px;
  line-height: 16px;
`;

Notification.setConfig({
  maxNotice: 6,
});
@withNotification()
class With extends React.Component {
  render() {
    console.log(this.props, 'withNotification');
    return null;
  }
}

const Doc = () => {
  const notification = useNotification();
  const theme = useTheme();

  const handleClick = useCallback(() => {
    notification.success({
      // direction: 'rtl',
      message: '登录提醒',
      autoHideDuration: 1500000000,
      description: (
        <div>
          <div>有人在未知區域登錄了您的賬號，在Mac OS系統裡，在社會層面上，香港的主要題有舉，但受...</div>
          <TimeWrapper theme={theme}>2021-04-16 15:45</TimeWrapper>
        </div>
      ),
      // icon: (<ICSecurityOutlined size={24} />),
    })
  }, [theme])

  return (
    <>
      <Button
        onClick={handleClick}
      >
        success
      </Button>
      {/* <Button
        onClick={() => {
          notification.open({
            message: '游戏',
            icon: (
              <img
                style={{ width: '40px', height: '40px' }}
                src="https://t7.baidu.com/it/u=1595072465,3644073269&fm=193&f=GIF"
                alt=""
              />
            ),

            description: `我的世界在哪里`,
            action: ({ key, close }) => {
              return (
                <>
                  <Button
                    onClick={() => {
                      notification.close(key);
                    }}
                    size="mini"
                    type="default"
                  >
                    cancel
                  </Button>
                  <Divider type="vertical" />
                  <Button
                    onClick={() => {
                      close();
                    }}
                    size="mini"
                    type="primary"
                  >
                    ok
                  </Button>
                </>
              );
            },
          });
        }}
      >
        open
      </Button>
      <Button
        onClick={() => {
          notification.error({
            message: '游戏',
            description: `我的世界在哪里`,
            action: ({ key, close }) => {
              return (
                <>
                  <Button
                    onClick={() => {
                      notification.close(key);
                    }}
                    size="mini"
                    type="default"
                  >
                    cancel
                  </Button>
                  <Divider type="vertical" />
                  <Button
                    onClick={() => {
                      close();
                    }}
                    size="mini"
                    type="primary"
                  >
                    ok
                  </Button>
                </>
              );
            },
            placement: 'top-left',
          });
        }}
      >
        error
      </Button>
      <Button
        onClick={() => {
          notification.info({
            message: '游戏',
            description: `我的世界在哪里`,
            action: ({ key, close }) => {
              return (
                <>
                  <Button
                    onClick={() => {
                      notification.close(key);
                    }}
                    size="mini"
                    type="default"
                  >
                    cancel
                  </Button>
                  <Divider type="vertical" />
                  <Button
                    onClick={() => {
                      close();
                    }}
                    size="mini"
                    type="primary"
                  >
                    ok
                  </Button>
                </>
              );
            },
            placement: 'bottom-right',
          });
        }}
      >
        info
      </Button>

      <Button
        onClick={() => {
          notification.warning({
            message: '游戏',
            description: `我的世界在哪里`,
            action: ({ key, close }) => {
              return (
                <>
                  <Button
                    onClick={() => {
                      notification.close(key);
                    }}
                    size="mini"
                    type="default"
                  >
                    cancel
                  </Button>
                  <Divider type="vertical" />
                  <Button
                    onClick={() => {
                      close();
                    }}
                    size="mini"
                    type="primary"
                  >
                    ok
                  </Button>
                </>
              );
            },
            placement: 'bottom-left',
          });
        }}
      >
        warning
      </Button> */}
    </>
  );
};
export default () => {
  return (
    <Wrapper>
      <Doc />
      <With />
    </Wrapper>
  );
};
