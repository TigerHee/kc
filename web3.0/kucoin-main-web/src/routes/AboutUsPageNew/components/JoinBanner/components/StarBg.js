/**
 * Owner: will.wang@kupotech.com
 */
import { default as Icon } from "@/components/common/KCSvgIcon";
import { styled, useMediaQuery, useTheme } from "@kux/mui";

const StarIcon = (props) => {
  return <Icon iconId={"star_icon"} {...props} />
};

const IconWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  overflow: hidden;

  & > svg {
    position: absolute;
    top: 50%;
    left: 50%;
  }
`

const StyledStarIcon = styled(StarIcon)`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  margin-top: -${props => props.size / 2}px;
  margin-left: -${props => props.size / 2}px;

  transform: translateX(${props => props.offsetX}px) translateY(${props => props.offsetY}px);
`;

const StarBg = () => {
  const theme = useTheme();
  const currentTheme = theme.currentTheme;

  const sm = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const md = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const color = currentTheme === 'dark' ? '#f3f3f3' : '#1d1d1d';

  if (sm) {
    return null;
  }

  if (md) {
    return (
      <IconWrapper>
        <StyledStarIcon fill={color} size={29} offsetX={-317} offsetY={36} />
        <StyledStarIcon fill={color} size={15} offsetX={-271} offsetY={-83} />
        <StyledStarIcon fill={color} size={15} offsetX={290} offsetY={-102} />
        <StyledStarIcon fill={color} size={25} offsetX={234} offsetY={90} />
      </IconWrapper>
    )  
  }

  return (
    <IconWrapper>
      <StyledStarIcon fill={color} size={29} offsetX={-560} offsetY={22} />
      <StyledStarIcon fill={color} size={15} offsetX={-410} offsetY={-88} />
      <StyledStarIcon fill={color} size={25} offsetX={-330} offsetY={68} />
      <StyledStarIcon fill={color} size={29} offsetX={361} offsetY={-75} />
      <StyledStarIcon fill={color} size={26} offsetX={566} offsetY={-6} />
      <StyledStarIcon fill={color} size={15} offsetX={413} offsetY={90} />
    </IconWrapper>
  )
};

export default StarBg;
