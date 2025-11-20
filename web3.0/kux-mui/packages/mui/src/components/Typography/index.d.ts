/**
 * Owner: victor.ren@kupotech.com
 */
 import React from 'react';

 export interface ITypographyProps extends React.HTMLAttributes<HTMLHeadingElement> {
   /**
    * 自定义字号，默认值为 ''
    */
   size?: string;

   /**
    * 字号，默认值为 h1
    */
   variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
 }
 
 declare const Typography: React.ForwardRefRenderFunction<HTMLHeadingElement, ITypographyProps>;
 
 export default Typography;
 