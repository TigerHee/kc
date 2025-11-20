import React, {memo} from 'react';
import {css} from '@emotion/native';

import useLang from 'hooks/useLang';
import Button from '../Button';
import {ButtonAreaWrap} from './styles';

/**
 * ConfirmFooter 组件是一个可定制的底部，根据传入的 props 显示 OK 和 Cancel 按钮
 * @returns ConfirmFooter 组件返回以下三种情况之一：
 * 1. 如果 footer prop 是一个组件，就返回这个组件作为自定义的底部
 * 2. 如果 footer prop 是 undefined，就返回一个默认的底部，包含两个按钮（OK 和 Cancel）
 * 3. 如果 footer prop 是 null，就返回 null，不显示任何底部
 * @param {Object} props 组件的属性。
 * @param {React.ReactNode} props.footer 底部内容，当不需要默认底部按钮时，可以设为 footer: null
 * @param {string} props.cancelText 取消按钮的文本。
 * @param {string} props.okText 确定按钮的文本。
 * @param {function} props.onCancel 处理取消事件的回调函数。
 * @param {function} props.onOk 处理确定事件的回调函数。
 * @param {boolean} [props.hiddenCancel=false] 是否隐藏取消按钮，可选。
 * @param {boolean} [props.hiddenOk=false] 是否隐藏确定按钮，可选。
 * @param {boolean} [props.loading=loading]
 * @param {object} props.okButtonProps 	ok 按钮 props

 *
 */

const ConfirmFooter = ({
  footer,
  okText,
  cancelText,
  onCancel,
  onOk,
  hiddenCancel,
  hiddenOk,
  loading,
  style,
  okButtonProps = {},
}) => {
  const {_t} = useLang();

  const showFooterArea = footer === null;
  const showCustomFooter = !!footer;
  const hasPairBtn = !hiddenCancel && !hiddenOk;

  if (showFooterArea) return null;

  if (showCustomFooter) return footer;

  return (
    <ButtonAreaWrap style={style}>
      {!hiddenCancel && (
        <Button
          style={css`
            flex: 1;
            margin-right: ${hasPairBtn ? '8px' : 0};
          `}
          onPress={onCancel}
          type="secondary"
          size="medium">
          {cancelText || _t('d28daac8f9764000a8f7')}
        </Button>
      )}

      {!hiddenOk && (
        <Button
          style={css`
            flex: 1;
            margin-left: ${hasPairBtn ? '8px' : 0};
          `}
          loading={loading}
          onPress={onOk}
          size="medium"
          {...(okButtonProps || {})}>
          {okText || _t('b31be4f93a764000a765')}
        </Button>
      )}
    </ButtonAreaWrap>
  );
};

export default memo(ConfirmFooter);
