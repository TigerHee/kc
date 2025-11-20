/**
 * Owner: Lori@kupotech.com
 */
 import { dynamic } from 'umi';

 const RemoteCmsStyleSheet = dynamic({
   async loader() {
     const m = await System.import('@remote/cms');
     const { CmsStyleSheet } = m;
 
     return CmsStyleSheet;
   },
   loading: () => null,
 });
 
 export default RemoteCmsStyleSheet;
 