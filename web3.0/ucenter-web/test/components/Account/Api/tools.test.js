/**
 * Owner: eli.xiang@kupotech.com
 */
import { getAuthList } from 'src/components/Account/Api/tools';
import { customRender } from 'test/setup';

describe('Account Api tools function', () => {
  test('getAuthList noWithdraw = false, isSubAccount = false', () => {
    const authListArr = getAuthList(
      false,
      {
        API_COMMON: false,
        API_FUTURES: true,
        API_SPOT: true,
        API_TRANSFER: true,
        API_WITHDRAW: true,
        API_MARGIN: true,
        API_EARN: true,
      },
      false,
    );

    const apiCommonAuthListItem = authListArr.find((item) => item.value === 'API_COMMON');
    const apiEarnAuthListItem = authListArr.find((item) => item.value === 'API_EARN');

    const { container: apiCommonContainer } = customRender(apiCommonAuthListItem.label, {});
    const { container: apiEarnContainer } = customRender(apiEarnAuthListItem.label, {});
    expect(apiCommonContainer.innerHTML).toContain('vGeoG6ES46EgfbizBCpK3C');
    expect(apiCommonContainer.innerHTML).toContain('api.auth.common.intro');

    expect(apiEarnContainer.innerHTML).toContain('9b9a216191574000a54d');
    expect(apiEarnContainer.innerHTML).toContain('5f8c13c328654000a806');

    expect(authListArr.length).toBe(7);
    expect(apiCommonAuthListItem?.disabled).toBe(true);
    expect(apiEarnAuthListItem?.disabled).toBe(false);
  });

  test('getAuthList noWithdraw = false, isSubAccount = true', () => {
    const authListArr = getAuthList(
      false,
      {
        API_COMMON: false,
        API_FUTURES: true,
        API_SPOT: true,
        API_TRANSFER: true,
        API_WITHDRAW: true,
        API_MARGIN: true,
        API_EARN: true,
      },
      true,
    );

    const apiEarnAuthListItem = authListArr.find((item) => item.value === 'API_EARN');

    const { container: apiEarnContainer } = customRender(apiEarnAuthListItem.label, {});
    expect(apiEarnContainer.innerHTML).toContain('9b9a216191574000a54d');
    expect(apiEarnContainer.innerHTML).toContain('5f8c13c328654000a806');
    expect(apiEarnContainer.innerHTML).toContain('40b31590595b4000aa53');
    expect(authListArr.length).toBe(7);
  });

  test('getAuthList noWithdraw = true, isSubAccount = true', () => {
    const authListArr = getAuthList(
      true,
      {
        API_COMMON: false,
        API_FUTURES: true,
        API_SPOT: true,
        API_TRANSFER: true,
        API_WITHDRAW: true,
        API_MARGIN: true,
        API_EARN: true,
      },
      true,
    );

    expect(authListArr.length).toBe(6);
  });

  test('getAuthList noWithdraw = true, isSubAccount = false', () => {
    const authListArr = getAuthList(
      true,
      {
        API_COMMON: false,
        API_FUTURES: true,
        API_SPOT: true,
        API_TRANSFER: true,
        API_WITHDRAW: true,
        API_MARGIN: true,
        API_EARN: true,
      },
      false,
    );

    const apiEarnAuthListItem = authListArr.find((item) => item.value === 'API_EARN');
    const { container: apiEarnContainer } = customRender(apiEarnAuthListItem.label, {});

    expect(apiEarnContainer.innerHTML).not.toContain('40b31590595b4000aa53');

    expect(authListArr.length).toBe(6);
  });
});
