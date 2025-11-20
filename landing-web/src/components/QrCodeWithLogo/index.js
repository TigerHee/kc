/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import QRCode from 'qrcode.react';
import PropTypes from 'prop-types';
import downloadLogo from 'assets/global/logo_icon.svg';

/*
 * 默认展示为带logo的二维码组件
 * src：中间展示的图片
 */
const QrCodeWithLogo = React.memo(props => {
  const { src, height, width, excavate, x, y, ...rest } = props;
  return (
    <QRCode
      {...rest}
      imageSettings={{
        src,
        x,
        y,
        height,
        width,
        excavate,
      }}
    />
  );
});

QrCodeWithLogo.propTypes = {
  src: PropTypes.any, // 显示的图片的部分
  x: PropTypes.any, // x偏移
  y: PropTypes.any, // y偏移
  height: PropTypes.number, // 中间展示的图片的高
  width: PropTypes.number, // 中间展示的图片的宽
  excavate: PropTypes.oneOf([true, false]), // 中间展示的部分是否镂空
};

QrCodeWithLogo.defaultProps = {
  src: downloadLogo, //默认展示下载中间的logo图片
  x: null, //默认位置居中
  y: null, //默认位置居中
  height: 40, // 默认中间图片展示的高度
  width: 40, // 默认中间图片展示的宽度
  excavate: true, // 默认展示为镂空
};

export default QrCodeWithLogo;
