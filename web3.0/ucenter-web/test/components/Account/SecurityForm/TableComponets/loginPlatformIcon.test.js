import getPlatformIcon from 'src/components/Account/SecurityForm/TableComponets/loginPlatformIcon';
import { customRender } from 'test/setup';

describe('test loginPlatformIcon', () => {
  it('loginPlatformIcon', () => {
    customRender(
      <>
        <div>{getPlatformIcon()}</div>
        <div>{getPlatformIcon('kucoin web')}</div>
        <div>{getPlatformIcon('iphone app')}</div>
        <div>{getPlatformIcon('android app')}</div>
        <div>{getPlatformIcon('other')}</div>
      </>,
    );
  });
});
