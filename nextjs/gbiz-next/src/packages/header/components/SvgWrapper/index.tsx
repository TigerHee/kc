import React from 'react';

// todo: 封装一个 svgWrapper组件
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  className?: string;
}

export function createIcon(svgElement: React.ReactElement, props) {
  // 返回一个新的 React 组件
  const IconComponent: React.FC<IconProps> = (innerProps = props) => {
    const { size = 24, color = 'currentColor', className = '', ...rest } = innerProps;
    // 克隆传入的svgElement，注入属性
    return (
      <div className={className}>
        {React.cloneElement(svgElement, {
          width: size,
          height: size,
          fill: color,
          ...rest,
        })}
      </div>
    );
  };

  return IconComponent;
}

interface Props extends IconProps {
  children: React.ReactElement;
}

const SvgWrapper = ({ children, ...rest }: Props) => {
  return createIcon(children, rest);
};

export default SvgWrapper;
