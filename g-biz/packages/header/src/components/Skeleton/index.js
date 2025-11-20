import { styled } from '@kux/mui';

const LIGHT_LINER_GRADIENT_BACKGROUND_COLOR = `linear-gradient(
  90deg,
  rgba(93, 103, 122, 0.04) 25%,
  rgba(29, 29, 29, 0.08) 37%,
  rgba(29, 29, 29, 0.04) 63%
)
`;

const DARK_LINER_GRADIENT_BACKGROUND_COLOR = `linear-gradient(
  90deg,
  rgba(243, 243, 243, 0.08) 25%,
  rgba(129, 129, 129, 0.3) 37%,
  rgba(243, 243, 243, 0.08) 63%
)
`;

const SkeletonItem = styled.div`
  @keyframes animSkeleton {
    0% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0 50%;
    }
  }
  border-radius: 4px;
  width: 60px;
  height: 20px;
  display: block;
  background: ${(props) =>
    props.theme.currentTheme === 'light'
      ? LIGHT_LINER_GRADIENT_BACKGROUND_COLOR
      : DARK_LINER_GRADIENT_BACKGROUND_COLOR};
  animation: animSkeleton 2s ease infinite;
  background-size: 400% 100%;
`;

const Skeleton = ({ style, className }) => {
  return <SkeletonItem style={style} className={className} />;
};

export default Skeleton;
