import { formatStyleUnit } from './style';

const envCache: Record<string, string | number> = {};

export type TSafeAreaEnv = 'safe-area-inset-bottom' | 'safe-area-inset-top' | 'safe-area-inset-right' | 'safe-area-inset-left';

export function getCssEnvRealValue(envName: TSafeAreaEnv, fallbackValue: number = 0): number {
  if (envCache[envName] !== undefined) {
    return Number(envCache[envName]);
  }

  if (!document.body) {
    console.warn('document.body is not available');
    return fallbackValue;
  }

  // 获取env的实际值
  const el = document.createElement('div');
  el.style.position = 'absolute';
  el.style.width = `env(${envName}, ${fallbackValue}px)`;
  document.body.appendChild(el);

  const style = getComputedStyle(el);
  const value = style.width;

  document.body.removeChild(el);

  if (!value) {
    console.warn(`kux-design failed to get value for env(${envName}), using defaultValue: ${fallbackValue}`);
    envCache[envName] = fallbackValue;
    return fallbackValue;
  }

  const parsedValue = parseFloat(value);
  envCache[envName] = parsedValue;
  return parsedValue;
}

/**
 * 获取安全区域的值，直接用css env有兼容问题。
 * 
 * @usage style={{
 *   "--kux-safe-area-inset-bottom": getCssSafeArea('safe-area-inset-bottom', 20)
 * }}
 * 
 * @params varName 安全区域css变量名
 * @params fallback 回退值
 */
export function getCssSafeArea(varName: TSafeAreaEnv, fallback: number) {
  return formatStyleUnit(
    getCssEnvRealValue(varName, fallback),
    'px'
  );
}
