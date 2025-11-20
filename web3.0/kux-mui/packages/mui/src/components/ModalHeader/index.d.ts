/**
 * Owner: victor.ren@kupotech.com
 */
 import React, { ReactNode } from 'react';

 export interface IModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
   /**
    * 底部边线，默认 true
    */
   border?: boolean;

   /**
    * 显示返回箭头，默认 false
    */
   back?: boolean;

   /**
    * 显示关闭箭头，默认 true
    */
   close?: boolean;

   /**
    * 标题
    */
   title: ReactNode;

   /**
    * 点击关闭
    */
   onClose: React.MouseEventHandler<HTMLDivElement>;

   /**
    * 点击返回
    */
   onBack?: React.MouseEventHandler<HTMLDivElement>;

   /**
    * 禁止关闭和返回，用于loading状态时
    */
   disableClose?: boolean;
 }
 
 declare const ModalHeader: React.ForwardRefRenderFunction<HTMLDivElement, IModalHeaderProps>;
 
 export default ModalHeader;
 