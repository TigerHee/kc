/**
 * Owner: jesse.shao@kupotech.com
 */
import { Dialog } from '@kufox/mui';
import { CloseOutlined } from '@kufox/icons';
import { px2rem } from '@kufox/mui/utils';
import { styled } from '@kufox/mui/emotion';;

export const InfoModal = styled(Dialog)`
  margin-bottom: 0;
  max-width: 100%;
  border-radius: ${px2rem(16)} ${px2rem(16)} 0 0;
  .info-content {
    padding: 0;
    overflow: hidden;
  }
`;

export const CloseIcon = styled(CloseOutlined)`
  position: absolute;
  left: 0;
  width: ${px2rem(24)};
  height: ${px2rem(24)};
`;

export const InfoHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${px2rem(14)} ${px2rem(12)} ${px2rem(12)} ${px2rem(12)};
  h2 {
    margin-bottom: 0;
    font-family: 'PingFang SC';
    font-weight: 500;
    font-size: ${px2rem(18)};
    line-height: 130%;
    text-align: center;
    color: ${props => props.theme.colors.text};
  }
`;

export const InfoContent = styled.article`
  padding: 0 ${px2rem(16)} ${px2rem(12)} ${px2rem(16)};
  min-height: ${px2rem(320)};
  p {
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: ${px2rem(14)};
    line-height: ${px2rem(22)};
    color: ${props => props.theme.colors.text60}
    margin-bottom: 1em;
  }
`;
