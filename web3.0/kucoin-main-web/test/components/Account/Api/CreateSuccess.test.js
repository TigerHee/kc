
/**
 * Owner: willen@kupotech.com
 */
test('test', () => {})
// import React from 'react';
// import CreateSuccess from 'src/components/Account/Api/CreateSuccess';
// import { customRender } from 'test/setup';
// import { fireEvent, screen } from '@testing-library/react';

// jest.mock('@kc/mui', () => {
//   return {
//     __esModule: true,
//     Snackbar: () => <div />,
//     SnackbarContent: () => <div />,
//   };
// });

// jest.mock('components/Router', () => {
//   return {
//     __esModule: true,
//     withRouter: () => (Component) => (props) => {
//       return <Component {...props} />;
//     },
//   };
// });

// jest.mock('@kufox/mui/hooks/useSnackbar', () => {
//   return {
//     __esModule: true,
//     default: () => {
//       return {
//         message: {},
//       };
//     },
//   };
// });

// describe('test CreateSuccess', () => {
//   test('test CreateSuccess component', () => {
//     customRender(<CreateSuccess />, {
//       api_key: {
//         createSuccessData: { ipWhitelistStatus: 0 },
//       },
//     });
//   });

//   test('test CreateSuccess component', () => {
//     customRender(<CreateSuccess successUrl={`/account-sub/api-manager`} successFunc={() => {}} />, {
//       api_key: {
//         createSuccessData: { authGroupMap: { a: 'test', b: null, c: 'tttt' }, expireAt: 123123 },
//         createSuccessVisible: true,
//       },
//     });
//     fireEvent.click(screen.getByTestId('btn'));
//   });
// });
