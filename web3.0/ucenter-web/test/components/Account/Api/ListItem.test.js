/**
 * Owner: willen@kupotech.com
 */
import ListItem from 'src/components/Account/Api/ListItem';
import { customRender } from 'test/setup';

describe('test ListItem', () => {
  test('test ListItem component', () => {
    customRender(<ListItem authGroupMap={{}} query={{ sub: 'test' }} />, {
      server_time: { serverTime: 1234567890 },
    });
    customRender(
      <>
        <ListItem
          version={1}
          query={{ sub: '' }}
          isActivated={true}
          currentLang="zh_CN"
          expireAt={1234}
          authGroupMap={{ API_COMMON: true, API_SPOT: true, API_WITHDRAW: true }}
          permissionMap={{ API_COMMON: false, API_SPOT: true, API_WITHDRAW: true }}
        />
        <ListItem
          query={{ sub: '' }}
          version={2}
          currentLang={'xx'}
          isActivated={true}
          accountSub={true}
          authGroupMap={{}}
          expireAt={1234}
          ipWhitelistStatus={0}
        />
        <ListItem
          query={{ sub: '' }}
          version={2}
          brokerId={123}
          apiVersion={1}
          currentLang={'xx'}
          isActivated={true}
          accountSub={true}
          authGroupMap={{}}
          expireAt={1234}
          ipWhitelistStatus={0}
        />
      </>,
    );
  });
});
