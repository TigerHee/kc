import { useState } from 'react';
import { Input } from '..';
import { IInputProps } from '../type';
import { AddFilledIcon } from '@kux/iconpack';

interface IProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const DisplayBox = (props: IProps) => {
  return (
    <section
      style={{
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        ...props.style,
      }}
    >
      {props.children}
    </section>
  );
};

export const InputWithStatusInfo = (props: IInputProps) => {
  const [value, setValue] = useState(0);
  const [count, setCount] = useState(0);

  return (
    <Input
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      statusInfo={
        <div>
          <div>Available</div>
          <div>
            <div>{count}</div>
            <AddFilledIcon
              size={20}
              color="get-theme(brandGreen)"
              onClick={() => {
                setCount(count - 1);
                setValue(value + 1);
              }}
            />
          </div>
        </div>
      }
      {...props}
    />
  );
};
