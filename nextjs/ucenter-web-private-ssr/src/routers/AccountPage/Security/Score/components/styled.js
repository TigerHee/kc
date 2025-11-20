import { styled } from '@kux/mui';
import { LEVEL_ENUMS } from '../constants';

export const Img = styled.img`
  transform: ${({ reflect }) => `scale(${reflect ? -1 : 1})`};
`;

export const LevelSpan = styled.span`
  ${({ level }) => {
    switch (level) {
      case LEVEL_ENUMS.HIGH:
        return `
          background: linear-gradient(180deg, #F6F6F6 0%, #71AB81 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        `;
      case LEVEL_ENUMS.MEDIUM:
        return `
          background: linear-gradient(180deg, #FFFFFE 0%, #E9D29B 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        `;
      default:
        return `
          color: #E0E0DD;
        `;
    }
  }}
`;

export const LoadingBox = styled.div`
  margin: 0 auto;
  max-width: 187.5px;
  display: flex;
  padding: ${({ isH5 }) => (isH5 ? 0 : '200px')} 0;
`;

export const AntiBox = styled.div`
  width: ${({ width }) => width}px;
  min-width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  overflow: hidden;
  position: relative;
  mask-image: radial-gradient(circle at center, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 80%);
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
  -webkit-mask-image: radial-gradient(circle at center, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 80%);
  -webkit-mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
`;
