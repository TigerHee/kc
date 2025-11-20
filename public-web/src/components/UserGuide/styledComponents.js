/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';

export const StyledPage = styled.main`
  padding: 20px 16px;
  background-color: ${(props) => props.theme.colors.overlay};
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

export const VideoWrapper = styled.section`
  border-radius: 8px;
  .video {
    width: 100%;
    max-width: 100%;
    height: 192px;
    margin: 0 auto;

    iframe {
      border-radius: 8px;
    }
  }
`;

export const VideoTextWrapper = styled.div`
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  margin-top: 12px;
`;
