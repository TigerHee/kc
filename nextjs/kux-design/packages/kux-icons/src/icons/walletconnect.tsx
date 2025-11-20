import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="m3.517 10.743 4.243 4.242 2.826-2.826-.003-.002 1.414-1.414.003.002.002-.002 1.414 1.414-.002.002 2.826 2.826 4.243-4.242 1.414 1.414-5.657 5.657-4.24-4.24-4.24 4.24-5.657-5.657z" />
        <path
          fillRule="evenodd"
          d="m7.764 9.607-.707.707L5.643 8.9l.707-.707a8 8 0 0 1 11.314 0l.707.707-1.415 1.414-.707-.707a6 6 0 0 0-8.485 0"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
