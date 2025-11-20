import { METHODS, SecVerifyResponse } from '../enums';
import { reportAppBridgeError } from './sentry';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';
import { toast } from '@kux/design';
import { useVerification } from '../components/Verification/model';
import { UNSUPPORTED_METHODS_LOWER_APP_VERSION, isCompatibleAppVersion, isInApp, openNativeValidation } from './app';
import noop from 'lodash-es/noop';
import VerificationDialog, { VerificationController } from '../components/VerificationDialog';
import '../common/httpInterceptors';
import { getToken } from '../services';
import { PLUGIN_LIST } from '../plugins';
import { Suspense } from 'react';

export interface SecVerifyBaseProps {
  bizType: string;
  businessData: Record<string, any>;
  errorRender?: (errorCode: string) => React.ReactNode;
  onSuccess?: (params: SecVerifyResponse) => void;
  onCancel?: () => void;
  onUnavailable?: () => void;
}

export interface SecVerifyProps extends SecVerifyBaseProps {}

export interface SecVerifyWithTokenProps extends SecVerifyBaseProps {
  token: string;
}

export interface SecVerifyWithAddressProps extends SecVerifyBaseProps {
  address: string;
}

/**
 * 基础的安全验证函数，包含公共逻辑
 * @param props 验证参数
 * @param options 额外选项，包括 token, address
 * @returns 返回一个控制器对象，可以通过它主动关闭弹窗
 */
const baseSecVerify = async (
  props: SecVerifyBaseProps,
  options: { token?: string, address?: string }
): Promise<VerificationController> => {
  const {
    bizType,
    businessData,
    errorRender,
    onSuccess = noop,
    onCancel = noop,
    onUnavailable = useVerification.getState().openResetSecurityPage,
  } = props;
  
  let permitValidateType: METHODS[] | undefined;
  if (isInApp) {
    if (await isCompatibleAppVersion()) {
      try {
        const handleUnavailable = () => {
          // 如果验证方式不可用，则 app 端需要先处理不可用逻辑
          // 再调用 onCancel 结束弹窗，否则业务方通过桥对 webview 处理可能导致冲突
          onUnavailable();
          onCancel();
        }
        openNativeValidation({ bizType, businessData, options, onCancel, onUnavailable: handleUnavailable, onSuccess });
      } catch (err: any) {
        reportAppBridgeError({ bizType, msg: err?.msg ?? err?.message });
        toast.error(err?.msg ?? err?.message);
      }
      // App 环境下也返回一个空控制器
      return { close: noop };
    } else {
      permitValidateType = PLUGIN_LIST
        .map(p => p.field)
        .filter(field => !UNSUPPORTED_METHODS_LOWER_APP_VERSION.includes(field));
    }
  }

  const container = document.createElement('div');
  container.setAttribute('data-testid', 'verification-root');
  document.body.append(container);

  // 创建 Promise 来等待控制器准备就绪
  return new Promise((resolve) => {
    let controllerRef: VerificationController | null = null;

    const handlePageShow = (e) => {
      if (e.persisted) {
        // 监听是否缓存页面
        // 如果是缓存页面，业务需要重新拉取数据
        // 调用 onCancel 结束弹窗
        wrappedOnCancel();
      }
    };
    window.addEventListener('pageshow', handlePageShow, { once: true });

    /** ReactDOM 由业务工程注入，版本大于 18 时使用 createRoot，否则使用 ReactDOM.render */
    const root = ReactDOM.version.split('.')[0] >= 18 ? createRoot(container) : null;
    const cleanup = () => {
      root ? root.unmount() : ReactDOM.unmountComponentAtNode(container);
      container.remove();
    };

    // 包装原始回调，在关闭时清理 DOM
    const wrappedOnSuccess = (params: SecVerifyResponse) => {
      cleanup();
      onSuccess(params);
    };

    const wrappedOnCancel = () => {
      cleanup();
      onCancel();
    };

    const dialog = <Suspense fallback={null}>
      <VerificationDialog
        bizType={bizType}
        businessData={businessData}
        permitValidateType={permitValidateType}
        options={options}
        errorRender={errorRender}
        onSuccess={wrappedOnSuccess}
        onCancel={wrappedOnCancel}
        onUnavailable={onUnavailable}
        onRef={(controller) => {
          // 增强控制器，添加 cleanup 逻辑
          controllerRef = {
            close: () => {
              controller.close();
              cleanup();
            }
          };
          resolve(controllerRef);
        }}
      />;
    </Suspense>;
  root ? root.render(dialog) : ReactDOM.render(dialog, container);
  });
};

/**
 * 安全验证函数（登陆态）
 * @param props 验证参数
 * @returns 返回一个控制器对象，可以通过 controller.close() 主动关闭弹窗
 * @example
 * const controller = await goVerify({ bizType: 'WITHDRAW', businessData: {...} });
 * // 外部主动关闭弹窗
 * controller.close();
 */
const goVerify = async (props: SecVerifyProps): Promise<VerificationController> => {
  return baseSecVerify(props, {});
};

/**
 * 带半登陆 token 参数的安全验证函数
 * @param props 验证参数，包含可选的 token
 * @returns 返回一个控制器对象，可以通过 controller.close() 主动关闭弹窗
 * @example
 * const controller = await goVerifyWithToken({ bizType: 'LOGIN', token: 'xxx', businessData: {...} });
 * controller.close();
 */
const goVerifyWithToken = async (props: SecVerifyWithTokenProps): Promise<VerificationController> => {
  const { token, ...baseProps } = props;
  if (!token) {
    throw new Error('token is required');
  }
  // token 最后也会放在 businessData 里传给后端，是 UC 预定义的业务参数
  // 避免业务方使用此参数，导致 UC 预定义的业务参数被覆盖
  if (props.businessData.token) {
    throw new Error('Business parameters do not support the use of token fields');
  }
  return baseSecVerify(baseProps, { token });
};

/**
 * 带邮箱或手机号的安全验证函数
 * @param props 验证参数，包含邮箱或手机号
 * @returns 返回一个控制器对象，可以通过 controller.close() 主动关闭弹窗
 * @example
 * const controller = await goVerifyWithAddress({ bizType: 'RESET_PASSWORD', address: 'user@example.com', businessData: {...} });
 * controller.close();
 */
const goVerifyWithAddress = async (props: SecVerifyWithAddressProps): Promise<VerificationController> => {
  const { address, ...baseProps } = props;
  if (!address) {
    throw new Error('address is required');
  }
  // token 和 address 最后也会放在 businessData 里传给后端，是 UC 预定义的业务参数
  // 避免业务方使用此参数，导致 UC 预定义的业务参数被覆盖
  if (props.businessData.address) {
    throw new Error('Business parameters do not support the use of address fields');
  }
  if (props.businessData.token) {
    throw new Error('Business parameters do not support the use of token fields');
  }
  const { data } = await getToken({ userAccount: address });
  return baseSecVerify(baseProps, { address, token: data });
};

export default goVerify;
export { goVerifyWithToken, goVerifyWithAddress };