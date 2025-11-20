import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M6 3a5 5 0 0 0-5 5v7a5 5 0 0 0 5 5h4a1 1 0 1 0 0-2H6a3 3 0 0 1-3-3V8q.001-.382.092-.737l8.354 5.57a1 1 0 0 0 1.11 0l8.354-5.57Q21 7.618 21 8v2a1 1 0 1 0 2 0V8a5 5 0 0 0-5-5zm13.8 2.599A3 3 0 0 0 18 5H6c-.674 0-1.297.223-1.798.599l7.799 5.2z"
          clipRule="evenodd"
        />
        <path d="M17.794 13.293a1 1 0 0 1 1.414 0l3.5 3.5a1 1 0 0 1 0 1.414l-3.5 3.5a1 1 0 0 1-1.414-1.414l1.793-1.793H14a1 1 0 1 1 0-2h5.585l-1.792-1.793a1 1 0 0 1 0-1.414" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
