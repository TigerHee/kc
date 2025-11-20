/**
 * Owner: victor.ren@kupotech.com
 */
 import React from 'react';
import ModalHeader from '../ModalHeader';
import ModalFooter from '../ModalFooter';

 export interface IMDrawerProps extends React.HTMLAttributes<HTMLDivElement> {
   /**
    * Drawer内容
    */
   children?: React.ReactNode;
 
   /**
    * 是否显示
    */
   show: boolean;
 
   /**
    * 按钮的主题，默认值为 'primary'
    */
   anchor?: 'top' | 'left' | 'right' | 'bottom';

   /**
    * header 边线，默认 true
    */
   headerBorder?: boolean;

   /**
    * 显示返回箭头，默认 false
    */
   back?: boolean;

   /**
    * 标题
    */
   title: ReactNode;
 
   /**
    * 关闭时触发的回调函数
    */
   onClose?: React.MouseEventHandler<HTMLDivElement>;

   /**
    * 点击返回
    */
   onBack?: React.MouseEventHandler<HTMLDivElement>;

   /**
    * 额外的 header 属性，参考 ModalHeader
    */
   headerProps?: ModalHeader;

 }
 
 declare const MDrawer: React.ForwardRefRenderFunction<HTMLDivElement, IMDrawerProps>;
 
 export default MDrawer;
 