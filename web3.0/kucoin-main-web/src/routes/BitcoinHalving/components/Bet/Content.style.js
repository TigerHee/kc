/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 6px;
  }
`;

export const LeftBtn = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  &:hover {
    & > div > img {
      transform: translate(0px, 0px);
      [dir='rtl'] & {
        transform: translate(0px, 0px) rotateY(180deg);
      }
    }
  }
`;

export const UpWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: #01bc8d;
  z-index: 9;
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
  box-shadow: -1px 5px 0px 0px #009a73;
  overflow: hidden;
  img {
    transform: translate(-6px, 6px);
    transition: all 0.2s linear;
    [dir='rtl'] & {
      transform: translate(-6px, 6px) rotateY(180deg);
      transition: all 0.2s linear;
    }
  }
`;

export const Parallelism = styled.div`
  width: 120px;
  height: 48px;
  background: #01bc8d;
  margin-left: -20px;
  transform: skew(-13deg);
  border-radius: 2px;
  box-shadow: 1px 5px 0px 0px #009a73;
  display: flex;
  align-items: center;
`;

export const RightBtn = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 12px;
  cursor: pointer;
  &:hover {
    & > div > img {
      transform: translate(0px, 0px);
      [dir='rtl'] & {
        transform: translate(0px, 0px) rotateY(180deg);
      }
    }
  }
`;

export const DownWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: #f65454;
  border-top-right-radius: 24px;
  border-bottom-right-radius: 24px;
  z-index: 9;
  box-shadow: 1px 5px 0px 0px #bb2121;
  overflow: hidden;
  img {
    transform: translate(6px, -6px);
    transition: all 0.2s linear;
    [dir='rtl'] & {
      transform: translate(6px, -6px) rotateY(180deg);
      transition: all 0.2s linear;
    }
  }
`;
export const RightParallelism = styled.div`
  width: 120px;
  height: 48px;
  background: #f65454;
  margin-right: -20px;
  transform: skew(-13deg);
  border-radius: 2px;
  box-shadow: -1px 5px 0px 0px #bb2121;
  display: flex;
  align-items: center;
`;

export const MaskPK = styled.img`
  z-index: 100;
  position: absolute;
  left: 134px;
  top: 5.5px;
`;

export const Canvas = styled.canvas`
  position: absolute;
  z-index: 99;
  top: -140px;
  left: 112px;
  opacity: 0.99;
`;

export const Text = styled.div`
  word-break: break-all;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  line-height: 130%;
  display: flex;
  align-items: center;
  transform: skew(13deg);
  padding-left: 20px;
  [dir='rtl'] & {
    padding-left: 35px;
  }
  img {
    margin-right: 4px;
  }
`;

export const TextRight = styled(Text)`
  justify-content: flex-end;
`;
