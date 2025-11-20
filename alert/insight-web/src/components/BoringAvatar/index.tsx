import Avatar from 'boring-avatars';

interface BoringAvatarProps {
  name: string;
  size?: number;
  variant?: 'beam' | 'bauhaus' | 'ring' | 'pixel';
  square?: boolean;
  colors?: 'green' | 'blue' | 'light';
}

export const BoringAvatar: React.FC<BoringAvatarProps> = (props) => {
  const { name, size = 40, variant = 'beam', square = true, colors = 'green' } = props;
  const colorMap = {
    green: ['#53ac59', '#3b8952', '#0f684b', '#03484c', '#1c232e'],
    blue: ['#001449', '#012677', '#005bc5', '#00b4fc', '#17f9ff'],
    light: ['#0db2ac', '#f5dd7e', '#fc8d4d', '#fc694d', '#faba32'],
  };
  return (
    <Avatar name={name} size={size} variant={variant} colors={colorMap[colors]} square={square} />
  );
};
