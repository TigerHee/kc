
/**
 * Owner: willen@kupotech.com
 */
test('test', () => {})
// /**
//  * Owner: willen@kupotech.com
//  */
// import React from 'react';
// import SecurityAuthForm from 'src/components/Account/SecurityForm/SecurityAuthForm';
// import { customRender } from 'test/setup';
// import { SnackbarContext } from '@kufox/mui/context/index';
// import SecurityModule from 'src/components/Account/SecurityForm/SecurityModule';

// jest.mock('react-redux', () => {
//   return {
//     __esModule: true,
//     default: null,
//     ...jest.requireActual('react-redux'),
//     useDispatch: jest.fn().mockImplementation(() => () => Promise.resolve([])),
//   };
// });

// class Test extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     const { children, ...restProps } = this.props;

//     return <SnackbarContext.Provider value={restProps}>{children}</SnackbarContext.Provider>;
//   }
// }

// describe('test SecurityAuthForm', () => {
//   test('test SecurityAuthForm', async () => {
//     const { container } = customRender(
//       <Test>
//         <SecurityAuthForm allowTypes={[]} bizType={'BIND_PHONE'} replaceMessage="test" />
//       </Test>,
//       {
//         user: {},
//         security_new: {},
//       },
//     );

//     expect(container.innerHTML).toContain('test');
//   });

//   test('test SecurityModule', async () => {
//     const { rerender, container } = customRender(
//       <Test>
//         <SecurityModule allowTypes={[]} bizType={'BIND_PHONE'} warning="warning-test" />
//       </Test>,
//       {
//         user: {},
//         security_new: {},
//       },
//     );
//     expect(container.innerHTML).toContain('warning-test');
//   });
// });
