import { styled } from '@kux/mui';
import { ICCloseOutlined } from '@kux/icons';

export const IOSWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: ${(props) => props.theme.colors.overlay};
  display: flex;
`;

export const InfoWrapper = styled.div`
  display: flex;
`;

export const InfoDes = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 14px;
  margin-left: 8px;
`;

export const InfoTitle = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text};
  font-weight: 600;
`;

export const Logo = styled.img`
  width: 36px;
  height: 36px;
`;

export const Close = styled(ICCloseOutlined)`
  position: absolute;
  right: 8px;
  top: 6px;
  width: 8px;
  height: 8px;
  cursor: pointer;
`;

export const ShareImg = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 2px;
`;
