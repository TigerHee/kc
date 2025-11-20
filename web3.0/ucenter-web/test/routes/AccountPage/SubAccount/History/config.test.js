import { loginCreator, transferCreator } from 'src/routes/AccountPage/SubAccount/History/config';
import { customRender } from 'test/setup';

const accountList = [
  { text: 'Account 1', value: 'acc1' },
  { text: 'Account 2', value: 'acc2' },
];

const subAccountList = [
  { text: 'Sub Account 1', value: 'sub1' },
  { text: 'Sub Account 2', value: 'sub2' },
];

const user = { uid: 'user1' };

describe('transferCreator', () => {
  it('should create transfer configuration correctly', () => {
    const config = transferCreator({ accountList, user });
    expect(config).toEqual({
      transfer: {
        title: expect.any(String), // Assuming it will be translated into a string
        initialFilters: expect.objectContaining({
          currentPage: 1,
          pageSize: 10,
        }),
        filters: expect.arrayContaining([
          expect.objectContaining({
            id: 'payOwnerId',
            label: expect.any(String),
            ocx: expect.any(Object), // Assuming it's a component mock or placeholder
          }),
          expect.objectContaining({
            id: 'recOwnerId',
            label: expect.any(String),
            ocx: expect.any(Object), // Assuming it's a component mock or placeholder
          }),
          expect.objectContaining({
            id: 'rangeDate',
            label: expect.any(String),
            ocx: expect.any(Object), // Assuming it's a component mock or placeholder
          }),
        ]),
        columns: expect.arrayContaining([
          expect.objectContaining({
            title: expect.any(String),
            dataIndex: expect.any(String),
            render: expect.any(Function), // Assuming it's a function for rendering data
          }),
        ]),
      },
    });
  });
  it('should create login configuration correctly', () => {
    const config = loginCreator({ subAccountList });

    expect(config).toEqual({
      login: {
        title: expect.any(String), // Assuming it will be translated into a string
        initialFilters: expect.objectContaining({
          currentPage: 1,
          pageSize: 5,
        }),
        filters: expect.arrayContaining([
          expect.objectContaining({
            id: 'subName',
            label: expect.any(String),
            ocx: expect.any(Object), // Assuming it's a component mock or placeholder
          }),
          expect.objectContaining({
            id: 'rangeDate',
            label: expect.any(String),
            ocx: expect.any(Object), // Assuming it's a component mock or placeholder
          }),
        ]),
        columns: expect.arrayContaining([
          expect.objectContaining({
            title: expect.any(String),
            dataIndex: expect.any(String),
            render: expect.any(Function), // Assuming it's a function for rendering data
          }),
        ]),
      },
    });
  });

  it('loginCreator render test', () => {
    const result = loginCreator({ subAccountList: [{ text: 'test', value: 'test' }] });

    expect(result.login).toBeDefined();
    customRender(result.login?.filters?.[0]?.ocx);
    customRender(result.login?.filters?.[1]?.ocx);
    const uglifiedIpDiv = result.login.columns[1].render('record', { ip: '1.1.1.12' });
    const { container } = customRender(uglifiedIpDiv);
    expect(container.innerHTML).toContain('record (1.***.12)');
  });

  it('transferCreator render test', () => {
    const result = transferCreator({ accountList: [{ text: 'test', value: 'test' }] });

    expect(result.transfer).toBeDefined();
    customRender(result.transfer?.filters?.[0]?.ocx);
    customRender(result.transfer?.filters?.[1]?.ocx);
    customRender(result.transfer?.columns?.[0]?.render('export'));
    customRender(result.transfer?.columns?.[1]?.render('Spot', { payTag: 'pay' }));
    customRender(result.transfer?.columns?.[2]?.render('account'));
    customRender(result.transfer?.columns?.[3]?.render('Spot', { recTag: 'rec' }));
  });
});
