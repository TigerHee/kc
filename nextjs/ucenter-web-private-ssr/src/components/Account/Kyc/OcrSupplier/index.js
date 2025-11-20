/**
 * Owner: tiger@kupotech.com
 */
import { useEffect, useState } from 'react';
import FacialRecognition from './FacialRecognition';
import AdvanceIframe from './FacialRecognition/AdvanceIframe';
import ScanQRCode from './FacialRecognition/ScanQRCode';
import JumioIframe from './JumioIframe';
import Lego from './Lego';
import LegoCamera from './Lego/Camera/index';
import SumsubIframe from './SumsubIframe';

const Modal = ({ onOk, onCancel, currentRoute, onSupplierCallback }) => {
  // advance 扫码的url
  const [advanceUrl, setAdvanceUrl] = useState('');
  // advance 扫码的过期时间
  const [expireSecond, setExpireSecond] = useState(3600);

  useEffect(() => {
    // 保留日志方便堆栈里查看用户访问路径
    console.info('currentRoute === ', currentRoute);
  }, [currentRoute]);

  const routesMap = {
    SUMSUB: (
      // sumsub 认证
      <SumsubIframe onSupplierCallback={onSupplierCallback} />
    ),
    jumio: (
      // jumio 认证
      <JumioIframe onSupplierCallback={onSupplierCallback} />
    ),
    legoIndex: (
      // lego 第1步
      <Lego
        onOk={(route) => {
          if (route) {
            typeof onOk === 'function' && onOk(route);
          }
        }}
        onCancel={onCancel}
      />
    ),
    legoCamera: (
      // lego 第2步和拍照
      <LegoCamera
        onOk={(route) => {
          if (route) {
            typeof onOk === 'function' && onOk(route);
          }
        }}
      />
    ),
    facial: (
      // lego 第3步 选 advance 或者 使用手机识别人脸
      <FacialRecognition
        onOk={(route, url, expireSecond) => {
          if (route) {
            onOk(route);
            setAdvanceUrl(url);
            setExpireSecond(expireSecond);
          }
        }}
      />
    ),
    facial_qrcode: (
      // advance扫码
      <ScanQRCode
        expireSecond={expireSecond}
        advanceUrl={advanceUrl}
        onOk={onOk}
        onSupplierCallback={onSupplierCallback}
      />
    ),
    advanceIframe: (
      // advance iframe
      <AdvanceIframe advanceUrl={advanceUrl} onSupplierCallback={onSupplierCallback} onOk={onOk} />
    ),
  };

  return routesMap[currentRoute];
};

export default Modal;
