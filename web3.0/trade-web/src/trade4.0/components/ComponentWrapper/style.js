/**
 * Owner: borden@kupotech.com
 */
import { fx, styled } from '@/style/emotion';

export const Wrapper = styled.section`
  ${fx.display('flex')}
  ${fx.flexFlow('column')}
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  // 移动屏下，position设置为relative以便父子dom进行高度(H)关联
  ${(props) => props.theme.breakpoints.down('sm')} {
    position: relative;
  }
`;

export default { Wrapper };
