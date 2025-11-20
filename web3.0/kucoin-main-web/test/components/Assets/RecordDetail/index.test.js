
/**
 * Owner: willen@kupotech.com
 */
test('test', () => {})
// import { fireEvent, screen } from '@testing-library/react';
// import React from 'react';
// import RecordDetail from 'src/components/Assets/RecordDetail/index';
// import { customRender } from 'test/setup';

// jest.mock('react-router-dom', () => {
//   const originalModule = jest.requireActual('react-router-dom');
//   return {
//     __esModule: true,
//     ...originalModule,
//     useRouteMatch: () => ({}),
//     // useDispatch: jest.fn(() => jest.fn()),
//   };
// });

// const props = {
//   accountTitle: 'withdraw.v2.history.accountList',
//   activeTab: 'coin_out_record',
//   checkInnerNeed: true,

//   detailHidden: () => {},
//   detailVisible: true,

//   chainInfo: {
//     AAVE_eth: {
//       withdrawMinFee: '0.5',
//       chainName: 'ERC20',
//       preDepositTipEnabled: 'false',
//       chain: 'eth',
//       isChainEnabled: 'true',
//       withdrawDisabledTip: '',
//       walletPrecision: '18',
//       chainFullName: 'Ethereum',
//       contractAddress: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
//       orgAddress: '',
//       isDepositEnabled: 'true',
//       withdrawMinSize: '1',
//       depositDisabledTip: '',
//       txUrl: 'https://etherscan.io/tx/{txId}',
//       userAddressName: '',
//       preWithdrawTipEnabled: 'false',
//       confirmationCount: '120',
//       withdrawFeeRate: '0',
//       currency: 'AAVE',
//       preConfirmationCount: '6',
//       isWithdrawEnabled: 'true',
//       preDepositTip: '',
//       preWithdrawTip: '',
//     },
//     UNI_eth: {
//       withdrawMinFee: '0.5',
//       chainName: 'ERC20',
//       preDepositTipEnabled: 'false',
//       chain: 'eth',
//       isChainEnabled: 'true',
//       withdrawDisabledTip: '',
//       walletPrecision: '18',
//       chainFullName: 'Ethereum',
//       contractAddress: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
//       orgAddress: '',
//       isDepositEnabled: 'true',
//       withdrawMinSize: '1',
//       depositDisabledTip: '',
//       txUrl: 'https://etherscan.io/tx/{txId}',
//       userAddressName: '',
//       preWithdrawTipEnabled: 'false',
//       confirmationCount: '120',
//       withdrawFeeRate: '0',
//       preConfirmationCount: '6',
//       isWithdrawEnabled: 'true',
//       preDepositTip: '',
//       preWithdrawTip: '',
//     },
//   },
// };

// // todo
// describe('test RecordDetail', () => {
//   test('test RecordDetail', () => {
//     const { container, rerender } = customRender(<RecordDetail {...props} />);
//     rerender(
//       <RecordDetail
//         {...props}
//         {...{
//           activeTab: 'coin_in_record',
//           accountTypes: ['MAIN'],
//           namespace: 'withdraw',
//           detail: {},
//           blockConfirm: true,
//         }}
//       />,
//     );
//     rerender(
//       <RecordDetail
//         {...props}
//         {...{
//           activeTab: 'coin_out_record',
//           accountTypes: ['MAIN'],
//           namespace: 'withdraw',
//           detail: {
//             isInner: false,
//             currency: 'AAVE',
//             chainId: 'eth',
//             addressRemark: true,
//             memo: 'btc',
//             walletTxId: 'asdasd@123123',
//             status: 'PROCESSING',
//             type: 'PHONE',
//             remark: 'xxxx',
//           },
//           blockConfirm: true,
//         }}
//       />,
//     );
//     rerender(
//       <RecordDetail
//         {...props}
//         {...{
//           activeTab: 'coin_out_record',
//           accountTypes: ['MAIN'],
//           namespace: 'withdraw',
//           detail: {
//             isInner: true,
//             currency: 'AAVE',
//             chainId: 'eth',
//             addressRemark: false,
//             memo: 'btc',
//             walletTxId: 'asdasd@123123',
//             status: 'PROCESSING',
//             type: 'PHONE',
//             remark: 'xxxx',
//           },
//           blockConfirm: false,
//         }}
//       />,
//     );
//     rerender(
//       <RecordDetail
//         {...props}
//         {...{
//           activeTab: 'coin_out_record',
//           accountTypes: ['MAIN'],
//           namespace: 'withdraw',
//           detail: {
//             isInner: false,
//             currency: 'AAVE',
//             chainId: 'eth',
//             addressRemark: true,
//             memo: 'btc',
//             walletTxId: 'asdasd@123123',
//             status: 'FAILURE',
//             type: 'PHONE',
//             remark: 'xxxx',
//           },
//           blockConfirm: true,
//         }}
//       />,
//     );
//     // fireEvent.click(screen.getByText('account.profit.yesterdayearn').parentElement);
//   });
// });
