/*
 * @Owner: Melon@kupotech.com
 * @Author: Melon Melon@kupotech.com
 * @Date: 2025-05-26 17:42:45
 * @LastEditors: Melon Melon@kupotech.com
 * @LastEditTime: 2025-05-26 18:43:48
 * @FilePath: /kucoin-main-web/test/components/JoinUs/TipDialog.test.js
 * @Description:
 *
 *
 */

import React from 'react';
import {
  TipDialog,
  TipProvider,
  useTipDialogStore,
  TipContent,
} from 'src/components/JoinUs/TipDialog';
import { customRender } from 'test/setup';
import { renderHook, act } from '@testing-library/react-hooks';
import { fireEvent, screen } from '@testing-library/react';

jest.mock('@kux/mui', () => {
  const originalModule = jest.requireActual('@kux/mui');
  const Dialog = (props) => {
    const { title, desc, okText, cancelText, children } = props || {};
    return (
      <div {...props}>
        <span>{title}</span>
        <span>{desc}</span>
        <div>{children}</div>
        <div>
          <span>{cancelText}</span>
          <span>{okText}</span>
        </div>
      </div>
    );
  };
  const MDialog = (props) => {
    const { title, desc, okText, cancelText, children, footer } = props || {};
    return (
      <div {...props}>
        <span>{title}</span>
        <span>{desc}</span>
        <div>{children}</div>
        <div>{footer}</div>
      </div>
    );
  };
  return {
    __esModule: true,
    ...originalModule,
    useTheme: () => {
      return {
        colors: {
          icon: 'red',
          primary: 'blue',
          layer: 'green',
          text: '#ffffff',
          text20: '#ffffff',
          text60: '#ffffff',
          cover2: 'red',
          divider80: 'red',
          divider8: 'red',
        },
      };
    },
    useMediaQuery: jest.fn(() => true),
    Dialog,
    MDialog,
  };
});

describe('test src/components/JoinUs/TipDialog', () => {
  test('TipDialog 大尺寸', () => {
    const { result, rerender } = renderHook(() => useTipDialogStore(), {
      wrapper: TipProvider,
    });
    const { getByTestId } = customRender(
      <TipProvider>
        <TipDialog />
      </TipProvider>,
    );
    const { openDialog } = result.current;
    act(() => openDialog());
    rerender();
    expect(result.current.visible).toBe(true);
    expect(getByTestId('TipContent')).toBeInTheDocument();
  });

  test('TipDialog 小尺寸 & 点击', () => {
    const { result, rerender } = renderHook(() => useTipDialogStore(), {
      wrapper: TipProvider,
    });
    const { getByTestId } = customRender(
      <TipProvider>
        <TipDialog isSm />
      </TipProvider>,
    );
    const { openDialog } = result.current;
    act(() => openDialog());
    rerender();
    expect(result.current.visible).toBe(true);
    expect(getByTestId('TipContent')).toBeInTheDocument();
    /** 取消按钮 */
    const cancelBtn = getByTestId('cancelBtn');
    expect(cancelBtn).toBeInTheDocument();
    fireEvent.click(cancelBtn);
    /** 继续前往按钮 */
    const okBtn = getByTestId('okBtn');
    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => ({ opener: null }));
    expect(okBtn).toBeInTheDocument();
    windowOpenSpy.mockRestore();
  });

  test('TipContent 大尺寸', () => {
    const { getByTestId } = customRender(<TipContent />);
    expect(getByTestId('TipContent')).toBeInTheDocument();
  });

  test('TipContent 小尺寸', () => {
    const { getByTestId, container } = customRender(<TipContent isSm />);
    expect(getByTestId('TipContent')).toBeInTheDocument();
    expect(container.querySelector('.tipContentWrapper_Sm')).toBeInTheDocument();
  });
});
